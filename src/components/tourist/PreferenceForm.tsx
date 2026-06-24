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
      toast.error("Geolocation not supported");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocating(false);
        toast.success("Location detected");
      },
      () => {
        setLocating(false);
        toast.error("Could not get location — select a city instead");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const useCityDefault = () => {
    const coords = CITY_COORDS[city];
    setLatitude(coords.lat);
    setLongitude(coords.lng);
    toast.info(`Using ${city} center as location`);
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
      toast.error(err instanceof Error ? err.message : "Search failed");
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
    <div className="mx-auto max-w-md space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D6A4F]">Find Authentic Food</h1>
          <p className="text-sm text-muted-foreground">
            Discover local gems near you
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Dietary preferences</Label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((opt) => (
                <Badge
                  key={opt}
                  variant={preferences.includes(opt) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 text-sm"
                  onClick={() => togglePreference(opt)}
                >
                  {opt}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allergies (comma separated)</Label>
            <Textarea
              placeholder="e.g. peanuts, shellfish, dairy"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Places containing these allergens will be excluded from results.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Budget</Label>
            <Select value={budget} onValueChange={(v) => v && setBudget(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="$">$ — Budget-friendly (under $60 MXN)</SelectItem>
                <SelectItem value="$$">$$ — Mid-range ($40–120 MXN)</SelectItem>
                <SelectItem value="$$$">$$$ — Premium ($100+ MXN)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Party size</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={partySize}
              onChange={(e) => setPartySize(parseInt(e.target.value) || 1)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Or pick a city</Label>
            <Select value={city} onValueChange={(v) => v && setCity(v as City)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CDMX">Mexico City (CDMX)</SelectItem>
                <SelectItem value="Guadalajara">Guadalajara</SelectItem>
                <SelectItem value="Monterrey">Monterrey</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-12"
              onClick={useMyLocation}
              disabled={locating}
            >
              {locating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="mr-2 h-4 w-4" />
              )}
              Use my location
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10"
              onClick={useCityDefault}
            >
              Use city center instead
            </Button>
          </div>

          {latitude !== null && longitude !== null && (
            <p className="text-xs text-muted-foreground">
              Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={handleSearch}
        disabled={loading}
        className="h-14 w-full bg-[#E85D04] text-lg hover:bg-[#E85D04]/90"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Searching...
          </>
        ) : (
          "Find Authentic Food"
        )}
      </Button>
    </div>
  );
}
