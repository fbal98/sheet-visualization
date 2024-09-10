"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  AreaChart,
  BarChart,
  PieChart,
  ScatterChart,
  Line,
  Area,
  Bar,
  Pie,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface ChartsProps {
  data: Record<string, any>[];
}

type ChartType =
  | "line"
  | "area"
  | "groupedBar"
  | "stackedBar"
  | "bar"
  | "pie"
  | "donut"
  | "bubble";

type DateGrouping = "day" | "month" | "year";

function parseDate(dateString: string): Date {
  // First, try parsing as ISO date
  let date = new Date(dateString);
  if (!isNaN(date.getTime())) return date;

  // If that fails, try parsing as Excel serial number
  const excelSerialNumber = parseInt(dateString, 10);
  if (!isNaN(excelSerialNumber)) {
    date = new Date((excelSerialNumber - 25569) * 86400 * 1000);
    if (!isNaN(date.getTime())) return date;
  }

  // If all else fails, return null or throw an error
  console.error(`Unable to parse date: ${dateString}`);
  return new Date(NaN);
}

function formatDate(date: Date, grouping: DateGrouping): string {
  if (isNaN(date.getTime())) return "Invalid Date";

  switch (grouping) {
    case "day":
      return date.toISOString().split("T")[0];
    case "month":
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    case "year":
      return `${date.getFullYear()}`;
    default:
      return date.toISOString().split("T")[0];
  }
}

export function Charts({ data }: ChartsProps) {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [xAxis, setXAxis] = useState<string>("");
  const [yAxis, setYAxis] = useState<string>("");
  const [valueField, setValueField] = useState<string>("");
  const [dateGrouping, setDateGrouping] = useState<DateGrouping>("day");

  const columns = Object.keys(data[0] || {});

  const processedData = useMemo(() => {
    if (!xAxis || !yAxis || !valueField) return [];

    const groupedData: Record<string, any> = {};

    data.forEach((item) => {
      let xValue = item[xAxis];
      if (
        chartType.includes("line") ||
        chartType.includes("area") ||
        chartType.includes("bar")
      ) {
        const date = parseDate(xValue);
        xValue = formatDate(date, dateGrouping);
      }

      if (!groupedData[xValue]) {
        groupedData[xValue] = { [xAxis]: xValue };
      }

      if (chartType === "groupedBar") {
        groupedData[xValue][item[yAxis]] =
          (groupedData[xValue][item[yAxis]] || 0) + Number(item[valueField]);
      } else {
        groupedData[xValue][yAxis] =
          (groupedData[xValue][yAxis] || 0) + Number(item[valueField]);
      }
    });

    return Object.values(groupedData);
  }, [data, xAxis, yAxis, valueField, chartType, dateGrouping]);

  const renderChart = () => {
    const commonProps = {
      data: processedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey={yAxis} fill="#8884d8" />
          </AreaChart>
        );
      case "groupedBar":
      case "stackedBar":
        return (
          <BarChart {...commonProps}>
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            {chartType === "groupedBar" ? (
              columns
                .filter((col) => col !== xAxis && col !== valueField)
                .map((col, index) => (
                  <Bar
                    key={col}
                    dataKey={col}
                    fill={`#${Math.floor(Math.random() * 16777215).toString(
                      16
                    )}`}
                  />
                ))
            ) : (
              <Bar dataKey={yAxis} fill="#8884d8" stackId="a" />
            )}
          </BarChart>
        );
      case "bar":
        return (
          <BarChart {...commonProps}>
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey={yAxis} fill="#8884d8" />
          </BarChart>
        );
      case "pie":
      case "donut":
        return (
          <PieChart {...commonProps}>
            <Tooltip content={<ChartTooltipContent />} />
            <Pie
              data={processedData}
              dataKey={yAxis}
              nameKey={xAxis}
              cx="50%"
              cy="50%"
              outerRadius={chartType === "pie" ? 80 : 100}
              innerRadius={chartType === "donut" ? 60 : 0}
              fill="#8884d8"
              label
            />
          </PieChart>
        );
      case "bubble":
        return (
          <ScatterChart {...commonProps}>
            <XAxis dataKey={xAxis} />
            <YAxis dataKey={yAxis} />
            <Tooltip content={<ChartTooltipContent />} />
            <Scatter name={valueField} data={processedData} fill="#8884d8">
              {processedData.map((entry, index) => (
                <circle
                  key={`circle-${index}`}
                  cx={0}
                  cy={0}
                  r={Math.sqrt(entry[valueField]) * 2}
                  fill="#8884d8"
                />
              ))}
            </Scatter>
          </ScatterChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Charts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Select
            value={chartType}
            onValueChange={(value: ChartType) => setChartType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="groupedBar">Grouped Bar Chart</SelectItem>
              <SelectItem value="stackedBar">Stacked Bar Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="donut">Donut Chart</SelectItem>
              <SelectItem value="bubble">Bubble Chart</SelectItem>
            </SelectContent>
          </Select>
          <Select value={xAxis} onValueChange={setXAxis}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select X-Axis" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column} value={column}>
                  {column}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yAxis} onValueChange={setYAxis}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Y-Axis" />
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
          {(chartType.includes("line") ||
            chartType.includes("area") ||
            chartType.includes("bar")) && (
            <Select
              value={dateGrouping}
              onValueChange={(value: DateGrouping) => setDateGrouping(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Date Grouping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <ChartContainer className="h-[400px]" config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
