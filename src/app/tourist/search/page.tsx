import { PreferenceForm } from "@/components/tourist/PreferenceForm";

export const dynamic = "force-dynamic";

export default function TouristSearchPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] py-6">
      <PreferenceForm />
    </div>
  );
}
