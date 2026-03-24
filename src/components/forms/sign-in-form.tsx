"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const signInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe invalide"),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setErrorMessage(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result?.ok) {
        setErrorMessage("Connexion refusee. Verifiez vos identifiants.");
        return;
      }

      router.push("/admin");
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/35">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Connexion</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Utilisez un compte admin pour acceder a l&apos;espace de gestion prive.
        </p>
      </div>

      {errorMessage ? <Alert>{errorMessage}</Alert> : null}

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" {...form.register("email")} />
        <p className="text-xs text-destructive">{form.formState.errors.email?.message}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Mot de passe</label>
        <Input type="password" {...form.register("password")} />
        <p className="text-xs text-destructive">{form.formState.errors.password?.message}</p>
      </div>

      <Button type="submit" className="w-full rounded-full" disabled={isPending}>
        {isPending ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
