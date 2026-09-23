"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, Clock, Calendar, Plus, Trash2 } from "lucide-react";

export interface MilestoneItem {
  id: string;
  title?: string | null;
  target_chapter?: number | null;
  target_page?: number | null;
  due_date: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
}

export interface MilestoneTimelineProps {
  milestones: MilestoneItem[];
  canEdit?: boolean;
  onAddMilestone?: (data: {
    title: string;
    target_chapter?: number;
    target_page?: number;
    due_date: string;
  }) => Promise<void> | void;
  onDeleteMilestone?: (milestoneId: string) => Promise<void> | void;
}

export function MilestoneTimeline({
  milestones,
  canEdit = false,
  onAddMilestone,
  onDeleteMilestone,
}: MilestoneTimelineProps) {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [chapter, setChapter] = React.useState("");
  const [page, setPage] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    try {
      setIsSubmitting(true);
      if (onAddMilestone) {
        await onAddMilestone({
          title: title.trim(),
          target_chapter: chapter ? parseInt(chapter, 10) : undefined,
          target_page: page ? parseInt(page, 10) : undefined,
          due_date: dueDate,
        });
      }
      setTitle("");
      setChapter("");
      setPage("");
      setDueDate("");
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!onDeleteMilestone) return;
    try {
      setDeletingId(id);
      await onDeleteMilestone(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200">
          Cronograma da Mesa {milestones.length > 0 && `(${milestones.length})`}
        </h3>

        {canEdit && milestones.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs py-1 px-2 h-auto text-brand-700 dark:text-brand-300"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Adicionar Meta
          </Button>
        )}
      </div>

      {milestones.length === 0 ? (
        <div className="p-6 rounded-lg border border-dashed border-line dark:border-ink-line bg-paper-100 dark:bg-ink-surface text-center space-y-3">
          <Calendar className="w-8 h-8 text-brand-700/60 dark:text-brand-300/60 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-ink-900 dark:text-paper-50 font-sans">
              Nenhum marco cadastrado ainda
            </p>
            <p className="text-xs text-ink-500 font-sans max-w-xs mx-auto">
              {canEdit
                ? "Defina prazos e metas de páginas ou capítulos para guiar a leitura conjunta."
                : "O organizador da mesa ainda não cadastrou os marcos de leitura."}
            </p>
          </div>
          {canEdit && (
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Adicionar Primeiro Marco
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {milestones.map((m, index) => {
            const cardStyle = m.isCurrent
              ? "border-l-4 border-l-amber-400 bg-amber-50/50 dark:bg-amber-950/25 border-amber-200/60 dark:border-amber-900/40 shadow-xs"
              : m.isCompleted
              ? "border-l-4 border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40"
              : "border-l-4 border-l-sky-400/70 bg-paper-100 dark:bg-ink-surface border-line dark:border-ink-line";

            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-lg border text-xs space-y-2.5 transition-colors group relative ${cardStyle}`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="flex-shrink-0 mt-0.5">
                      {m.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : m.isCurrent ? (
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-line dark:border-ink-line flex items-center justify-center text-[10px] text-ink-500 font-sans">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-sans font-semibold text-ink-900 dark:text-paper-50 leading-snug">
                        {m.title || `Meta ${index + 1}`}
                      </h4>
                      {(m.target_chapter || m.target_page) && (
                        <p className="text-[11px] text-ink-600 dark:text-paper-300 mt-0.5">
                          {m.target_chapter ? `Capítulo ${m.target_chapter}` : ""}
                          {m.target_chapter && m.target_page ? " · " : ""}
                          {m.target_page ? `Até Pág. ${m.target_page}` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {m.isCurrent && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-amber-200/90 text-amber-950 border border-amber-300 dark:bg-amber-900/60 dark:text-amber-100 dark:border-amber-700 shadow-xs">
                        Em curso
                      </span>
                    )}
                    {m.isCompleted && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-100 dark:border-emerald-700 shadow-xs">
                        Concluído
                      </span>
                    )}

                    {canEdit && onDeleteMilestone && (
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        disabled={deletingId === m.id}
                        title="Excluir marco"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-ink-500 dark:text-paper-300 pt-2 border-t border-line/60 dark:border-ink-line/60">
                  <span className="font-sans text-ink-400 dark:text-paper-300/70">
                    Prazo de leitura
                  </span>
                  <span className="flex items-center gap-1 font-medium text-ink-700 dark:text-paper-200">
                    <Calendar className="w-3 h-3 text-ink-400 dark:text-paper-300/70" />
                    {formatDate(m.due_date)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Adicionar Meta / Marco */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Adicionar Meta de Leitura"
        description="Defina um marco com prazo para orientar os leitores desta mesa."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Título da Meta"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Semana 1 · Primeiros capítulos"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Capítulo Alvo (opcional)"
              type="number"
              min="0"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="Ex: 5"
            />
            <Input
              label="Página Alvo (opcional)"
              type="number"
              min="0"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              placeholder="Ex: 80"
            />
          </div>

          <Input
            label="Prazo Final de Leitura"
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Criar Meta
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
