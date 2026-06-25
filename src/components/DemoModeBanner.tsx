import { isSupabaseConfigured } from "@/lib/config";

export function DemoModeBanner() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="border-b border-orange-200 bg-orange-50 px-4 py-2 text-center text-sm font-medium text-orange-900">
      Modo demo — Supabase no configurado. Los datos se guardan localmente en tu
      navegador.
    </div>
  );
}
