import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/layout/admin-shell";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/account?denied=1");
  }

  return <AdminShell>{children}</AdminShell>;
}
