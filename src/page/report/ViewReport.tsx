import { useState } from "react"
import InventoryModal from "./components/csvReport/InventoryModal "
import GmailPreviewModal from "./components/gmailPreviewModal/GmailPreviewModal";

const ViewReport = ()=>{

  const [showTextModal, setShowTextModal] = useState(false);

    return (
      <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 print:bg-white print:text-black print:block print:p-0 print:min-h-0">
        <InventoryModal setShowTextModal={setShowTextModal} />

        {showTextModal && (
          <GmailPreviewModal setShowTextModal={setShowTextModal} />
        )}
      </main>
    );
};

export default ViewReport;