import React, { useState } from "react";
import { InventoryItemRow } from "./InventoryItemRow";
import type { InventoryGroup } from "@/types/inventory";

interface CategoryGroupCardProps {
  group: InventoryGroup;
  groupIndex: number;
  filteredItems: Array<{ item: InventoryGroup["items"][0]; itemIdx: number }>;
  showNegative?: boolean;
  showCosts: boolean;
  editMode: boolean;
  forceAllBtl?: boolean;
  onDeleteItem: (groupIndex: number, itemIndex: number) => void;
  onToggleUnit: (groupIndex: number, itemIndex: number) => void;
  isBar: boolean;
}

type UnitType = "btls" | "un" | "ml" | "L" | null;

export const CategoryGroupCard: React.FC<CategoryGroupCardProps> = ({
  group,
  groupIndex,
  filteredItems,
  showCosts,
  editMode,
  forceAllBtl = false,
  onDeleteItem,
  onToggleUnit,
  isBar,
}) => {
  // Estado local para alternar la visibilidad/tipo de unidad
  const [activeUnit, setActiveUnit] = useState<UnitType>(null);

  // Determinar la unidad por defecto según la categoría del grupo
  const getDefaultUnit = (catName?: string): UnitType => {
    const category = (catName ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const unitCategories = [
      "cafe",
      "cafes",
      "coffee",
      "cafeteria",
      "infusion",
      "infusiones",
      "desayuno",
      "desayunos",
      "caliente",
      "calientes",
    ];

    const mlCategories = ["vermouth", "vermut"];

    if (unitCategories.some((name) => category.includes(name))) return "un";
    if (mlCategories.some((name) => category.includes(name))) return "ml";
    if (category.includes("keg")) return "L";
    return "btls";
  };

  // Ciclo para alternar las unidades al presionar la variación
  const toggleUnitOnClick = () => {
    if (!activeUnit) {
      setActiveUnit(getDefaultUnit(group.categoria));
    } else {
      const units: UnitType[] = ["btls", "un", "ml", "L", null];
      const nextIndex = (units.indexOf(activeUnit) + 1) % units.length;
      setActiveUnit(units[nextIndex]);
    }
  };

  // Helper para extraer solo el número limpiando texto previo
  const getOnlyNumber = (text?: string | null) => {
    if (!text) return "0";
    const match = text.trim().match(/-?\d+([.,]\d+)?/);
    return match ? match[0] : text.trim();
  };

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

  // 2. VARIACIÓN / DIFERENCIA
  const renderVarianceBadge = (diferencia?: string | null) => {
    if (!diferencia || diferencia.trim() === "0") return null;

    const numValue = getOnlyNumber(diferencia);
    const esNegativo = numValue.includes("-");

    // Formatear valor: con o sin unidad dependiendo de `activeUnit`
    let formattedDiff = activeUnit ? `${numValue} ${activeUnit}` : numValue;

    // Agregar signo +
    if (!formattedDiff.startsWith("+") && !formattedDiff.startsWith("-")) {
      formattedDiff = `+${formattedDiff}`;
    }

    return (
      <button
        type="button"
        onClick={toggleUnitOnClick}
        className={`text-xs font-bold px-3 py-1 rounded-full border transition-all transform active:scale-95 cursor-pointer ${
          esNegativo
            ? "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200"
            : "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
        }`}
      >
        Variación {formattedDiff}
      </button>
    );
  };

  // 3. IMPACTO DE COSTO
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

  // Formatear existencia para agregarle la unidad activa
  const formatExistencia = (val?: string | null) => {
    const rawNum = getOnlyNumber(val);
    return activeUnit ? `${rawNum} ${activeUnit}` : rawNum;
  };

  return (
    <div className="border border-neutral-200 rounded-xl p-5 bg-neutral-50/50 hover:bg-neutral-50 transition-colors shadow-sm mb-6">
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
              {isBar ? "Exist. Previa: " : "Stock teórico: "}
              <strong className="text-neutral-900 bg-neutral-200 px-1.5 py-0.5 rounded transition-all">
                {formatExistencia(group.existenciaPrevia)}
              </strong>
            </span>

            <span>•</span>

            <span>
              {isBar ? "Exist. Actual: " : "Conteo: "}
              <strong className="text-neutral-900 bg-neutral-200 px-1.5 py-0.5 rounded transition-all">
                {formatExistencia(group.existencia)}
              </strong>
            </span>
          </div>
        </div>

        {/* 🎯 MÉTRICAS Y BADGES DE LA CATEGORÍA */}
        <div className="flex items-center gap-2 flex-wrap">
          {renderVarianceBadge(group.diferencia)}
          {renderPercentageBadge(group.porcentajeDiferencia)}
          {showCosts && renderCostImpactBadge(group.diferenciaCosto)}
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
            forceAllBtl={forceAllBtl}
            onDeleteItem={onDeleteItem}
            onToggleUnit={onToggleUnit}
            renderPercentageBadge={renderPercentageBadge}
            isBar={isBar}
          />
        ))}
      </ul>
    </div>
  );
};
