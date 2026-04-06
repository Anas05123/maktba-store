"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatTnd } from "@/lib/format";

type OrderRecord = {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  total: number;
  receiverName: string;
  receiverPhone: string;
  receiverCity: string;
  receiverGovernorate: string;
  receiverAddressLine: string;
  customerNotes: string;
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

export function OrderManager() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState(false);
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
    const payload = await response.json();
    setOrders(payload.data ?? []);
    setLiveMode(Boolean(payload.live));
  }

  useEffect(() => {
    void load();
  }, []);

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
      const result = await response.json();
      setMessage(result.message ?? "Saved");
      if (response.ok) {
        await load();
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Edition commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!liveMode ? (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-300/10 p-4 text-sm text-amber-50">
              Mode demo: les modifications live necessitent PostgreSQL.
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
                <p className="text-sm font-semibold text-white">{current.orderNumber}</p>
                <p className="mt-1 text-sm text-white/60">{current.customerName}</p>
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
                      onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
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
                      onChange={(e) => setForm((prev) => ({ ...prev, receiverName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">
                      Telephone
                    </p>
                    <Input
                      placeholder="+216 ..."
                      value={form.receiverPhone}
                      onChange={(e) => setForm((prev) => ({ ...prev, receiverPhone: e.target.value }))}
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
                        onChange={(e) => setForm((prev) => ({ ...prev, receiverCity: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">
                        Gouvernorat
                      </p>
                      <Input
                        placeholder="Ex: Tunis"
                        value={form.receiverGovernorate}
                        onChange={(e) => setForm((prev) => ({ ...prev, receiverGovernorate: e.target.value }))}
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
                      onChange={(e) => setForm((prev) => ({ ...prev, receiverAddressLine: e.target.value }))}
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
                      onChange={(e) => setForm((prev) => ({ ...prev, customerNotes: e.target.value }))}
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
        {orders.map((order) => (
          <Card key={order.id} className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-white/60">{order.customerName}</p>
                <p className="mt-2 text-sm text-white/70">
                  {getOrderStatusLabel(order.status)} • {formatTnd(order.total)}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  {order.receiverCity}, {order.receiverGovernorate}
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                onClick={() => setSelectedId(order.id)}
              >
                Editer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
