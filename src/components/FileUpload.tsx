import { useState, useRef, useCallback } from "react";
import type { DragEvent } from "react";
import { FileArrowUpIcon, FileTextIcon } from "@phosphor-icons/react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  disabled: boolean;
}

const FileUpload = ({ onFileSelected, disabled }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".txt")) {
        alert("Please upload a .txt file");
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected],
  );

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile],
  );

  const handleBrowse = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile],
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-2xl p-14 text-center transition-all duration-300 animate-fade-in-up
        ${disabled ? "opacity-50 cursor-not-allowed border-gray-300 bg-gray-50" : ""}
        ${isDragging && !disabled ? "border-amway-dark bg-amway-light/60 scale-[1.02] shadow-lg" : ""}
        ${!isDragging && !disabled ? "border-amway-dark/30 bg-white hover:border-amway-dark/50 hover:bg-amway-light/10 hover:shadow-sm" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        className={`mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300 ${isDragging ? "bg-amway-dark/10" : "bg-amway-light"}`}
      >
        <FileArrowUpIcon
          className={`w-8 h-8 transition-colors duration-300 ${isDragging ? "text-amway-dark" : "text-amway-dark/50"}`}
          weight="duotone"
        />
      </div>

      <p className="text-body-amway text-lg font-medium mb-1">
        {isDragging ? "Drop your file here" : "Drag and drop your transcript"}
      </p>
      <p className="text-gray-400 text-sm mb-6">or browse from your computer</p>
      <button
        onClick={handleBrowse}
        disabled={disabled}
        className="btn-amway-primary"
      >
        Browse Files
      </button>
      <div className="flex items-center justify-center gap-2 mt-5">
        <FileTextIcon className="w-3.5 h-3.5 text-gray-300" />
        <span className="text-gray-400 text-xs">Supports .txt files</span>
      </div>
    </div>
  );
};

export default FileUpload;
