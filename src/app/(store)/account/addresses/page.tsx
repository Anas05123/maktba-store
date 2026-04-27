import { AccountNav } from "@/components/account/account-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccountOverview } from "@/lib/account-data";

export default async function AccountAddressesPage() {
  const overview = await getAccountOverview();

  return (
    <div className="w-full space-y-8 px-4 py-10 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Carnet d&apos;adresses
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Mes adresses</h1>
        </div>
        <AccountNav />
      </div>

      <Card className="rounded-[32px] border-white/70 bg-white/90">
        <CardHeader>
          <CardTitle>Adresses enregistrees</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {overview.addresses.length ? (
            overview.addresses.map((address) => (
              <div key={address.id} className="rounded-3xl border p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{address.label}</p>
                  {address.isDefault ? (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Defaut
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{address.line1}</p>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.governorate}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground md:col-span-2">
              Aucune adresse n&apos;est enregistree pour le moment.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
