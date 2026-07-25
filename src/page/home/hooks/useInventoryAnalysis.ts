import { useState, type ChangeEvent } from "react";
import { csvToJson } from "../utils/csvParser";
import {
  analyzeItem,
  detectUnit,
  parsePercentage,
  cleanNumber,
} from "../utils/inventoryHelpers";
import type { InventoryGroup, InventoryItem } from "../../../types/inventory";

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

  // Estado visible de costos
  const [showCosts, setShowCosts] = useState<boolean>(true);

  // 🎯 Estado para forzar todo el inventario a Botellas (btl)
  const [forceAllBtl, setForceAllBtl] = useState<boolean>(false);

  const toggleCosts = () => setShowCosts((prev) => !prev);
  const toggleForceAllBtl = () => setForceAllBtl((prev) => !prev);

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

  // 🎯 NUEVO: Manejador para alternar la unidad individual de un producto (btl ↔ ml)
  const handleToggleUnit = (groupIndex: number, itemIndex: number) => {
    setJsonData((prevData) => {
      if (!prevData) return prevData;

      const newData = structuredClone(prevData);
      const group = newData[groupIndex];
      const item = group.items[itemIndex] as InventoryItem & {
        manualUnit?: string;
      };

      // Detectamos su unidad actual considerando la categoría
      const currentUnit = detectUnit(item, group.categoria, forceAllBtl);
      const nextUnit = currentUnit === "btl" ? "ml" : "btl";

      // Asignamos el override manual
      item.manualUnit = nextUnit;

      return newData;
    });
  };

  const getFilteredItems = (
    items: InventoryGroup["items"],
    groupIndex: number,
  ) => {
    if (!items) return [];

    const group = jsonData?.[groupIndex];
    const categoryName = group?.categoria ?? "";

    return items
      .map((item, itemIdx) => ({ item, itemIdx }))
      .filter(({ item, itemIdx }) => {
        const itemKey = `${groupIndex}-${itemIdx}`;
        if (ignoredItemKeys.has(itemKey)) return false;

        // 🎯 Evaluamos el análisis respetando categoría y forceAllBtl
        const analysis = analyzeItem(item, categoryName, forceAllBtl);
        const pctValue = parsePercentage(item.porcentajeDiferencia);

        // 1. Descartar si no tiene diferencia
        if (
          !analysis.tieneDiferencia &&
          !analysis.esUsadoNegativo &&
          analysis.diffAmount === 0
        ) {
          return false;
        }

        // 🎯 2. FILTRO POR VOLUMEN ESTRICTO:
        if (
          minAmountFilter > 0 &&
          analysis.unit === "ml" &&
          analysis.diffAmount < minAmountFilter
        ) {
          return false;
        }

        return pctValue >= minPercentageFilter;
      });
  };

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
    handleToggleUnit, 
    getFilteredItems,
    generateGmailText,
    copyToClipboard,
    showCosts,
    setShowCosts,
    toggleCosts,
    forceAllBtl,
    setForceAllBtl,
    toggleForceAllBtl,
  };
}
