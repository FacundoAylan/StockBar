import { useState } from "react";
import InputCard from "./components/inputCard/InputCard";
import InventoryModal from "./components/csvReport/InventoryModal ";
import useInventoryAnalysis from "./hooks/useInventoryAnalysis";
import GmailPreviewModal from "./components/gmailPreviewModal/GmailPreviewModal";

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
        <GmailPreviewModal 
          setShowTextModal={setShowModal}
          generateGmailText={generateGmailText}
          copyToClipboard={copyToClipboard}
          copied={copied}
        />
      )}
    </main>
  );
};

export default Home;
