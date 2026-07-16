"use client";

import { useRef, useState } from "react";
import { Upload, CheckCircle, Loader2 } from "lucide-react";

type FileUploadProps = {
  label: string;
  accept?: string;
  value?: string;
  onChange: (url: string) => void;
  error?: string;
  required?: boolean;
};

export function FileUpload({
  label,
  accept = ".pdf,.jpg,.jpeg,.png,.webp",
  value,
  onChange,
  error,
  required,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Error al subir archivo");
      }

      onChange(data.url);
      setFileName(file.name);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-neon-cyan"> *</span>}
      </label>
      <div
        className={`glow-border cursor-pointer rounded-lg border-dashed p-4 text-center transition-colors hover:border-neon-cyan/60 ${
          error || uploadError ? "border-red-400/50" : ""
        }`}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Subiendo...
          </div>
        ) : value ? (
          <div className="flex items-center justify-center gap-2 text-sm text-neon-cyan">
            <CheckCircle className="h-4 w-4" />
            {fileName ?? "Archivo cargado"}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm text-text-muted">
            <Upload className="h-5 w-5" />
            <span>Click para seleccionar archivo</span>
          </div>
        )}
      </div>
      {(error || uploadError) && (
        <p className="text-xs text-red-400">{error ?? uploadError}</p>
      )}
    </div>
  );
}
