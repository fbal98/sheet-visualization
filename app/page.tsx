"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FileUpload } from "./components/FileUpload";

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">
          Excel File Upload and Column Mapping
        </h1>
        <div className="w-full max-w-4xl">
          <FileUpload />
        </div>
      </main>
    </DndProvider>
  );
}
