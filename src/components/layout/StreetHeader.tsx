import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { GraffitiLogo } from "@/components/branding/GraffitiLogo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/tourist/search", label: "Explorar puestos" },
  { href: "/register?role=tourist", label: "Turistas" },
  { href: "/register?role=vendor", label: "Comerciantes" },
  { href: "/login", label: "Entrar" },
];

interface StreetHeaderProps {
  showTagline?: boolean;
}

export function StreetHeader({ showTagline = true }: StreetHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:py-3">
        <GraffitiLogo size="sm" />

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-orange-50 hover:text-[#FF6B00]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/tourist/search"
          className={cn(
            buttonVariants({ size: "sm" }),
            "rounded-full bg-[#FF6B00] font-bold text-white shadow-md shadow-orange-200 hover:bg-[#E85D04]"
          )}
        >
          <Search className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">Buscar comida</span>
          <span className="sm:hidden">Buscar</span>
        </Link>
      </div>

      {showTagline && (
        <div className="flex items-center justify-center gap-2 border-t border-orange-50 bg-[#FFF5EB] px-4 py-1.5 text-xs font-medium text-neutral-600">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#FF6B00]" />
          CDMX · Guadalajara · Monterrey · Comida callejera auténtica
        </div>
      )}
    </header>
  );
}
