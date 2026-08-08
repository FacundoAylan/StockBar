interface GmailPreviewModalProps { 
  setShowTextModal: React.Dispatch<React.SetStateAction<boolean>>; 
  generateGmailText: () => string; 
  copyToClipboard: () => void; 
  copied: boolean; 
}

const GmailPreviewModal = ({
  setShowTextModal,
  generateGmailText,
  copyToClipboard,
  copied
}: GmailPreviewModalProps) => {
  return (
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
  )
};


export default GmailPreviewModal;