"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatTnd } from "@/lib/format";

type OrderRecord = {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: string;
  paymentStatus: string;
  deliveryStatus: string;
  customerName: string;
  total: number;
  itemsCount: number;
  itemsPreview: string[];
  receiverName: string;
  receiverPhone: string;
  receiverCity: string;
  receiverGovernorate: string;
  receiverAddressLine: string;
  customerNotes: string;
  isNew?: boolean;
};

const orderStatusOptions = [
  { value: "PENDING", label: "En attente" },
  { value: "CONFIRMED", label: "Confirmee" },
  { value: "PICKING", label: "Preparation" },
  { value: "READY_FOR_DELIVERY", label: "Prete pour livraison" },
  { value: "SHIPPED", label: "Expediee" },
  { value: "DELIVERED", label: "Livree" },
  { value: "CANCELLED", label: "Annulee" },
  { value: "RETURNED", label: "Retournee" },
] as const;

function getOrderStatusLabel(status: string) {
  return orderStatusOptions.find((item) => item.value === status)?.label ?? status;
}

export function OrderManager({
  initialOrders = [],
  initialLiveMode = false,
  highlightedOrderIds = [],
}: {
  initialOrders?: OrderRecord[];
  initialLiveMode?: boolean;
  highlightedOrderIds?: string[];
}) {
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    initialOrders.map((order) => ({
      ...order,
      isNew: order.isNew || highlightedOrderIds.includes(order.id),
    })),
  );
  const [selectedId, setSelectedId] = useState<string | null>(initialOrders[0]?.id ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState(initialLiveMode);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    status: "PENDING",
    receiverName: "",
    receiverPhone: "",
    receiverCity: "",
    receiverGovernorate: "",
    receiverAddressLine: "",
    customerNotes: "",
  });

  async function load() {
    const response = await fetch("/api/admin/orders", { cache: "no-store" });
    const payload = (await response.json()) as {
      data?: OrderRecord[];
      live?: boolean;
    };
    const nextOrders = payload.data ?? [];
    setOrders(nextOrders);
    setLiveMode(Boolean(payload.live));
    setSelectedId((currentSelectedId) => {
      if (currentSelectedId && nextOrders.some((order) => order.id === currentSelectedId)) {
        return currentSelectedId;
      }

      return nextOrders[0]?.id ?? null;
    });
  }

  useEffect(() => {
    if (!initialOrders.length) {
      void load();
    }

    const intervalId = window.setInterval(() => {
      void load();
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [initialOrders.length]);

  const current = useMemo(
    () => orders.find((order) => order.id === selectedId) ?? null,
    [orders, selectedId],
  );

  useEffect(() => {
    if (!current) return;

    setForm({
      status: current.status,
      receiverName: current.receiverName,
      receiverPhone: current.receiverPhone,
      receiverCity: current.receiverCity,
      receiverGovernorate: current.receiverGovernorate,
      receiverAddressLine: current.receiverAddressLine,
      customerNotes: current.customerNotes,
    });
  }, [current]);

  function handleSave() {
    if (!selectedId) return;

    startTransition(async () => {
      const response = await fetch(`/api/admin/orders/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { message?: string };
      setMessage(result.message ?? "Commande mise a jour.");

      if (response.ok) {
        await load();
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
      <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Edition commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!liveMode ? (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-300/10 p-4 text-sm text-amber-50">
              Connexion base indisponible: les mises a jour de commandes sont temporairement desactivees.
            </div>
          ) : null}
          {message ? (
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm">
              {message}
            </div>
          ) : null}

          {current ? (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-white">{current.orderNumber}</p>
                  {current.isNew ? (
                    <Badge className="rounded-full bg-rose-500/15 px-3 py-1 text-rose-200 hover:bg-rose-500/15">
                      New
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-white/60">{current.customerName}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/45">
                  {formatDate(current.placedAt)} • {current.itemsCount} article(s)
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-900 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-white/50">Statut</p>
                    <p className="mt-2 text-sm font-medium">
                      {getOrderStatusLabel(current.status)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-white/50">Total</p>
                    <p className="mt-2 text-sm font-medium">{formatTnd(current.total)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Coordonnees de livraison</p>
                <div className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">
                      Statut de commande
                    </p>
                    <select
                      className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm"
                      value={form.status}
                      onChange={(event) =>
                        setForm((previous) => ({ ...previous, status: event.target.value }))
                      }
                    >
                      {orderStatusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">
                      Nom du receveur
                    </p>
                    <Input
                      placeholder="Nom du parent ou du receveur"
                      value={form.receiverName}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          receiverName: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">
                      Telephone
                    </p>
                    <Input
                      placeholder="+216 ..."
                      value={form.receiverPhone}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          receiverPhone: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">
                        Ville
                      </p>
                      <Input
                        placeholder="Ex: Ariana"
                        value={form.receiverCity}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            receiverCity: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">
                        Gouvernorat
                      </p>
                      <Input
                        placeholder="Ex: Tunis"
                        value={form.receiverGovernorate}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            receiverGovernorate: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">
                      Adresse de livraison
                    </p>
                    <Textarea
                      rows={3}
                      placeholder="Rue, numero, immeuble, etage..."
                      value={form.receiverAddressLine}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          receiverAddressLine: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">
                      Note client
                    </p>
                    <Textarea
                      rows={3}
                      placeholder="Instructions utiles pour la livraison"
                      value={form.customerNotes}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          customerNotes: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Button
                className="rounded-full"
                onClick={handleSave}
                disabled={!liveMode || isPending}
              >
                Mettre a jour
              </Button>
            </>
          ) : (
            <p className="text-sm text-white/60">
              Choisissez une commande pour modifier son statut, le receveur ou l&apos;adresse de livraison.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {orders.length ? (
          orders.map((order) => (
            <Card
              key={order.id}
              className={`rounded-[28px] text-white ${
                order.isNew
                  ? "border-primary/40 bg-primary/10 shadow-[0_0_0_1px_rgba(14,165,233,0.15)]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold">{order.orderNumber}</p>
                    {order.isNew ? (
                      <Badge className="rounded-full bg-rose-500/15 px-3 py-1 text-rose-200 hover:bg-rose-500/15">
                        New
                      </Badge>
                    ) : null}
                    <Badge variant="secondary" className="rounded-full">
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/60">
                    <span>{order.customerName}</span>
                    <span>{formatDate(order.placedAt)}</span>
                    <span>{order.itemsCount} article(s)</span>
                    <span>{formatTnd(order.total)}</span>
                  </div>
                  <p className="text-sm text-white/50">
                    {order.receiverCity}, {order.receiverGovernorate}
                  </p>
                  {order.itemsPreview.length ? (
                    <p className="text-sm text-white/70">{order.itemsPreview.join(" • ")}</p>
                  ) : null}
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <div className="text-sm text-white/55">
                    <p>Paiement: {order.paymentStatus}</p>
                    <p>Livraison: {order.deliveryStatus}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => setSelectedId(order.id)}
                  >
                    Ouvrir la commande
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardContent className="p-5 text-sm text-white/60">
              Aucune commande client n&apos;a encore ete recue.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
