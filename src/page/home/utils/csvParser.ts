import type { InventoryGroup, InventoryItem } from "../../../types/inventory";
import { getCategoryIcon } from "./categoryHelper";

export const parseCsvLine = (line: string): string[] => {
  if (!line || !line.trim()) return [];

  return line
    .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    .map((val) =>
      val ? val.replace(/^"|"$/g, "").replace(/\\/g, "").trim() : "",
    );
};

/**
  Extracts and maps raw row data into a standardized InventoryItem structure.
 */
const mapRowToItem = (
  rowObj: Record<string, string | null>,
): InventoryItem => ({
  nombreArticulo: rowObj["nombre artículo"] || "",
  existenciaPrevia: rowObj["existencia previa"] || null,
  compras: rowObj["compras"] || null,
  existencia: rowObj["existencia"] || null,
  usado: rowObj["usado"] || null,
  vendido: rowObj["vendido"] || null,
  diferencia: rowObj["diferencia"] || null,
  porcentajeDiferencia: rowObj["% diferencia"] || null,
  diferenciaCosto: rowObj["diferencia (costo)"] || null,
  ingresos: rowObj["ingresos"] || null,
  porcentajeCosto: rowObj["porcentaje de costo"] || null,
  porcentajeCostoIdeal: rowObj["porcentaje de costo ideal"] || null,
});


export const csvToJson = (csv: string): InventoryGroup[] => {
  if (!csv) return [];

  const allLines = csv.split("\n");
  if (allLines.length < 2) return [];

  const headers = parseCsvLine(allLines[0]).map((h) => h.toLowerCase());
  const objList: InventoryGroup[] = [];
  let currentGroupItems: InventoryItem[] = [];

  for (let i = 1; i < allLines.length; i++) {
    const rawLine = allLines[i];
    if (!rawLine || !rawLine.trim()) continue;

    const values = parseCsvLine(rawLine);
    const rowObj: Record<string, string | null> = {};

    headers.forEach((header, index) => {
      rowObj[header] = values[index] !== undefined ? values[index] : null;
    });

    const itemNombre = rowObj["nombre artículo"] || "";

    // Total row indicates the end of a category group
    if (itemNombre.includes("Total")) {
      const cleanCategory = itemNombre
        .replace(/^Total\s*/i, "")
        .replace(/:$/, "")
        .trim();

    const categoryObject: InventoryGroup = {
      categoria: cleanCategory,
      icono: getCategoryIcon(cleanCategory),
      existenciaPrevia: rowObj["existencia previa"] || "",
      compras: rowObj["compras"] || "",
      existencia: rowObj["existencia"] || "",
      usado: rowObj["usado"] || "",
      vendido: rowObj["vendido"] || "",
      diferencia: rowObj["diferencia"] || "",
      porcentajeDiferencia: rowObj["% diferencia"] || undefined,
      diferenciaCosto: rowObj["diferencia (costo)"] || "",
      ingresos: rowObj["ingresos"] || "",
      porcentajeCosto: rowObj["porcentaje de costo"] || undefined,
      porcentajeCostoIdeal: rowObj["porcentaje de costo ideal"] || undefined,
      items: [...currentGroupItems],
    };

      objList.push(categoryObject);
      currentGroupItems = []; // Reset item pool for next category
    } else if (itemNombre) {
      currentGroupItems.push(mapRowToItem(rowObj));
    }
  }

  return objList;
};
