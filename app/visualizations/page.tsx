"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PivotTable } from "../components/PivotTable";
import { Charts } from "../components/Charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VisualizationsPage() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("visualizationData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
    }
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Data Visualizations</h1>
      <Button onClick={() => router.back()} className="mb-4">
        Back to Data Table
      </Button>
      {data.length > 0 ? (
        <Tabs defaultValue="pivot" className="w-full">
          <TabsList>
            <TabsTrigger value="pivot">Pivot Table</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
          <TabsContent value="pivot">
            <PivotTable data={data} />
          </TabsContent>
          <TabsContent value="charts">
            <Charts data={data} />
          </TabsContent>
        </Tabs>
      ) : (
        <p>No data available for visualization.</p>
      )}
    </main>
  );
}
