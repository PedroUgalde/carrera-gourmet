import { isSupabaseConfigured } from "@/lib/config";

export function DemoModeBanner() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
      Modo demo — Supabase no configurado. Los datos se guardan localmente en tu
      navegador.
    </div>
  );
}
