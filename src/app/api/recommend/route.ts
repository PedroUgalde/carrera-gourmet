import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_VENDORS } from "@/lib/demo-data";
import { parseAllergyExclusions } from "@/lib/recommend-allergies";
import { scoreAndRankVendors } from "@/lib/recommend";
import { isSupabaseConfigured } from "@/lib/config";
import type { MenuItem } from "@/lib/types/database";

const requestSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  preferences: z.array(z.string()).default([]),
  allergies: z.string().optional(),
  party_size: z.number().int().positive().default(2),
  budget: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { latitude, longitude, preferences, party_size, budget, allergies } =
      parsed.data;

    const allergyExclusions = parseAllergyExclusions(allergies ?? "");

    if (!isSupabaseConfigured()) {
      const results = scoreAndRankVendors(
        DEMO_VENDORS.map((v) => ({
          ...v,
          menus: v.menus as MenuItem[],
        })),
        latitude,
        longitude,
        preferences,
        party_size,
        budget,
        allergyExclusions
      );
      return NextResponse.json({ vendors: results, source: "demo" });
    }

    const supabase = createAdminClient();

    const { data: vendors, error: vendorsError } = await supabase
      .from("vendors")
      .select("*");

    if (vendorsError) {
      return NextResponse.json({ error: vendorsError.message }, { status: 500 });
    }

    const { data: menus, error: menusError } = await supabase
      .from("menus")
      .select("*");

    if (menusError) {
      return NextResponse.json({ error: menusError.message }, { status: 500 });
    }

    const { data: capacities, error: capError } = await supabase
      .from("vendor_capacity")
      .select("*");

    if (capError) {
      return NextResponse.json({ error: capError.message }, { status: 500 });
    }

    const capacityMap = new Map(
      (capacities ?? []).map((c) => [c.vendor_id, c])
    );

    const vendorsWithMenus = (vendors ?? []).map((v) => {
      const cap = capacityMap.get(v.id);
      return {
        id: v.id,
        name: v.name,
        location_name: v.location_name,
        city: v.city,
        latitude: v.latitude,
        longitude: v.longitude,
        capacity_total: cap?.capacity_total ?? v.capacity_total,
        available: cap?.available ?? v.capacity_total,
        tags: v.tags ?? [],
        menus: (menus ?? []).filter((m) => m.vendor_id === v.id) as MenuItem[],
      };
    });

    const results = scoreAndRankVendors(
      vendorsWithMenus,
      latitude,
      longitude,
      preferences,
      party_size,
      budget,
      allergyExclusions
    );

    return NextResponse.json({ vendors: results, source: "supabase" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
