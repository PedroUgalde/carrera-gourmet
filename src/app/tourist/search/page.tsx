import { PreferenceForm } from "@/components/tourist/PreferenceForm";
import { StreetShell } from "@/components/layout/StreetShell";

export const dynamic = "force-dynamic";

export default function TouristSearchPage() {
  return (
    <StreetShell showFooter={false}>
      <PreferenceForm />
    </StreetShell>
  );
}
