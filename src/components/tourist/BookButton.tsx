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
      toast.error("Not enough capacity for your party");
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
        throw new Error(data.error ?? "Booking failed");
      }

      setBooked(true);
      toast.success(data.message ?? "Place booked!");
      onBooked?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <Button disabled className="w-full bg-green-600">
        Booked — Your spot is secured
      </Button>
    );
  }

  return (
    <Button
      onClick={handleBook}
      disabled={loading || available < partySize}
      className="h-12 w-full bg-[#2D6A4F] hover:bg-[#2D6A4F]/90"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Booking...
        </>
      ) : available < partySize ? (
        "No capacity available"
      ) : (
        "Book Place"
      )}
    </Button>
  );
}
