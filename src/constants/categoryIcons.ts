export interface CategoryPattern {
  keywords: string[];
  icon: string;
}

export const CATEGORY_ICON_MAP: CategoryPattern[] = [
  // Spirits & Dark/White Liquors
  { keywords: ["whiskey", "whisky", "bourbon", "scotch"], icon: "🥃" },
  { keywords: ["gin"], icon: "🍸" },
  {
    keywords: [
      "vodka",
      "tequila",
      "mezkal",
      "mezcal",
      "cachaca",
      "cachaça",
      "cognac",
      "ron",
      "rum",
    ],
    icon: "🍹",
  },
  {
    keywords: ["aperitivo", "licor", "vermut", "vermouth", "bitter", "fernet"],
    icon: "🍷",
  },

  // Wines & Sparkling Wines
  {
    keywords: ["wine", "vino", "champagne", "espumante", "cava", "prosecco"],
    icon: "🍾",
  },

  // Beers & Ciders
  {
    keywords: ["kegs", "porron", "cerveza", "beer", "chopp", "sidra"],
    icon: "🍺",
  },

  // Non-Alcoholic / Soft Drinks / Energy & Hot Drinks
  { keywords: ["energizante", "energy"], icon: "⚡" },
  {
    keywords: ["gaseosa", "soda", "tonica", "tonic", "soft drink"],
    icon: "🥤",
  },
  { keywords: ["agua", "water"], icon: "💧" },
  { keywords: ["jugo", "juice", "pulp"], icon: "🧃" },
  { keywords: ["cafe", "coffee", "te", "tea"], icon: "☕" },

  // Food / Ingredients / Kitchen Supplies
  { keywords: ["comida", "food", "cocina", "plato"], icon: "🍽️" },
  { keywords: ["fruta", "fruit", "citrico", "insumo"], icon: "🍋" },
  { keywords: ["hielo", "ice"], icon: "🧊" },
];

export const DEFAULT_CATEGORY_ICON = "🏷️";
export const FALLBACK_ICON = "📦";
