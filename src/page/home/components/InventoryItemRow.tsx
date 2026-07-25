import React from "react";
import { analyzeItem } from "../utils/inventoryHelpers";
import type { InventoryItem } from "../../../types/inventory";

interface InventoryItemRowProps {
  item: InventoryItem;
  itemIdx: number;
  groupIndex: number;
  categoryName?: string;
  editMode: boolean;
  forceAllBtl?: boolean;
  onDeleteItem: (groupIndex: number, itemIndex: number) => void;
  onToggleUnit: (groupIndex: number, itemIndex: number) => void;
}

export const InventoryItemRow: React.FC<InventoryItemRowProps> = ({
  item,
  itemIdx,
  groupIndex,
  categoryName,
  editMode,
  forceAllBtl = false,
  onDeleteItem,
  onToggleUnit,
}) => {
  const {
    tieneDiferencia,
    esFaltante,
    signo,
    diffAmount,
    unit,
    prevNum,
    actNum,
    ventasStr,
    usoStr,
  } = analyzeItem(item, categoryName, forceAllBtl);

  return (
    <li className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2 px-2 rounded-lg avoid-break print:break-inside-avoid">
      <div className="flex flex-col">
        <span className="font-semibold text-neutral-800">
          {item.nombreArticulo}
        </span>
        <span className="text-xs text-neutral-500 mt-0.5">
          Previa:{" "}
          <strong className="text-neutral-700">
            {prevNum} {unit}
          </strong>{" "}
          | Actual:{" "}
          <strong className="text-neutral-700">
            {actNum} {unit}
          </strong>
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs">
        {/* 🎯 SOLO MOSTRAR SI REALMENTE HAY UNA DIFERENCIA DISTINTA DE 0 */}
        {tieneDiferencia && (
          <>
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
          </>
        )}

        <span className="text-neutral-500">
          Ventas: <strong className="text-neutral-700">{ventasStr}</strong>
        </span>
        <span className="text-neutral-500">
          Uso: <strong className="text-neutral-700">{usoStr}</strong>
        </span>

        {/* 🎯 BOTONES DE MODO EDICIÓN */}
        {editMode && (
          <div className="flex items-center gap-1.5 ml-2 print:hidden">
            {/* Botón para alternar unidad individual (Botella vs Caja/ml) */}
            <button
              type="button"
              onClick={() => onToggleUnit(groupIndex, itemIdx)}
              className="text-amber-700 hover:text-amber-900 font-bold bg-amber-50 hover:bg-amber-100 p-1.5 rounded-lg transition-colors border border-amber-200 cursor-pointer"
              title={`Unidad actual: ${unit}. Clic para alternar (btl ↔ ml)`}
            >
              {unit === "btl" ? "🍾" : "📦"}
            </button>

            {/* Botón Borrar */}
            <button
              type="button"
              onClick={() => onDeleteItem(groupIndex, itemIdx)}
              className="text-rose-500 hover:text-rose-700 font-bold bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition-colors border border-rose-200 cursor-pointer"
              title="Eliminar del reporte"
            >
              🗑️ Borrar
            </button>
          </div>
        )}
      </div>
    </li>
  );
};
