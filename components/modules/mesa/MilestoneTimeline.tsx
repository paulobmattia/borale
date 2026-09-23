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
          return (
            <div
              key={m.id}
              className="p-3.5 rounded-lg border border-line bg-paper-100 dark:bg-ink-surface dark:border-ink-line text-xs space-y-2.5 transition-colors"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="flex-shrink-0 mt-0.5">
                    {m.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    ) : m.isCurrent ? (
                      <Clock className="w-4 h-4 text-brand-700 dark:text-brand-300 animate-pulse" />
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
                      <p className="text-[11px] text-ink-500 dark:text-paper-300 mt-0.5">
                        {m.target_chapter ? `Capítulo ${m.target_chapter}` : ""}
                        {m.target_chapter && m.target_page ? " · " : ""}
                        {m.target_page ? `Até Pág. ${m.target_page}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                {m.isCurrent && (
                  <Badge variant="brand" className="text-[10px]">
                    Em curso
                  </Badge>
                )}
                {m.isCompleted && (
                  <Badge variant="success" className="text-[10px]">
                    Concluído
                  </Badge>
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
