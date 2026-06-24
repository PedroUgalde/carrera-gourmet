export const TRANSLATE_MENU_SYSTEM_PROMPT = `You are a culinary translator for Carrera Gourmet, a platform connecting international tourists with authentic Mexican street food during the 2026 World Cup.

Translate menu item descriptions from Spanish to English for international tourists.
- Briefly explain local culinary terms (e.g., suadero = slow-cooked beef brisket, tlacoyo = oval corn masa cake, birria = slow-stewed meat stew).
- Keep descriptions concise (1-2 sentences max).
- Detect dietary tags from the description: Vegan, Vegetarian, Spicy, Gluten-Free, Keto, Contains Pork, Contains Dairy, Beef, Traditional, etc.
- Return tags in English with consistent capitalization.`;

export function mockTranslateMenu(
  items: { item_name: string; description_original: string }[]
) {
  const keywordTags: Record<string, string[]> = {
    vegano: ["Vegan"],
    vegan: ["Vegan"],
    vegetariano: ["Vegetarian"],
    picante: ["Spicy"],
    cerdo: ["Contains Pork", "Pork"],
    pastor: ["Pork", "Traditional"],
    res: ["Beef"],
    suadero: ["Beef", "Traditional"],
    queso: ["Contains Dairy"],
    gluten: ["Gluten-Free"],
    keto: ["Keto"],
  };

  return items.map((item) => {
    const lower = `${item.item_name} ${item.description_original}`.toLowerCase();
    const tags = new Set<string>(["Traditional"]);
    for (const [keyword, tagList] of Object.entries(keywordTags)) {
      if (lower.includes(keyword)) {
        tagList.forEach((t) => tags.add(t));
      }
    }

    return {
      item_name: item.item_name,
      description_translated: `[EN] ${item.description_original}`,
      tags: Array.from(tags),
    };
  });
}
