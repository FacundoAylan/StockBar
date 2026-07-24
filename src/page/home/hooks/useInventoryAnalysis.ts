import { useState, type ChangeEvent,  } from "react";
import { csvToJson } from "../utils/csvParser";
import {
  analyzeItem,
  parsePercentage,
  cleanNumber,
} from "../utils/inventoryHelpers";
import type { InventoryGroup } from "../../../types/inventory";

export function useInventoryAnalysis() {
  const [jsonData, setJsonData] = useState<InventoryGroup[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);

  // Filtros
  const [minPercentageFilter] = useState(0);
  const [minAmountFilter, setMinAmountFilter] = useState(0);
  const [showNegative, setShowNegative] = useState(false);

  // Edición y estado de borrado
  const [editMode, setEditMode] = useState(false);
  const [ignoredItemKeys, setIgnoredItemKeys] = useState<Set<string>>(
    new Set(),
  );
  const [copied, setCopied] = useState(false);

  //Estado visible de costos
  const [showCosts, setShowCosts] = useState<boolean>(true);

  const toggleCosts = () => setShowCosts((prev) => !prev);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFileName(selectedFile.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const jsonResult = csvToJson(text);
      setJsonData(jsonResult);
      setIgnoredItemKeys(new Set());
    };
    reader.readAsText(selectedFile);
  };

  const handleDeleteItem = (groupIndex: number, itemIndex: number) => {
    const key = `${groupIndex}-${itemIndex}`;
    setIgnoredItemKeys((prev) => new Set(prev).add(key));
  };

  const getFilteredItems = (
    items: InventoryGroup["items"],
    groupIndex: number,
  ) => {
    if (!items) return [];

    return items
      .map((item, itemIdx) => ({ item, itemIdx }))
      .filter(({ item, itemIdx }) => {
        const itemKey = `${groupIndex}-${itemIdx}`;
        if (ignoredItemKeys.has(itemKey)) return false;

        const analysis = analyzeItem(item);
        const pctValue = parsePercentage(item.porcentajeDiferencia);

        if (!analysis.tieneDiferencia && !analysis.esUsadoNegativo)
          return false;

        if (
          (analysis.unit === "ml" || analysis.unit === "L") &&
          minAmountFilter > 0 &&
          analysis.diffAmount < minAmountFilter
        ) {
          return false;
        }

        const coincideTipo = showNegative
          ? analysis.esUsadoNegativo
          : !analysis.esUsadoNegativo;
        return coincideTipo && pctValue >= minPercentageFilter;
      });
  };

  const generateGmailText = () => {
    if (!jsonData) return "";

    let text = `Buenas, les envío el informe de la semana (${
      showNegative ? "USADOS NEGATIVOS" : "REPORTES Y SOBRANTES"
    }):\n\n`;

    jsonData.forEach((group, groupIdx) => {
      const itemsFiltrados = getFilteredItems(group.items, groupIdx);

      if (itemsFiltrados.length > 0) {
        let totalDiff = 0;
        let totalPrevia = 0;
        let mainUnit = "btl";

        itemsFiltrados.forEach(({ item }) => {
          const analysis = analyzeItem(item);
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
          const analysis = analyzeItem(item);
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
    jsonData,
    fileName,
    showModal,
    setShowModal,
    showTextModal,
    setShowTextModal,
    minAmountFilter,
    setMinAmountFilter,
    showNegative,
    setShowNegative,
    editMode,
    setEditMode,
    copied,
    handleFileChange,
    handleDeleteItem,
    getFilteredItems,
    generateGmailText,
    copyToClipboard,
    showCosts,
    setShowCosts,
    toggleCosts,
  };
}
