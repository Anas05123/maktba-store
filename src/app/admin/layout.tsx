import { AdminAccessGuard } from "@/components/admin/admin-access-guard";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminAccessGuard>{children}</AdminAccessGuard>;
}
