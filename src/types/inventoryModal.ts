import type { Dispatch, SetStateAction } from "react";
import type { InventoryGroup, InventoryItem } from "./inventory";

export interface FilteredInventoryItem {
  item: InventoryItem;
  itemIdx: number;
}

export interface InventoryModalProps {
  minAmountFilter: number;

  setMinAmountFilter: Dispatch<SetStateAction<number>>;

  handleDeleteItem: (groupIndex: number, itemIndex: number) => void;

  handleToggleUnit: (groupIndex: number, itemIndex: number) => void;

  getFilteredItems: (
    items: InventoryGroup["items"],
    groupIndex: number,
  ) => FilteredInventoryItem[];

  setShowTextModal: Dispatch<SetStateAction<boolean>>;
}
