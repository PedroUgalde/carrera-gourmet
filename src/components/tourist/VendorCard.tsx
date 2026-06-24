"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorMapDynamic } from "@/components/maps/VendorMapDynamic";
import { BookButton } from "@/components/tourist/BookButton";
import type { RecommendedVendor } from "@/lib/types/database";
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
    <Card className="overflow-hidden shadow-md">
      <CardHeader className="bg-[#2D6A4F]/5 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-[#E85D04]">
              #{rank} Match
            </span>
            <CardTitle className="text-xl">{vendor.name}</CardTitle>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {vendor.location_name}, {vendor.city}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-[#2D6A4F]">
              {vendor.distance_km} km
            </p>
            <p className="flex items-center justify-end gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              {vendor.available}/{vendor.capacity_total} spots
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {vendor.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
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
          <h4 className="text-sm font-semibold">Menu highlights</h4>
          {vendor.menus.map((item) => (
            <div key={item.id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between">
                <p className="font-medium">{item.item_name}</p>
                <p className="text-sm font-semibold text-[#E85D04]">
                  ${Number(item.price).toFixed(0)} MXN
                </p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
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
