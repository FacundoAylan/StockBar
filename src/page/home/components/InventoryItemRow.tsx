import React from "react";
import { analyzeItem } from "../utils/inventoryHelpers";
import type { InventoryItem } from "../../../types/inventory";

interface InventoryItemRowProps {
  item: InventoryItem;
  itemIdx: number;
  groupIndex: number;
  editMode: boolean;
  onDeleteItem: (groupIndex: number, itemIndex: number) => void;
}

export const InventoryItemRow: React.FC<InventoryItemRowProps> = ({
  item,
  itemIdx,
  groupIndex,
  editMode,
  onDeleteItem,
}) => {
  const {
    esFaltante,
    signo,
    diffAmount,
    unit,
    prevNum,
    actNum,
    ventasStr,
    usoStr,
  } = analyzeItem(item);

  return (
    <li className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2 px-2 rounded-lg">
      <div className="flex flex-col">
        <span className="font-semibold text-neutral-800">
          {item.nombreArticulo}
        </span>
        <span className="text-xs text-neutral-500 mt-0.5">
          Exist. Previa:{" "}
          <strong className="text-neutral-700">
            {prevNum} {unit}
          </strong>{" "}
          | Exist. Actual:{" "}
          <strong className="text-neutral-700">
            {actNum} {unit}
          </strong>
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <span
          className={`font-bold px-2.5 py-1 rounded-md border ${
            esFaltante
              ? "text-rose-700 bg-rose-50 border-rose-200"
              : "text-emerald-700 bg-emerald-50 border-emerald-200"
          }`}
        >
          {esFaltante ? "Faltan" : "Sobran"} {signo}
          {diffAmount} {unit}
        </span>

        <span className="text-neutral-300">|</span>
        <span className="text-neutral-500">
          Ventas: <strong className="text-neutral-700">{ventasStr}</strong>
        </span>
        <span className="text-neutral-500">
          Uso: <strong className="text-neutral-700">{usoStr}</strong>
        </span>

        {editMode && (
          <button
            type="button"
            onClick={() => onDeleteItem(groupIndex, itemIdx)}
            className="ml-2 text-rose-500 hover:text-rose-700 font-bold bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition-colors border border-rose-200 cursor-pointer"
            title="Eliminar del reporte"
          >
            🗑️ Borrar
          </button>
        )}
      </div>
    </li>
  );
};
