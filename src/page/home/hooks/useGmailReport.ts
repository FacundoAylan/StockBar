import { useState } from "react";
import { analyzeItem, cleanNumber } from "../utils/inventoryHelpers";
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

export function useGmailReport({
  jsonData,
  showNegative,
  forceAllBtl,
  getFilteredItems,
}: UseGmailReportProps) {
  const [copied, setCopied] = useState(false);

  const generateGmailText = () => {
    if (!jsonData) return "";

    let text = `Buenas, les envío el informe de la semana (${
      showNegative ? "USADOS NEGATIVOS" : "REPORTES Y SOBRANTES"
    }):\n\n`;

    jsonData.forEach((group, groupIdx) => {
      const itemsFiltrados = getFilteredItems(group.items, groupIdx);
      const categoryName = group?.categoria ?? "";

      if (itemsFiltrados.length > 0) {
        let totalDiff = 0;
        let totalPrevia = 0;
        let mainUnit = "btl";

        itemsFiltrados.forEach(({ item }) => {
          const analysis = analyzeItem(item, categoryName, forceAllBtl);
          const prevNum = Math.abs(cleanNumber(item.existenciaPrevia));

          totalDiff += analysis.esFaltante
            ? -analysis.diffAmount
            : analysis.diffAmount;
          totalPrevia += prevNum;
          if (analysis.unit) mainUnit = analysis.unit;
        });

        const esSobranteCat = totalDiff >= 0;
        const accionCat = esSobranteCat ? "Sobran" : "Faltan";
        const valAbs = Math.abs(totalDiff);

        let pctCatStr = "";
        if (totalPrevia > 0) {
          const pct = ((valAbs / totalPrevia) * 100).toFixed(1);
          pctCatStr = ` (${esSobranteCat ? "+" : "-"}${pct}%)`;
        }

        text += `${group.icono} ${group.categoria}: ${accionCat} ${valAbs} ${mainUnit}${pctCatStr}\n`;

        itemsFiltrados.forEach(({ item }) => {
          const analysis = analyzeItem(item, categoryName, forceAllBtl);
          text += `• ${item.nombreArticulo}: ${analysis.accion} ${analysis.diffAmount} ${analysis.unit} — Ventas: ${analysis.ventasStr} | Uso real: ${analysis.usoStr}.\n`;
        });

        text += "\n";
      }
    });

    text +=
      "---\nQuedo a disposición ante cualquier consulta.\n\nSaludos cordiales.";
    return text;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateGmailText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return {
    copied,
    generateGmailText,
    copyToClipboard,
  };
}
