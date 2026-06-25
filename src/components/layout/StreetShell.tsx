import { StreetFooter } from "@/components/layout/StreetFooter";
import { StreetHeader } from "@/components/layout/StreetHeader";
import { cn } from "@/lib/utils";

interface StreetShellProps {
  children: React.ReactNode;
  centered?: boolean;
  showTagline?: boolean;
  showFooter?: boolean;
}

export function StreetShell({
  children,
  centered = false,
  showTagline = true,
  showFooter = true,
}: StreetShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFF5EB]">
      <StreetHeader showTagline={showTagline} />
      <main
        className={cn(
          "flex-1",
          centered && "flex items-center justify-center p-4 py-8"
        )}
      >
        {children}
      </main>
      {showFooter && <StreetFooter />}
    </div>
  );
}
