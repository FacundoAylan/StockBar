import { useState } from "react";

import { analyzeItem } from "../utils/inventoryHelpers";
import type { InventoryGroup } from "../../../types/inventory";

import useInventoryStore from "../../../zustand/store/inventoryStore";

interface UseGmailReportProps {
  getFilteredItems: (
    items: InventoryGroup["items"],
    groupIndex: number,
  ) => {
    item: InventoryGroup["items"][0];
    itemIdx: number;
  }[];
}

// Convertidor a texto ancho en MAYÚSCULAS
const toWideUpperText = (str: string) => {
  return str
    .toUpperCase()
    .replace(/[A-Z0-9]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) + 0xfee0),
    );
};

// Convertidor a NEGRITA Unicode
const toBoldText = (str: string) => {
  return str.replace(/[A-Za-z0-9]/g, (ch) => {
    const code = ch.charCodeAt(0);

    // Mayúsculas
    if (code >= 65 && code <= 90) {
      return String.fromCodePoint(0x1d5a0 + (code - 65));
    }

    // Minúsculas
    if (code >= 97 && code <= 122) {
      return String.fromCodePoint(0x1d5ba + (code - 97));
    }

    // Números
    if (code >= 48 && code <= 57) {
      return String.fromCodePoint(0x1d7e2 + (code - 48));
    }

    return ch;
  });
};

const useGmailReport = ({ getFilteredItems }: UseGmailReportProps) => {
  const [copied, setCopied] = useState(false);

  // Zustand
  const { jsonData, isBar, forceAllBtl } = useInventoryStore();

  const hasValue = (value: unknown): boolean => {
    if (value == null || value === "") {
      return false;
    }

    const str = String(value).trim();

    const normalized = str
      .replace("%", "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "");

    const num = Number(normalized);

    if (!Number.isNaN(num)) {
      return num !== 0;
    }

    return true;
  };

  const generateGmailText = () => {
    if (!jsonData) {
      return "";
    }

    const titulo = "INFORME DE AUDITORÍA DE INVENTARIO";

    let text = `====================================================\n`;

    text += `📋 ${toWideUpperText(titulo)}\n`;

    text += `====================================================\n\n`;

    jsonData.forEach((group, groupIdx) => {
      const itemsFiltrados = getFilteredItems(group.items, groupIdx);

      const categoryName = group?.categoria ?? "";

      if (itemsFiltrados.length === 0) {
        return;
      }

      const iconoGrupo = group.icono || "☕";

      const diffCat = hasValue(group.diferencia)
        ? `  (Faltan: ${group.diferencia})`
        : "";

      const pctCat = hasValue(group.porcentajeDiferencia)
        ? ` (% dif: ${group.porcentajeDiferencia})`
        : "";

      text += `${iconoGrupo}  ${toWideUpperText(
        categoryName,
      )}${diffCat}${pctCat}\n`;

      text += `----------------------------------------------------\n`;

      itemsFiltrados.forEach(({ item }) => {
        const analysis = analyzeItem(item, categoryName, forceAllBtl);

        const pctItemStr = hasValue(item.porcentajeDiferencia)
          ? ` -- % dif: ${item.porcentajeDiferencia}`
          : "";

        let diffStr = "ok";

        if (analysis.tieneDiferencia) {
          const accion = analysis.esFaltante ? "Faltan" : "Sobran";

          diffStr = `${accion}: ${analysis.signo}${analysis.diffAmount ?? 0} ${
            analysis.unit?.toLowerCase() ?? ""
          }`;
        }

        text += `   🔹 ${toBoldText(item.nombreArticulo ?? "")}\n`;

        if (isBar) {
          text += `      Vendido: ${analysis.ventasStr ?? 0}  |  Usado: ${
            analysis.usoStr ?? 0
          }\n`;
        } else {
          const conteo =
            Number(item.existencia ?? 0) === 0 ? "Sin stock" : item.existencia;

          text += `      Stock teórico: ${
            item.existenciaPrevia ?? 0
          }  |  Conteo: ${conteo}\n`;
        }

        text += `      ${diffStr}${pctItemStr}\n\n`;
      });

      text += "\n";
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

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error("Error al copiar texto plano:", err);
    }
  };

  return {
    copied,
    generateGmailText,
    copyToClipboard,
  };
};

export default useGmailReport;
