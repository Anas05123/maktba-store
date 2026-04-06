import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin/cms";

const allowedMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    return NextResponse.json({ message: "Aucun fichier image recu." }, { status: 400 });
  }

  const uploadedUrls: string[] = [];
  const uploadDir = path.join(process.cwd(), "public", "uploads", "catalog");
  await mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    const extension = allowedMimeTypes.get(file.type);

    if (!extension) {
      return NextResponse.json(
        { message: "Format image invalide. Utilisez JPG, PNG, WEBP ou GIF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Image trop lourde. Taille maximale: 4 Mo." },
        { status: 400 },
      );
    }

    const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
    const absolutePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(absolutePath, buffer);
    uploadedUrls.push(`/uploads/catalog/${fileName}`);
  }

  return NextResponse.json({ ok: true, urls: uploadedUrls });
}
