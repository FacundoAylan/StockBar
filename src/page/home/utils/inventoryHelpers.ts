import type { InventoryItem } from "../../../types/inventory";

export type UnitType = "ml" | "btl" | "L" | "un";

export interface ItemAnalysis {
  tieneDiferencia: boolean;
  esUsadoNegativo: boolean;
  esDiferenciaNegativa: boolean;
  esFaltante: boolean;
  accion: "Faltan" | "Sobran";
  signo: "+" | "-" | "";
  unit: UnitType;
  diffAmount: number;
  prevNum: number;
  actNum: number;
  diffStr: string;
  ventasStr: string;
  usoStr: string;
}

export const cleanNumber = (valStr: string | null | undefined): number => {
  if (!valStr) return 0;
  const clean = valStr.toString().replace(/[^0-9.-]/g, "");
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

export const parsePercentage = (pctStr: string | null | undefined): number => {
  if (!pctStr) return 0;
  const clean = pctStr.toString().replace(/[%+-]/g, "").trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : Math.abs(num);
};

// Helper para verificar si el texto contiene la palabra exacta (case-insensitive)
const hasWord = (text: string, word: string): boolean => {
  // \b garantiza los límites de la palabra exactos
  const regex = new RegExp(`\\b${word}\\b`, "i");
  return regex.test(text);
};

export const detectUnit = (
  item: InventoryItem,
  categoryName?: string,
  forceAllBtl: boolean = false,
): UnitType => {
  // 🎯 1. Prioridad Manual
  if (item.manualUnit) {
    return item.manualUnit as UnitType;
  }

  const categoryStr = (categoryName || "").toLowerCase();
  const nameStr = (item.nombreArticulo || "").toLowerCase();
  const textToTest = `${categoryStr} ${nameStr}`.toLowerCase();

  // 🎯 2. EXCEPCIÓN BOTELLAS ESPECIALES: Cafe de Paris es Espumante ---> BTL
  if (textToTest.includes("cafe de paris")) {
    return "btl";
  }

  // 🎯 3. REGLA: LITROS / BARRIL / GRIFO / BAG-IN-BOX / SACHET (Prioridad Alta sobre ML y BTL)
  if (
    hasWord(textToTest, "keg") ||
    hasWord(textToTest, "kegs") ||
    hasWord(textToTest, "barril") ||
    hasWord(textToTest, "chopp") ||
    hasWord(textToTest, "tirada") ||
    hasWord(textToTest, "draft") ||
    hasWord(textToTest, "grifo") ||
    hasWord(textToTest, "proyecto") ||
    hasWord(textToTest, "bib") ||
    hasWord(textToTest, "sachet") ||
    textToTest.includes("10l") || 
    textToTest.includes("10 l") || 
    textToTest.includes("5l") ||
    textToTest.includes("5 l")
  ) {
    return "L";
  }

  // 🎯 4. EXCEPCIONES A 'ml': Licores de café, Coctelería y Vermuts de barra
  if (
    // Licores de Café (evitan caer en regla 'cafe' de unidad)
    hasWord(textToTest, "borghetti") ||
    hasWord(textToTest, "bols") ||
    hasWord(textToTest, "cusenier") ||
    hasWord(textToTest, "tia") ||
    textToTest.includes("tia maria") ||
    // Vermuts de barra y aperitivos a granel
    textToTest.includes("tres plumas") ||
    hasWord(textToTest, "vermouth") ||
    hasWord(textToTest, "vermut") ||
    hasWord(textToTest, "vermu") ||
    hasWord(textToTest, "cinzano") ||
    hasWord(textToTest, "martini") ||
    hasWord(textToTest, "canela") ||
    hasWord(textToTest, "lunfa") ||
    hasWord(textToTest, "veraniego") ||
    hasWord(textToTest, "gancia") ||
    textToTest.includes("gancia spritz") ||
    textToTest.includes("cold brew")
  ) {
    return "ml";
  }

  // 🎯 5. REGLA: CAFÉ EN ENVASE / KILOS / PAQUETE (Fuerza a 'un')
  if (
    hasWord(textToTest, "cafe") ||
    hasWord(textToTest, "café") ||
    hasWord(textToTest, "espresso")
  ) {
    return "un";
  }

  // 🎯 6. Override Global
  if (forceAllBtl) {
    return "btl";
  }

  // 🎯 7. REGLA BOTELLAS
  if (
    // AGUAS Y BEBIDAS SIN ALCOHOL
    hasWord(textToTest, "agua") ||
    hasWord(textToTest, "aguas") ||
    hasWord(textToTest, "water") ||
    hasWord(textToTest, "mineral") ||
    textToTest.includes("bebida s/alcohol") ||
    textToTest.includes("bebidas s/alcohol") ||
    textToTest.includes("sin alcohol") ||
    textToTest.includes("s/alcohol") ||
    textToTest.includes("s/alc") ||
    textToTest.includes("sin alc") ||
    // GASEOSAS Y REFRESCOS
    hasWord(textToTest, "gaseosa") ||
    hasWord(textToTest, "gaseosas") ||
    hasWord(textToTest, "soda") ||
    hasWord(textToTest, "refresco") ||
    hasWord(textToTest, "coca") ||
    hasWord(textToTest, "sprite") ||
    hasWord(textToTest, "fanta") ||
    hasWord(textToTest, "7up") ||
    hasWord(textToTest, "sevenup") ||
    hasWord(textToTest, "schweppes") ||
    hasWord(textToTest, "tónica") ||
    hasWord(textToTest, "tonica") ||
    textToTest.includes("paso de los toros") ||
    // VINOS, CERVEZAS Y ESPUMANTES
    hasWord(textToTest, "vino") ||
    hasWord(textToTest, "wine") ||
    hasWord(textToTest, "champagne") ||
    hasWord(textToTest, "espumante") ||
    hasWord(textToTest, "espumoso") ||
    hasWord(textToTest, "spritz") ||
    hasWord(textToTest, "porron") ||
    hasWord(textToTest, "porrón") ||
    hasWord(textToTest, "cerveza") ||
    hasWord(textToTest, "cervezas") ||
    hasWord(textToTest, "sidra") ||
    // ENERGIZANTES Y LATAS
    hasWord(textToTest, "energizante") ||
    hasWord(textToTest, "energy") ||
    textToTest.includes("red bull") ||
    hasWord(textToTest, "monster") ||
    hasWord(textToTest, "speed") ||
    // PALABRAS CLAVE DIRECTAS DE CONTENEDOR
    hasWord(textToTest, "btl") ||
    hasWord(textToTest, "botella") ||
    hasWord(textToTest, "bot") ||
    hasWord(textToTest, "lata") ||
    hasWord(textToTest, "can")
  ) {
    return "btl";
  }

  // 🎯 8. DEFAULT: Destilados / Licores / Coctelería a granel
  return "ml";
};

export const analyzeItem = (
  item: InventoryItem,
  categoryName?: string,
  forceAllBtl: boolean = false,
): ItemAnalysis => {
  const rawUsado = cleanNumber(item.usado);
  const rawVendido = Math.abs(cleanNumber(item.vendido));
  const rawDiff = cleanNumber(item.diferencia);
  const rawPrevia = Math.abs(cleanNumber(item.existenciaPrevia));
  const rawActual = Math.abs(cleanNumber(item.existencia));

  const unit = detectUnit(item, categoryName, forceAllBtl);

  const diffTrimmed = (item.diferencia || "").trim();

  // 🎯 Solo tiene diferencia si es estrictamente distinta de 0
  const tieneDiferencia =
    rawDiff !== 0 &&
    diffTrimmed !== "" &&
    !["0", "0ml", "0btl", "0l"].includes(diffTrimmed.toLowerCase());

  const esUsadoNegativo = (item.usado?.includes("-") ?? false) || rawUsado < 0;
  const esDiferenciaNegativa =
    (item.diferencia?.includes("-") ?? false) || rawDiff < 0;

  const usadoAbs = Math.abs(rawUsado);
  const diffAbs = Math.abs(rawDiff);
  const diffAmount = diffAbs;

  const esFaltante = esDiferenciaNegativa;
  const accion = esFaltante ? "Faltan" : "Sobran";

  return {
    tieneDiferencia,
    esUsadoNegativo,
    esDiferenciaNegativa,
    esFaltante,
    accion,
    signo: "",
    unit,
    diffAmount,
    prevNum: rawPrevia,
    actNum: rawActual,
    diffStr: `${diffAmount} ${unit}`,
    ventasStr: `${rawVendido} ${unit}`,
    usoStr: `${usadoAbs} ${unit}`,
  };
};
