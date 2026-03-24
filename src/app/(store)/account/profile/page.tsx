import { AccountNav } from "@/components/account/account-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountProfilePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Profil client</p>
          <h1 className="mt-2 text-4xl font-semibold">Informations personnelles</h1>
        </div>
        <AccountNav />
      </div>

      <Card className="rounded-[32px] border-white/70 bg-white/90">
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {[
            ["Nom", "Client demo Maktba"],
            ["Email", "client@maktba.tn"],
            ["Telephone", "+216 20 000 000"],
            ["Langue", "Francais"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border p-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-lg font-semibold">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
