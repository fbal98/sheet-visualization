"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ColumnMappingProps {
  mergedData: Record<string, any>[];
  allColumns: string[];
  onMappingComplete: (finalData: Record<string, any>[]) => void;
}

export function ColumnMapping({
  mergedData,
  allColumns,
  onMappingComplete,
}: ColumnMappingProps) {
  const [columnNames, setColumnNames] = useState<Record<string, string>>(
    Object.fromEntries(allColumns.map((col) => [col, col]))
  );
  const [updatedData, setUpdatedData] = useState(mergedData);

  useEffect(() => {
    updateMergedData();
  }, [columnNames]);

  const handleRename = (originalName: string, newName: string) => {
    setColumnNames((prev) => ({ ...prev, [originalName]: newName }));
  };

  const updateMergedData = () => {
    const newData = updatedData.map((row) => {
      const newRow: Record<string, any> = {};
      Object.entries(columnNames).forEach(([originalName, newName]) => {
        if (newName in newRow) {
          newRow[newName] = row[originalName] || newRow[newName];
        } else {
          newRow[newName] = row[originalName];
        }
      });
      return newRow;
    });
    setUpdatedData(newData);
  };

  const handleConfirm = () => {
    onMappingComplete(updatedData);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Column Mapping and Merging
      </h2>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Original Column Name</TableHead>
              <TableHead>New Column Name</TableHead>
              <TableHead>Sample Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allColumns.map((column) => (
              <TableRow key={column}>
                <TableCell>{column}</TableCell>
                <TableCell>
                  <Input
                    value={columnNames[column]}
                    onChange={(e) => handleRename(column, e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  {updatedData[0] && updatedData[0][columnNames[column]]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Preview and Confirm</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Final Dataset Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.values(columnNames).map((col, index) => (
                    <TableHead key={index}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {updatedData.slice(0, 10).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Object.values(columnNames).map((col, colIndex) => (
                      <TableCell key={colIndex}>{row[col]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={handleConfirm} className="mt-4">
            Confirm and Proceed
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
