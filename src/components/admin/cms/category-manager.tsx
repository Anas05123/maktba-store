"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
};

export function CategoryManager() {
  const [items, setItems] = useState<CategoryRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [liveMode, setLiveMode] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function load() {
    const response = await fetch("/api/admin/categories", { cache: "no-store" });
    const payload = await response.json();
    setItems(payload.data ?? []);
    setLiveMode(Boolean(payload.live));
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const current = items.find((item) => item.id === selectedId);
    if (!current) {
      setForm(emptyForm);
      return;
    }
    setForm({
      name: current.name,
      slug: current.slug,
      description: current.description,
      image: current.image,
    });
  }, [items, selectedId]);

  function handleSave() {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch(
        selectedId ? `/api/admin/categories/${selectedId}` : "/api/admin/categories",
        {
          method: selectedId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const result = await response.json();
      setMessage(result.message ?? "Saved");
      if (response.ok) {
        setSelectedId(null);
        await load();
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const result = await response.json();
      setMessage(result.message ?? "Deleted");
      if (response.ok) {
        setSelectedId(null);
        await load();
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>{selectedId ? "Editer une categorie" : "Nouvelle categorie"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!liveMode ? (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-300/10 p-4 text-sm text-amber-50">
              Mode demo: connectez la base pour activer le CRUD.
            </div>
          ) : null}
          {message ? <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm">{message}</div> : null}
          <Input placeholder="Nom" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} />
          <Textarea placeholder="Description" rows={4} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} />
          <div className="flex gap-3">
            <Button className="rounded-full" onClick={handleSave} disabled={!liveMode || isPending}>
              {selectedId ? "Mettre a jour" : "Ajouter"}
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setSelectedId(null)}>
              Nouvelle
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardContent className="space-y-3 p-5">
              <div>
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm text-white/60">{item.slug}</p>
              </div>
              <p className="text-sm text-white/70">{item.description}</p>
              <p className="text-sm text-white/50">{item.productCount} produits</p>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={() => setSelectedId(item.id)}>
                  Editer
                </Button>
                <Button variant="destructive" className="rounded-full" onClick={() => handleDelete(item.id)} disabled={!liveMode || isPending}>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
