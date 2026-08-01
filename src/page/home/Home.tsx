import { useState } from "react";
import InputCard from "./components/inputCard/InputCard";
import InventoryModal from "./components/csvReport/InventoryModal ";
import useInventoryAnalysis from "./hooks/useInventoryAnalysis";

const Home = () => {
  
  //Para saber si es un bar o un bonprix
  const[isBar, setIsBar] = useState(true);

  const {
    jsonData,
    showModal,
    setShowModal,
    showTextModal,
    setShowTextModal,
    copied,
    fileName,
    handleFileChange,
    handleRemoveFile,
    generateGmailText,
    copyToClipboard,
    minAmountFilter,
    setMinAmountFilter,
    editMode,
    setEditMode,
    handleDeleteItem,
    handleToggleUnit,
    getFilteredItems,
    showCosts,
    toggleCosts,
    forceAllBtl,
    toggleForceAllBtl,
  } = useInventoryAnalysis(isBar);


  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 print:bg-white print:p-0 print:block print:min-h-0">
      {/* Carga CSV (Tarjeta Inicial) */}
      <InputCard
        jsonData={jsonData}
        fileName={fileName}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        setIsBar={setIsBar}
        setShowModal={setShowModal}
        setForceAllBtl={toggleForceAllBtl}
      />

      {/* Modal Principal de Informe */}
      {showModal && jsonData && (
        <InventoryModal
          jsonData={jsonData}
          setShowModal={setShowModal}
          setShowTextModal={setShowTextModal}
          minAmountFilter={minAmountFilter}
          setMinAmountFilter={setMinAmountFilter}
          editMode={editMode}
          setEditMode={setEditMode}
          handleDeleteItem={handleDeleteItem}
          handleToggleUnit={handleToggleUnit}
          getFilteredItems={getFilteredItems}
          showCosts={showCosts}
          toggleCosts={toggleCosts}
          forceAllBtl={forceAllBtl}
          toggleForceAllBtl={toggleForceAllBtl}
          isBar={isBar}
        />
      )}

      {/* Modal Gmail */}
      {showTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white text-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                ✉️ Resumen Redactado
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
};

export default Home;
