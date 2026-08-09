import { detectUnit, type UnitType } from "../utils/inventoryHelpers";
import type { InventoryItem } from "../../../types/inventory";

import useInventoryFilters from "./useInventoryFilters";
import useGmailReport from "./useGmailReport";
import useInventoryStore from "../../../zustand/store/inventoryStore";

const useInventoryAnalysis = () => {
  // Zustand
  const {
    jsonData,
    fileName,
    isBar,
    forceAllBtl,
    setJsonData,
    setForceAllBtl,
  } = useInventoryStore();

  // Filtros
  const {
    minAmountFilter,
    setMinAmountFilter,
    handleDeleteItem,
    getFilteredItems,
  } = useInventoryFilters(jsonData);

  // Gmail
  const { copied, generateGmailText, copyToClipboard } = useGmailReport({
    getFilteredItems,
  });

  // Cambiar unidad del artículo
  const handleToggleUnit = (groupIndex: number, itemIndex: number) => {
    if (!jsonData) return;

    const newData = structuredClone(jsonData);

    const group = newData[groupIndex];

    if (!group) return;

    const item = group.items[itemIndex] as InventoryItem & {
      manualUnit?: UnitType;
    };

    if (!item) return;

    const currentUnit = detectUnit(item, group.categoria, forceAllBtl);

    // ml → btl → L → un → ml
    let nextUnit: UnitType;

    if (currentUnit === "ml") {
      nextUnit = "btl";
    } else if (currentUnit === "btl") {
      nextUnit = "L";
    } else if (currentUnit === "L") {
      nextUnit = "un";
    } else {
      nextUnit = "ml";
    }

    item.manualUnit = nextUnit;

    setJsonData(newData);
  };

  // Alternar modo botellas
  const toggleForceAllBtl = () => {
    setForceAllBtl(!forceAllBtl);
  };

  return {
    // Estados globales
    jsonData,
    fileName,
    isBar,
    forceAllBtl,

    // Filtros
    minAmountFilter,
    setMinAmountFilter,

    // Botellas
    toggleForceAllBtl,

    // Datos
    handleDeleteItem,
    handleToggleUnit,
    getFilteredItems,

    // Gmail
    copied,
    generateGmailText,
    copyToClipboard,
  };
};

export default useInventoryAnalysis;
