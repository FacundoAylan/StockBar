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
  // 🎯 1. Prioridad Manual: Selección explícita del usuario en modo edición
  if (item.manualUnit) {
    return item.manualUnit as UnitType;
  }

  const categoryStr = (categoryName || "").toLowerCase();
  const nameStr = (item.nombreArticulo || "").toLowerCase();
  const textToTest = `${categoryStr} ${nameStr}`.toLowerCase();

  // 🎯 2. REGLA: CAFÉ / COLD BREW / INFUSIONES (Fuerza siempre a 'ml')
  if (
    hasWord(textToTest, "cafe") ||
    hasWord(textToTest, "café") ||
    hasWord(textToTest, "espresso") ||
    hasWord(textToTest, "martini") ||
    hasWord(textToTest, "cinzano") ||
    hasWord(textToTest, "canela") ||
    textToTest.includes("cold brew")
  ) {
    return "ml";
  }

  // 🎯 3. REGLA: LITROS / BARRIL / GRIFO (Kegs, Chopp, Cerveza Tirada, Vermut de Grifo, Proyectos)
  if (
    hasWord(textToTest, "keg") ||
    hasWord(textToTest, "kegs") ||
    hasWord(textToTest, "barril") ||
    hasWord(textToTest, "chopp") ||
    hasWord(textToTest, "tirada") ||
    hasWord(textToTest, "draft") ||
    hasWord(textToTest, "grifo") ||
    hasWord(textToTest, "proyecto")
  ) {
    return "L";
  }

  // 🎯 4. Override Global: Forzar a botellas todo lo demás que NO sea barril ni café
  if (forceAllBtl) {
    return "btl";
  }

  // 🎯 5. REGLA PRINCIPAL DE BOTELLAS Y UNIDADES (PRIORIDAD ALTA)
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
    // VINOS, VERMUTS, CERVEZAS Y ESPUMANTES
    hasWord(textToTest, "vino") ||
    hasWord(textToTest, "wine") ||
    hasWord(textToTest, "champagne") ||
    hasWord(textToTest, "espumante") ||
    hasWord(textToTest, "espumoso") ||
    hasWord(textToTest, "vermu") ||
    hasWord(textToTest, "vermut") ||
    hasWord(textToTest, "vermouth") ||
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

  // 🎯 6. REGLA POR DEFECTO: Destilados / Licores / Coctelería a granel
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
