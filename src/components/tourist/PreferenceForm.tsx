"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import { demoSignOut } from "@/lib/demo-auth";
import { CITY_COORDS, DIETARY_OPTIONS, type City } from "@/lib/types/database";

export function PreferenceForm() {
  const router = useRouter();
  const supabase = createClient();
  const [preferences, setPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState("");
  const [budget, setBudget] = useState<string>("$$");
  const [partySize, setPartySize] = useState(2);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [city, setCity] = useState<City>("CDMX");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const togglePreference = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalización no disponible");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocating(false);
        toast.success("Ubicación detectada");
      },
      () => {
        setLocating(false);
        toast.error("No se pudo obtener ubicación — elige una ciudad");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const useCityDefault = () => {
    const coords = CITY_COORDS[city];
    setLatitude(coords.lat);
    setLongitude(coords.lng);
    toast.info(`Usando centro de ${city}`);
  };

  const handleSearch = async () => {
    const lat = latitude ?? CITY_COORDS[city].lat;
    const lng = longitude ?? CITY_COORDS[city].lng;

    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          preferences,
          allergies: allergies.trim(),
          party_size: partySize,
          budget,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      sessionStorage.setItem(
        "carrera_results",
        JSON.stringify({
          vendors: data.vendors,
          party_size: partySize,
          latitude: lat,
          longitude: lng,
        })
      );
      router.push("/tourist/results");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Búsqueda fallida");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!isSupabaseConfigured()) {
      demoSignOut();
    } else {
      await supabase.auth.signOut();
    }
    window.location.href = "/";
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="street-heading text-2xl">¿Qué se te antoja?</h1>
          <p className="text-sm text-neutral-600">
            Encuentra puestos callejeros cerca de ti
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full border-orange-200"
          onClick={handleLogout}
        >
          Salir
        </Button>
      </div>

      <Card className="street-card">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-neutral-900">
            Tus preferencias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Dieta y estilo</Label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((opt) => (
                <Badge
                  key={opt}
                  variant={preferences.includes(opt) ? "default" : "outline"}
                  className={
                    preferences.includes(opt)
                      ? "cursor-pointer bg-[#FF6B00] px-3 py-1.5 text-sm hover:bg-[#E85D04]"
                      : "cursor-pointer border-orange-200 px-3 py-1.5 text-sm hover:bg-orange-50"
                  }
                  onClick={() => togglePreference(opt)}
                >
                  {opt}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Alergias (separadas por coma)</Label>
            <Textarea
              placeholder="ej. cacahuate, mariscos, lácteos"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="border-orange-100"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Presupuesto</Label>
            <Select value={budget} onValueChange={(v) => v && setBudget(v)}>
              <SelectTrigger className="border-orange-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="$">$ — Barato (menos de $60 MXN)</SelectItem>
                <SelectItem value="$$">$$ — Medio ($40–120 MXN)</SelectItem>
                <SelectItem value="$$$">$$$ — Premium ($100+ MXN)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>¿Cuántos van?</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={partySize}
              onChange={(e) => setPartySize(parseInt(e.target.value) || 1)}
              className="border-orange-100"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="street-card">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-neutral-900">
            Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Ciudad</Label>
            <Select value={city} onValueChange={(v) => v && setCity(v as City)}>
              <SelectTrigger className="border-orange-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CDMX">Ciudad de México</SelectItem>
                <SelectItem value="Guadalajara">Guadalajara</SelectItem>
                <SelectItem value="Monterrey">Monterrey</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full border-orange-200 font-semibold hover:bg-orange-50"
              onClick={useMyLocation}
              disabled={locating}
            >
              {locating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="mr-2 h-4 w-4 text-[#FF6B00]" />
              )}
              Usar mi ubicación
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 font-medium text-neutral-600"
              onClick={useCityDefault}
            >
              Usar centro de la ciudad
            </Button>
          </div>

          {latitude !== null && longitude !== null && (
            <p className="text-xs text-neutral-500">
              Ubicación: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={handleSearch}
        disabled={loading}
        className="h-14 w-full rounded-full bg-[#FF6B00] text-lg font-black uppercase tracking-wide hover:bg-[#E85D04]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Buscando puestos...
          </>
        ) : (
          "Buscar antojos"
        )}
      </Button>
    </div>
  );
}
