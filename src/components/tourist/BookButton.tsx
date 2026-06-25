"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BookButtonProps {
  vendorId: string;
  partySize: number;
  available: number;
  onBooked?: () => void;
}

export function BookButton({
  vendorId,
  partySize,
  available,
  onBooked,
}: BookButtonProps) {
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleBook = async () => {
    if (available < partySize) {
      toast.error("No hay suficiente aforo para tu grupo");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor_id: vendorId, party_size: partySize }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Reserva fallida");
      }

      setBooked(true);
      toast.success(data.message ?? "¡Lugar reservado!");
      onBooked?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reserva fallida");
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <Button disabled className="w-full rounded-full bg-green-600 font-bold">
        Reservado — tu lugar está asegurado
      </Button>
    );
  }

  return (
    <Button
      onClick={handleBook}
      disabled={loading || available < partySize}
      className="h-12 w-full rounded-full bg-[#FF6B00] font-bold hover:bg-[#E85D04]"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Reservando...
        </>
      ) : available < partySize ? (
        "Sin aforo disponible"
      ) : (
        "Reservar lugar"
      )}
    </Button>
  );
}
