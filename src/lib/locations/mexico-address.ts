import type { City } from "@/lib/types/database";

export const CDMX_ALCALDIAS = [
  "Álvaro Obregón",
  "Azcapotzalco",
  "Benito Juárez",
  "Coyoacán",
  "Cuajimalpa de Morelos",
  "Cuauhtémoc",
  "Gustavo A. Madero",
  "Iztacalco",
  "Iztapalapa",
  "La Magdalena Contreras",
  "Miguel Hidalgo",
  "Milpa Alta",
  "Tláhuac",
  "Tlalpan",
  "Venustiano Carranza",
  "Xochimilco",
] as const;

export const GUADALAJARA_MUNICIPIOS = [
  "Guadalajara",
  "Zapopan",
  "Tlaquepaque",
  "Tonalá",
  "El Salto",
  "Tlajomulco de Zúñiga",
] as const;

export const MONTERREY_MUNICIPIOS = [
  "Monterrey",
  "San Pedro Garza García",
  "San Nicolás de los Garza",
  "Guadalupe",
  "Apodaca",
  "Santa Catarina",
] as const;

export const BOROUGHS_BY_CITY: Record<City, readonly string[]> = {
  CDMX: CDMX_ALCALDIAS,
  Guadalajara: GUADALAJARA_MUNICIPIOS,
  Monterrey: MONTERREY_MUNICIPIOS,
};

export const BOROUGH_LABEL: Record<City, string> = {
  CDMX: "Alcaldía",
  Guadalajara: "Municipio",
  Monterrey: "Municipio",
};

export interface StructuredAddress {
  street: string;
  streetNumber: string;
  postalCode: string;
  borough: string;
  city: City;
}

export function buildLocationName(addr: StructuredAddress): string {
  const parts = [
    `${addr.street.trim()} ${addr.streetNumber.trim()}`.trim(),
    `${BOROUGH_LABEL[addr.city]} ${addr.borough}`,
    `CP ${addr.postalCode.trim()}`,
    addr.city,
  ].filter(Boolean);
  return parts.join(", ");
}

export function buildGeocodeQuery(addr: StructuredAddress): string {
  const cityLabel =
    addr.city === "CDMX"
      ? "Ciudad de México"
      : addr.city === "Guadalajara"
        ? "Guadalajara, Jalisco"
        : "Monterrey, Nuevo León";

  return `${addr.street} ${addr.streetNumber}, ${addr.borough}, ${cityLabel}, ${addr.postalCode}, México`;
}

export function parseLocationName(
  locationName: string,
  city: City
): Partial<StructuredAddress> {
  const boroughs = BOROUGHS_BY_CITY[city];
  const foundBorough = boroughs.find((b) =>
    locationName.toLowerCase().includes(b.toLowerCase())
  );
  const cpMatch = locationName.match(/CP\s*(\d{5})/i);

  return {
    borough: foundBorough ?? "",
    postalCode: cpMatch?.[1] ?? "",
    city,
  };
}
