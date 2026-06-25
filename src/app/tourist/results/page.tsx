"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StreetShell } from "@/components/layout/StreetShell";
import { VendorCard } from "@/components/tourist/VendorCard";
import type { RecommendedVendor } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface ResultsData {
  vendors: RecommendedVendor[];
  party_size: number;
  latitude: number;
  longitude: number;
}

export default function TouristResultsPage() {
  const [data, setData] = useState<ResultsData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("carrera_results");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const handleBooked = (vendorId: string) => {
    if (!data) return;
    setData({
      ...data,
      vendors: data.vendors.map((v) =>
        v.id === vendorId
          ? { ...v, available: Math.max(0, v.available - data.party_size) }
          : v
      ),
    });
    sessionStorage.setItem(
      "carrera_results",
      JSON.stringify({
        ...data,
        vendors: data.vendors.map((v) =>
          v.id === vendorId
            ? { ...v, available: Math.max(0, v.available - data.party_size) }
            : v
        ),
      })
    );
  };

  if (!data) {
    return (
      <StreetShell centered showFooter={false}>
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-neutral-600">No hay resultados de búsqueda.</p>
          <Link href="/tourist/search" className={cn(buttonVariants(), "street-btn")}>
            Nueva búsqueda
          </Link>
        </div>
      </StreetShell>
    );
  }

  return (
    <StreetShell showFooter={false}>
      <div className="mx-auto max-w-md space-y-6 p-4 py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/tourist/search"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "rounded-full hover:bg-orange-50 hover:text-[#FF6B00]"
            )}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="street-heading text-2xl">Puestos cerca de ti</h1>
            <p className="text-sm text-neutral-600">
              {data.vendors.length} antojos encontrados
            </p>
          </div>
        </div>

        {data.vendors.length === 0 ? (
          <div className="street-card p-6 text-center">
            <p className="text-neutral-600">
              Ningún puesto coincide con tus preferencias o no hay aforo
              disponible.
            </p>
            <Link
              href="/tourist/search"
              className={cn(buttonVariants(), "mt-4 street-btn")}
            >
              Ajustar búsqueda
            </Link>
          </div>
        ) : (
          data.vendors.map((vendor, index) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              partySize={data.party_size}
              rank={index + 1}
              onBooked={handleBooked}
            />
          ))
        )}
      </div>
    </StreetShell>
  );
}
