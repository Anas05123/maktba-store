import { StoreFooter } from "@/components/layout/store-footer";
import { StoreHeader } from "@/components/layout/store-header";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="print:hidden">
        <StoreHeader />
      </div>
      <main className="flex-1">{children}</main>
      <div className="print:hidden">
        <StoreFooter />
      </div>
    </div>
  );
}
