import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SEED_VENDORS } from "@/lib/seed-vendors";
import { isSupabaseConfigured } from "@/lib/config";

const DEFAULT_HOURS = {
  mon: "10-22",
  tue: "10-22",
  wed: "10-22",
  thu: "10-22",
  fri: "10-23",
  sat: "10-23",
  sun: "11-21",
};

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured. Set env variables first." },
      { status: 503 }
    );
  }

  const admin = createAdminClient();
  const results: { email: string; vendor: string; status: string }[] = [];

  for (const seed of SEED_VENDORS) {
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    let userId = existingUsers?.users.find((u) => u.email === seed.email)?.id;

    if (!userId) {
      const { data: newUser, error: createError } =
        await admin.auth.admin.createUser({
          email: seed.email,
          password: "SeedVendor123!",
          email_confirm: true,
          user_metadata: { role: "vendor" },
        });
      if (createError || !newUser.user) {
        results.push({
          email: seed.email,
          vendor: seed.name,
          status: `error: ${createError?.message}`,
        });
        continue;
      }
      userId = newUser.user.id;
    }

    const { data: existingVendor } = await admin
      .from("vendors")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let vendorId = existingVendor?.id;

    if (!vendorId) {
      const { data: vendor, error: vendorError } = await admin
        .from("vendors")
        .insert({
          user_id: userId,
          name: seed.name,
          location_name: seed.location_name,
          city: seed.city,
          latitude: seed.latitude,
          longitude: seed.longitude,
          capacity_total: seed.capacity_total,
          hours: DEFAULT_HOURS,
          tags: seed.tags,
        })
        .select("id")
        .single();

      if (vendorError || !vendor) {
        results.push({
          email: seed.email,
          vendor: seed.name,
          status: `error: ${vendorError?.message}`,
        });
        continue;
      }
      vendorId = vendor.id;
    } else {
      await admin
        .from("vendors")
        .update({
          name: seed.name,
          location_name: seed.location_name,
          city: seed.city,
          latitude: seed.latitude,
          longitude: seed.longitude,
          capacity_total: seed.capacity_total,
          tags: seed.tags,
        })
        .eq("id", vendorId);
    }

    await admin.from("menus").delete().eq("vendor_id", vendorId);
    await admin.from("menus").insert(
      seed.menus.map((m) => ({
        vendor_id: vendorId,
        item_name: m.item_name,
        description_original: m.description_original,
        description_translated: m.description_translated,
        price: m.price,
        tags: m.tags,
      }))
    );

    results.push({ email: seed.email, vendor: seed.name, status: "seeded" });
  }

  return NextResponse.json({
    message: "10 demo vendors seeded",
    results,
    note: "Password for seed accounts: SeedVendor123!",
  });
}
