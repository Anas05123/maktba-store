import { getServerSession } from "next-auth";
import Link from "next/link";

import { SignInForm } from "@/components/forms/sign-in-form";
import { StoreAuthControls } from "@/components/shared/auth-controls";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { customers, dashboardSummary, orders } from "@/lib/demo-data";
import { formatTnd } from "@/lib/format";

const customer = customers[0]!;
const primaryLinkClass =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { denied } = await searchParams;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div className="space-y-4">
        <Badge className="rounded-full bg-primary/10 px-4 py-1 text-primary hover:bg-primary/10">
          Compte client
        </Badge>
        <h1 className="text-4xl font-semibold">Mon compte</h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          Retrouvez vos informations, l&apos;historique de commande et l&apos;acces de gestion si vous etes administrateur.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-4">
          {denied ? (
            <Card className="rounded-[32px] border-amber-300/60 bg-amber-50">
              <CardContent className="p-5 text-sm text-amber-900">
                Acces refuse. Le dashboard est reserve aux administrateurs.
              </CardContent>
            </Card>
          ) : null}
          {session?.user ? (
            <Card className="rounded-[32px] border-white/70 bg-white/90">
              <CardHeader>
                <CardTitle>Session active</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-3xl bg-muted/60 p-5">
                  <p className="font-semibold">{session.user.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Role: {session.user.role ?? "CLIENT"}
                  </p>
                </div>
                {session.user.role === "ADMIN" ? (
                  <Link href="/admin" className={primaryLinkClass}>
                    Ouvrir le dashboard admin
                  </Link>
                ) : null}
                <StoreAuthControls />
              </CardContent>
            </Card>
          ) : (
            <SignInForm />
          )}
          <Card className="rounded-[32px] border-white/70 bg-white/90">
            <CardHeader>
              <CardTitle>Infos de demonstration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-5">
                <p className="font-semibold">{customer.companyName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{customer.contactName}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border p-4">
                  <p className="text-sm text-muted-foreground">Credit</p>
                  <p className="mt-2 text-xl font-semibold">{formatTnd(customer.creditLimit)}</p>
                </div>
                <div className="rounded-3xl border p-4">
                  <p className="text-sm text-muted-foreground">Lifetime value</p>
                  <p className="mt-2 text-xl font-semibold">{formatTnd(customer.lifetimeValue)}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Admin demo: `admin@maktba.tn` / `ChangeMe123!`</p>
                <p>Manager demo: `manager@maktba.tn` / `Manager123!`</p>
              </div>
              <Link href="/account/orders" className={primaryLinkClass}>
                Voir l&apos;historique commandes
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[32px] border-white/70 bg-white/90">
          <CardHeader>
            <CardTitle>Dernieres activites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div key={order.orderNumber} className="rounded-3xl border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{order.orderNumber}</p>
                  <Badge variant="secondary" className="rounded-full">
                    {order.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{order.customer.companyName}</p>
                <p className="mt-2 text-sm font-medium">{formatTnd(order.total)}</p>
              </div>
            ))}
            <div className="rounded-3xl bg-muted/60 p-5">
              <p className="text-sm text-muted-foreground">Panier moyen plateforme</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatTnd(dashboardSummary.avgOrderValue)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
