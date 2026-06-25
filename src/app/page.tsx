import Link from "next/link";
import { redirect } from "next/navigation";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { VendorCarousel } from "@/components/home/VendorCarousel";
import { StreetFooter } from "@/components/layout/StreetFooter";
import { StreetHeader } from "@/components/layout/StreetHeader";
import { getFeaturedVendors } from "@/lib/featured-vendors";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

export default async function HomePage() {
  if (isSupabaseConfigured()) {
    const user = await getCurrentUser();
    if (user?.role === "vendor") redirect("/vendor/dashboard");
    if (user?.role === "tourist") redirect("/tourist/search");
  }

  const featuredVendors = await getFeaturedVendors(6);

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF5EB]">
      <StreetHeader />

      <main className="flex-1">
        <HeroSection />
        <VendorCarousel vendors={featuredVendors} />
        <FeaturesSection />

        <section className="border-y-2 border-orange-100 bg-white py-12">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="street-heading text-2xl">¿Se te antojó?</h2>
            <p className="mt-2 text-neutral-600">
              Prueba sin cuenta o regístrate para reservar en el puesto.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/tourist/search"
                className="inline-flex h-12 items-center rounded-full bg-[#FF6B00] px-8 text-sm font-black uppercase tracking-wide text-white shadow-md shadow-orange-200 transition hover:bg-[#E85D04]"
              >
                Probar ahora
              </Link>
              <Link
                href="/register?role=tourist"
                className="inline-flex h-12 items-center rounded-full border-2 border-neutral-900 px-8 text-sm font-bold text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
              >
                Crear cuenta
              </Link>
            </div>
            {!isSupabaseConfigured() && (
              <p className="mt-4 text-sm text-amber-700">
                Supabase no configurado — usa el modo demo o configura .env.local
                para autenticación real.
              </p>
            )}
          </div>
        </section>
      </main>

      <StreetFooter />
    </div>
  );
}
