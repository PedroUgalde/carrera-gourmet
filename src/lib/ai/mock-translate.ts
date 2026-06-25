/** Glosario callejero ES → EN para modo demo (sin OpenAI). */
const FOOD_TERMS: Record<string, string> = {
  gorditas: "thick corn masa pockets (gorditas)",
  gordita: "thick corn masa pocket (gordita)",
  chicharrón: "crispy pork rinds (chicharrón)",
  chicharron: "crispy pork rinds (chicharrón)",
  frijoles: "refried beans",
  frijol: "beans",
  suadero: "slow-cooked beef brisket (suadero)",
  birria: "slow-stewed meat in rich broth (birria)",
  pastor: "marinated pork al pastor",
  carnitas: "slow-braised pork carnitas",
  barbacoa: "slow-cooked barbacoa",
  tlacoyo: "oval corn masa cake (tlacoyo)",
  tlayuda: "large crispy Oaxacan tortilla (tlayuda)",
  elote: "grilled corn on the cob (elote)",
  esquites: "cup of corn kernels (esquites)",
  quesadilla: "cheese-filled tortilla (quesadilla)",
  quesillo: "Oaxaca string cheese",
  nopales: "cactus paddles (nopales)",
  nopal: "cactus paddle (nopal)",
  aguacate: "avocado",
  cebolla: "onion",
  cilantro: "cilantro",
  salsa: "salsa",
  "salsa roja": "red salsa",
  "salsa verde": "green salsa",
  tortilla: "tortilla",
  tortillas: "tortillas",
  longaniza: "spicy pork sausage (longaniza)",
  tasajo: "thinly sliced dried beef (tasajo)",
  queso: "cheese",
  pollo: "chicken",
  res: "beef",
  cerdo: "pork",
  borrego: "lamb",
  cabrito: "young goat",
  pescado: "fish",
  camarón: "shrimp",
  camaron: "shrimp",
  "flor de calabaza": "squash blossom",
  calabaza: "squash",
  epazote: "epazote herb",
  limón: "lime",
  limon: "lime",
  chile: "chili pepper",
  picante: "spicy",
  mayonesa: "mayonnaise",
  consomé: "broth (consomé)",
  consome: "broth (consomé)",
  torta: "Mexican sandwich (torta)",
  "torta ahogada": "drowned pork sandwich in spicy sauce (torta ahogada)",
  milanesa: "breaded cutlet (milanesa)",
  canasta: "steamed basket-style",
  vegano: "vegan",
  vegetariano: "vegetarian",
};

const TAG_KEYWORDS: Record<string, string[]> = {
  vegano: ["Vegan"],
  vegan: ["Vegan"],
  vegetariano: ["Vegetarian"],
  picante: ["Spicy"],
  cerdo: ["Contains Pork", "Pork"],
  chicharron: ["Pork", "Traditional"],
  chicharrón: ["Pork", "Traditional"],
  pastor: ["Pork", "Traditional"],
  carnitas: ["Pork", "Traditional"],
  res: ["Beef"],
  suadero: ["Beef", "Traditional"],
  birria: ["Beef", "Traditional"],
  borrego: ["Lamb", "Traditional"],
  cabrito: ["Goat", "Traditional"],
  queso: ["Contains Dairy"],
  quesillo: ["Contains Dairy"],
  lacteo: ["Contains Dairy"],
  gluten: ["Gluten-Free"],
  keto: ["Keto"],
  pescado: ["Seafood"],
  camaron: ["Seafood"],
  camarón: ["Seafood"],
};

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function translateDescription(description: string): string {
  let text = description.trim();
  const sortedTerms = Object.keys(FOOD_TERMS).sort(
    (a, b) => b.length - a.length
  );

  for (const term of sortedTerms) {
    const pattern = new RegExp(
      term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi"
    );
    text = text.replace(pattern, FOOD_TERMS[term]);
  }

  text = text
    .replace(/\s+de\s+/gi, " with ")
    .replace(/\s+con\s+/gi, " and ")
    .replace(/\s+y\s+/gi, " and ")
    .replace(/\s+al\s+/gi, " with ")
    .replace(/\s+en\s+/gi, " in ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  if (!text.endsWith(".")) text += ".";

  return text;
}

function detectTags(itemName: string, description: string): string[] {
  const lower = normalize(`${itemName} ${description}`);
  const tags = new Set<string>(["Traditional"]);

  for (const [keyword, tagList] of Object.entries(TAG_KEYWORDS)) {
    if (lower.includes(normalize(keyword))) {
      tagList.forEach((t) => tags.add(t));
    }
  }

  return Array.from(tags);
}

export function mockTranslateMenu(
  items: { item_name: string; description_original: string }[]
) {
  return items.map((item) => ({
    item_name: item.item_name,
    description_translated: translateDescription(item.description_original),
    tags: detectTags(item.item_name, item.description_original),
  }));
}

export function isGeminiConfigured(): boolean {
  const key = (process.env.GEMINI_API_KEY ?? "").trim();
  return key.length > 0 && !key.startsWith("xxx");
}

export function isOpenAIConfigured(): boolean {
  const key = (process.env.OPENAI_API_KEY ?? "").trim();
  return key.length > 0 && !key.startsWith("sk-xxx");
}
