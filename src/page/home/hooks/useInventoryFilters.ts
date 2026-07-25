import { useState } from "react";
import { analyzeItem, parsePercentage } from "../utils/inventoryHelpers";
import type { InventoryGroup} from "../../../types/inventory";

export function useInventoryFilters(jsonData: InventoryGroup[] | null) {
  const [minPercentageFilter] = useState(0);
  const [minAmountFilter, setMinAmountFilter] = useState(0);
  const [showNegative, setShowNegative] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [ignoredItemKeys, setIgnoredItemKeys] = useState<Set<string>>(
    new Set(),
  );

  const [showCosts, setShowCosts] = useState<boolean>(true);
  const [forceAllBtl, setForceAllBtl] = useState<boolean>(false);

  const toggleCosts = () => setShowCosts((prev) => !prev);
  const toggleForceAllBtl = () => setForceAllBtl((prev) => !prev);

  const handleDeleteItem = (groupIndex: number, itemIndex: number) => {
    const key = `${groupIndex}-${itemIndex}`;
    setIgnoredItemKeys((prev) => new Set(prev).add(key));
  };

  const resetIgnoredKeys = () => setIgnoredItemKeys(new Set());

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

        const analysis = analyzeItem(item, categoryName, forceAllBtl);
        const pctValue = parsePercentage(item.porcentajeDiferencia);

        if (
          !analysis.tieneDiferencia &&
          !analysis.esUsadoNegativo &&
          analysis.diffAmount === 0
        ) {
          return false;
        }

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

  return {
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
  };
}
