import { useState } from "react"
import InventoryModal from "./components/csvReport/InventoryModal "
import GmailPreviewModal from "./components/gmailPreviewModal/GmailPreviewModal";
import useInventoryAnalysis from "./hooks/useInventoryAnalysis";

const ViewReport = () => {

  const [showTextModal, setShowTextModal] = useState(false);

  // Lógica del reporte
  const {
    minAmountFilter,
    setMinAmountFilter,
    handleDeleteItem,
    handleToggleUnit,
    getFilteredItems,
  } = useInventoryAnalysis();

  return (
    <main className="w-full h-full max-h-full overflow-hidden text-white flex flex-col items-center justify-start p-1 print:bg-white print:text-black print:block print:p-0 print:m-0 print:w-full print:h-auto print:max-h-none print:overflow-visible">
      <InventoryModal
        minAmountFilter={minAmountFilter}
        setMinAmountFilter={setMinAmountFilter}
        handleDeleteItem={handleDeleteItem}
        handleToggleUnit={handleToggleUnit}
        getFilteredItems={getFilteredItems}
        setShowTextModal={setShowTextModal}
      />

      {showTextModal && (
        <GmailPreviewModal
          getFilteredItems={getFilteredItems}
          setShowTextModal={setShowTextModal}
        />
      )}
    </main>
  );
};;

export default ViewReport;