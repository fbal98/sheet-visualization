"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, X, File } from "lucide-react";
import * as XLSX from "xlsx";
import { ColumnHeaders } from "./ColumnHeaders";

interface ParsedFile {
  name: string;
  headers: string[];
}

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [parsedFiles, setParsedFiles] = useState<ParsedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const headers = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        })[0] as string[];
        setParsedFiles((prevParsedFiles) => [
          ...prevParsedFiles,
          { name: file.name, headers },
        ]);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setParsedFiles((prevParsedFiles) =>
      prevParsedFiles.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-gray-400"
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        {isDragActive ? (
          <p className="mt-2 text-sm text-gray-600">Drop the files here ...</p>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            Drag 'n' drop some Excel files here, or click to select files
          </p>
        )}
        <Button className="mt-4" variant="outline">
          Select Files
        </Button>

        {files.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Uploaded Files:
            </h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <File size={16} className="text-blue-500" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {parsedFiles.length > 0 && <ColumnHeaders parsedFiles={parsedFiles} />}
    </div>
  );
}
