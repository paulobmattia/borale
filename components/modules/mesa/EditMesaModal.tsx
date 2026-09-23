"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateMesa } from "@/app/actions/mesa";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Lock, Save } from "lucide-react";

export interface EditMesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  initialData: {
    title: string;
    book_title: string;
    book_author: string;
    book_cover_url?: string | null;
    is_private?: boolean;
  };
  onSaved?: (updatedData: {
    title: string;
    book_title: string;
    book_author: string;
    book_cover_url?: string | null;
    is_private?: boolean;
  }) => void;
}

export function EditMesaModal({
  isOpen,
  onClose,
  groupId,
  initialData,
  onSaved,
}: EditMesaModalProps) {
  const router = useRouter();
  const [title, setTitle] = React.useState(initialData.title);
  const [bookTitle, setBookTitle] = React.useState(initialData.book_title);
  const [bookAuthor, setBookAuthor] = React.useState(initialData.book_author);
  const [bookCoverUrl, setBookCoverUrl] = React.useState(
    initialData.book_cover_url || ""
  );
  const [isPrivate, setIsPrivate] = React.useState(Boolean(initialData.is_private));
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sincroniza sempre que a prop initialData ou isOpen mudar
  React.useEffect(() => {
    if (isOpen) {
      setTitle(initialData.title);
      setBookTitle(initialData.book_title);
      setBookAuthor(initialData.book_author);
      setBookCoverUrl(initialData.book_cover_url || "");
      setIsPrivate(Boolean(initialData.is_private));
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !bookTitle.trim() || !bookAuthor.trim()) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        title: title.trim(),
        book_title: bookTitle.trim(),
        book_author: bookAuthor.trim(),
        book_cover_url: bookCoverUrl.trim() || null,
        is_private: isPrivate,
      };

      await updateMesa(groupId, payload);

      onSaved?.(payload);
      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Ocorreu um erro ao atualizar os dados da mesa.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Mesa de Leitura"
      description="Atualize as informações do livro, capa e privacidade desta mesa."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs font-medium">
            {error}
          </div>
        )}

        <Input
          id="edit-mesa-title"
          label="Nome da Mesa"
          required
          placeholder="Ex: Clube do Livro — Clarice Lispector"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="edit-book-title"
            label="Título da Obra"
            required
            placeholder="Ex: A Hora da Estrela"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />

          <Input
            id="edit-book-author"
            label="Autor(a)"
            required
            placeholder="Ex: Clarice Lispector"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <ImageUpload
            bucket="covers"
            value={bookCoverUrl}
            onChange={setBookCoverUrl}
            aspectRatio="cover"
            label="Capa da Obra"
            hint="Envie uma foto da capa do livro ou cole a URL direta abaixo"
          />
          <input
            type="url"
            placeholder="Ou cole a URL direta da capa (https://...)"
            value={bookCoverUrl}
            onChange={(e) => setBookCoverUrl(e.target.value)}
            className="w-full h-8 px-2.5 text-xs rounded border border-line bg-paper-100 dark:bg-ink-surface-2 dark:border-ink-line text-ink-900 dark:text-paper-50 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
          />
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-ink-700 dark:text-paper-200 cursor-pointer pt-1 select-none">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="rounded border-line text-brand-700 focus:ring-brand-500 w-4 h-4"
          />
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-ink-500" />
            Mesa privada (acessível apenas por convite)
          </span>
        </label>

        <div className="flex justify-end gap-2 pt-3 border-t border-line dark:border-ink-line">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
}
