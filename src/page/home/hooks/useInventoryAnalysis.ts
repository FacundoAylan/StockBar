import { useState } from "react";
import { useFileParser } from "./useFileParser";
import { useInventoryFilters } from "./useInventoryFilters";
import { useGmailReport } from "./useGmailReport";
import { detectUnit } from "../utils/inventoryHelpers";
import type { InventoryItem } from "../../../types/inventory";

export function useInventoryAnalysis() {
  const [showModal, setShowModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);

  // Sub-hook de archivo
  const { jsonData, setJsonData, fileName, handleFileChange, resetFile } =
    useFileParser();

  // Sub-hook de filtros
  const {
    minAmountFilter,
    setMinAmountFilter,
    showNegative,
    setShowNegative,
    editMode,
    setEditMode,
    showCosts,
    setShowCosts,
    toggleCosts,
    forceAllBtl,
    setForceAllBtl,
    toggleForceAllBtl,
    handleDeleteItem,
    resetIgnoredKeys,
    getFilteredItems,
  } = useInventoryFilters(jsonData);

  // Sub-hook de Gmail
  const { copied, generateGmailText, copyToClipboard } = useGmailReport({
    jsonData,
    showNegative,
    forceAllBtl,
    getFilteredItems,
  });

  // Sobrescribir handleFileChange para limpiar elementos borrados al cargar uno nuevo
  const onFileChangeWithReset = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetIgnoredKeys();
    handleFileChange(e);
  };

  const handleToggleUnit = (groupIndex: number, itemIndex: number) => {
    setJsonData((prevData) => {
      if (!prevData) return prevData;

      const newData = structuredClone(prevData);
      const group = newData[groupIndex];
      const item = group.items[itemIndex] as InventoryItem & {
        manualUnit?: string;
      };

      const currentUnit = detectUnit(item, group.categoria, forceAllBtl);
      item.manualUnit = currentUnit === "btl" ? "ml" : "btl";

      return newData;
    });
  };

  const handleRemoveFile = () => {
    resetFile();
    resetIgnoredKeys();
    setShowModal(false);
    setShowTextModal(false);
  };

  return {
    jsonData,
    fileName,
    showModal,
    setShowModal,
    showTextModal,
    setShowTextModal,

    // Filtros
    minAmountFilter,
    setMinAmountFilter,
    showNegative,
    setShowNegative,

    // Edición
    editMode,
    setEditMode,
    copied,

    // Toggles visuales
    showCosts,
    setShowCosts,
    toggleCosts,
    forceAllBtl,
    setForceAllBtl,
    toggleForceAllBtl,

    // Acciones de datos
    handleFileChange: onFileChangeWithReset,
    handleRemoveFile,
    handleDeleteItem,
    handleToggleUnit,
    getFilteredItems,
    generateGmailText,
    copyToClipboard,
  };
}
