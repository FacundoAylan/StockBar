import type { InventoryItem } from "../../../types/inventory";

export type UnitType = "ml" | "btl" | "L" | "un";

export interface ItemAnalysis {
  tieneDiferencia: boolean;
  esUsadoNegativo: boolean;
  esDiferenciaNegativa: boolean;
  esFaltante: boolean;
  accion: "Faltan" | "Sobran";
  signo: "+" | "-"| "";
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

export const detectUnit = (item: InventoryItem): UnitType => {
  const strToTest =
    `${item.diferencia || ""} ${item.usado || ""} ${item.existenciaPrevia || ""} ${item.existencia || ""}`.toLowerCase();

  if (strToTest.includes("ml") || strToTest.includes("cc")) return "ml";
  if (
    strToTest.includes("btl") ||
    strToTest.includes("botella") ||
    strToTest.includes("each") ||
    strToTest.includes("can") ||
    strToTest.includes("lat") ||
    /\bea\b/.test(strToTest)
  ) {
    return "btl";
  }
  if (
    strToTest.includes("lts") ||
    strToTest.includes("litro") ||
    strToTest.includes("keg") ||
    /\b\d+\s*l\b/.test(strToTest) ||
    /\bl\b/.test(strToTest)
  ) {
    return "L";
  }
  if (
    strToTest.includes("un") ||
    strToTest.includes("unidad") ||
    strToTest.includes("uds")
  ) {
    return "un";
  }

  return "ml";
};

export const analyzeItem = (item: InventoryItem): ItemAnalysis => {
  const rawUsado = cleanNumber(item.usado);
  const rawVendido = Math.abs(cleanNumber(item.vendido));
  const rawDiff = cleanNumber(item.diferencia);
  const rawPrevia = Math.abs(cleanNumber(item.existenciaPrevia));
  const rawActual = Math.abs(cleanNumber(item.existencia));
  const unit = detectUnit(item);

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

  const esFaltante = esDiferenciaNegativa || esUsadoNegativo;

  // 🎯 CAMBIO AQUÍ: Se eliminan '+' y '-' para dejar el signo vacío
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
