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
  renderPercentageBadge?: (
    porcentaje?: string | number | null,
  ) => React.ReactNode;
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
  renderPercentageBadge,
}) => {
  const {
    tieneDiferencia,
    esFaltante,
    signo,
    diffAmount,
    unit,
    ventasStr,
    usoStr,
  } = analyzeItem(item, categoryName, forceAllBtl);

  return (
    <li className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2 px-2 rounded-lg avoid-break print:break-inside-avoid hover:bg-neutral-100/50 transition-colors">
      {/* 🎯 NOMBRE DEL ARTÍCULO + VENDIDO Y USADO */}
      <div className="flex flex-col">
        <span className="font-semibold text-neutral-800">
          {item.nombreArticulo}
        </span>
        <span className="text-xs text-neutral-500 mt-0.5">
          Vendido: <strong className="text-neutral-700">{ventasStr}</strong> |
          Usado: <strong className="text-neutral-700">{usoStr}</strong>
        </span>
      </div>

      <div className="flex items-center gap-2.5 text-xs flex-wrap">
        {/* 🎯 FALTANTE / SOBRANTE + % DIFERENCIA AL LADO */}
        {tieneDiferencia && (
          <div className="flex items-center gap-1.5">
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

            {/* 🎯 % Diferencia ubicado al lado del Faltante/Sobrante */}
            {renderPercentageBadge &&
              renderPercentageBadge(item.porcentajeDiferencia)}
          </div>
        )}

        {/* 🎯 BOTONES DE MODO EDICIÓN */}
        {editMode && (
          <div className="flex items-center gap-1.5 ml-2 print:hidden">
            <button
              type="button"
              onClick={() => onToggleUnit(groupIndex, itemIdx)}
              className="text-amber-700 hover:text-amber-900 font-bold bg-amber-50 hover:bg-amber-100 p-1.5 rounded-lg transition-colors border border-amber-200 cursor-pointer text-xs flex items-center gap-1"
              title={`Unidad actual: ${unit}. Clic para cambiar.`}
            >
              {unit === "ml" && " Cambiar a Btl"}
              {unit === "btl" && " Cambiar a L"}
              {unit === "L" && " Cambiar a Unidad"}
              {unit === "un" && " Cambiar a ml"}
            </button>

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
