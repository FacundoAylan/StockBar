import { useState, type ChangeEvent } from "react";
import { csvToJson } from "../utils/csvParser";
import type { InventoryGroup } from "../../../types/inventory";

export function useFileParser() {
  const [jsonData, setJsonData] = useState<InventoryGroup[] | null>(null);
  const [fileName, setFileName] = useState<string>("");

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

  const resetFile = () => {
    setFileName("");
    setJsonData(null);
    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return {
    jsonData,
    setJsonData,
    fileName,
    handleFileChange,
    resetFile,
  };
}
