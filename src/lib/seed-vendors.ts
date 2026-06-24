export interface SeedVendor {
  email: string;
  name: string;
  location_name: string;
  city: "CDMX" | "Guadalajara" | "Monterrey";
  latitude: number;
  longitude: number;
  capacity_total: number;
  tags: string[];
  menus: {
    item_name: string;
    description_original: string;
    description_translated: string;
    price: number;
    tags: string[];
  }[];
}

export const SEED_VENDORS: SeedVendor[] = [
  {
    email: "seed-vendor-01@carrera-gourmet.demo",
    name: "Tacos El Portales",
    location_name: "Portales Sur",
    city: "CDMX",
    latitude: 19.3712,
    longitude: -99.1405,
    capacity_total: 18,
    tags: ["Traditional", "Beef", "Spicy"],
    menus: [
      {
        item_name: "Tacos de Suadero",
        description_original: "Tacos de suadero con cebolla, cilantro y salsa roja",
        description_translated:
          "Slow-cooked beef brisket tacos (suadero) with onion, cilantro and red salsa",
        price: 35,
        tags: ["Beef", "Traditional"],
      },
      {
        item_name: "Quesadilla de Flor de Calabaza",
        description_original: "Quesadilla con flor de calabaza y queso Oaxaca",
        description_translated:
          "Squash blossom quesadilla with Oaxaca cheese — seasonal favorite",
        price: 45,
        tags: ["Vegetarian", "Contains Dairy"],
      },
    ],
  },
  {
    email: "seed-vendor-02@carrera-gourmet.demo",
    name: "Antojitos La Güela",
    location_name: "Portales Sur",
    city: "CDMX",
    latitude: 19.3688,
    longitude: -99.142,
    capacity_total: 15,
    tags: ["Traditional", "Vegetarian"],
    menus: [
      {
        item_name: "Esquites Portales",
        description_original: "Esquites con epazote, limón y chile en polvo",
        description_translated:
          "Cup of corn kernels with epazote, lime and chili powder — street classic",
        price: 40,
        tags: ["Vegetarian"],
      },
    ],
  },
  {
    email: "seed-vendor-03@carrera-gourmet.demo",
    name: "Tacos CU — ESCOM",
    location_name: "Ciudad Universitaria, ESCOM",
    city: "CDMX",
    latitude: 19.3244,
    longitude: -99.1778,
    capacity_total: 22,
    tags: ["Traditional", "Budget", "Spicy"],
    menus: [
      {
        item_name: "Tacos de Longaniza",
        description_original: "Tacos de longaniza con nopales y salsa verde",
        description_translated:
          "Spicy pork sausage tacos with cactus and green salsa — student favorite near ESCOM",
        price: 30,
        tags: ["Pork", "Spicy"],
      },
      {
        item_name: "Gringa de Pastor",
        description_original: "Gringa al pastor con piña y queso",
        description_translated:
          "Flour tortilla with marinated pork, pineapple and melted cheese",
        price: 55,
        tags: ["Pork", "Contains Dairy"],
      },
    ],
  },
  {
    email: "seed-vendor-04@carrera-gourmet.demo",
    name: "Elotes del Pedregal",
    location_name: "ESCOM, Ciudad Universitaria",
    city: "CDMX",
    latitude: 19.3255,
    longitude: -99.1795,
    capacity_total: 12,
    tags: ["Vegetarian", "Vegan"],
    menus: [
      {
        item_name: "Elote Preparado",
        description_original: "Elote con mayonesa, chile, limón y queso",
        description_translated:
          "Grilled corn with mayo, chili powder, lime and cheese",
        price: 35,
        tags: ["Vegetarian"],
      },
      {
        item_name: "Elote Vegano",
        description_original: "Elote con mantequilla vegana y chile tajín",
        description_translated:
          "Grilled corn with vegan butter and tajín chili — plant-based",
        price: 35,
        tags: ["Vegan", "Vegetarian"],
      },
    ],
  },
  {
    email: "seed-vendor-05@carrera-gourmet.demo",
    name: "Tacos del Zócalo",
    location_name: "Centro Histórico, Zócalo",
    city: "CDMX",
    latitude: 19.4328,
    longitude: -99.1332,
    capacity_total: 30,
    tags: ["Traditional", "Beef"],
    menus: [
      {
        item_name: "Tacos de Canasta",
        description_original: "Tacos de canasta con papa y chicharrón",
        description_translated:
          "Steamed basket tacos with potato and pork rinds — Mexico City breakfast icon",
        price: 15,
        tags: ["Traditional", "Budget"],
      },
      {
        item_name: "Tacos al Pastor",
        description_original: "Tacos al pastor con piña asada",
        description_translated:
          "Marinated pork tacos with grilled pineapple — must-try near the Zócalo",
        price: 42,
        tags: ["Pork", "Traditional"],
      },
    ],
  },
  {
    email: "seed-vendor-06@carrera-gourmet.demo",
    name: "Barbacoa Don Pepe",
    location_name: "Zócalo",
    city: "CDMX",
    latitude: 19.434,
    longitude: -99.1345,
    capacity_total: 20,
    tags: ["Traditional", "Beef"],
    menus: [
      {
        item_name: "Barbacoa de Borrego",
        description_original: "Barbacoa de borrego con consomé y tortillas",
        description_translated:
          "Slow-cooked lamb barbacoa with broth and fresh tortillas — Sunday tradition",
        price: 120,
        tags: ["Traditional", "Lamb"],
      },
    ],
  },
  {
    email: "seed-vendor-07@carrera-gourmet.demo",
    name: "Tortas Azteca",
    location_name: "Estadio Azteca",
    city: "CDMX",
    latitude: 19.303,
    longitude: -99.151,
    capacity_total: 25,
    tags: ["Traditional", "Pork"],
    menus: [
      {
        item_name: "Torta de Milanesa",
        description_original: "Torta de milanesa con aguacate y frijoles",
        description_translated:
          "Breaded cutlet sandwich with avocado and beans — stadium area staple",
        price: 65,
        tags: ["Pork", "Traditional"],
      },
      {
        item_name: "Cemita de Puebla",
        description_original: "Cemita con milanesa, quesillo y pápalo",
        description_translated:
          "Puebla-style sesame roll with cutlet, string cheese and pápalo herb",
        price: 75,
        tags: ["Traditional", "Contains Dairy"],
      },
    ],
  },
  {
    email: "seed-vendor-08@carrera-gourmet.demo",
    name: "Carnitas Calzada",
    location_name: "Calzada de Tlalpan, Estadio Azteca",
    city: "CDMX",
    latitude: 19.3015,
    longitude: -99.1495,
    capacity_total: 18,
    tags: ["Pork", "Traditional"],
    menus: [
      {
        item_name: "Carnitas Mixtas",
        description_original: "Carnitas surtidas con cuerito y tortillas hechas a mano",
        description_translated:
          "Mixed pork carnitas with crispy skin and handmade tortillas",
        price: 90,
        tags: ["Pork", "Traditional"],
      },
    ],
  },
  {
    email: "seed-vendor-09@carrera-gourmet.demo",
    name: "Birrieria El Compadre",
    location_name: "Centro Histórico",
    city: "Guadalajara",
    latitude: 20.6597,
    longitude: -103.3496,
    capacity_total: 24,
    tags: ["Traditional", "Beef"],
    menus: [
      {
        item_name: "Birria de Res",
        description_original: "Birria estilo Jalisco con consomé",
        description_translated:
          "Slow-stewed beef birria with rich consommé — Jalisco specialty",
        price: 120,
        tags: ["Beef", "Traditional"],
      },
    ],
  },
  {
    email: "seed-vendor-10@carrera-gourmet.demo",
    name: "Elotes y Esquites La Güera",
    location_name: "Parque Fundidora",
    city: "Monterrey",
    latitude: 25.6866,
    longitude: -100.3161,
    capacity_total: 14,
    tags: ["Vegetarian", "Vegan"],
    menus: [
      {
        item_name: "Esquites",
        description_original: "Esquites con mayonesa, chile y limón",
        description_translated:
          "Cup of corn kernels with mayo, chili powder and lime",
        price: 45,
        tags: ["Vegetarian"],
      },
      {
        item_name: "Elote Vegano",
        description_original: "Elote con mantequilla vegana y chile",
        description_translated:
          "Grilled corn with vegan butter and chili — plant-based option",
        price: 40,
        tags: ["Vegan", "Vegetarian"],
      },
    ],
  },
];
