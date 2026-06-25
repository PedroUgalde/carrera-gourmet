import Link from "next/link";
import { cn } from "@/lib/utils";

type GraffitiLogoSize = "sm" | "md" | "lg";

interface GraffitiLogoProps {
  className?: string;
  size?: GraffitiLogoSize;
  href?: string | null;
}

const sizeConfig: Record<
  GraffitiLogoSize,
  { box: string; line1: string; line2: string; drip: string }
> = {
  sm: {
    box: "px-3 py-1.5 min-w-[9.5rem]",
    line1: "text-[1.05rem] sm:text-[1.15rem]",
    line2: "text-[0.95rem] sm:text-[1.05rem]",
    drip: "h-2 w-1",
  },
  md: {
    box: "px-5 py-2.5 min-w-[14rem]",
    line1: "text-2xl",
    line2: "text-xl",
    drip: "h-3 w-1.5",
  },
  lg: {
    box: "px-7 py-3.5 min-w-[18rem]",
    line1: "text-4xl sm:text-5xl",
    line2: "text-3xl sm:text-4xl",
    drip: "h-4 w-2",
  },
};

function LogoMark({
  size,
  className,
}: {
  size: GraffitiLogoSize;
  className?: string;
}) {
  const cfg = sizeConfig[size];

  return (
    <span
      className={cn(
        "graffiti-logo-brick relative inline-block rotate-[-1.5deg] select-none",
        cfg.box,
        className
      )}
    >
      <span className="relative z-10 block leading-[0.82]">
        <span className={cn("font-graffiti graffiti-throw-up block", cfg.line1)}>
          Carrera
        </span>
        <span
          className={cn(
            "font-graffiti graffiti-throw-up -mt-0.5 block pl-1",
            cfg.line2
          )}
        >
          Gourmet
        </span>
      </span>

      <span
        aria-hidden
        className={cn(
          "absolute bottom-0 left-[18%] rounded-b-full bg-[#FF6B00]",
          cfg.drip
        )}
      />
      <span
        aria-hidden
        className={cn(
          "absolute bottom-0 left-[42%] rounded-b-full bg-neutral-900",
          cfg.drip,
          "h-3"
        )}
      />
      <span
        aria-hidden
        className={cn(
          "absolute bottom-0 right-[22%] rounded-b-full bg-[#FF6B00]",
          cfg.drip,
          "h-2.5"
        )}
      />
    </span>
  );
}

export function GraffitiLogo({
  className,
  size = "sm",
  href = "/",
}: GraffitiLogoProps) {
  const mark = <LogoMark size={size} className={className} />;

  if (href) {
    return (
      <Link
        href={href}
        className="inline-block transition hover:scale-[1.03] hover:rotate-0"
      >
        {mark}
      </Link>
    );
  }

  return mark;
}
