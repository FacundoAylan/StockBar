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
  forceAllBtl: boolean = false,
): UnitType => {
  // 🎯 Si el botón está activado, todo pasa automáticamente a 'btl'
  if (forceAllBtl) {
    return "btl";
  }

  const categoryStr = (categoryName || "").toLowerCase();
  const nameStr = (item.nombreArticulo || "").toLowerCase();
  const textToTest = `${categoryStr} ${nameStr}`.toLowerCase();

  // 1. REGLA: LITROS / BARRIL (Kegs, Chopp, Cerveza Tirada)
  if (
    textToTest.includes("keg") ||
    textToTest.includes("barril") ||
    textToTest.includes("chopp") ||
    textToTest.includes("tirada") ||
    textToTest.includes("draft")
  ) {
    return "L";
  }

  // 2. REGLA PRINCIPAL DE BOTELLAS Y UNIDADES (PRIORIDAD ALTA)
  // Todo lo que encaje aquí SERÁ BOTELLA ('btl') aunque en el nombre diga '500ml' o '350ml'
  if (
    // AGUAS Y BEBIDAS SIN ALCOHOL
    textToTest.includes("agua") ||
    textToTest.includes("aguas") ||
    textToTest.includes("water") ||
    textToTest.includes("mineral") ||
    textToTest.includes("bebida s/alcohol") ||
    textToTest.includes("bebidas s/alcohol") ||
    textToTest.includes("sin alcohol") ||
    textToTest.includes("s/alcohol") ||
    textToTest.includes("s/alc") ||
    textToTest.includes("sin alc") ||
    // GASEOSAS Y REFRESCOS
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
    // VINOS Y ESPUMANTES
    textToTest.includes("vino") ||
    textToTest.includes("wine") ||
    textToTest.includes("champagne") ||
    textToTest.includes("espumante") ||
    textToTest.includes("espumoso") ||
    textToTest.includes("porron") ||
    textToTest.includes("porrón") ||
    textToTest.includes("sidra") ||
    // ENERGIZANTES Y LATAS
    textToTest.includes("energizante") ||
    textToTest.includes("energy") ||
    textToTest.includes("red bull") ||
    textToTest.includes("monster") ||
    textToTest.includes("speed") ||
    // PALABRAS CLAVE DIRECTAS DE CONTENEDOR
    textToTest.includes("btl") ||
    textToTest.includes("botella") ||
    textToTest.includes("lata") ||
    textToTest.includes("can")
  ) {
    return "btl";
  }

  // 3. REGLA POR DEFECTO: Destilados / Licores / Coctelería a granel
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

  // 🎯 1. Pasamos categoryName Y forceAllBtl a detectUnit
  const unit = detectUnit(item, categoryName, forceAllBtl);

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

  // 🎯 2. Determinación directa sin reasignaciones
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