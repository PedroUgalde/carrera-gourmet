import { NextResponse } from "next/server";
import { z } from "zod";
import { translateMenuItems } from "@/lib/ai/translate-providers";

const requestSchema = z.object({
  items: z
    .array(
      z.object({
        item_name: z.string().min(1),
        description_original: z.string().min(1),
      })
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await translateMenuItems(parsed.data.items);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
