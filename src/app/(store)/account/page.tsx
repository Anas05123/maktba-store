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
import { customerAccountOverviews, operationalOrders } from "@/lib/operations";
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
  const customer = customerAccountOverviews[0]!;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
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
                <StoreAuthControls />
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
              <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-5">
                <p className="font-semibold">{customer.displayName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{customer.email}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border p-4">
                  <p className="text-sm text-muted-foreground">Commandes</p>
                  <p className="mt-2 text-xl font-semibold">{customer.orderCount}</p>
                </div>
                <div className="rounded-3xl border p-4">
                  <p className="text-sm text-muted-foreground">Total depense</p>
                  <p className="mt-2 text-xl font-semibold">{formatTnd(customer.totalSpent)}</p>
                </div>
              </div>
              <Link href="/account/orders" className={primaryLinkClass}>
                Voir l&apos;historique commandes
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[32px] border-white/70 bg-white/90">
          <CardHeader>
            <CardTitle>Activites recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {operationalOrders.slice(0, 3).map((order) => (
              <div key={order.orderNumber} className="rounded-3xl border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{order.orderNumber}</p>
                  <Badge variant="secondary" className="rounded-full">
                    {order.orderStatus}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{order.customerName}</p>
                <p className="mt-2 text-sm font-medium">{formatTnd(order.total)}</p>
              </div>
            ))}
            <div className="rounded-3xl bg-muted/60 p-5">
              <p className="text-sm text-muted-foreground">Documents disponibles</p>
              <p className="mt-2 text-2xl font-semibold">{operationalOrders.length} factures</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
