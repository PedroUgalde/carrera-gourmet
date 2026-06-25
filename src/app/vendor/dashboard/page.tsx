import { VendorDashboardForm } from "@/components/vendor/VendorDashboardForm";
import { StreetShell } from "@/components/layout/StreetShell";

export const dynamic = "force-dynamic";

export default function VendorDashboardPage() {
  return (
    <StreetShell showFooter={false}>
      <VendorDashboardForm />
    </StreetShell>
  );
}
