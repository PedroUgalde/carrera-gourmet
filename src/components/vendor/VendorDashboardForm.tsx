"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationPickerDynamic } from "@/components/maps/LocationPickerDynamic";
import { LocationAddressForm } from "@/components/vendor/LocationAddressForm";
import { HoursInput } from "@/components/vendor/HoursInput";
import { MenuItemForm } from "@/components/vendor/MenuItemForm";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import {
  demoSignOut,
  getDemoUser,
  getDemoVendor,
  saveDemoVendor,
} from "@/lib/demo-auth";
import {
  CITY_COORDS,
  type City,
  type MenuItemInput,
  type Vendor,
} from "@/lib/types/database";
import { geocodeStructuredAddress } from "@/lib/geo/geocode";
import {
  buildLocationName,
  parseLocationName,
} from "@/lib/locations/mexico-address";

const DEFAULT_HOURS = {
  mon: "10-22",
  tue: "10-22",
  wed: "10-22",
  thu: "10-22",
  fri: "10-23",
  sat: "10-23",
  sun: "11-21",
};

export function VendorDashboardForm() {
  const supabase = createClient();
  const demoMode = !isSupabaseConfigured();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [borough, setBorough] = useState("");
  const [city, setCity] = useState<City>("CDMX");
  const [latitude, setLatitude] = useState(CITY_COORDS.CDMX.lat);
  const [longitude, setLongitude] = useState(CITY_COORDS.CDMX.lng);
  const [capacityTotal, setCapacityTotal] = useState(20);
  const [hours, setHours] = useState<Record<string, string>>(DEFAULT_HOURS);
  const [menuItems, setMenuItems] = useState<MenuItemInput[]>([
    { item_name: "", description_original: "", price: 0, tags: [] },
  ]);
  const [geocoding, setGeocoding] = useState(false);
  const skipGeocode = useRef(true);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runGeocode = useCallback(async () => {
    if (!street.trim() || !borough || !postalCode || postalCode.length < 5) return;

    setGeocoding(true);
    try {
      const result = await geocodeStructuredAddress({
        street,
        streetNumber,
        postalCode,
        borough,
        city,
      });
      if (result) {
        setLatitude(result.lat);
        setLongitude(result.lng);
      }
    } catch {
      // el vendor puede ajustar el pin manualmente
    } finally {
      setGeocoding(false);
    }
  }, [street, streetNumber, postalCode, borough, city]);

  useEffect(() => {
    if (skipGeocode.current) return;
    if (!street.trim() || !borough || postalCode.length < 5) return;

    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(() => {
      runGeocode();
    }, 800);

    return () => {
      if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    };
  }, [street, streetNumber, postalCode, borough, city, runGeocode]);

  useEffect(() => {
    async function loadVendor() {
      if (demoMode) {
        const demoUser = getDemoUser();
        if (demoUser) {
          const saved = getDemoVendor(demoUser.id);
          if (saved) {
            setName(saved.name);
            const parsed = parseLocationName(saved.location_name ?? "", saved.city as City);
            setStreet("");
            setStreetNumber("");
            setPostalCode(parsed.postalCode ?? "");
            setBorough(parsed.borough ?? "");
            setCity(saved.city as City);
            setLatitude(saved.latitude);
            setLongitude(saved.longitude);
            setCapacityTotal(saved.capacity_total);
            setHours(saved.hours ?? DEFAULT_HOURS);
            if (saved.menuItems.length > 0) {
              setMenuItems(saved.menuItems);
            }
          }
        }
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: vendor } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (vendor) {
        const v = vendor as Vendor;
        setVendorId(v.id);
        setName(v.name);
        const parsed = parseLocationName(v.location_name, v.city);
        setStreet("");
        setStreetNumber("");
        setPostalCode(parsed.postalCode ?? "");
        setBorough(parsed.borough ?? "");
        setCity(v.city);
        setLatitude(v.latitude);
        setLongitude(v.longitude);
        setCapacityTotal(v.capacity_total);
        setHours(v.hours ?? DEFAULT_HOURS);

        const { data: menus } = await supabase
          .from("menus")
          .select("*")
          .eq("vendor_id", v.id);

        if (menus && menus.length > 0) {
          setMenuItems(
            menus.map((m) => ({
              item_name: m.item_name,
              description_original: m.description_original,
              description_translated: m.description_translated ?? undefined,
              price: Number(m.price),
              tags: m.tags ?? [],
            }))
          );
        }
      }
      setLoading(false);
    }
    loadVendor().then(() => {
      skipGeocode.current = false;
    });
  }, [supabase, demoMode]);

  const handleCityChange = (newCity: City) => {
    setCity(newCity);
    setBorough("");
    setLatitude(CITY_COORDS[newCity].lat);
    setLongitude(CITY_COORDS[newCity].lng);
  };

  const handleTranslate = async () => {
    const itemsToTranslate = menuItems.filter(
      (i) => i.item_name && i.description_original
    );
    if (itemsToTranslate.length === 0) {
      toast.error("Agrega al menos un platillo con descripción");
      return;
    }

    setTranslating(true);
    try {
      const res = await fetch("/api/translate-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToTranslate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const updated = menuItems.map((item) => {
        const translated = data.items.find(
          (t: { item_name: string }) => t.item_name === item.item_name
        );
        if (translated) {
          return {
            ...item,
            description_translated: translated.description_translated,
            tags: translated.tags,
          };
        }
        return item;
      });
      setMenuItems(updated);
      toast.success("Menú traducido con IA");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al traducir");
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !street || !borough || postalCode.length < 5) {
      toast.error("Completa nombre y dirección (calle, alcaldía, CP)");
      return;
    }

    const locationName = buildLocationName({
      street,
      streetNumber,
      postalCode,
      borough,
      city,
    });

    setSaving(true);
    try {
      if (demoMode) {
        const demoUser = getDemoUser();
        if (!demoUser) throw new Error("No autenticado — usa Demo Vendor en /register");

        saveDemoVendor(demoUser.id, {
          name,
          location_name: locationName,
          city,
          latitude,
          longitude,
          capacity_total: capacityTotal,
          hours,
          menuItems: menuItems.filter(
            (i) => i.item_name && i.description_original
          ),
        });
        toast.success("Negocio guardado localmente (modo demo)");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const allTags = [
        ...new Set(menuItems.flatMap((m) => m.tags ?? [])),
      ];

      const vendorPayload = {
        user_id: user.id,
        name,
        location_name: locationName,
        city,
        latitude,
        longitude,
        capacity_total: capacityTotal,
        hours,
        tags: allTags,
      };

      let currentVendorId = vendorId;

      if (currentVendorId) {
        const { error } = await supabase
          .from("vendors")
          .update(vendorPayload)
          .eq("id", currentVendorId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("vendors")
          .insert(vendorPayload)
          .select("id")
          .single();
        if (error) throw error;
        currentVendorId = data.id;
        setVendorId(data.id);
      }

      await supabase.from("menus").delete().eq("vendor_id", currentVendorId);

      const validItems = menuItems.filter(
        (i) => i.item_name && i.description_original
      );
      if (validItems.length > 0) {
        const { error: menuError } = await supabase.from("menus").insert(
          validItems.map((item) => ({
            vendor_id: currentVendorId,
            item_name: item.item_name,
            description_original: item.description_original,
            description_translated: item.description_translated ?? null,
            price: item.price,
            tags: item.tags ?? [],
          }))
        );
        if (menuError) throw menuError;
      }

      toast.success("Negocio guardado correctamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (demoMode) {
      demoSignOut();
    } else {
      await supabase.auth.signOut();
    }
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D6A4F]">Portal Comerciante</h1>
          <p className="text-sm text-muted-foreground">
            Registra tu puesto para turistas del Mundial 2026
          </p>
        </div>
        <Button type="button" variant="outline" onClick={handleLogout}>
          Salir
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del negocio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre del puesto</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Tacos El Güero"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Ciudad</Label>
            <Select value={city} onValueChange={(v) => v && handleCityChange(v as City)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CDMX">CDMX</SelectItem>
                <SelectItem value="Guadalajara">Guadalajara</SelectItem>
                <SelectItem value="Monterrey">Monterrey</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <LocationAddressForm
            city={city}
            street={street}
            streetNumber={streetNumber}
            postalCode={postalCode}
            borough={borough}
            onStreetChange={setStreet}
            onStreetNumberChange={setStreetNumber}
            onPostalCodeChange={setPostalCode}
            onBoroughChange={setBorough}
            geocoding={geocoding}
          />

          <div className="space-y-2">
            <Label>Capacidad total (personas)</Label>
            <Input
              type="number"
              min={1}
              value={capacityTotal}
              onChange={(e) => setCapacityTotal(parseInt(e.target.value) || 1)}
              required
            />
          </div>
          <HoursInput hours={hours} onChange={setHours} />
          <div className="space-y-2">
            <Label>Ubicación en mapa</Label>
            <p className="text-xs text-muted-foreground">
              Ajusta el pin si la dirección no quedó exacta.
            </p>
            <LocationPickerDynamic
              city={city}
              latitude={latitude}
              longitude={longitude}
              onChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <MenuItemForm
            items={menuItems}
            onChange={setMenuItems}
            onTranslate={handleTranslate}
            translating={translating}
          />
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={saving}
        className="w-full bg-[#2D6A4F] hover:bg-[#2D6A4F]/90"
        size="lg"
      >
        {saving ? "Guardando..." : "Guardar negocio"}
      </Button>
    </form>
  );
}
