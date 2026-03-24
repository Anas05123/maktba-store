"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type CustomerRecord = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  governorate: string;
  isActive: boolean;
};

export function CustomerManager() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    city: "",
    governorate: "",
    isActive: true,
  });

  async function load() {
    const response = await fetch("/api/admin/customers", { cache: "no-store" });
    const payload = await response.json();
    setCustomers(payload.data ?? []);
    setLiveMode(Boolean(payload.live));
  }

  useEffect(() => {
    void load();
  }, []);

  const current = useMemo(
    () => customers.find((customer) => customer.id === selectedId) ?? null,
    [customers, selectedId],
  );

  useEffect(() => {
    if (!current) return;
    setForm({
      companyName: current.companyName,
      contactName: current.contactName,
      email: current.email,
      phone: current.phone,
      city: current.city,
      governorate: current.governorate,
      isActive: current.isActive,
    });
  }, [current]);

  function handleSave() {
    if (!selectedId) return;
    startTransition(async () => {
      const response = await fetch(`/api/admin/customers/${selectedId}`, {
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
    <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
      <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Edition client</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!liveMode ? (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-300/10 p-4 text-sm text-amber-50">
              Mode demo: la base est necessaire pour modifier les clients.
            </div>
          ) : null}
          {message ? <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm">{message}</div> : null}
          {current ? (
            <>
              <Input value={form.companyName} onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))} />
              <Input value={form.contactName} onChange={(e) => setForm((prev) => ({ ...prev, contactName: e.target.value }))} />
              <Input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
              <Input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
              <Input value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} />
              <Input value={form.governorate} onChange={(e) => setForm((prev) => ({ ...prev, governorate: e.target.value }))} />
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
                Client actif
              </label>
              <Button className="rounded-full" onClick={handleSave} disabled={!liveMode || isPending}>
                Mettre a jour
              </Button>
            </>
          ) : (
            <p className="text-sm text-white/60">Choisissez un client pour modifier ses informations.</p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold">{customer.companyName}</p>
                <p className="text-sm text-white/60">
                  {customer.contactName} • {customer.city}, {customer.governorate}
                </p>
              </div>
              <Button variant="outline" className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={() => setSelectedId(customer.id)}>
                Editer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
