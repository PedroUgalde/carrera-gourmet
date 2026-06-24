/**
 * Inserta 10 vendors de ejemplo vía Supabase Auth signup + insert.
 * Uso: node scripts/seed-vendors.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  try {
    const envPath = resolve(root, ".env.local");
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const val = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    console.error("No se encontró .env.local");
    process.exit(1);
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const SEED_VENDORS = [
  { email: "seed-vendor-01@carrera-gourmet.demo", name: "Tacos El Portales", location_name: "Portales Sur", city: "CDMX", latitude: 19.3712, longitude: -99.1405, capacity_total: 18, tags: ["Traditional", "Beef", "Spicy"], menus: [{ item_name: "Tacos de Suadero", description_original: "Tacos de suadero con cebolla, cilantro y salsa roja", description_translated: "Slow-cooked beef brisket tacos (suadero) with onion, cilantro and red salsa", price: 35, tags: ["Beef", "Traditional"] }, { item_name: "Quesadilla de Flor de Calabaza", description_original: "Quesadilla con flor de calabaza y queso Oaxaca", description_translated: "Squash blossom quesadilla with Oaxaca cheese", price: 45, tags: ["Vegetarian", "Contains Dairy"] }] },
  { email: "seed-vendor-02@carrera-gourmet.demo", name: "Antojitos La Güela", location_name: "Portales Sur", city: "CDMX", latitude: 19.3688, longitude: -99.142, capacity_total: 15, tags: ["Traditional", "Vegetarian"], menus: [{ item_name: "Esquites Portales", description_original: "Esquites con epazote, limón y chile en polvo", description_translated: "Cup of corn kernels with epazote, lime and chili powder", price: 40, tags: ["Vegetarian"] }] },
  { email: "seed-vendor-03@carrera-gourmet.demo", name: "Tacos CU — ESCOM", location_name: "Ciudad Universitaria, ESCOM", city: "CDMX", latitude: 19.3244, longitude: -99.1778, capacity_total: 22, tags: ["Traditional", "Budget", "Spicy"], menus: [{ item_name: "Tacos de Longaniza", description_original: "Tacos de longaniza con nopales y salsa verde", description_translated: "Spicy pork sausage tacos with cactus and green salsa near ESCOM", price: 30, tags: ["Pork", "Spicy"] }] },
  { email: "seed-vendor-04@carrera-gourmet.demo", name: "Elotes del Pedregal", location_name: "ESCOM, Ciudad Universitaria", city: "CDMX", latitude: 19.3255, longitude: -99.1795, capacity_total: 12, tags: ["Vegetarian", "Vegan"], menus: [{ item_name: "Elote Vegano", description_original: "Elote con mantequilla vegana y chile tajín", description_translated: "Grilled corn with vegan butter and tajín chili", price: 35, tags: ["Vegan", "Vegetarian"] }] },
  { email: "seed-vendor-05@carrera-gourmet.demo", name: "Tacos del Zócalo", location_name: "Centro Histórico, Zócalo", city: "CDMX", latitude: 19.4328, longitude: -99.1332, capacity_total: 30, tags: ["Traditional", "Beef"], menus: [{ item_name: "Tacos al Pastor", description_original: "Tacos al pastor con piña asada", description_translated: "Marinated pork tacos with grilled pineapple near the Zócalo", price: 42, tags: ["Pork", "Traditional"] }] },
  { email: "seed-vendor-06@carrera-gourmet.demo", name: "Barbacoa Don Pepe", location_name: "Zócalo", city: "CDMX", latitude: 19.434, longitude: -99.1345, capacity_total: 20, tags: ["Traditional", "Beef"], menus: [{ item_name: "Barbacoa de Borrego", description_original: "Barbacoa de borrego con consomé y tortillas", description_translated: "Slow-cooked lamb barbacoa with broth and fresh tortillas", price: 120, tags: ["Traditional", "Lamb"] }] },
  { email: "seed-vendor-07@carrera-gourmet.demo", name: "Tortas Azteca", location_name: "Estadio Azteca", city: "CDMX", latitude: 19.303, longitude: -99.151, capacity_total: 25, tags: ["Traditional", "Pork"], menus: [{ item_name: "Torta de Milanesa", description_original: "Torta de milanesa con aguacate y frijoles", description_translated: "Breaded cutlet sandwich with avocado and beans", price: 65, tags: ["Pork", "Traditional"] }] },
  { email: "seed-vendor-08@carrera-gourmet.demo", name: "Carnitas Calzada", location_name: "Calzada de Tlalpan, Estadio Azteca", city: "CDMX", latitude: 19.3015, longitude: -99.1495, capacity_total: 18, tags: ["Pork", "Traditional"], menus: [{ item_name: "Carnitas Mixtas", description_original: "Carnitas surtidas con cuerito y tortillas hechas a mano", description_translated: "Mixed pork carnitas with crispy skin and handmade tortillas", price: 90, tags: ["Pork", "Traditional"] }] },
  { email: "seed-vendor-09@carrera-gourmet.demo", name: "Birrieria El Compadre", location_name: "Centro Histórico", city: "Guadalajara", latitude: 20.6597, longitude: -103.3496, capacity_total: 24, tags: ["Traditional", "Beef"], menus: [{ item_name: "Birria de Res", description_original: "Birria estilo Jalisco con consomé", description_translated: "Slow-stewed beef birria with rich consommé", price: 120, tags: ["Beef", "Traditional"] }] },
  { email: "seed-vendor-10@carrera-gourmet.demo", name: "Elotes y Esquites La Güera", location_name: "Parque Fundidora", city: "Monterrey", latitude: 25.6866, longitude: -100.3161, capacity_total: 14, tags: ["Vegetarian", "Vegan"], menus: [{ item_name: "Esquites", description_original: "Esquites con mayonesa, chile y limón", description_translated: "Cup of corn kernels with mayo, chili powder and lime", price: 45, tags: ["Vegetarian"] }] },
];

const HOURS = { mon: "10-22", tue: "10-22", wed: "10-22", thu: "10-22", fri: "10-23", sat: "10-23", sun: "11-21" };
const PASSWORD = "SeedVendor123!";

async function ensureUser(supabase, email) {
  let { data, error } = await supabase.auth.signInWithPassword({ email, password: PASSWORD });
  if (data.user) return data.user;

  ({ data, error } = await supabase.auth.signUp({
    email,
    password: PASSWORD,
    options: { data: { role: "vendor" } },
  }));

  if (error) throw new Error(`${email}: ${error.message}`);
  if (!data.user) throw new Error(`${email}: no user returned`);
  return data.user;
}

async function main() {
  console.log("Sembrando 10 vendors...\n");
  const results = [];

  for (const seed of SEED_VENDORS) {
    const supabase = createClient(url, key);
    try {
      const user = await ensureUser(supabase, seed.email);

      const { data: existing } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let vendorId = existing?.id;

      if (vendorId) {
        await supabase.from("vendors").update({
          name: seed.name,
          location_name: seed.location_name,
          city: seed.city,
          latitude: seed.latitude,
          longitude: seed.longitude,
          capacity_total: seed.capacity_total,
          hours: HOURS,
          tags: seed.tags,
        }).eq("id", vendorId);
      } else {
        const { data: vendor, error } = await supabase.from("vendors").insert({
          user_id: user.id,
          name: seed.name,
          location_name: seed.location_name,
          city: seed.city,
          latitude: seed.latitude,
          longitude: seed.longitude,
          capacity_total: seed.capacity_total,
          hours: HOURS,
          tags: seed.tags,
        }).select("id").single();
        if (error) throw error;
        vendorId = vendor.id;
      }

      await supabase.from("menus").delete().eq("vendor_id", vendorId);
      await supabase.from("menus").insert(
        seed.menus.map((m) => ({ vendor_id: vendorId, ...m }))
      );

      results.push(`✓ ${seed.name} (${seed.location_name})`);
    } catch (err) {
      results.push(`✗ ${seed.name}: ${err.message}`);
    } finally {
      await supabase.auth.signOut();
    }
  }

  console.log(results.join("\n"));
  console.log("\nListo. Password seed: SeedVendor123!");
}

main();
