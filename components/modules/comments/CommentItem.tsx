"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ReactionPicker, type ReactionCount } from "./ReactionPicker";
import { isSpoilerForUser, formatReadingLocation } from "@/lib/spoiler";
import { formatDate } from "@/lib/utils";
import type { ReactionType } from "@/types/database";
import { Button } from "@/components/ui/Button";
import {
  Eye,
  EyeOff,
  ShieldAlert,
  MessageSquare,
  Reply,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface CommentReplyData {
  id: string;
  parent_id?: string | null;
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

export interface CommentData {
  id: string;
  parent_id?: string | null;
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
  replies?: CommentReplyData[];
}

export interface CommentItemProps {
  comment: CommentData;
  currentUserProgress?: {
    current_page: number;
    current_chapter: number;
  } | null;
  onToggleReaction?: (commentId: string, type: ReactionType) => void;
  onAddReply?: (
    parentId: string,
    data: { content: string; has_spoiler: boolean }
  ) => Promise<void> | void;
}

export interface PostItTheme {
  border: string;
  bg: string;
  flag: string;
  replyBorder: string;
}

export function getPostItTheme(id: string): PostItTheme {
  const themes: PostItTheme[] = [
    // Amarelo Canário (Post-it clássico)
    {
      border: "border-l-amber-400 dark:border-l-amber-500",
      bg: "bg-amber-50/40 dark:bg-amber-950/20",
      flag: "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-900/60 dark:text-amber-100 dark:border-amber-700",
      replyBorder: "border-l-amber-400/80 dark:border-l-amber-500/80",
    },
    // Rosa Marca-texto
    {
      border: "border-l-rose-400 dark:border-l-rose-500",
      bg: "bg-rose-50/40 dark:bg-rose-950/20",
      flag: "bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-900/60 dark:text-rose-100 dark:border-rose-700",
      replyBorder: "border-l-rose-400/80 dark:border-l-rose-500/80",
    },
    // Verde Menta
    {
      border: "border-l-emerald-400 dark:border-l-emerald-500",
      bg: "bg-emerald-50/40 dark:bg-emerald-950/20",
      flag: "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-100 dark:border-emerald-700",
      replyBorder: "border-l-emerald-400/80 dark:border-l-emerald-500/80",
    },
    // Azul Celeste
    {
      border: "border-l-sky-400 dark:border-l-sky-500",
      bg: "bg-sky-50/40 dark:bg-sky-950/20",
      flag: "bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-900/60 dark:text-sky-100 dark:border-sky-700",
      replyBorder: "border-l-sky-400/80 dark:border-l-sky-500/80",
    },
    // Lavanda / Lilás
    {
      border: "border-l-purple-400 dark:border-l-purple-500",
      bg: "bg-purple-50/40 dark:bg-purple-950/20",
      flag: "bg-purple-100 text-purple-950 border-purple-300 dark:bg-purple-900/60 dark:text-purple-100 dark:border-purple-700",
      replyBorder: "border-l-purple-400/80 dark:border-l-purple-500/80",
    },
    // Laranja Pêssego
    {
      border: "border-l-orange-400 dark:border-l-orange-500",
      bg: "bg-orange-50/40 dark:bg-orange-950/20",
      flag: "bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-900/60 dark:text-orange-100 dark:border-orange-700",
      replyBorder: "border-l-orange-400/80 dark:border-l-orange-500/80",
    },
  ];

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return themes[Math.abs(hash) % themes.length];
}

function ReplyItem({
  reply,
  currentUserProgress,
  onToggleReaction,
  theme,
}: {
  reply: CommentReplyData;
  currentUserProgress?: {
    current_page: number;
    current_chapter: number;
  } | null;
  onToggleReaction?: (commentId: string, type: ReactionType) => void;
  theme?: PostItTheme;
}) {
  const isSpoiler = React.useMemo(() => {
    return isSpoilerForUser(
      {
        chapter_ref: reply.chapter_ref,
        page_ref: reply.page_ref,
        has_spoiler: reply.has_spoiler,
      },
      currentUserProgress
    );
  }, [reply, currentUserProgress]);

  const [isRevealed, setIsRevealed] = React.useState(!isSpoiler);

  return (
    <div
      className={`rounded-md border border-line/70 bg-paper-100/95 dark:bg-ink-surface-2/60 dark:border-ink-line/70 p-3 space-y-2 text-xs border-l-2 ${
        theme?.replyBorder || "border-l-brand-600/60"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            src={reply.author_avatar}
            fallbackText={reply.author_name}
            size="sm"
            className="w-5 h-5 text-[10px]"
          />
          <span className="font-sans font-semibold text-ink-900 dark:text-paper-100">
            {reply.author_name}
          </span>
          <span className="text-[11px] text-ink-500 dark:text-paper-300/60">
            @{reply.author_username}
          </span>
          <span className="text-ink-300 dark:text-ink-600">·</span>
          <span className="text-[11px] text-ink-500 dark:text-paper-300/60">
            {formatDate(reply.created_at)}
          </span>
        </div>

        {reply.has_spoiler && (
          <Badge variant="error" className="text-[9px] px-1.5 py-0 gap-0.5">
            <ShieldAlert className="w-2.5 h-2.5" /> Spoiler
          </Badge>
        )}
      </div>

      {isSpoiler && !isRevealed ? (
        <div className="p-2 rounded bg-paper-200/50 dark:bg-ink-surface text-center">
          <p className="text-[11px] text-ink-600 dark:text-paper-300 font-sans mb-1">
            Esta resposta pode conter spoilers.
          </p>
          <button
            type="button"
            onClick={() => setIsRevealed(true)}
            className="text-[11px] font-semibold text-brand-700 dark:text-brand-300 underline"
          >
            Revelar
          </button>
        </div>
      ) : (
        <p className="font-reading text-body text-ink-900 dark:text-paper-50 leading-relaxed whitespace-pre-wrap">
          {reply.content}
        </p>
      )}

      <div className="pt-1">
        <ReactionPicker
          reactions={reply.reactions || []}
          onToggleReaction={(type) =>
            onToggleReaction && onToggleReaction(reply.id, type)
          }
        />
      </div>
    </div>
  );
}

export function CommentItem({
  comment,
  currentUserProgress,
  onToggleReaction,
  onAddReply,
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
  const [isRepliesOpen, setIsRepliesOpen] = React.useState(true);
  const [isReplying, setIsReplying] = React.useState(false);
  const [replyContent, setReplyContent] = React.useState("");
  const [replyHasSpoiler, setReplyHasSpoiler] = React.useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = React.useState(false);

  React.useEffect(() => {
    if (!isSpoiler) {
      setIsRevealed(true);
    }
  }, [isSpoiler]);

  const locationLabel = formatReadingLocation(
    comment.chapter_ref,
    comment.page_ref
  );

  const postitTheme = React.useMemo(
    () => getPostItTheme(comment.id),
    [comment.id]
  );

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !onAddReply) return;

    try {
      setIsSubmittingReply(true);
      await onAddReply(comment.id, {
        content: replyContent.trim(),
        has_spoiler: replyHasSpoiler,
      });
      setReplyContent("");
      setIsReplying(false);
      setIsRepliesOpen(true);
    } catch {
      // Erro tratado pelo container
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <article
      className={`group relative rounded-md border border-line ${postitTheme.bg} bg-paper-100 dark:bg-ink-surface dark:border-ink-line p-4 transition-all duration-150 shadow-xs border-l-4 ${postitTheme.border} space-y-3`}
    >
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

        {/* Localização da leitura com etiqueta adesiva Post-it e flag de spoiler */}
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans font-semibold border shadow-xs ${postitTheme.flag}`}
          >
            {locationLabel}
          </span>
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

      {/* Rodapé: Reações Expressivas e Ações de Resposta */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-line/50 dark:border-ink-line/50">
        <ReactionPicker
          reactions={comment.reactions || []}
          onToggleReaction={(type) =>
            onToggleReaction && onToggleReaction(comment.id, type)
          }
        />

        <div className="flex items-center gap-3">
          {comment.replies && comment.replies.length > 0 && (
            <button
              type="button"
              onClick={() => setIsRepliesOpen((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs font-sans font-medium text-ink-600 hover:text-ink-900 dark:text-paper-300 dark:hover:text-paper-50 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>
                {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "resposta" : "respostas"}
              </span>
              {isRepliesOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {onAddReply && (
            <button
              type="button"
              onClick={() => {
                setIsReplying((prev) => !prev);
                setIsRepliesOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-sans font-medium text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200 transition"
            >
              <Reply className="w-3.5 h-3.5" />
              Responder
            </button>
          )}
        </div>
      </div>

      {/* Seção Aninhada de Discussão (Thread) */}
      {(isRepliesOpen || isReplying) && (
        <div
          className={`ml-2 sm:ml-4 pl-3 border-l-2 ${postitTheme.replyBorder} space-y-3 pt-1`}
        >
          {/* Lista de respostas */}
          {comment.replies && comment.replies.length > 0 && isRepliesOpen && (
            <div className="space-y-2.5">
              {comment.replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  currentUserProgress={currentUserProgress}
                  onToggleReaction={onToggleReaction}
                  theme={postitTheme}
                />
              ))}
            </div>
          )}

          {/* Formulário inline de resposta */}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="space-y-2 pt-1">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Responder a @${comment.author_username}...`}
                className="w-full min-h-[64px] p-2.5 text-xs rounded border border-line bg-paper-100 dark:bg-ink-surface-2 dark:border-ink-line text-ink-900 dark:text-paper-50 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand-500 font-reading leading-relaxed"
                required
                autoFocus
              />

              <div className="flex items-center justify-between gap-2">
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] text-ink-600 dark:text-paper-300 select-none">
                  <input
                    type="checkbox"
                    checked={replyHasSpoiler}
                    onChange={(e) => setReplyHasSpoiler(e.target.checked)}
                    className="rounded border-line text-brand-700 focus:ring-brand-500 w-3 h-3"
                  />
                  <span>Contém spoiler</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyContent("");
                    }}
                    className="px-2.5 py-1 text-xs font-sans text-ink-500 hover:text-ink-800 dark:hover:text-paper-100 transition"
                  >
                    Cancelar
                  </button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!replyContent.trim()}
                    isLoading={isSubmittingReply}
                    className="h-7 text-xs px-3"
                  >
                    Publicar resposta
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </article>
  );
}
