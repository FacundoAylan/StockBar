import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import useInventoryStore from "@/zustand/store/inventoryStore";

interface InputCardProps {
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputCard = ({
  handleFileChange,
}: InputCardProps) => {

  const navigate = useNavigate();

  const { jsonData, fileName, setIsBar, setForceAllBtl } = useInventoryStore();
  const resetFile = useInventoryStore((state) => state.resetFile);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const barSelected = value === "Bar";

    setIsBar(barSelected);
    setForceAllBtl(!barSelected);
  };

  const handleRemoveFile = () => {
    resetFile();

    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;

    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Glow celeste */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-[110px]" />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6 overflow-hidden rounded-2xl border border-white/10 border-t-white/20 border-l-white/20 bg-slate-900/50 p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        {/* Reflejo superior */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent" />

        {/* Header */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <h1 className="text-2xl font-black uppercase tracking-widest text-slate-300">
            Módulo de Reportes
          </h1>

          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400">
            Gestión de Inventario
          </p>
        </div>

        <div className="relative z-10 flex w-full flex-col items-center gap-4">
          {!fileName && (
            <>
              <p className="text-xs font-normal leading-relaxed text-slate-300 sm:text-sm">
                Cargue su archivo CSV para procesar el análisis detallado del
                inventario.
              </p>

              <label
                htmlFor="file-upload"
                className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-sky-400/30 bg-sky-500/10 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.06)] backdrop-blur-md transition-all hover:border-sky-400/50 hover:bg-sky-500/15 hover:shadow-[0_0_25px_rgba(56,189,248,0.12)] active:scale-[0.98]"
              >
                <span className="text-base">📂</span>
                <span>Subir Archivo CSV</span>
              </label>
            </>
          )}

          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {fileName && (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-400/20 bg-slate-950/50 px-4 py-2.5 backdrop-blur-md">
              <span className="text-sm">📄</span>

              <span className="max-w-[280px] truncate text-xs font-medium text-slate-200">
                {fileName}
              </span>
            </div>
          )}

          {jsonData && jsonData.length > 0 && (
            <div className="mt-1 flex w-full flex-col gap-3.5">
              {/* Tipo de establecimiento */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="ml-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                  Tipo de Establecimiento
                </label>

                <select
                  onChange={handleSelectChange}
                  className="w-full cursor-pointer rounded-xl border border-sky-400/20 bg-slate-950/70 px-4 py-3 text-xs font-medium text-slate-200 shadow-inner backdrop-blur-md transition-all focus:border-sky-400/50 focus:outline-none focus:ring-1 focus:ring-sky-400/20"
                >
                  <option className="bg-slate-950 text-slate-200">Bar</option>
                  <option className="bg-slate-950 text-slate-200">
                    Bonpix
                  </option>
                </select>
              </div>

              {/* Ver informe */}
              <button
                type="button"
                onClick={() => navigate("/report")}
                className="w-full cursor-pointer rounded-xl border border-sky-400/30 bg-sky-500/10 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.06)] backdrop-blur-md transition-all hover:border-sky-400/50 hover:bg-sky-500/15 hover:shadow-[0_0_25px_rgba(56,189,248,0.12)] active:scale-[0.98]"
              >
                Ver Informe Detallado
              </button>

              {/* Eliminar archivo */}
              <button
                type="button"
                onClick={handleRemoveFile}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-500 bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(220,38,38,0.15)] transition-all hover:border-red-400 hover:bg-red-500 hover:shadow-[0_0_22px_rgba(220,38,38,0.25)] active:scale-[0.98]"
              >
                <span>🗑️</span>
                <span>Eliminar Archivo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputCard;