import type { ChangeEvent } from "react";
import useInventoryStore from "@/zustand/store/inventoryStore";
import { csvToJson } from "@/page/report/utils/csvParser";

const useFileParser = () => {
  const setJsonData = useInventoryStore((state) => state.setJsonData);
  const setFileName = useInventoryStore((state) => state.setFileName);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();

    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFileName(selectedFile.name);

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      const jsonResult = csvToJson(text);

      setJsonData(jsonResult);
    };

    reader.readAsText(selectedFile);
  };

  return {
    handleFileChange,
  };
};

export default useFileParser;
