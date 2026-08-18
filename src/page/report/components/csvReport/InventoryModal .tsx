import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryGroupCard } from "./CategoryGroupCard";
import useInventoryStore from "@/zustand/store/inventoryStore";
import type { InventoryModalProps } from "@/types/inventoryModal";
import { useReactToPrint } from "react-to-print";

const InventoryModal = ({
  minAmountFilter,
  setMinAmountFilter,
  handleDeleteItem,
  handleToggleUnit,
  getFilteredItems,
  setShowTextModal,
}: InventoryModalProps) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [showCosts, setShowCosts] = useState(true);

  const navigate = useNavigate();

  // Estado global
  const { jsonData, forceAllBtl, setForceAllBtl, isBar, fileName } = useInventoryStore();

  const toggleCosts = () => {
    setShowCosts((prev) => !prev);
  };

  const handleClose = () => {
    setForceAllBtl(false);
    navigate("/");
  };

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: fileName ? fileName.split("-")[0].trim() : "Bar",
  });

  useEffect(() => {
    if (!jsonData) {
      setForceAllBtl(false);
      navigate("/", { replace: true });
    }
  }, [jsonData, navigate, setForceAllBtl]);

  if (!jsonData) {
    return null;
  }

  return (
    <div className="w-full max-h-[470px] flex flex-col items-center justify-center p-2">
      <div className="relative w-full max-w-5xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-500">
        {/* Header y Acciones */}
        <div className="relative border-b border-sky-400/20 bg-[#060818]/95 px-4 py-2.5 backdrop-blur-md">
          <div className="flex flex-col items-center justify-between gap-2 pr-8 md:flex-row">
            {/* Título */}
            <h2 className="text-base font-black uppercase tracking-wider text-slate-300">
              Reporte de Inventario
            </h2>

            {/* Barra de acciones y filtros */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Filtro de Volumen */}
              {!forceAllBtl && (
                <select
                  id="amount-filter"
                  value={minAmountFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setMinAmountFilter(Number(e.target.value))
                  }
                  className="cursor-pointer rounded-lg border border-sky-400/25 bg-slate-900 px-2.5 py-1.5 text-xs font-bold text-sky-200 transition-all focus:border-sky-400/50 focus:outline-none focus:ring-1 focus:ring-sky-400/20"
                >
                  <option value={0} className="bg-[#060818] text-slate-100">
                    Filtrar: Todos
                  </option>
                  <option value={30} className="bg-[#060818] text-slate-100">
                    &gt; 30 ml
                  </option>
                  <option value={60} className="bg-[#060818] text-slate-100">
                    &gt; 60 ml
                  </option>
                </select>
              )}

              {/* Modo Edición */}
              <button
                type="button"
                onClick={() => setEditMode((prev) => !prev)}
                className={`flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                  editMode
                    ? "border-sky-300 bg-sky-400 text-[#060818] shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                    : "border-sky-400/25 bg-slate-900 text-sky-300 hover:border-sky-400/50 hover:bg-sky-500/10"
                }`}
              >
                {editMode ? "✓ Guardar" : "✏️ Editar"}
              </button>

              {/* Costos */}
              <button
                type="button"
                onClick={toggleCosts}
                className={`flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                  showCosts
                    ? "border-sky-400/40 bg-sky-500/10 text-sky-300"
                    : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                {showCosts ? "🚫 Costos" : "👁️ Costos"}
              </button>

              {/* Gmail */}
              <button
                type="button"
                onClick={() => setShowTextModal(true)}
                className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300 transition-all hover:border-sky-400/30 hover:bg-sky-500/5 hover:text-sky-200 active:scale-95"
              >
                ✉️ Gmail
              </button>

              {/* PDF */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100 active:scale-95"
              >
                📄 PDF
              </button>
            </div>
          </div>

          {/* Botón cerrar */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-2 top-2.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-red-500/40 bg-red-600 text-xs font-bold text-white transition-all hover:border-red-400 hover:bg-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] active:scale-95"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Contenido Imprimible y Escroleable */}
        <div
          ref={reportRef}
          id="report"
          className="flex-1 space-y-3 overflow-y-auto bg-white p-6"
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
      </div>
    </div>
  );
};

export default InventoryModal;
