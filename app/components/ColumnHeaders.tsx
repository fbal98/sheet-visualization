"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ParsedFile {
  name: string;
  headers: string[];
}

interface ColumnHeadersProps {
  parsedFiles: ParsedFile[];
}

export function ColumnHeaders({ parsedFiles }: ColumnHeadersProps) {
  const allHeaders = new Set(parsedFiles.flatMap((file) => file.headers));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Column Headers</h2>
      {parsedFiles.map((file, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{file.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(allHeaders).map((header, headerIndex) => (
                <Badge
                  key={headerIndex}
                  variant={
                    file.headers.includes(header) ? "default" : "secondary"
                  }
                >
                  {header}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
