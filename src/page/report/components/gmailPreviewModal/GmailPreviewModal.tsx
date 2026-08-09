import type { Dispatch, SetStateAction } from "react";

import useGmailReport from "../../hooks/useGmailReport";
import useInventoryFilters from "../../hooks/useInventoryFilters";
import useInventoryStore from "../../../../zustand/store/inventoryStore";

interface GmailPreviewModalProps {
  setShowTextModal: Dispatch<SetStateAction<boolean>>;
}

const GmailPreviewModal = ({ setShowTextModal }: GmailPreviewModalProps) => {

 const { jsonData } = useInventoryStore();

 const { getFilteredItems } = useInventoryFilters(jsonData);

  const { generateGmailText, copyToClipboard, copied } = useGmailReport({
    getFilteredItems,
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-800">
            ✉️ Resumen Redactado
          </h2>

          <button
            type="button"
            onClick={() => setShowTextModal(false)}
            className="text-neutral-400 hover:text-neutral-600 font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5">
          <textarea
            readOnly
            value={generateGmailText()}
            className="w-full h-72 p-4 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-neutral-800 focus:outline-none"
          />

          <div className="flex justify-between items-center pt-4">
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
    </div>
  );
};

export default GmailPreviewModal;
