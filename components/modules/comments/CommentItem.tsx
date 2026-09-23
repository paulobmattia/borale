"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ReactionPicker, type ReactionCount } from "./ReactionPicker";
import { isSpoilerForUser, formatReadingLocation } from "@/lib/spoiler";
import { formatDate } from "@/lib/utils";
import type { ReactionType } from "@/types/database";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";

export interface CommentData {
  id: string;
  user_id: string;
  author_name: string;
  author_username: string;
  author_avatar?: string | null;
  chapter_ref?: number | null;
  page_ref?: number | null;
  content: string;
  has_spoiler: boolean;
  created_at: string;
  reactions?: ReactionCount[];
}

export interface CommentItemProps {
  comment: CommentData;
  currentUserProgress?: {
    current_page: number;
    current_chapter: number;
  } | null;
  onToggleReaction?: (commentId: string, type: ReactionType) => void;
}

export function CommentItem({
  comment,
  currentUserProgress,
  onToggleReaction,
}: CommentItemProps) {
  const isSpoiler = React.useMemo(() => {
    return isSpoilerForUser(
      {
        chapter_ref: comment.chapter_ref,
        page_ref: comment.page_ref,
        has_spoiler: comment.has_spoiler,
      },
      currentUserProgress
    );
  }, [comment, currentUserProgress]);

  const [isRevealed, setIsRevealed] = React.useState(!isSpoiler);

  React.useEffect(() => {
    if (!isSpoiler) {
      setIsRevealed(true);
    }
  }, [isSpoiler]);

  const locationLabel = formatReadingLocation(
    comment.chapter_ref,
    comment.page_ref
  );

  return (
    <article className="group relative rounded-md border border-line bg-paper-100 dark:bg-ink-surface dark:border-ink-line p-4 transition-all duration-150 shadow-sm border-l-4 border-l-brand-700/70 dark:border-l-brand-500/70 space-y-3">
      {/* Cabeçalho da Nota de Margem */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Avatar
            src={comment.author_avatar}
            fallbackText={comment.author_name}
            size="sm"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-semibold text-ink-900 dark:text-paper-50">
                {comment.author_name}
              </span>
              <span className="text-ink-500 dark:text-paper-200/60 text-[11px]">
                @{comment.author_username}
              </span>
            </div>
            <span className="text-[11px] text-ink-500 dark:text-paper-200/50">
              {formatDate(comment.created_at)}
            </span>
          </div>
        </div>

        {/* Localização da leitura e flag de spoiler */}
        <div className="flex items-center gap-1.5">
          <Badge
            variant={isSpoiler && !isRevealed ? "warning" : "default"}
            className="text-[11px]"
          >
            {locationLabel}
          </Badge>
          {isSpoiler && (
            <Badge variant="error" className="text-[10px] gap-1">
              <ShieldAlert className="w-3 h-3 stroke-[1.75]" /> Spoiler
            </Badge>
          )}
        </div>
      </div>

      {/* Conteúdo com Proteção Anti-Spoiler */}
      <div>
        {isSpoiler && !isRevealed ? (
          <div className="relative rounded bg-paper-200/50 dark:bg-ink-surface-2 p-3 text-center border border-line/60 dark:border-ink-line/60">
            <div className="spoiler-blur select-none pointer-events-none mb-2">
              <p className="font-reading text-body text-ink-900 dark:text-paper-50 line-clamp-2">
                {comment.content}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xs text-ink-700 dark:text-paper-200 font-medium">
                Esta nota menciona trechos à frente do seu ritmo ({locationLabel}).
              </span>
              <button
                type="button"
                onClick={() => setIsRevealed(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-500 dark:text-brand-300 transition underline underline-offset-2 min-h-[36px]"
              >
                <Eye className="w-3.5 h-3.5 stroke-[1.75]" />
                Revelar anotação
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-reading text-body text-ink-900 dark:text-paper-50 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
            {isSpoiler && isRevealed && (
              <button
                type="button"
                onClick={() => setIsRevealed(false)}
                className="inline-flex items-center gap-1 text-[11px] text-ink-500 hover:text-ink-700 dark:hover:text-paper-200 transition min-h-[28px]"
              >
                <EyeOff className="w-3 h-3 stroke-[1.75]" />
                Ocultar novamente
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reações Expressivas */}
      <div className="pt-2 border-t border-line/50 dark:border-ink-line/50">
        <ReactionPicker
          reactions={comment.reactions || []}
          onToggleReaction={(type) =>
            onToggleReaction && onToggleReaction(comment.id, type)
          }
        />
      </div>
    </article>
  );
}
