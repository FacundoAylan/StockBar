import { useInventoryAnalysis } from "./hooks/useInventoryAnalysis";
import { CategoryGroupCard } from "./components/CategoryGroupCard";

export default function App() {
  const {
    jsonData,
    fileName,
    showModal,
    setShowModal,
    showTextModal,
    setShowTextModal,
    minAmountFilter,
    setMinAmountFilter,
    showNegative,
    setShowNegative,
    editMode,
    setEditMode,
    copied,
    handleFileChange,
    handleDeleteItem,
    getFilteredItems,
    generateGmailText,
    copyToClipboard,
  } = useInventoryAnalysis();

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 print:bg-white print:p-0 print:block print:min-h-0">
      {/* Carga CSV */}
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-6 text-center print:hidden">
        <h1 className="text-4xl font-extrabold tracking-tight text-red-500 uppercase">
          ¡Informes, afuera!
        </h1>
        <p className="text-neutral-400 text-sm">
          Carga tu reporte CSV para procesar el análisis de inventario.
        </p>

        <div className="w-full flex flex-col gap-3 items-center mt-2">
          <label
            htmlFor="file-upload"
            className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-600/30"
          >
            {fileName ? "Cambiar Archivo" : "Subir Archivo CSV"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {fileName && (
            <span className="text-xs text-neutral-400 truncate">
              📄 {fileName}
            </span>
          )}

          {jsonData && jsonData.length > 0 && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full mt-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Ver Informe Detallado
            </button>
          )}
        </div>
      </div>

      {/* Modal Principal de Informe */}
      {showModal && jsonData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print:static print:p-0 print:block">
          <div className="printable-modal relative w-full max-w-5xl max-h-[85vh] print:max-h-none print:max-w-none bg-white text-neutral-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden print:overflow-visible">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between p-6 border-b border-neutral-200 bg-neutral-50 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Reporte de Inventario
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Análisis unificado por unidad
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => setShowNegative(!showNegative)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    showNegative
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                      : "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200"
                  }`}
                >
                  {showNegative
                    ? "🟢 Ver Informe General / Sobrantes"
                    : "🔴 Ver Usados Negativos"}
                </button>

                <select
                  id="amount-filter"
                  value={minAmountFilter}
                  onChange={(e) => setMinAmountFilter(Number(e.target.value))}
                  className="bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 text-xs font-bold rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition-all"
                >
                  <option value={0}>Filtrar Volumen: Todos</option>
                  <option value={30}>Más de 30 ml</option>
                  <option value={60}>Más de 60 ml</option>
                </select>

                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    editMode
                      ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                      : "bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200"
                  }`}
                >
                  {editMode ? "✓ Guardar Cambios" : "✏️ Editar Ítems"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowTextModal(true)}
                  className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  ✉️ Copiar p/ Gmail
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  📄 PDF
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido Visual */}
            <div className="p-6 overflow-y-auto print:overflow-visible print:max-h-none space-y-6">
              {jsonData.map((group, groupIndex) => {
                const itemsFiltrados = getFilteredItems(
                  group.items,
                  groupIndex,
                );
                if (itemsFiltrados.length === 0) return null;

                return (
                  <CategoryGroupCard
                    key={groupIndex}
                    group={group}
                    groupIndex={groupIndex}
                    filteredItems={itemsFiltrados}
                    showNegative={showNegative}
                    editMode={editMode}
                    onDeleteItem={handleDeleteItem}
                  />
                );
              })}
            </div>

            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end print:hidden">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-neutral-800 hover:bg-neutral-900 text-white text-sm font-semibold rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gmail */}
      {showTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white text-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                ✉️ Resumen Redactado (
                {showNegative ? "Usados Negativos" : "General / Sobrantes"})
              </h3>
              <button
                type="button"
                onClick={() => setShowTextModal(false)}
                className="text-neutral-400 hover:text-neutral-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <textarea
              readOnly
              value={generateGmailText()}
              className="w-full h-72 p-4 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-neutral-800 focus:outline-none"
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-neutral-500">
                Texto listo para enviar excluyendo elementos eliminados.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowTextModal(false)}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {copied ? "✓ ¡Copiado!" : "📋 Copiar Texto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
