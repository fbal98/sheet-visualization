"use client";

import { useEffect, useState } from "react";
import { MergedDataTable } from "../components/MergedDataTable";

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
      <h1 className="text-3xl font-bold mb-4">Merged Data</h1>
      <p className="mb-4">
        Here's your merged data. You can search, filter, and sort the data using
        the controls below. To download the data, use the "Download Excel" or
        "Download CSV" buttons at the top of the table.
      </p>
      {mergedData.length > 0 ? (
        <MergedDataTable data={mergedData} />
      ) : (
        <p>No merged data available.</p>
      )}
    </main>
  );
}
