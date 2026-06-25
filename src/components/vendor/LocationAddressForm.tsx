"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BOROUGH_LABEL,
  BOROUGHS_BY_CITY,
  type StructuredAddress,
} from "@/lib/locations/mexico-address";
import type { City } from "@/lib/types/database";

interface LocationAddressFormProps {
  city: City;
  street: string;
  streetNumber: string;
  postalCode: string;
  borough: string;
  onStreetChange: (v: string) => void;
  onStreetNumberChange: (v: string) => void;
  onPostalCodeChange: (v: string) => void;
  onBoroughChange: (v: string) => void;
  geocoding?: boolean;
}

export function LocationAddressForm({
  city,
  street,
  streetNumber,
  postalCode,
  borough,
  onStreetChange,
  onStreetNumberChange,
  onPostalCodeChange,
  onBoroughChange,
  geocoding,
}: LocationAddressFormProps) {
  const boroughs = BOROUGHS_BY_CITY[city];
  const boroughLabel = BOROUGH_LABEL[city];

  return (
    <div className="space-y-4 rounded-xl border-2 border-orange-100 bg-orange-50/30 p-4">
      <div>
        <p className="text-sm font-bold text-[#FF6B00]">Dirección del puesto</p>
        <p className="text-xs text-muted-foreground">
          Completa la dirección para ubicar tu negocio con precisión en el mapa.
        </p>
      </div>

      <div className="space-y-2">
        <Label>{boroughLabel}</Label>
        <Select value={borough || undefined} onValueChange={(v) => v && onBoroughChange(v)}>
          <SelectTrigger>
            <SelectValue placeholder={`Selecciona ${boroughLabel.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {boroughs.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-2">
          <Label>Calle</Label>
          <Input
            placeholder="Ej: Av. Insurgentes Sur"
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Número</Label>
          <Input
            placeholder="123"
            value={streetNumber}
            onChange={(e) => onStreetNumberChange(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Código postal</Label>
        <Input
          placeholder="Ej: 03100"
          value={postalCode}
          onChange={(e) => onPostalCodeChange(e.target.value.replace(/\D/g, "").slice(0, 5))}
          maxLength={5}
          inputMode="numeric"
          required
        />
      </div>

      {geocoding && (
        <p className="text-xs text-[#FF6B00]">Buscando ubicación en el mapa...</p>
      )}
    </div>
  );
}

export function toStructuredAddress(
  city: City,
  street: string,
  streetNumber: string,
  postalCode: string,
  borough: string
): StructuredAddress {
  return { city, street, streetNumber, postalCode, borough };
}
