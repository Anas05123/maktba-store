import { AccountNav } from "@/components/account/account-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customerAccountOverviews } from "@/lib/operations";

export default function AccountAddressesPage() {
  const customer = customerAccountOverviews[0]!;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Carnet d&apos;adresses</p>
          <h1 className="mt-2 text-4xl font-semibold">Mes adresses</h1>
        </div>
        <AccountNav />
      </div>

      <Card className="rounded-[32px] border-white/70 bg-white/90">
        <CardHeader>
          <CardTitle>Adresses enregistrees</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {customer.addresses.map((address) => (
            <div key={`${address.label}-${address.line1}`} className="rounded-3xl border p-5">
              <p className="font-semibold">{address.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{address.line1}</p>
              <p className="text-sm text-muted-foreground">
                {address.city}, {address.governorate}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
