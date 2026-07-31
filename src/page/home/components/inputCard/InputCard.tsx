import type { ChangeEvent } from "react";
import type { InventoryGroup } from "../../../../types/inventory";

interface InputCardProps {
  jsonData: InventoryGroup[] | null;
  fileName: string;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  setIsBar: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setForceAllBtl: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InputCard = ({
  jsonData,
  fileName,
  handleFileChange,
  handleRemoveFile,
  setIsBar,
  setShowModal,
  setForceAllBtl,
}: InputCardProps) => {
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const barSelected = value === "Bar";

    setIsBar(barSelected);
    setForceAllBtl(!barSelected);
  };

  return (
    <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-6 text-center print:hidden">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-100 uppercase">
        Módulo de Reportes
      </h1>

      <div className="w-full flex flex-col gap-4 items-center mt-2">
        {!fileName && (
          <>
            <p className="text-neutral-400 text-sm">
              Cargue su archivo CSV para procesar el análisis detallado del
              inventario.
            </p>
            <label
              htmlFor="file-upload"
              className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-600/30"
            >
              📂 Subir Archivo CSV
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
          <span className="text-xs text-neutral-400 truncate">
            📄 {fileName}
          </span>
        )}

        {jsonData && jsonData.length > 0 && (
          <div className="flex flex-col gap-3 w-full">
            <label className="text-sm font-semibold text-neutral-300">
              Selecciona si es un bar o un bonpix
            </label>
            <select
              onChange={handleSelectChange}
              className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-200 shadow-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option>Bar</option>
              <option>Bonpix</option>
            </select>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Ver Informe Detallado
            </button>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="w-full py-3 px-6 bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-rose-100 font-bold rounded-xl border border-rose-800/50 cursor-pointer flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              🗑️ Eliminar Archivo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputCard;