"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { FeaturedVendor } from "@/lib/featured-vendors";
import { getVendorImageUrl } from "@/lib/vendor-images";
import { cn } from "@/lib/utils";

interface VendorCarouselProps {
  vendors: FeaturedVendor[];
}

export function VendorCarousel({ vendors }: VendorCarouselProps) {
  const [active, setActive] = useState(0);
  const count = vendors.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [count, next]);

  if (count === 0) return null;

  const vendor = vendors[active];

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-[#FF6B00]">
            Puestos destacados
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-neutral-900 sm:text-4xl">
            Los que hay que probar
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-600">
            Puestos reales en las tres ciudades sede. Fotos, ubicación y menú
            al alcance.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border-2 border-orange-100 bg-[#FFF5EB] shadow-lg">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[4/3] min-h-[240px] lg:aspect-auto lg:min-h-[380px]">
              {vendors.map((v, i) => (
                <div
                  key={v.id}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700",
                    i === active ? "opacity-100" : "opacity-0"
                  )}
                >
                  <Image
                    src={getVendorImageUrl(v.image_url, i)}
                    alt={v.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-md bg-[#FF6B00] px-2.5 py-1 text-xs font-black uppercase text-white">
                {vendor.city}
              </span>
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-10">
              <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-900 sm:text-3xl">
                {vendor.name}
              </h3>
              <p className="mt-2 flex items-center gap-1.5 font-medium text-neutral-600">
                <MapPin className="h-4 w-4 shrink-0 text-[#FF6B00]" />
                {vendor.location_name}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {vendor.tags.slice(0, 4).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-orange-200 bg-white text-xs font-semibold"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <Link
                href="/tourist/search"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-8 w-fit rounded-full bg-[#FF6B00] font-bold hover:bg-[#E85D04]"
                )}
              >
                Ver puestos cerca
              </Link>
            </div>
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-orange-100 bg-white p-2 shadow-md transition hover:bg-orange-50 lg:left-4"
              >
                <ChevronLeft className="h-5 w-5 text-[#FF6B00]" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Siguiente"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-orange-100 bg-white p-2 shadow-md transition hover:bg-orange-50 lg:right-4"
              >
                <ChevronRight className="h-5 w-5 text-[#FF6B00]" />
              </button>
            </>
          )}
        </div>

        {count > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {vendors.map((v, i) => (
              <button
                key={v.id}
                type="button"
                aria-label={`Ver ${v.name}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  i === active
                    ? "w-8 bg-[#FF6B00]"
                    : "w-2.5 bg-orange-200 hover:bg-orange-300"
                )}
              />
            ))}
          </div>
        )}

        <div className="mt-10 hidden gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-6">
          {vendors.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "group overflow-hidden rounded-xl border-2 bg-white text-left transition hover:shadow-md",
                i === active
                  ? "border-[#FF6B00] shadow-md"
                  : "border-orange-100 hover:border-orange-200"
              )}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={getVendorImageUrl(v.image_url, i)}
                  alt={v.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="160px"
                />
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-bold">{v.name}</p>
                <p className="truncate text-[10px] text-neutral-500">
                  {v.city}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
