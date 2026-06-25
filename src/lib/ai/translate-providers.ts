import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { z } from "zod";
import { TRANSLATE_MENU_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import {
  isGeminiConfigured,
  isOpenAIConfigured,
  mockTranslateMenu,
} from "@/lib/ai/mock-translate";

export type TranslateSource =
  | "ollama"
  | "gemini"
  | "openai"
  | "demo"
  | "demo-fallback";

const responseSchema = z.object({
  items: z.array(
    z.object({
      item_name: z.string(),
      description_translated: z.string(),
      tags: z.array(z.string()),
    })
  ),
});

type MenuItemInput = { item_name: string; description_original: string };

export function getOllamaConfig() {
  return {
    baseURL: (
      process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434/v1"
    ).trim(),
    model: (process.env.OLLAMA_MODEL ?? "qwen2.5:1.5b").trim(),
    enabled: process.env.OLLAMA_ENABLED !== "false",
  };
}

export function isOllamaEnabled() {
  return getOllamaConfig().enabled;
}

async function generateTranslation(
  model: Parameters<typeof generateObject>[0]["model"],
  items: MenuItemInput[]
) {
  const { object } = await generateObject({
    model,
    schema: responseSchema,
    system: TRANSLATE_MENU_SYSTEM_PROMPT,
    prompt: `Translate these menu items:\n${JSON.stringify(items, null, 2)}`,
  });

  return object.items;
}

export async function translateMenuItems(items: MenuItemInput[]): Promise<{
  items: ReturnType<typeof mockTranslateMenu>;
  source: TranslateSource;
  note?: string;
}> {
  const errors: string[] = [];

  if (isOllamaEnabled()) {
    try {
      const { baseURL, model } = getOllamaConfig();
      const ollama = createOpenAI({ baseURL, apiKey: "ollama" });
      const translated = await generateTranslation(ollama.chat(model), items);
      return { items: translated, source: "ollama" };
    } catch (err) {
      const message = err instanceof Error ? err.message : "no disponible";
      const hint = /not found|404/i.test(message)
        ? `modelo "${getOllamaConfig().model}" no instalado — corre: ollama pull ${getOllamaConfig().model}`
        : message.includes("ECONNREFUSED") || message.includes("fetch failed")
          ? "servidor apagado — abre la app Ollama o corre: ollama serve"
          : message;
      errors.push(`Ollama: ${hint}`);
    }
  }

  if (isGeminiConfigured()) {
    try {
      const google = createGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY!.trim(),
      });
      const translated = await generateTranslation(
        google("gemini-2.0-flash"),
        items
      );
      return { items: translated, source: "gemini" };
    } catch (err) {
      errors.push(
        `Gemini: ${err instanceof Error ? err.message : "error"}`
      );
    }
  }

  if (isOpenAIConfigured()) {
    try {
      const translated = await generateTranslation(openai("gpt-4o-mini"), items);
      return { items: translated, source: "openai" };
    } catch (err) {
      errors.push(
        `OpenAI: ${err instanceof Error ? err.message : "error"}`
      );
    }
  }

  const fallbackNote =
    errors.length > 0
      ? `${errors.join(" · ")}. Glosario callejero activado.`
      : "Sin IA configurada — glosario callejero.";

  return {
    items: mockTranslateMenu(items),
    source: errors.length > 0 ? "demo-fallback" : "demo",
    note: fallbackNote,
  };
}
