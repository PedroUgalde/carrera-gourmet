import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { HERO_STREET_FOOD_IMAGE } from "@/lib/home-assets";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-[520px] overflow-hidden sm:min-h-[600px] lg:min-h-[680px]">
      <Image
        src={HERO_STREET_FOOD_IMAGE}
        alt="Puesto callejero de comida mexicana en la acera"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <div className="relative mx-auto flex h-full min-h-[520px] max-w-6xl flex-col justify-center px-4 py-16 sm:min-h-[600px] sm:px-8 lg:min-h-[680px]">
        <span className="mb-4 inline-flex w-fit rotate-[-1deg] rounded-md border-2 border-[#FF6B00] bg-[#FF6B00] px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">
          Mundial 2026 · México
        </span>

        <h1 className="max-w-2xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
          La calle
          <span className="block text-[#FF6B00]">sabe mejor</span>
        </h1>

        <p className="mt-5 max-w-lg text-base font-medium leading-relaxed text-white/90 sm:text-lg">
          Encuentra tacos, elotes, birria y antojitos en puestos reales de CDMX,
          Guadalajara y Monterrey. Reserva tu lugar antes de que se acabe el
          guiso.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/tourist/search"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-full bg-[#FF6B00] px-8 text-base font-black uppercase tracking-wide shadow-lg shadow-orange-900/30 hover:bg-[#E85D04]"
            )}
          >
            Buscar puestos cerca
          </Link>
          <Link
            href="/register?role=vendor"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-12 rounded-full border-2 border-white bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            )}
          >
            Tengo un puesto
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {["Tacos", "Elotes", "Birria", "Tortas", "Antojitos"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
