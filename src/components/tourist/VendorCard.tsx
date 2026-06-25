"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorMapDynamic } from "@/components/maps/VendorMapDynamic";
import { BookButton } from "@/components/tourist/BookButton";
import type { RecommendedVendor } from "@/lib/types/database";
import { getVendorImageUrl } from "@/lib/vendor-images";
import { MapPin, Users } from "lucide-react";

interface VendorCardProps {
  vendor: RecommendedVendor;
  partySize: number;
  rank: number;
  onBooked?: (vendorId: string) => void;
}

export function VendorCard({
  vendor,
  partySize,
  rank,
  onBooked,
}: VendorCardProps) {
  return (
    <Card className="street-card overflow-hidden shadow-md">
      <div className="relative h-44 w-full">
        <Image
          src={getVendorImageUrl(vendor.image_url, rank - 1)}
          alt={vendor.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute left-3 top-3 rounded-md bg-[#FF6B00] px-2.5 py-0.5 text-xs font-black uppercase text-white">
          #{rank} top
        </span>
      </div>
      <CardHeader className="border-b border-orange-50 bg-orange-50/50 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{vendor.name}</CardTitle>
            <p className="flex items-center gap-1 text-sm text-neutral-600">
              <MapPin className="h-3 w-3 text-[#FF6B00]" />
              {vendor.location_name}, {vendor.city}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold text-[#FF6B00]">
              {vendor.distance_km} km
            </p>
            <p className="flex items-center justify-end gap-1 text-neutral-500">
              <Users className="h-3 w-3" />
              {vendor.available}/{vendor.capacity_total} lugares
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {vendor.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-orange-200 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <VendorMapDynamic
          latitude={vendor.latitude}
          longitude={vendor.longitude}
          name={vendor.name}
        />

        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wide text-neutral-700">
            Lo más pedido
          </h4>
          {vendor.menus.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border-2 border-orange-50 bg-[#FFF5EB]/50 p-3"
            >
              <div className="flex items-start justify-between">
                <p className="font-semibold">{item.item_name}</p>
                <p className="text-sm font-black text-[#FF6B00]">
                  ${Number(item.price).toFixed(0)} MXN
                </p>
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                {item.description_translated ?? item.description_original}
              </p>
              {item.tags && item.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <BookButton
          vendorId={vendor.id}
          partySize={partySize}
          available={vendor.available}
          onBooked={() => onBooked?.(vendor.id)}
        />
      </CardContent>
    </Card>
  );
}
