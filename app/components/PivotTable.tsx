"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PivotTableProps {
  data: Record<string, any>[];
}

type DateGrouping = "none" | "month" | "year";

export function PivotTable({ data }: PivotTableProps) {
  const [rowField, setRowField] = useState<string>("");
  const [columnField, setColumnField] = useState<string>("");
  const [valueField, setValueField] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [dateGrouping, setDateGrouping] = useState<DateGrouping>("none");
  const [showWorkingDays, setShowWorkingDays] = useState(false);

  const columns = Object.keys(data[0] || {});

  const pivotData = useMemo(() => {
    if (!rowField || !columnField || !valueField) return null;

    const filteredData = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );

    const pivot: Record<string, Record<string, number>> = {};
    const columnValues = new Set<string>();

    filteredData.forEach((row) => {
      let rowKey = String(row[rowField]);
      let colKey = String(row[columnField]);

      // Apply date grouping if the column field is a date
      if (columnField === "Date" && dateGrouping !== "none") {
        const date = new Date(colKey);
        colKey =
          dateGrouping === "month"
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                2,
                "0"
              )}`
            : date.getFullYear().toString();
      }

      let value = Number(row[valueField]) || 0;

      // Convert hours to working days if option is selected
      if (showWorkingDays && valueField.toLowerCase().includes("hours")) {
        value /= 8;
      }

      if (!pivot[rowKey]) pivot[rowKey] = {};
      if (!pivot[rowKey][colKey]) pivot[rowKey][colKey] = 0;

      pivot[rowKey][colKey] += value;
      columnValues.add(colKey);
    });

    return { pivot, columnValues: Array.from(columnValues) };
  }, [
    data,
    rowField,
    columnField,
    valueField,
    filter,
    dateGrouping,
    showWorkingDays,
  ]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Pivot Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Select value={rowField} onValueChange={setRowField}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Row Field" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column} value={column}>
                  {column}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={columnField} onValueChange={setColumnField}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Column Field" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column} value={column}>
                  {column}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={valueField} onValueChange={setValueField}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Value Field" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column} value={column}>
                  {column}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-4 mb-4">
          {columnField === "Date" && (
            <Select
              value={dateGrouping}
              onValueChange={(value: DateGrouping) => setDateGrouping(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date Grouping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Grouping</SelectItem>
                <SelectItem value="month">Group by Month</SelectItem>
                <SelectItem value="year">Group by Year</SelectItem>
              </SelectContent>
            </Select>
          )}
          {valueField.toLowerCase().includes("hours") && (
            <div className="flex items-center space-x-2">
              <Switch
                id="working-days"
                checked={showWorkingDays}
                onCheckedChange={setShowWorkingDays}
              />
              <Label htmlFor="working-days">Show as Working Days</Label>
            </div>
          )}
        </div>
        <Input
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4"
        />
        {pivotData && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{rowField}</TableHead>
                {pivotData.columnValues.map((colValue) => (
                  <TableHead key={colValue}>{colValue}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(pivotData.pivot).map(([rowValue, rowData]) => (
                <TableRow key={rowValue}>
                  <TableCell>{rowValue}</TableCell>
                  {pivotData.columnValues.map((colValue) => (
                    <TableCell key={colValue}>
                      {rowData[colValue]?.toFixed(2) || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
