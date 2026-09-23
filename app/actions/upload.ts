"use server";

import { createClient } from "@/lib/supabase/server";

export interface UploadResult {
  url?: string;
  error?: string;
}

/**
 * Server action para upload seguro de imagens (capas de livros e avatares) no Supabase Storage
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Você precisa estar autenticado para enviar imagens." };
    }

    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "covers";

    if (!file || file.size === 0) {
      return { error: "Nenhum arquivo de imagem foi selecionado." };
    }

    if (!["covers", "avatars"].includes(bucket)) {
      return { error: "Destino de armazenamento inválido." };
    }

    // Validação de tipo de arquivo
    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ];
    if (!validMimeTypes.includes(file.type)) {
      return {
        error:
          "Formato de imagem não suportado. Por favor, envie arquivos JPG, PNG ou WEBP.",
      };
    }

    // Limite de 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return {
        error: "A imagem não pode ultrapassar o tamanho máximo de 5MB.",
      };
    }

    // Gerar caminho limpo e único
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const filePath = `${user.id}/${Date.now()}_${sanitizedName}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      if (
        uploadError.message?.toLowerCase().includes("bucket not found") ||
        (uploadError as any).statusCode === "404"
      ) {
        return {
          error: `O bucket de armazenamento '${bucket}' não foi encontrado no Supabase. Execute o script 'setup-storage-and-triggers.sql' no SQL Editor do Supabase para criá-lo.`,
        };
      }
      return { error: `Erro no upload: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (err: any) {
    return {
      error:
        err?.message || "Ocorreu um erro inesperado ao processar a imagem.",
    };
  }
}
