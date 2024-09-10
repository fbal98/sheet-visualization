"use client";

import { Card, Title, BarChart } from "@tremor/react";

interface BarChartProps {
  data: Record<string, any>[];
  xAxis: string;
  yAxis: string;
}

export function SimpleBarChart({ data, xAxis, yAxis }: BarChartProps) {
  return (
    <Card>
      <Title>Simple Bar Chart</Title>
      <BarChart
        className="mt-6"
        data={data}
        index={xAxis}
        categories={[yAxis]}
        colors={["blue"]}
        yAxisWidth={48}
      />
    </Card>
  );
}
