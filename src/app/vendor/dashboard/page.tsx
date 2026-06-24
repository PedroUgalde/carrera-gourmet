import { VendorDashboardForm } from "@/components/vendor/VendorDashboardForm";

export const dynamic = "force-dynamic";

export default function VendorDashboardPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] py-6">
      <VendorDashboardForm />
    </div>
  );
}
