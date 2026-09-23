"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/app/actions/upload";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageUploadProps {
  bucket: "covers" | "avatars";
  value?: string | null;
  onChange: (url: string) => void;
  aspectRatio?: "cover" | "avatar";
  label?: string;
  hint?: string;
  className?: string;
}

export function ImageUpload({
  bucket,
  value,
  onChange,
  aspectRatio = "cover",
  label,
  hint,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(value || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("A imagem não pode ultrapassar o limite de 10MB.");
      return;
    }

    // Preview local imediato
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setError(null);
    setIsUploading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Envio direto do navegador para o Supabase Storage (sem restrição de payload da Vercel)
        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const sanitizedName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .slice(0, 30);
        const filePath = `${user.id}/${Date.now()}_${sanitizedName}.${fileExt}`;

        const { error: clientUploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
          });

        if (!clientUploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from(bucket).getPublicUrl(filePath);

          setPreviewUrl(publicUrl);
          onChange(publicUrl);
          setIsUploading(false);
          return;
        }

        if (
          clientUploadError.message?.toLowerCase().includes("bucket not found") ||
          (clientUploadError as any).statusCode === "404"
        ) {
          throw new Error(
            `O bucket de armazenamento '${bucket}' não foi encontrado. Por favor, execute o script 'setup-storage-and-triggers.sql' no painel do Supabase para criá-lo.`
          );
        }
      }

      // Fallback para Server Action caso o cliente encontre qualquer restrição
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);

      const result = await uploadImage(formData);

      if (result.error) {
        setError(result.error);
        setPreviewUrl(value || null);
      } else if (result.url) {
        setPreviewUrl(result.url);
        onChange(result.url);
      }
    } catch (err: any) {
      setError(err?.message || "Falha ao enviar arquivo.");
      setPreviewUrl(value || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block font-sans text-xs font-semibold tracking-wide uppercase text-ink-700 dark:text-paper-200">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative inline-block group">
          <div
            className={cn(
              "overflow-hidden border border-line dark:border-ink-line bg-paper-200 dark:bg-ink-surface shadow-editorial transition-all",
              aspectRatio === "avatar"
                ? "w-24 h-24 rounded-full"
                : "w-28 h-40 rounded"
            )}
          >
            <img
              src={previewUrl}
              alt="Prévia da imagem"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-ink-900/60 flex flex-col items-center justify-center text-paper-50 text-xs gap-1.5 backdrop-blur-[1px]">
                <Loader2 className="w-5 h-5 animate-spin text-brand-300" />
                <span className="text-[11px] font-medium">Enviando...</span>
              </div>
            )}
          </div>

          {!isUploading && (
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-sans font-medium text-brand-700 hover:text-brand-900 dark:text-brand-300 underline"
              >
                Trocar imagem
              </button>
              <span className="text-ink-300 dark:text-ink-600">·</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-[11px] font-sans font-medium text-rose-600 hover:text-rose-800 dark:text-rose-400 inline-flex items-center gap-0.5"
              >
                <X className="w-3 h-3" /> Remover
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed border-line hover:border-brand-500/60 dark:border-ink-line dark:hover:border-brand-400/60 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-paper-200/40 hover:bg-paper-200/70 dark:bg-ink-surface/40 dark:hover:bg-ink-surface/80",
            isUploading && "opacity-75 cursor-not-allowed"
          )}
        >
          {isUploading ? (
            <div className="py-3 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-brand-700 dark:text-brand-300" />
              <span className="text-xs font-medium text-ink-700 dark:text-paper-200">
                Enviando imagem para o Supabase...
              </span>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-paper-300/80 dark:bg-ink-surface-2 flex items-center justify-center text-ink-600 dark:text-paper-300">
                <Upload className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-900 dark:text-paper-100 font-sans">
                  {aspectRatio === "avatar"
                    ? "Escolher foto de perfil"
                    : "Escolher capa do livro"}
                </p>
                <p className="text-[11px] text-ink-500 dark:text-paper-300/70 mt-0.5 font-sans">
                  JPG, PNG ou WEBP até 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-semantic-error font-medium pt-0.5">
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-[11px] text-ink-500 dark:text-paper-300/70 font-sans">
          {hint}
        </p>
      )}
    </div>
  );
}
