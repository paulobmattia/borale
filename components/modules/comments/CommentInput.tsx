"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Input } from "@/components/ui/Input";
import { Send, ShieldAlert } from "lucide-react";

export interface CommentInputProps {
  onSubmitComment: (data: {
    content: string;
    chapter_ref?: number;
    page_ref?: number;
    has_spoiler: boolean;
  }) => Promise<void> | void;
  defaultChapter?: number;
  defaultPage?: number;
  isLoading?: boolean;
}

export function CommentInput({
  onSubmitComment,
  defaultChapter,
  defaultPage,
  isLoading = false,
}: CommentInputProps) {
  const [content, setContent] = React.useState("");
  const [chapter, setChapter] = React.useState(
    defaultChapter ? defaultChapter.toString() : ""
  );
  const [page, setPage] = React.useState(
    defaultPage ? defaultPage.toString() : ""
  );
  const [hasSpoiler, setHasSpoiler] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmitComment({
        content: content.trim(),
        chapter_ref: chapter ? parseInt(chapter, 10) : undefined,
        page_ref: page ? parseInt(page, 10) : undefined,
        has_spoiler: hasSpoiler,
      });

      // Limpa formulário após envio
      setContent("");
      setHasSpoiler(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded-lg border border-line bg-paper-200/40 dark:bg-ink-surface dark:border-ink-line space-y-3"
    >
      <div className="flex justify-between items-center">
        <label
          htmlFor="comment-content"
          className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200"
        >
          Anotar na margem
        </label>
        <span className="text-[11px] text-ink-500 font-sans">
          Suas anotações enriquecem a mesa
        </span>
      </div>

      <Textarea
        id="comment-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escreva sua reflexão, citação favorita ou reação ao capítulo..."
        className="min-h-[80px]"
        required
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Referência de Capítulo e Página */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded border border-line bg-paper-100 dark:bg-ink-surface-2 dark:border-ink-line focus-within:ring-1 focus-within:ring-brand-500 overflow-hidden transition-all shadow-sm">
            <span className="px-2.5 py-1 text-[11px] font-sans font-medium text-ink-600 dark:text-paper-300 bg-paper-200/70 dark:bg-ink-surface-3 border-r border-line dark:border-ink-line select-none">
              Cap.
            </span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              aria-label="Capítulo da anotação"
              className="w-14 h-8 px-2 text-xs bg-transparent text-ink-900 dark:text-paper-50 placeholder:text-ink-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center rounded border border-line bg-paper-100 dark:bg-ink-surface-2 dark:border-ink-line focus-within:ring-1 focus-within:ring-brand-500 overflow-hidden transition-all shadow-sm">
            <span className="px-2.5 py-1 text-[11px] font-sans font-medium text-ink-600 dark:text-paper-300 bg-paper-200/70 dark:bg-ink-surface-3 border-r border-line dark:border-ink-line select-none">
              Pág.
            </span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              aria-label="Página da anotação"
              className="w-16 h-8 px-2 text-xs bg-transparent text-ink-900 dark:text-paper-50 placeholder:text-ink-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Opção de Spoiler Manual e Botão de Envio */}
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-ink-700 dark:text-paper-200 select-none">
            <input
              type="checkbox"
              checked={hasSpoiler}
              onChange={(e) => setHasSpoiler(e.target.checked)}
              className="rounded border-line text-brand-700 focus:ring-brand-500 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldAlert className="w-3 h-3 text-amber-600" />
              Contém spoiler
            </span>
          </label>

          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting || isLoading}
            disabled={!content.trim()}
            rightIcon={<Send className="w-3 h-3" />}
          >
            Publicar nota
          </Button>
        </div>
      </div>
    </form>
  );
}
