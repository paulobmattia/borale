"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ReactionType } from "@/types/database";
import {
  ThumbsUp,
  Check,
  Lightbulb,
  Sparkles,
  Flame,
  Heart,
} from "lucide-react";

export interface ReactionCount {
  type: ReactionType;
  count: number;
  userReacted: boolean;
}

export interface ReactionPickerProps {
  reactions: ReactionCount[];
  onToggleReaction: (type: ReactionType) => void;
  disabled?: boolean;
}

// Configuração das 6 reações expressivas com ícones Lucide (sem emojis, conforme design.md)
const REACTION_CONFIG: Record<
  ReactionType,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  LIKE: { label: "Gostei", icon: ThumbsUp },
  AGREE: { label: "Concordo", icon: Check },
  INSIGHT: { label: "Insight", icon: Lightbulb },
  MIND_BLOWN: { label: "Impactante", icon: Sparkles },
  ANGRY: { label: "Indignado", icon: Flame },
  LOVE: { label: "Amei", icon: Heart },
};

export function ReactionPicker({
  reactions,
  onToggleReaction,
  disabled = false,
}: ReactionPickerProps) {
  const reactionMap = React.useMemo(() => {
    const map = new Map<ReactionType, ReactionCount>();
    reactions.forEach((r) => map.set(r.type, r));
    return map;
  }, [reactions]);

  const allTypes: ReactionType[] = [
    "LIKE",
    "AGREE",
    "INSIGHT",
    "MIND_BLOWN",
    "ANGRY",
    "LOVE",
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      {allTypes.map((type) => {
        const data = reactionMap.get(type);
        const count = data?.count || 0;
        const userReacted = !!data?.userReacted;
        const config = REACTION_CONFIG[type];
        const Icon = config.icon;

        // Se ninguém reagiu e o leitor não interagiu, botão compacto e silencioso
        if (count === 0 && !userReacted) {
          return (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => onToggleReaction(type)}
              title={config.label}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-sans text-ink-500 hover:text-ink-900 hover:bg-paper-200/50 dark:hover:bg-ink-surface-2 dark:text-paper-200/70 dark:hover:text-paper-50 transition border border-transparent hover:border-line dark:hover:border-ink-line opacity-60 hover:opacity-100 min-h-[30px]"
            >
              <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
              <span className="hidden sm:inline text-[11px]">{config.label}</span>
            </button>
          );
        }

        return (
          <button
            key={type}
            type="button"
            disabled={disabled}
            onClick={() => onToggleReaction(type)}
            title={config.label}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-sans font-medium transition border select-none min-h-[30px]",
              userReacted
                ? "bg-brand-700/10 text-brand-700 border-brand-700/30 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/40 font-semibold"
                : "bg-paper-200/50 text-ink-700 border-line hover:bg-paper-200 dark:bg-ink-surface dark:text-paper-200 dark:border-ink-line hover:text-ink-900"
            )}
          >
            <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
            <span className="text-[11px]">{config.label}</span>
            <span className="text-[11px] opacity-75 font-mono">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
