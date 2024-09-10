"use client";

import { useEffect, useState } from "react";
import { MergedDataTable } from "./components/MergedDataTable";

export default function MergedDataPage() {
  const [mergedData, setMergedData] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("mergedData");
    if (storedData) {
      setMergedData(JSON.parse(storedData));
    }
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Merged Data</h1>
      {mergedData.length > 0 ? (
        <MergedDataTable data={mergedData} />
      ) : (
        <p>No merged data available.</p>
      )}
    </main>
  );
}
