/** Mapeo de alergias comunes → palabras a excluir en tags/descripciones */
const ALLERGY_KEYWORDS: Record<string, string[]> = {
  peanut: ["peanut", "peanuts", "cacahuate", "maní"],
  peanuts: ["peanut", "peanuts", "cacahuate", "maní"],
  cacahuate: ["peanut", "peanuts", "cacahuate", "maní"],
  shellfish: ["shellfish", "shrimp", "camaron", "camarón", "marisco", "seafood"],
  marisco: ["shellfish", "shrimp", "camaron", "camarón", "marisco", "seafood"],
  camaron: ["shellfish", "shrimp", "camaron", "camarón", "marisco"],
  dairy: ["dairy", "cheese", "queso", "lacteo", "lácteo", "contains dairy"],
  lacteo: ["dairy", "cheese", "queso", "lacteo", "lácteo", "contains dairy"],
  gluten: ["gluten", "wheat", "trigo", "gluten-free"],
  trigo: ["gluten", "wheat", "trigo"],
  egg: ["egg", "huevo", "eggs"],
  huevo: ["egg", "huevo", "eggs"],
  soy: ["soy", "soya", "soja"],
  fish: ["fish", "pescado", "atun", "atún"],
  pescado: ["fish", "pescado"],
  pork: ["pork", "cerdo", "pastor", "carnitas", "suadero"],
  cerdo: ["pork", "cerdo", "pastor", "carnitas"],
  nuts: ["nut", "nuts", "nuez", "almendra", "peanut"],
  nueces: ["nut", "nuts", "nuez", "almendra"],
};

export function parseAllergyExclusions(raw: string): string[] {
  if (!raw.trim()) return [];

  const tokens = raw
    .split(/[,;]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const exclusions = new Set<string>();

  for (const token of tokens) {
    exclusions.add(token);
    const mapped = ALLERGY_KEYWORDS[token];
    if (mapped) {
      mapped.forEach((k) => exclusions.add(k));
    }
    // también buscar si el token contiene alguna clave conocida
    for (const [key, words] of Object.entries(ALLERGY_KEYWORDS)) {
      if (token.includes(key) || key.includes(token)) {
        words.forEach((w) => exclusions.add(w));
        exclusions.add(key);
      }
    }
  }

  return Array.from(exclusions);
}

export function vendorContainsAllergen(
  vendorTags: string[],
  menuTags: string[],
  menuTexts: string[],
  exclusions: string[]
): boolean {
  if (exclusions.length === 0) return false;

  const corpus = [...vendorTags, ...menuTags, ...menuTexts]
    .join(" ")
    .toLowerCase();

  return exclusions.some((ex) => corpus.includes(ex.toLowerCase()));
}
