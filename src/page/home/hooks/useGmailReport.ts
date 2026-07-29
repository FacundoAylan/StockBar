import { useState } from "react";
import { analyzeItem } from "../utils/inventoryHelpers";
import type { InventoryGroup } from "../../../types/inventory";

interface UseGmailReportProps {
  jsonData: InventoryGroup[] | null;
  showNegative: boolean;
  forceAllBtl: boolean;
  getFilteredItems: (
    items: InventoryGroup["items"],
    groupIndex: number,
  ) => { item: InventoryGroup["items"][0]; itemIdx: number }[];
}

// 1. Convertidor a texto ANCHO MAYÚSCULA solo para Categorías
const toWideUpperText = (str: string) => {
  return str
    .toUpperCase()
    .replace(/[A-Z0-9]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) + 0xfee0),
    );
};

// 2. Convertidor a NEGRITA REAL UNICODE (mantiene mayúsculas y minúsculas)
const toBoldText = (str: string) => {
  return str.replace(/[A-Za-z0-9]/g, (ch) => {
    const code = ch.charCodeAt(0);
    // Mayúsculas A-Z
    if (code >= 65 && code <= 90)
      return String.fromCodePoint(0x1d5a0 + (code - 65));
    // Minúsculas a-z
    if (code >= 97 && code <= 122)
      return String.fromCodePoint(0x1d5ba + (code - 97));
    // Números 0-9
    if (code >= 48 && code <= 57)
      return String.fromCodePoint(0x1d7e2 + (code - 48));
    return ch;
  });
};

export function useGmailReport({
  jsonData,
  showNegative,
  forceAllBtl,
  getFilteredItems,
}: UseGmailReportProps) {
  const [copied, setCopied] = useState(false);

  const generateGmailText = () => {
    if (!jsonData) return "";

    const titulo = showNegative
      ? "ANÁLISIS DE USADOS NEGATIVOS"
      : "INFORME DE AUDITORÍA DE INVENTARIO";

    let text = `====================================================\n`;
    text += `📋 ${toWideUpperText(titulo)}\n`;
    text += `====================================================\n\n`;

    jsonData.forEach((group, groupIdx) => {
      const itemsFiltrados = getFilteredItems(group.items, groupIdx);
      const categoryName = group?.categoria ?? "";

      if (itemsFiltrados.length > 0) {
        // Métricas de Categoría
        const diffCat = group.diferencia
          ? `  (Faltan: ${group.diferencia})`
          : "";
        const pctCat = group.porcentajeDiferencia
          ? ` (% dif: ${group.porcentajeDiferencia})`
          : "";
        const iconoGrupo = group.icono || "☕";

        // 🎯 CATEGORÍA: ÚNICA EN MAYÚSCULAS Y ANCHO
        text += `${iconoGrupo}  ${toWideUpperText(group.categoria)}${diffCat}${pctCat}\n`;
        text += `----------------------------------------------------\n`;

        itemsFiltrados.forEach(({ item }) => {
          const analysis = analyzeItem(item, categoryName, forceAllBtl);

          const pctItemStr = item.porcentajeDiferencia
            ? ` -- % dif: ${item.porcentajeDiferencia}`
            : "";

          let diffStr = "ok";
          if (analysis.tieneDiferencia) {
            const accion = analysis.esFaltante ? "Faltan" : "Sobran";
            diffStr = `${accion}: ${analysis.signo}${analysis.diffAmount} ${analysis.unit.toLowerCase()}`;
          }

          // 🎯 ARTÍCULO Y MÉTRICAS: EN MINÚSCULAS CON NEGRITA
          text += `   🔹 ${toBoldText(item.nombreArticulo)}\n`;
          text += `      Vendido: ${analysis.ventasStr}  |  Usado: ${analysis.usoStr}\n`;
          text += `      ${diffStr}${pctItemStr}\n\n`;
        });

        text += `\n`;
      }
    });

    text += `====================================================\n`;
    text += `📌 Quedo a disposición ante cualquier consulta.\n`;
    text += `Saludos cordiales.`;

    return text;
  };

  const copyToClipboard = async () => {
    const textPlain = generateGmailText();

    try {
      await navigator.clipboard.writeText(textPlain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Error al copiar texto plano:", err);
    }
  };

  return {
    copied,
    generateGmailText,
    copyToClipboard,
  };
}
