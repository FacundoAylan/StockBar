import React from "react";
import { InventoryItemRow } from "./InventoryItemRow";
import type { InventoryGroup } from "../../../types/inventory";

interface CategoryGroupCardProps {
  group: InventoryGroup;
  groupIndex: number;
  filteredItems: Array<{ item: InventoryGroup["items"][0]; itemIdx: number }>;
  showNegative?: boolean;
  showCosts: boolean;
  editMode: boolean;
  onDeleteItem: (groupIndex: number, itemIndex: number) => void;
}

export const CategoryGroupCard: React.FC<CategoryGroupCardProps> = ({
  group,
  groupIndex,
  filteredItems,
  showCosts,
  editMode,
  onDeleteItem,
}) => {
  // 1. % DIFERENCIA
  const renderPercentageBadge = (porcentaje?: string | number | null) => {
    if (porcentaje === undefined || porcentaje === null || porcentaje === "")
      return null;

    const pctStr = String(porcentaje).replace("%", "").trim();
    const pctNum = parseFloat(pctStr);

    if (isNaN(pctNum) || pctNum === 0) return null;

    const esNegativo = pctNum < 0;

    return (
      <span
        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
          esNegativo
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}
      >
        % Diferencia {esNegativo ? "" : "+"}
        {pctNum}%
      </span>
    );
  };

  // 2. VARIACIÓN / DIFERENCIA (Acepta undefined)
  const renderVarianceBadge = (diferencia?: string | null) => {
    if (!diferencia || diferencia === "0") return null;
    const cleanDiff = diferencia.trim();
    const esNegativo = cleanDiff.includes("-");

    return (
      <span
        className={`text-xs font-bold px-3 py-1 rounded-full border ${
          esNegativo
            ? "bg-rose-100 text-rose-800 border-rose-200"
            : "bg-emerald-100 text-emerald-800 border-emerald-200"
        }`}
      >
        Variación{" "}
        {cleanDiff.startsWith("+") || cleanDiff.startsWith("-")
          ? cleanDiff
          : `+${cleanDiff}`}
      </span>
    );
  };

  // 3. IMPACTO DE COSTO (Acepta undefined)
  const renderCostImpactBadge = (diferenciaCosto?: string | null) => {
    if (!diferenciaCosto) return null;
    const isNeg = diferenciaCosto.includes("-");
    const isPos = diferenciaCosto.includes("+");

    let style = "bg-slate-100 text-slate-800 border-slate-300";
    if (isNeg) style = "bg-rose-100 text-rose-900 border-rose-300";
    else if (isPos)
      style = "bg-emerald-100 text-emerald-900 border-emerald-300";

    return (
      <span
        className={`text-xs font-extrabold px-3 py-1 rounded-xl border shadow-sm flex items-center gap-1.5 ${style}`}
      >
        <span className="opacity-70">Impacto:</span>
        <span className="font-mono">{diferenciaCosto}</span>
      </span>
    );
  };

  return (
    <div className="border border-neutral-200 rounded-xl p-5 bg-neutral-50/50 hover:bg-neutral-50 transition-colors shadow-sm avoid-break print:break-inside-avoid">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{group.icono}</span>
            <h3 className="text-lg font-extrabold text-neutral-800 uppercase tracking-wide">
              {group.categoria}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-600 mt-1 pl-8 font-medium">
            <span>
              Exist. Previa:{" "}
              <strong className="text-neutral-900 bg-neutral-200 px-1.5 py-0.5 rounded">
                {group.existenciaPrevia || "0"}
              </strong>
            </span>
            <span>•</span>
            <span>
              Exist. Actual:{" "}
              <strong className="text-neutral-900 bg-neutral-200 px-1.5 py-0.5 rounded">
                {group.existencia || "0"}
              </strong>
            </span>
          </div>
        </div>

        {/* 🎯 MÉTRICAS Y BADGES JUNTOS EN UN SOLO LUGAR */}
        <div className="flex items-center gap-2 flex-wrap">
          {showCosts && renderCostImpactBadge(group.diferenciaCosto)}
          {renderVarianceBadge(group.diferencia)}
          {renderPercentageBadge(group.porcentajeDiferencia)}
        </div>
      </div>

      <ul className="divide-y divide-neutral-200/60">
        {filteredItems.map(({ item, itemIdx }) => (
          <InventoryItemRow
            key={itemIdx}
            item={item}
            itemIdx={itemIdx}
            groupIndex={groupIndex}
            categoryName={group.categoria}
            editMode={editMode}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
};
