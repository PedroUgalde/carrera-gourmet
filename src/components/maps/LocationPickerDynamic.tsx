"use client";

import dynamic from "next/dynamic";
import type { City } from "@/lib/types/database";

const LocationPickerInner = dynamic(
  () =>
    import("@/components/maps/LocationPicker").then((m) => m.LocationPicker),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-muted" /> }
);

interface LocationPickerDynamicProps {
  city: City;
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

export function LocationPickerDynamic(props: LocationPickerDynamicProps) {
  return <LocationPickerInner {...props} />;
}
