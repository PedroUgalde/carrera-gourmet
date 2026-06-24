import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import {
  TRANSLATE_MENU_SYSTEM_PROMPT,
  mockTranslateMenu,
} from "@/lib/ai/prompts";

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

const responseSchema = z.object({
  items: z.array(
    z.object({
      item_name: z.string(),
      description_translated: z.string(),
      tags: z.array(z.string()),
    })
  ),
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

    const { items } = parsed.data;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        items: mockTranslateMenu(items),
        source: "mock",
      });
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: responseSchema,
      system: TRANSLATE_MENU_SYSTEM_PROMPT,
      prompt: `Translate these menu items:\n${JSON.stringify(items, null, 2)}`,
    });

    return NextResponse.json({ items: object.items, source: "openai" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
