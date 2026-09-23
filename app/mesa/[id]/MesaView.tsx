"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Users, ShieldAlert, Sparkles, BookOpen, UserPlus, Settings, Camera } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ReadingProgressBar,
  MesaMembers,
  MilestoneTimeline,
  EditMesaModal,
  type MesaMemberData,
  type MilestoneItem,
} from "@/components/modules/mesa";
import {
  CommentsList,
  type CommentData,
  type CommentReplyData,
} from "@/components/modules/comments";
import {
  updateReadingProgress,
  joinMesa,
} from "@/app/actions/mesa";
import {
  addComment,
  toggleReaction,
} from "@/app/actions/comments";
import { useMesaRealtime } from "@/lib/hooks/useMesaRealtime";
import type { ReactionType } from "@/types/database";

export interface MesaViewProps {
  id: string;
  initialMesa?: {
    title: string;
    book_title: string;
    book_author: string;
    book_cover_url?: string | null;
    is_private?: boolean;
  };
  initialMembers?: MesaMemberData[];
  initialMilestones?: MilestoneItem[];
  initialComments?: CommentData[];
  initialUserProgress?: {
    current_page: number;
    current_chapter: number;
  } | null;
  isMember?: boolean;
  canEdit?: boolean;
}

export function MesaView({
  id,
  initialMesa = {
    title: "Leitura Coletiva",
    book_title: "A Hora da Estrela",
    book_author: "Clarice Lispector",
    book_cover_url: null,
    is_private: false,
  },
  initialMembers = [
    {
      id: "1",
      username: "clarice_fan",
      display_name: "Mariana Santos",
      role: "admin",
      joined_at: "2026-09-10T10:00:00Z",
      current_page: 42,
      current_chapter: 1,
    },
    {
      id: "2",
      username: "lucas_leitor",
      display_name: "Lucas Lima",
      role: "member",
      joined_at: "2026-09-12T14:30:00Z",
      current_page: 58,
      current_chapter: 2,
    },
    {
      id: "3",
      username: "beatriz_livros",
      display_name: "Beatriz Nogueira",
      role: "member",
      joined_at: "2026-09-14T09:15:00Z",
      current_page: 35,
      current_chapter: 1,
    },
  ],
  initialMilestones = [
    {
      id: "m1",
      title: "Semana 1 · Início de Macabéa",
      target_chapter: 1,
      target_page: 40,
      due_date: "2026-09-15T23:59:59Z",
      isCompleted: true,
    },
    {
      id: "m2",
      title: "Semana 2 · O Encontro com Olímpico",
      target_chapter: 2,
      target_page: 75,
      due_date: "2026-09-25T23:59:59Z",
      isCurrent: true,
    },
    {
      id: "m3",
      title: "Semana 3 · A Consulta com a Cartomante e Fim",
      target_chapter: 3,
      target_page: 110,
      due_date: "2026-10-02T23:59:59Z",
    },
  ],
  initialComments = [
    {
      id: "c1",
      user_id: "1",
      author_name: "Mariana Santos",
      author_username: "clarice_fan",
      chapter_ref: 1,
      page_ref: 18,
      content:
        "“A datilógrafa vivia numa espécie de névoa...” A maneira como o narrador Rodrigo S.M. interrompe a própria história para falar de si mesmo estabelece um pacto reflexivo raro com o leitor.",
      has_spoiler: false,
      created_at: "2026-09-15T18:20:00Z",
      reactions: [
        { type: "INSIGHT", count: 4, userReacted: true },
        { type: "LIKE", count: 2, userReacted: false },
        { type: "AGREE", count: 3, userReacted: false },
      ],
    },
    {
      id: "c2",
      user_id: "2",
      author_name: "Lucas Lima",
      author_username: "lucas_leitor",
      chapter_ref: 2,
      page_ref: 58,
      content:
        "O diálogo entre Macabéa e Olímpico de Jesus no banco da praça é uma das coisas mais dilacerantes da literatura brasileira. Cada pergunta sem resposta mútua expõe o abismo da incomunicabilidade.",
      has_spoiler: false,
      created_at: "2026-09-20T21:40:00Z",
      reactions: [
        { type: "MIND_BLOWN", count: 2, userReacted: false },
        { type: "LOVE", count: 3, userReacted: false },
      ],
    },
  ],
  initialUserProgress = {
    current_page: 42,
    current_chapter: 1,
  },
  isMember = true,
  canEdit = false,
}: MesaViewProps) {
  const [mesa, setMesa] = React.useState(initialMesa);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  React.useEffect(() => {
    setMesa(initialMesa);
  }, [initialMesa]);

  const [userProgress, setUserProgress] = React.useState(
    initialUserProgress || { current_page: 0, current_chapter: 0 }
  );
  const [members, setMembers] = React.useState<MesaMemberData[]>(initialMembers);
  const [milestones, setMilestones] = React.useState<MilestoneItem[]>(initialMilestones);
  const [comments, setComments] = React.useState<CommentData[]>(initialComments);
  const [isGroupMember, setIsGroupMember] = React.useState(isMember);
  const [isJoining, setIsJoining] = React.useState(false);

  // Inscrição em tempo real no Supabase Realtime
  useMesaRealtime({
    groupId: id,
    onCommentChange: () => {},
    onReactionChange: () => {},
    onProgressChange: () => {},
  });

  const handleJoinMesa = async () => {
    try {
      setIsJoining(true);
      await joinMesa(id);
      setIsGroupMember(true);
      setMembers((prev) => [
        ...prev,
        {
          id: "current_user",
          username: "voce",
          display_name: "Você",
          role: "member",
          joined_at: new Date().toISOString(),
          current_page: 0,
          current_chapter: 0,
        },
      ]);
    } catch {
      // Fallback otimista durante desenvolvimento
      setIsGroupMember(true);
    } finally {
      setIsJoining(false);
    }
  };

  const handleUpdateProgress = async (page: number, chapter: number) => {
    setUserProgress({ current_page: page, current_chapter: chapter });

    try {
      await updateReadingProgress(id, page, chapter);
    } catch {
      // Fallback em desenvolvimento
    }
  };

  const handleAddComment = async (data: {
    content: string;
    chapter_ref?: number;
    page_ref?: number;
    has_spoiler: boolean;
  }) => {
    const optimisticComment: CommentData = {
      id: `c_${Date.now()}`,
      user_id: "current_user",
      author_name: "Você",
      author_username: "leitor",
      chapter_ref: data.chapter_ref || userProgress.current_chapter,
      page_ref: data.page_ref || userProgress.current_page,
      content: data.content,
      has_spoiler: data.has_spoiler,
      created_at: new Date().toISOString(),
      reactions: [],
    };

    setComments((prev) => [optimisticComment, ...prev]);

    try {
      await addComment({
        groupId: id,
        content: data.content,
        chapterRef: data.chapter_ref,
        pageRef: data.page_ref,
        hasSpoiler: data.has_spoiler,
      });
    } catch {
      // Fallback gracioso
    }
  };

  const handleAddReply = async (
    parentId: string,
    data: { content: string; has_spoiler: boolean }
  ) => {
    const optimisticReply: CommentReplyData = {
      id: `rep_${Date.now()}`,
      parent_id: parentId,
      user_id: "current_user",
      author_name: "Você",
      author_username: "leitor",
      content: data.content,
      has_spoiler: data.has_spoiler,
      created_at: new Date().toISOString(),
      reactions: [],
    };

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), optimisticReply],
          };
        }
        return comment;
      })
    );

    try {
      await addComment({
        groupId: id,
        parentId,
        content: data.content,
        hasSpoiler: data.has_spoiler,
      });
    } catch {
      // Fallback gracioso
    }
  };

  const updateReactionsHelper = (reactions: any[], type: ReactionType) => {
    const list = [...reactions];
    const existingIndex = list.findIndex((r) => r.type === type);
    if (existingIndex >= 0) {
      const current = list[existingIndex];
      if (current.userReacted) {
        list[existingIndex] = {
          ...current,
          count: Math.max(0, current.count - 1),
          userReacted: false,
        };
      } else {
        list[existingIndex] = {
          ...current,
          count: current.count + 1,
          userReacted: true,
        };
      }
    } else {
      list.push({ type, count: 1, userReacted: true });
    }
    return list;
  };

  const handleToggleReaction = async (commentId: string, type: ReactionType) => {
    setComments((prev) =>
      prev.map((comment) => {
        // Se for o comentário raiz
        if (comment.id === commentId) {
          return {
            ...comment,
            reactions: updateReactionsHelper(comment.reactions || [], type),
          };
        }

        // Se for uma resposta aninhada dentro de replies
        if (comment.replies && comment.replies.some((r) => r.id === commentId)) {
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === commentId) {
              return {
                ...reply,
                reactions: updateReactionsHelper(reply.reactions || [], type),
              };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }

        return comment;
      })
    );

    try {
      await toggleReaction(id, commentId, type);
    } catch {
      // Fallback gracioso
    }
  };

  return (
    <div className="min-h-screen bg-paper-100 dark:bg-ink-bg flex flex-col">
      {/* Topo da Mesa */}
      <header className="border-b border-line dark:border-ink-line bg-paper-100/90 dark:bg-ink-bg/90 backdrop-blur sticky top-0 z-10 px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-700 hover:text-ink-900 dark:text-paper-200 dark:hover:text-paper-50 transition min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </Link>
          <div className="flex items-center gap-3">
            {canEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                leftIcon={<Settings className="w-3.5 h-3.5" />}
              >
                Editar Mesa
              </Button>
            )}

            {!isGroupMember ? (
              <Button
                size="sm"
                onClick={handleJoinMesa}
                isLoading={isJoining}
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              >
                Ingressar na Mesa
              </Button>
            ) : (
              <Badge variant="brand" className="text-[11px]">
                Mesa Síncrona
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Banner para Visitantes */}
        {!isGroupMember && (
          <div className="p-4 rounded-lg bg-paper-200/60 dark:bg-ink-surface border border-line dark:border-ink-line flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="font-reading text-body text-ink-700 dark:text-paper-200">
              Você está visitando esta mesa pública. Ingresse para sincronizar seu ritmo e publicar anotações na margem.
            </p>
            <Button
              size="sm"
              onClick={handleJoinMesa}
              isLoading={isJoining}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Participar da Leitura
            </Button>
          </div>
        )}

        {/* Cabeçalho Editorial do Livro */}
        <div className="flex flex-col md:flex-row gap-6 items-start pb-8 border-b border-line dark:border-ink-line">
          <div className="relative group/cover w-32 h-44 rounded bg-paper-300 dark:bg-ink-surface-2 border border-line dark:border-ink-line flex-shrink-0 flex items-center justify-center text-center p-3 font-display text-base text-ink-700 dark:text-paper-200 shadow-editorial overflow-hidden">
            {mesa.book_cover_url ? (
              <img
                src={mesa.book_cover_url}
                alt={mesa.book_title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{mesa.book_title}</span>
            )}

            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                title="Alterar capa da mesa"
                className="absolute inset-0 bg-ink-950/75 opacity-0 group-hover/cover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-paper-50 p-2 text-center text-xs font-sans font-medium"
              >
                <Camera className="w-5 h-5 text-brand-300" />
                <span className="text-[11px] leading-tight">Trocar Capa</span>
              </button>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-widest text-brand-700 dark:text-brand-300 font-semibold px-2 py-0.5 rounded bg-paper-200 dark:bg-ink-surface border border-line dark:border-ink-line">
                {mesa.title}
              </span>
              <span className="text-xs text-ink-500 dark:text-paper-200/60 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {members.length} leitores
              </span>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-brand-700 dark:text-brand-300 hover:underline inline-flex items-center gap-1 ml-2 font-medium"
                >
                  <Settings className="w-3 h-3" /> Editar informações
                </button>
              )}
            </div>

            <h1 className="font-display text-h1 text-ink-900 dark:text-paper-50 leading-tight">
              {mesa.book_title}
            </h1>
            <p className="font-reading text-body-lg text-ink-700 dark:text-paper-200 italic">
              {mesa.book_author}
            </p>
            <p className="font-reading text-body text-ink-700 dark:text-paper-200 max-w-2xl leading-relaxed">
              Mesa de leitura compartilhada. Notas da margem, marcos semanais e reações sincronizadas entre leitores.
            </p>
          </div>
        </div>

        {/* Barra de Progresso do Leitor Conectada */}
        <ReadingProgressBar
          currentPage={userProgress.current_page}
          currentChapter={userProgress.current_chapter}
          totalPages={110}
          targetPage={75}
          onUpdateProgress={handleUpdateProgress}
          canEdit={isGroupMember}
        />

        {/* Grid de 2 Colunas: Notas na Margem (Principal) e Lateral (Membros + Cronograma) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda: Discussão e Notas de Margem com Anti-Spoiler */}
          <div className="lg:col-span-2 space-y-6">
            <CommentsList
              comments={comments}
              currentUserProgress={userProgress}
              onAddComment={handleAddComment}
              onToggleReaction={handleToggleReaction}
              onAddReply={handleAddReply}
            />
          </div>

          {/* Coluna da Direita: Membros da Mesa e Cronograma de Metas */}
          <div className="space-y-6">
            <MesaMembers members={members} />
            <MilestoneTimeline milestones={milestones} />
          </div>
        </div>
      </main>

      {/* Modal de Edição de Mesa */}
      <EditMesaModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        groupId={id}
        initialData={mesa}
        onSaved={(updated) =>
          setMesa((prev) => ({
            ...prev,
            ...updated,
          }))
        }
      />
    </div>
  );
}
