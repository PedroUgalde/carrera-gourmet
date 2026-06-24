import { haversineDistance } from "@/lib/geo/haversine";
import { vendorContainsAllergen } from "@/lib/recommend-allergies";
import {
  BUDGET_RANGES,
  type MenuItem,
  type RecommendedVendor,
} from "@/lib/types/database";

interface VendorWithMenus {
  id: string;
  name: string;
  location_name: string;
  city: "CDMX" | "Guadalajara" | "Monterrey";
  latitude: number;
  longitude: number;
  capacity_total: number;
  available: number;
  tags: string[];
  menus: MenuItem[];
}

function tagMatchRatio(
  preferences: string[],
  vendorTags: string[],
  menuTags: string[]
): number {
  if (preferences.length === 0) return 1;
  const allTags = new Set(
    [...vendorTags, ...menuTags].map((t) => t.toLowerCase())
  );
  const matches = preferences.filter((p) =>
    allTags.has(p.toLowerCase())
  ).length;
  return matches / preferences.length;
}

function avgMenuPrice(menus: MenuItem[]): number {
  if (menus.length === 0) return 0;
  return menus.reduce((sum, m) => sum + Number(m.price), 0) / menus.length;
}

function matchesBudget(avgPrice: number, budget?: string): boolean {
  if (!budget || !BUDGET_RANGES[budget]) return true;
  const { min, max } = BUDGET_RANGES[budget];
  return avgPrice >= min && avgPrice <= max;
}

export function scoreAndRankVendors(
  vendors: VendorWithMenus[],
  latitude: number,
  longitude: number,
  preferences: string[],
  partySize: number,
  budget?: string,
  allergyExclusions: string[] = []
): RecommendedVendor[] {
  return vendors
    .filter((v) => v.available >= partySize)
    .filter((v) => {
      const menuTags = v.menus.flatMap((m) => m.tags ?? []);
      const menuTexts = v.menus.flatMap((m) => [
        m.item_name,
        m.description_original,
        m.description_translated ?? "",
      ]);
      return !vendorContainsAllergen(
        v.tags,
        menuTags,
        menuTexts,
        allergyExclusions
      );
    })
    .filter((v) => {
      const menuTags = v.menus.flatMap((m) => m.tags ?? []);
      if (preferences.length === 0) return true;
      const allTags = [...v.tags, ...menuTags].map((t) => t.toLowerCase());
      return preferences.some((p) => allTags.includes(p.toLowerCase()));
    })
    .filter((v) => matchesBudget(avgMenuPrice(v.menus), budget))
    .map((v) => {
      const distance = haversineDistance(
        latitude,
        longitude,
        v.latitude,
        v.longitude
      );
      const menuTags = v.menus.flatMap((m) => m.tags ?? []);
      const tagRatio = tagMatchRatio(preferences, v.tags, menuTags);
      const capacityRatio =
        v.capacity_total > 0 ? v.available / v.capacity_total : 0;
      const score =
        (1 / Math.max(distance, 0.1)) * 0.5 +
        tagRatio * 0.3 +
        capacityRatio * 0.2;

      return {
        ...v,
        distance_km: Math.round(distance * 100) / 100,
        score: Math.round(score * 1000) / 1000,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
