"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { FolderPlus, PencilLine, Shapes, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadAdminImages } from "@/lib/admin/upload-client";
import { getSafeImageSrc } from "@/lib/images";

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

const categoryExamples = [
  "Cartables",
  "Stylos",
  "Cahiers / blocs",
  "Packs scolaires",
  "Trousses",
  "Papeterie",
];

export function CategoryManager() {
  const [items, setItems] = useState<CategoryRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [liveMode, setLiveMode] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        setIsEditorOpen(false);
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

  function openNewCategory() {
    setSelectedId(null);
    setForm(emptyForm);
    setMessage(null);
    setUploadMessage(null);
    setIsEditorOpen(true);
  }

  function openEditCategory(id: string) {
    setSelectedId(id);
    setMessage(null);
    setUploadMessage(null);
    setIsEditorOpen(true);
  }

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    startUploadTransition(async () => {
      setUploadMessage(null);

      try {
        const [url] = await uploadAdminImages([file]);
        setForm((prev) => ({ ...prev, image: url ?? prev.image }));
        setUploadMessage("Image de categorie ajoutee.");
      } catch (error) {
        setUploadMessage(error instanceof Error ? error.message : "Upload impossible.");
      } finally {
        event.target.value = "";
      }
    });
  }

  return (
    <>
      <div className="space-y-6">
        <Card className="rounded-[32px] border-white/10 bg-slate-900 bg-[linear-gradient(135deg,rgba(14,165,233,0.10),rgba(15,23,42,0.96))] text-white shadow-2xl shadow-slate-950/20">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-white/45">Organisation du catalogue</p>
                <h1 className="mt-2 text-3xl font-semibold">Categories & rayons</h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
                  Creez des rayons propres, visibles et simples a comprendre pour les parents qui cherchent vite.
                </p>
              </div>
              <Button className="rounded-full" size="lg" onClick={openNewCategory} disabled={!liveMode}>
                <FolderPlus className="size-4" />
                Nouvelle categorie
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Rayons actifs", value: `${items.length}` },
                { label: "Produits classes", value: `${items.reduce((sum, item) => sum + item.productCount, 0)}` },
                { label: "Presentation", value: "Plus claire" },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/55">{item.label}</p>
                      <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3 text-primary">
                      <Shapes className="size-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!liveMode ? (
              <div className="rounded-2xl border border-amber-400/30 bg-amber-300/10 p-4 text-sm text-amber-50">
                Mode demo: connectez la base pour activer le CRUD.
              </div>
            ) : null}
            {message ? (
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm">
                {message}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="rounded-[28px] border-white/10 bg-white/5 text-white">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="relative size-20 overflow-hidden rounded-[22px] bg-slate-900/70">
                      <Image
                        src={getSafeImageSrc(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm text-white/60">{item.slug}</p>
                  </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/65">
                    {item.productCount} produits
                  </span>
                </div>
                <p className="text-sm leading-6 text-white/70">
                  {item.description || "Aucune description renseignee pour cette categorie."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    onClick={() => openEditCategory(item.id)}
                  >
                    <PencilLine className="size-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-full"
                    onClick={() => handleDelete(item.id)}
                    disabled={!liveMode || isPending}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={isEditorOpen}
        onOpenChange={(open) => {
          setIsEditorOpen(open);
          if (!open) {
            setSelectedId(null);
          }
        }}
      >
        <DialogContent className="max-w-[calc(100%-1rem)] border border-white/10 bg-slate-950 p-0 text-white sm:max-w-[min(980px,92vw)]">
          <DialogHeader className="border-b border-white/10 px-6 py-5">
            <DialogTitle className="text-2xl">
              {selectedId ? "Editer la categorie" : "Nouvelle categorie"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Ouvrez, corrigez et enregistrez une categorie sans perdre la vue globale du catalogue.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
            {message ? (
              <div className="mb-4 rounded-2xl border border-white/10 bg-white/10 p-3 text-sm">
                {message}
              </div>
            ) : null}
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Informations de la categorie</p>
                <p className="mt-1 text-xs text-white/60">
                  Creez des rayons simples et clairs pour aider les parents a trouver vite les produits.
                </p>

                <div className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">Nom visible</p>
                    <Input placeholder="Ex: Cartables" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">Slug</p>
                    <Input placeholder="Ex: cartables" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">Description courte</p>
                    <Textarea placeholder="Ex: Cartables, trousses et sacs pratiques pour la rentree." rows={5} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Image de couverture</p>
                      <p className="mt-1 text-xs text-white/60">
                        Importez une image depuis votre bureau ou collez un lien.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        onChange={handleUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="size-4" />
                        {isUploading ? "Envoi..." : "Importer depuis le bureau"}
                      </Button>
                    </div>
                  </div>

                  {uploadMessage ? (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80">
                      {uploadMessage}
                    </div>
                  ) : null}

                  <div className="mt-4 space-y-2">
                    <Input placeholder="/uploads/... ou https://..." value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} />
                  </div>

                  <div className="mt-4 relative overflow-hidden rounded-[22px] border border-white/10 bg-slate-900/70 aspect-[4/3]">
                    <Image
                      src={getSafeImageSrc(form.image)}
                      alt={form.name || "Image categorie"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">Exemples de rayons utiles</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categoryExamples.map((example) => (
                      <span
                        key={example}
                        className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs text-white/70"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 px-6 py-4">
            <Button
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              onClick={() => {
                setIsEditorOpen(false);
                setSelectedId(null);
              }}
            >
              Annuler
            </Button>
            <Button className="rounded-full" onClick={handleSave} disabled={!liveMode || isPending}>
              {selectedId ? "Mettre a jour" : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
