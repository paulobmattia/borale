"use client";

import * as React from "react";
import { CommentItem, type CommentData } from "./CommentItem";
import { CommentInput } from "./CommentInput";
import { isSpoilerForUser } from "@/lib/spoiler";
import type { ReactionType } from "@/types/database";
import { MessageSquare, Filter, ShieldCheck } from "lucide-react";

export interface CommentsListProps {
  comments: CommentData[];
  currentUserProgress?: {
    current_page: number;
    current_chapter: number;
  } | null;
  onAddComment: (data: {
    content: string;
    chapter_ref?: number;
    page_ref?: number;
    has_spoiler: boolean;
  }) => Promise<void> | void;
  onToggleReaction?: (commentId: string, type: ReactionType) => void;
}

export function CommentsList({
  comments,
  currentUserProgress,
  onAddComment,
  onToggleReaction,
}: CommentsListProps) {
  const [filterMode, setFilterMode] = React.useState<"all" | "safe">("all");

  const filteredComments = React.useMemo(() => {
    if (filterMode === "all" || !currentUserProgress) {
      return comments;
    }
    // Modo "safe": oculta anotações que ultrapassam o progresso do usuário
    return comments.filter(
      (c) =>
        !isSpoilerForUser(
          {
            chapter_ref: c.chapter_ref,
            page_ref: c.page_ref,
            has_spoiler: c.has_spoiler,
          },
          currentUserProgress
        )
    );
  }, [comments, filterMode, currentUserProgress]);

  return (
    <div className="space-y-6">
      {/* Formulário de Anotação */}
      <CommentInput
        onSubmitComment={onAddComment}
        defaultChapter={currentUserProgress?.current_chapter}
        defaultPage={currentUserProgress?.current_page}
      />

      {/* Barra de Filtro Editorial */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-700 dark:text-brand-300" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900 dark:text-paper-50">
            Notas da Mesa ({comments.length})
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-paper-200/60 dark:bg-ink-surface p-1 rounded-md border border-line dark:border-ink-line text-xs">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-2.5 py-1 rounded transition font-medium ${
              filterMode === "all"
                ? "bg-paper-100 dark:bg-ink-surface-2 text-ink-900 dark:text-paper-50 shadow-sm"
                : "text-ink-700 dark:text-paper-200 hover:text-ink-900"
            }`}
          >
            Todas as notas
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("safe")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition font-medium ${
              filterMode === "safe"
                ? "bg-paper-100 dark:bg-ink-surface-2 text-ink-900 dark:text-paper-50 shadow-sm"
                : "text-ink-700 dark:text-paper-200 hover:text-ink-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Apenas no meu ritmo
          </button>
        </div>
      </div>

      {/* Lista de Comentários */}
      {filteredComments.length === 0 ? (
        <div className="p-8 text-center rounded-lg border border-dashed border-line dark:border-ink-line bg-paper-200/20">
          <p className="font-reading text-body text-ink-700 dark:text-paper-200">
            {filterMode === "safe"
              ? "Nenhuma nota encontrada até o seu progresso atual. Seja o primeiro a anotar!"
              : "Ainda não há anotações nesta mesa. Comece a conversa!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserProgress={currentUserProgress}
              onToggleReaction={onToggleReaction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
