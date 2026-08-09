import { useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

import { CategoryGroupCard } from "./CategoryGroupCard";
import useInventoryStore from "../../../../zustand/store/inventoryStore";
import useInventoryAnalysis from "../../hooks/useInventoryAnalysis";

interface InventoryModalProps {
  setShowTextModal: Dispatch<SetStateAction<boolean>>;
}

const InventoryModal = ({ setShowTextModal }: InventoryModalProps) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [showCosts, setShowCosts] = useState(true);

  const navigate = useNavigate();

  // Estado global
  const { jsonData, forceAllBtl, isBar } = useInventoryStore();

  // Lógica del reporte
  const {
    minAmountFilter,
    setMinAmountFilter,
    handleDeleteItem,
    handleToggleUnit,
    getFilteredItems,
    toggleForceAllBtl,
  } = useInventoryAnalysis();

  const toggleCosts = () => {
    setShowCosts((prev) => !prev);
  };

  if (!jsonData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 print:static print:inset-auto print:block print:bg-transparent print:p-0">
      <div className="w-full max-w-5xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col print:max-w-none print:max-h-none print:rounded-none print:shadow-none print:overflow-visible print:block">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 bg-white flex justify-between items-center">
          <h2 className="text-xl font-bold text-neutral-800">
            Reporte de Inventario
          </h2>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            {/* Forzar botellas */}
            <button
              type="button"
              onClick={toggleForceAllBtl}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                forceAllBtl
                  ? "bg-amber-500 text-white border-amber-600 shadow-amber-500/20"
                  : "bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200"
              }`}
            >
              🍾 {forceAllBtl ? "Mostrar en unidades" : "Mostrar en botellas"}
            </button>

            {/* Filtro de volumen */}
            {!forceAllBtl && (
              <select
                id="amount-filter"
                value={minAmountFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setMinAmountFilter(Number(e.target.value))
                }
                className="bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 text-xs font-bold rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition-all"
              >
                <option value={0}>Filtrar Volumen: Todos</option>
                <option value={30}>Más de 30 ml</option>
                <option value={60}>Más de 60 ml</option>
              </select>
            )}

            {/* Modo edición */}
            <button
              type="button"
              onClick={() => setEditMode((prev) => !prev)}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                editMode
                  ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                  : "bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200"
              }`}
            >
              {editMode ? "✓ Guardar Cambios" : "✏️ Editar Ítems"}
            </button>

            {/* Costos */}
            <button
              type="button"
              onClick={toggleCosts}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer shadow-sm ${
                showCosts
                  ? "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
                  : "bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200"
              }`}
            >
              {showCosts ? "💰 Ocultar Costos" : "👁️ Mostrar Costos"}
            </button>

            {/* Gmail */}
            <button
              type="button"
              onClick={() => setShowTextModal(true)}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              ✉️ Copiar p/ Gmail
            </button>

            {/* PDF */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              📄 PDF
            </button>

            {/* Cerrar */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div
          ref={reportRef}
          className="p-6 overflow-y-auto print:overflow-visible print:max-h-none space-y-6 bg-white"
        >
          {jsonData.map((group, groupIndex) => {
            const itemsFiltrados = getFilteredItems(group.items, groupIndex);

            if (itemsFiltrados.length === 0) {
              return null;
            }

            return (
              <CategoryGroupCard
                key={groupIndex}
                group={group}
                groupIndex={groupIndex}
                filteredItems={itemsFiltrados}
                showCosts={showCosts}
                editMode={editMode}
                forceAllBtl={forceAllBtl}
                onDeleteItem={handleDeleteItem}
                onToggleUnit={handleToggleUnit}
                isBar={isBar}
              />
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end print:hidden">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-900 text-white text-sm font-semibold rounded-lg cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
