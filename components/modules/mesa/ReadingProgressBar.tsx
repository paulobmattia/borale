"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Bookmark, Edit3, CheckCircle2 } from "lucide-react";

export interface ReadingProgressBarProps {
  currentPage: number;
  currentChapter: number;
  totalPages?: number;
  targetPage?: number;
  targetChapter?: number;
  onUpdateProgress?: (page: number, chapter: number) => Promise<void> | void;
  canEdit?: boolean;
}

export function ReadingProgressBar({
  currentPage,
  currentChapter,
  totalPages,
  targetPage,
  targetChapter,
  onUpdateProgress,
  canEdit = true,
}: ReadingProgressBarProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [pageInput, setPageInput] = React.useState(currentPage.toString());
  const [chapterInput, setChapterInput] = React.useState(currentChapter.toString());
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setPageInput(currentPage.toString());
    setChapterInput(currentChapter.toString());
  }, [currentPage, currentChapter]);

  // Calcula percentual se houver referência de páginas
  const maxRef = totalPages || targetPage;
  const hasReference = typeof maxRef === "number" && maxRef > 0;
  const percentage = hasReference
    ? Math.min(100, Math.round((currentPage / maxRef) * 100))
    : null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPage = parseInt(pageInput, 10);
    const newChapter = parseInt(chapterInput, 10) || 0;

    if (isNaN(newPage) || newPage < 0) return;

    try {
      setIsSubmitting(true);
      if (onUpdateProgress) {
        await onUpdateProgress(newPage, newChapter);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-2 p-4 rounded-lg border border-line bg-paper-200/40 dark:bg-ink-surface dark:border-ink-line">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <Bookmark className="w-3.5 h-3.5 text-brand-700 dark:text-brand-300" />
          <span className="font-semibold text-ink-900 dark:text-paper-50">
            Seu ritmo: {currentChapter > 0 ? `Cap. ${currentChapter} · ` : ""}
            Pág. {currentPage} {totalPages ? `/ ${totalPages}` : ""}
          </span>
          {targetPage && (
            <span className="text-ink-500 dark:text-paper-200/70">
              (Próxima meta: {targetChapter ? `Cap. ${targetChapter} · ` : ""}Pág. {targetPage})
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {percentage !== null ? (
            <span className="font-semibold text-brand-700 dark:text-brand-300">
              {percentage}%
            </span>
          ) : (
            <span className="text-[11px] text-ink-500 dark:text-paper-300">
              {currentPage > 0 ? "Leitura iniciada" : "A iniciar"}
            </span>
          )}
          {canEdit && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-500 dark:text-brand-300 underline underline-offset-2"
            >
              <Edit3 className="w-3 h-3" />
              Atualizar
            </button>
          )}
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full h-1.5 bg-paper-300 dark:bg-ink-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-700 dark:bg-brand-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage !== null ? percentage : currentPage > 0 ? 10 : 0}%` }}
        />
      </div>

      {/* Modal de Atualização de Progresso */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Atualizar Leitura"
        description="Registre onde você parou. Suas anotações e proteção anti-spoiler serão ajustadas automaticamente."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Capítulo atual"
              type="number"
              min="0"
              value={chapterInput}
              onChange={(e) => setChapterInput(e.target.value)}
              placeholder="Ex: 3"
            />
            <Input
              label="Página atual"
              type="number"
              min="0"
              max={totalPages || undefined}
              required
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder="Ex: 45"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Salvar Progresso
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
