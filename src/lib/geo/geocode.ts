import type { StructuredAddress } from "@/lib/locations/mexico-address";
import { buildGeocodeQuery as buildStructuredQuery } from "@/lib/locations/mexico-address";

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

export async function geocodeStructuredAddress(
  address: StructuredAddress
): Promise<GeocodeResult | null> {
  if (!address.street.trim() || address.street.trim().length < 2) return null;
  if (!address.borough) return null;

  const q = buildStructuredQuery(address);
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.lat == null || data.lng == null) return null;

  return {
    lat: data.lat,
    lng: data.lng,
    displayName: data.displayName ?? q,
  };
}

/** @deprecated use geocodeStructuredAddress */
export async function geocodeAddress(
  locationName: string,
  city: string
): Promise<GeocodeResult | null> {
  if (!locationName.trim() || locationName.trim().length < 3) return null;
  const cityLabel =
    city === "CDMX"
      ? "Ciudad de México"
      : city === "Guadalajara"
        ? "Guadalajara, Jalisco"
        : "Monterrey, Nuevo León";
  const q = `${locationName}, ${cityLabel}, México`;
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.lat == null || data.lng == null) return null;
  return { lat: data.lat, lng: data.lng, displayName: data.displayName ?? q };
}
