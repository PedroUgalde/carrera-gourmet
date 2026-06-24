"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DAYS = [
  { key: "mon", label: "Lun" },
  { key: "tue", label: "Mar" },
  { key: "wed", label: "Mié" },
  { key: "thu", label: "Jue" },
  { key: "fri", label: "Vie" },
  { key: "sat", label: "Sáb" },
  { key: "sun", label: "Dom" },
] as const;

interface HoursInputProps {
  hours: Record<string, string>;
  onChange: (hours: Record<string, string>) => void;
}

export function HoursInput({ hours, onChange }: HoursInputProps) {
  return (
    <div className="space-y-2">
      <Label>Horarios (ej: 9-22)</Label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {DAYS.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <Input
              placeholder="9-22"
              value={hours[key] ?? ""}
              onChange={(e) =>
                onChange({ ...hours, [key]: e.target.value })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
