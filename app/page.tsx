import { FileUpload } from "./components/FileUpload";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">
        Excel File Upload and Analysis
      </h1>
      <div className="w-full max-w-2xl">
        <FileUpload />
      </div>
    </main>
  );
}
