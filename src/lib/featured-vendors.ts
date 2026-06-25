import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { DEMO_VENDORS } from "@/lib/demo-data";
import type { City } from "@/lib/types/database";

export interface FeaturedVendor {
  id: string;
  name: string;
  location_name: string;
  city: City;
  image_url: string | null;
  tags: string[];
}

export async function getFeaturedVendors(limit = 6): Promise<FeaturedVendor[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_VENDORS.slice(0, limit).map((v) => ({
      id: v.id,
      name: v.name,
      location_name: v.location_name,
      city: v.city,
      image_url: v.image_url ?? null,
      tags: v.tags,
    }));
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("vendors")
    .select("id, name, location_name, city, image_url, tags")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as FeaturedVendor[];
}
