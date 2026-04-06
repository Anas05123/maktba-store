"use client";

export async function uploadAdminImages(files: File[]) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "Upload impossible.");
  }

  return (payload.urls as string[]) ?? [];
}
