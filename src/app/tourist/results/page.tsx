"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FFF8F0] p-4">
        <p className="text-muted-foreground">No search results found.</p>
        <Link
          href="/tourist/search"
          className={cn(buttonVariants(), "bg-[#2D6A4F]")}
        >
          Start a new search
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-6">
      <div className="mx-auto max-w-md space-y-6 p-4">
        <div className="flex items-center gap-3">
          <Link
            href="/tourist/search"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#2D6A4F]">Top picks near you</h1>
            <p className="text-sm text-muted-foreground">
              {data.vendors.length} authentic spots found
            </p>
          </div>
        </div>

        {data.vendors.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-center">
            <p className="text-muted-foreground">
              No vendors match your preferences with available capacity.
            </p>
            <Link
              href="/tourist/search"
              className={cn(buttonVariants(), "mt-4 bg-[#E85D04]")}
            >
              Adjust preferences
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
    </div>
  );
}
