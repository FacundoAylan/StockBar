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

export const detectUnit = (
  item: InventoryItem,
  categoryName?: string,
): UnitType => {
  const categoryStr = (categoryName || "").toLowerCase();
  const nameStr = (item.nombreArticulo || "").toLowerCase();
  const textToTest = `${categoryStr} ${nameStr}`.toLowerCase();

  // 1. REGLA: LITROS (Kegs, Barriles, Chopp, Cerveza Tirada)
  if (
    textToTest.includes("keg") ||
    textToTest.includes("barril") ||
    textToTest.includes("chopp") ||
    textToTest.includes("tirada") ||
    textToTest.includes("draft")
  ) {
    return "L";
  }

  // 2. REGLA: BOTELLAS (Vinos, Champagnes, Porrones, Gaseosas, Energizantes)
  if (
    textToTest.includes("vino") ||
    textToTest.includes("wine") ||
    textToTest.includes("champagne") ||
    textToTest.includes("espumante") ||
    textToTest.includes("espumoso") ||
    textToTest.includes("porron") ||
    textToTest.includes("porrón") ||
    textToTest.includes("sidra") ||
    // 🎯 REGLAS PARA GASEOSAS Y REFRESCOS
    textToTest.includes("gaseosa") ||
    textToTest.includes("gaseosas") ||
    textToTest.includes("soda") ||
    textToTest.includes("refresco") ||
    textToTest.includes("coca") ||
    textToTest.includes("sprite") ||
    textToTest.includes("fanta") ||
    textToTest.includes("7up") ||
    textToTest.includes("sevenup") ||
    textToTest.includes("schweppes") ||
    textToTest.includes("tónica") ||
    textToTest.includes("tonica") ||
    textToTest.includes("paso de los toros") ||
    // ENERGIZANTES
    textToTest.includes("energizante") ||
    textToTest.includes("energy") ||
    textToTest.includes("red bull") ||
    textToTest.includes("monster") ||
    textToTest.includes("speed")
  ) {
    return "btl";
  }

  // 3. REGLA: BOTELLAS EXPLÍCITAS (si la celda o el ítem contienen 'btl', 'botella', 'lata')
  if (
    textToTest.includes("btl") ||
    textToTest.includes("botella") ||
    textToTest.includes("can") ||
    textToTest.includes("lata")
  ) {
    return "btl";
  }

  // 4. REGLA POR DEFECTO: Destilados / Licores en ML
  return "ml";
};

export const analyzeItem = (
  item: InventoryItem,
  categoryName?: string,
): ItemAnalysis => {
  const rawUsado = cleanNumber(item.usado);
  const rawVendido = Math.abs(cleanNumber(item.vendido));
  const rawDiff = cleanNumber(item.diferencia);
  const rawPrevia = Math.abs(cleanNumber(item.existenciaPrevia));
  const rawActual = Math.abs(cleanNumber(item.existencia));

  // 🎯 1. Pasamos la categoría a detectUnit para asignar 'btl', 'L' o 'ml' correctamente
  const unit = detectUnit(item, categoryName);

  const diffTrimmed = (item.diferencia || "").trim();
  const tieneDiferencia =
    rawDiff !== 0 ||
    (diffTrimmed !== "" &&
      !["0", "0ml", "0btl", "0l"].includes(diffTrimmed.toLowerCase()));

  const esUsadoNegativo = (item.usado?.includes("-") ?? false) || rawUsado < 0;
  const esDiferenciaNegativa =
    (item.diferencia?.includes("-") ?? false) || rawDiff < 0;

  const usadoAbs = Math.abs(rawUsado);
  const diffAbs = Math.abs(rawDiff);
  const diffAmount = diffAbs || usadoAbs;

  // 🎯 2. Determinación directa sin reasignaciones (resuelve el warning del linter)
  const esFaltante =
    rawDiff !== 0
      ? esDiferenciaNegativa
      : rawUsado !== 0
        ? !esUsadoNegativo
        : rawActual < rawPrevia;

  const signo = "";
  const accion = esFaltante ? "Faltan" : "Sobran";

  return {
    tieneDiferencia,
    esUsadoNegativo,
    esDiferenciaNegativa,
    esFaltante,
    accion,
    signo,
    unit,
    diffAmount,
    prevNum: rawPrevia,
    actNum: rawActual,
    diffStr: `${diffAmount} ${unit}`,
    ventasStr: `${rawVendido} ${unit}`,
    usoStr: `${usadoAbs} ${unit}`,
  };
};