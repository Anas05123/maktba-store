import { getServerSession } from "next-auth";
import Link from "next/link";

import { AccountNav } from "@/components/account/account-nav";
import { RegisterForm } from "@/components/forms/register-form";
import { SignInForm } from "@/components/forms/sign-in-form";
import { StoreAuthControls } from "@/components/shared/auth-controls";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/lib/auth";
import { getAccountOverview } from "@/lib/account-data";
import { formatTnd } from "@/lib/format";

const primaryLinkClass =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { denied } = await searchParams;
  const overview = session?.user ? await getAccountOverview() : null;

  return (
    <div className="w-full space-y-8 px-4 py-10 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="space-y-4">
        <Badge className="rounded-full bg-primary/10 px-4 py-1 text-primary hover:bg-primary/10">
          Compte client
        </Badge>
        <h1 className="text-4xl font-semibold">Mon compte</h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          Connectez-vous, creez votre compte, suivez vos commandes et accedez a vos factures en quelques clics.
        </p>
        {session?.user ? <AccountNav /> : null}
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
                <div className="flex flex-wrap gap-3">
                  <Link href="/account/orders" className={primaryLinkClass}>
                    Voir mes commandes
                  </Link>
                  {session.user.role === "ADMIN" ? (
                    <Link href="/admin" className={primaryLinkClass}>
                      Ouvrir le dashboard admin
                    </Link>
                  ) : null}
                </div>
                <StoreAuthControls variant="account" />
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="rounded-full bg-muted/60 p-1">
                <TabsTrigger value="signin" className="rounded-full px-5">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="register" className="rounded-full px-5">
                  Creer un compte
                </TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <SignInForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          )}

          <Card className="rounded-[32px] border-white/70 bg-white/90">
            <CardHeader>
              <CardTitle>Vue compte client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {overview ? (
                <>
                  <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-5">
                    <p className="font-semibold">{overview.displayName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{overview.email}</p>
                    {overview.customerCode ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-primary">
                        Code client {overview.customerCode}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border p-4">
                      <p className="text-sm text-muted-foreground">Commandes</p>
                      <p className="mt-2 text-xl font-semibold">{overview.orderCount}</p>
                    </div>
                    <div className="rounded-3xl border p-4">
                      <p className="text-sm text-muted-foreground">Total depense</p>
                      <p className="mt-2 text-xl font-semibold">
                        {formatTnd(overview.totalSpent)}
                      </p>
                    </div>
                  </div>
                  <Link href="/account/orders" className={primaryLinkClass}>
                    Voir l&apos;historique commandes
                  </Link>
                </>
              ) : (
                <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
                  Connectez-vous pour consulter vos commandes, votre profil et vos adresses.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[32px] border-white/70 bg-white/90">
          <CardHeader>
            <CardTitle>Activites recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {overview?.recentOrders.length ? (
              <>
                {overview.recentOrders.map((order) => (
                  <div key={order.orderNumber} className="rounded-3xl border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{order.orderNumber}</p>
                      <Badge variant="secondary" className="rounded-full">
                        {order.statusLabel}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {order.items.map((item) => item.name).slice(0, 2).join(" • ")}
                    </p>
                    <p className="mt-2 text-sm font-medium">{formatTnd(order.total)}</p>
                  </div>
                ))}
                <div className="rounded-3xl bg-muted/60 p-5">
                  <p className="text-sm text-muted-foreground">Documents disponibles</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {overview.orderCount} facture(s)
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
                Vous n&apos;avez aucune commande pour le moment.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
