"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, X, File } from "lucide-react";
import * as XLSX from "xlsx";
import { ColumnMapping } from "./ColumnMapping";
import { useRouter } from "next/navigation";

interface ParsedFile {
  name: string;
  data: Record<string, any>[];
}

// Helper function to convert Excel serial date to JS Date
function excelDateToJSDate(serial: number): Date {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate()
  );
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [parsedFiles, setParsedFiles] = useState<ParsedFile[]>([]);
  const [mergedData, setMergedData] = useState<Record<string, any>[]>([]);
  const [allColumns, setAllColumns] = useState<string[]>([]);
  const [showMapping, setShowMapping] = useState(false);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          dateNF: "yyyy-mm-dd",
        }) as Record<string, any>[];

        // Convert potential date values
        const processedData = jsonData.map((row) => {
          const newRow: Record<string, any> = {};
          Object.entries(row).forEach(([key, value]) => {
            if (typeof value === "number" && value > 25569 && value < 2958466) {
              // Likely a date
              newRow[key] = formatDate(excelDateToJSDate(value));
            } else {
              newRow[key] = value;
            }
          });
          return newRow;
        });

        setParsedFiles((prevParsedFiles) => [
          ...prevParsedFiles,
          { name: file.name, data: processedData },
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

  const mergeFiles = () => {
    const allData = parsedFiles.flatMap((file) => file.data);
    const columns = Array.from(
      new Set(allData.flatMap((row) => Object.keys(row)))
    );

    const merged = allData.map((row) => {
      const newRow: Record<string, any> = {};
      columns.forEach((col) => {
        newRow[col] = row[col] !== undefined ? row[col] : null;
      });
      return newRow;
    });

    setMergedData(merged);
    setAllColumns(columns);
    setShowMapping(true);
  };

  const handleMappingComplete = (finalData: Record<string, any>[]) => {
    // Store the merged data in localStorage (or you could use a state management solution like Redux)
    localStorage.setItem("mergedData", JSON.stringify(finalData));
    router.push("/merged-data");
  };

  return (
    <div className="space-y-4">
      {!showMapping ? (
        <>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-gray-400"
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            {isDragActive ? (
              <p className="mt-2 text-sm text-gray-600">
                Drop the files here ...
              </p>
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
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
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
          {parsedFiles.length > 0 && (
            <Button onClick={mergeFiles} className="mt-4">
              Merge Files and View Columns
            </Button>
          )}
        </>
      ) : (
        <ColumnMapping
          mergedData={mergedData}
          allColumns={allColumns}
          onMappingComplete={handleMappingComplete}
        />
      )}
    </div>
  );
}
