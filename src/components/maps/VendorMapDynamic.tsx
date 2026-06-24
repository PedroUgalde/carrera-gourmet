"use client";

import dynamic from "next/dynamic";

export const VendorMapDynamic = dynamic(
  () => import("@/components/maps/VendorMap").then((m) => m.VendorMap),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-lg bg-muted" /> }
);
