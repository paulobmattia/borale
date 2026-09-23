import * as React from "react";
import { BookOpen, Users, MessageSquare, Flame } from "lucide-react";

export interface ReaderStatsData {
  activeGroups: number;
  completedBooks: number;
  totalNotes: number;
  pagesRead?: number;
}

export interface ReaderStatsProps {
  stats: ReaderStatsData;
}

export function ReaderStats({ stats }: ReaderStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="p-4 rounded-lg bg-paper-200/40 dark:bg-ink-surface border border-line dark:border-ink-line">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1">
          <Users className="w-3.5 h-3.5 text-brand-700 dark:text-brand-300" />
          <span>Mesas ativas</span>
        </div>
        <span className="font-display text-h2 text-ink-900 dark:text-paper-50 leading-none">
          {stats.activeGroups}
        </span>
      </div>

      <div className="p-4 rounded-lg bg-paper-200/40 dark:bg-ink-surface border border-line dark:border-ink-line">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>Livros lidos</span>
        </div>
        <span className="font-display text-h2 text-ink-900 dark:text-paper-50 leading-none">
          {stats.completedBooks}
        </span>
      </div>

      <div className="p-4 rounded-lg bg-paper-200/40 dark:bg-ink-surface border border-line dark:border-ink-line">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1">
          <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Notas na margem</span>
        </div>
        <span className="font-display text-h2 text-ink-900 dark:text-paper-50 leading-none">
          {stats.totalNotes}
        </span>
      </div>

      <div className="p-4 rounded-lg bg-paper-200/40 dark:bg-ink-surface border border-line dark:border-ink-line">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1">
          <Flame className="w-3.5 h-3.5 text-brand-500" />
          <span>Páginas lidas</span>
        </div>
        <span className="font-display text-h2 text-ink-900 dark:text-paper-50 leading-none">
          {stats.pagesRead || 0}
        </span>
      </div>
    </div>
  );
}
