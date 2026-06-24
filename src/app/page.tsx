import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  if (isSupabaseConfigured()) {
    const user = await getCurrentUser();
    if (user?.role === "vendor") redirect("/vendor/dashboard");
    if (user?.role === "tourist") redirect("/tourist/search");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF8F0]">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-[#2D6A4F]">Carrera Gourmet</span>
          <div className="flex gap-2">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-block rounded-full bg-[#2D6A4F]/10 px-4 py-1.5 text-sm font-medium text-[#2D6A4F]">
            FIFA World Cup 2026 — Mexico
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#2D6A4F] sm:text-5xl">
            Taste Mexico Like a Local
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with authentic street food vendors in CDMX, Guadalajara, and
            Monterrey. AI-powered recommendations, translations, and real-time
            capacity — so tourists discover local gems and vendors thrive.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register?role=tourist"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 bg-[#E85D04] px-8 text-lg hover:bg-[#E85D04]/90"
              )}
            >
              I&apos;m a Tourist
            </Link>
            <Link
              href="/register?role=vendor"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-14 border-[#2D6A4F] px-8 text-lg text-[#2D6A4F]"
              )}
            >
              I&apos;m a Vendor
            </Link>
            <Link
              href="/tourist/search"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-14 border-[#E85D04] px-8 text-lg text-[#E85D04]"
              )}
            >
              Try Demo
            </Link>
          </div>
          {!isSupabaseConfigured() && (
            <p className="text-sm text-amber-700">
              Supabase not configured — use Demo mode or configure .env.local for
              real auth.
            </p>
          )}
        </div>

        <section className="mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              title: "AI Recommendations",
              desc: "Find the 3 closest spots matching your diet, budget, and party size.",
            },
            {
              title: "Menu Translation",
              desc: "Suadero, birria, tlacoyo — explained in clear English for tourists.",
            },
            {
              title: "Live Capacity",
              desc: "Book instantly and secure your spot before you arrive.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-white p-6 text-left shadow-sm"
            >
              <h3 className="font-semibold text-[#2D6A4F]">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Carrera Gourmet MVP — Decentralizing economic impact for local commerce
      </footer>
    </div>
  );
}
