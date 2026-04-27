"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function AdminOrderNotificationsBadge() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await fetch("/api/admin/orders/notifications", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { count?: number };

        if (isMounted) {
          setCount(payload.count ?? 0);
        }
      } catch {
        // Keep the current badge state if polling fails.
      }
    }

    void load();
    const intervalId = window.setInterval(() => {
      void load();
    }, 15000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [pathname]);

  if (count < 1) {
    return null;
  }

  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm shadow-rose-950/30">
      {count > 9 ? "9+" : count}
    </span>
  );
}
