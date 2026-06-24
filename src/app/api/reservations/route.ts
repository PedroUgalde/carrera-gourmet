import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/config";

const postSchema = z.object({
  vendor_id: z.string().uuid(),
  party_size: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = postSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        reservation_id: "demo-reservation",
        message: "Demo mode — reservation simulated",
      });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { vendor_id, party_size } = parsed.data;
    const admin = createAdminClient();

    const { data, error } = await admin.rpc("book_reservation", {
      p_tourist_id: user.id,
      p_vendor_id: vendor_id,
      p_party_size: party_size,
    });

    if (error) {
      const isCapacity =
        error.message.includes("Insufficient capacity") ||
        error.message.includes("capacity");
      return NextResponse.json(
        {
          error: isCapacity
            ? "No hay aforo disponible para tu grupo"
            : error.message,
        },
        { status: isCapacity ? 409 : 500 }
      );
    }

    return NextResponse.json({
      reservation_id: data,
      message: "Reserva confirmada — tu lugar está asegurado",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ reservations: [] });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("reservations")
      .select("*, vendors(name, location_name, city)")
      .eq("tourist_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reservations: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
