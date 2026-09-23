import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, Clock, Calendar } from "lucide-react";

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
}

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  if (milestones.length === 0) {
    return (
      <div className="p-4 rounded-lg border border-line bg-paper-100 dark:bg-ink-surface text-center">
        <p className="text-xs text-ink-500 font-sans">
          Nenhum marco cadastrado para esta mesa ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200">
        Cronograma da Mesa
      </h3>

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
              className={`p-3.5 rounded-lg border text-xs space-y-2.5 transition-colors ${cardStyle}`}
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
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink-500 dark:text-paper-300 pt-2 border-t border-line/60 dark:border-ink-line/60">
                <span className="font-sans text-ink-400 dark:text-paper-300/70">Prazo de leitura</span>
                <span className="flex items-center gap-1 font-medium text-ink-700 dark:text-paper-200">
                  <Calendar className="w-3 h-3 text-ink-400 dark:text-paper-300/70" />
                  {formatDate(m.due_date)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
