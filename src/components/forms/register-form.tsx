"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const registerSchema = z.object({
  firstName: z.string().min(2, "Prenom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Telephone invalide"),
  password: z.string().min(8, "Minimum 8 caracteres"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setErrorMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message ?? "Inscription impossible pour le moment.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/account",
      });

      if (!signInResult?.ok) {
        window.location.assign("/account");
        return;
      }

      window.location.assign(signInResult.url ?? "/account");
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/35"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Creer un compte</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Enregistrez votre compte pour suivre vos commandes, vos factures et vos adresses.
        </p>
      </div>

      {errorMessage ? <Alert>{errorMessage}</Alert> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prenom</label>
          <Input {...form.register("firstName")} />
          <p className="text-xs text-destructive">{form.formState.errors.firstName?.message}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom</label>
          <Input {...form.register("lastName")} />
          <p className="text-xs text-destructive">{form.formState.errors.lastName?.message}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" {...form.register("email")} />
        <p className="text-xs text-destructive">{form.formState.errors.email?.message}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Telephone</label>
        <Input {...form.register("phone")} />
        <p className="text-xs text-destructive">{form.formState.errors.phone?.message}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Mot de passe</label>
        <Input type="password" {...form.register("password")} />
        <p className="text-xs text-destructive">{form.formState.errors.password?.message}</p>
      </div>

      <Button type="submit" className="w-full rounded-full" disabled={isPending}>
        {isPending ? "Creation du compte..." : "Creer mon compte"}
      </Button>
    </form>
  );
}
