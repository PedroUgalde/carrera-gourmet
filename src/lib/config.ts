import { DEMO_VENDORS } from "@/lib/demo-data";

export { DEMO_VENDORS };

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    url.length > 0 &&
    key.length > 0 &&
    !url.includes("xxx") &&
    !key.startsWith("eyJ...")
  );
}
