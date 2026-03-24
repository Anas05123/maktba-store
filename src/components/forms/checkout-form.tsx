"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tunisianGovernorates } from "@/lib/navigation";
import { useCartStore } from "@/store/cart-store";

const checkoutSchema = z.object({
  companyName: z.string().min(2, "Societe requise"),
  contactName: z.string().min(2, "Contact requis"),
  phone: z.string().min(8, "Telephone invalide"),
  email: z.string().email("Email invalide"),
  governorate: z.string().min(2, "Choisissez un gouvernorat"),
  city: z.string().min(2, "Ville requise"),
  addressLine: z.string().min(6, "Adresse requise"),
  notes: z.string().optional(),
  cashOnDelivery: z.boolean(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const clearCart = useCartStore((state) => state.clearCart);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      phone: "",
      email: "",
      governorate: "Tunis",
      city: "",
      addressLine: "",
      notes: "",
      cashOnDelivery: true,
    },
  });
  const cashOnDelivery = useWatch({
    control: form.control,
    name: "cashOnDelivery",
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success("Commande prete a etre confirmee");
    clearCart();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-[28px] border border-white/70 bg-white/90 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Societe / magasin</label>
          <Input {...form.register("companyName")} />
          <p className="text-xs text-destructive">{form.formState.errors.companyName?.message}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom du contact</label>
          <Input {...form.register("contactName")} />
          <p className="text-xs text-destructive">{form.formState.errors.contactName?.message}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Telephone</label>
          <Input {...form.register("phone")} />
          <p className="text-xs text-destructive">{form.formState.errors.phone?.message}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input {...form.register("email")} />
          <p className="text-xs text-destructive">{form.formState.errors.email?.message}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Gouvernorat</label>
          <select
            {...form.register("governorate")}
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
          >
            {tunisianGovernorates.map((governorate) => (
              <option key={governorate} value={governorate}>
                {governorate}
              </option>
            ))}
          </select>
          <p className="text-xs text-destructive">{form.formState.errors.governorate?.message}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ville</label>
          <Input {...form.register("city")} />
          <p className="text-xs text-destructive">{form.formState.errors.city?.message}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Adresse complete</label>
        <Textarea {...form.register("addressLine")} rows={4} />
        <p className="text-xs text-destructive">{form.formState.errors.addressLine?.message}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Instructions de livraison</label>
        <Textarea {...form.register("notes")} rows={3} />
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
        <Checkbox
          checked={cashOnDelivery}
          onCheckedChange={(checked) => form.setValue("cashOnDelivery", Boolean(checked))}
        />
        <span className="text-sm">
          Paiement a la livraison (COD) active, une option tres utilisee en Tunisie.
        </span>
      </label>

      <Button type="submit" className="w-full rounded-full">
        Confirmer la commande
      </Button>
    </form>
  );
}
