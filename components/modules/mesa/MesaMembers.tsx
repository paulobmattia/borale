import * as React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Crown, BookOpen } from "lucide-react";

export interface MesaMemberData {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  role: "admin" | "member";
  joined_at: string;
  current_page?: number;
  current_chapter?: number;
}

export interface MesaMembersProps {
  members: MesaMemberData[];
}

export function MesaMembers({ members }: MesaMembersProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200">
          Leitores na Mesa ({members.length})
        </h3>
      </div>

      <div className="divide-y divide-line/60 dark:divide-ink-line/60 rounded-lg border border-line bg-paper-100 dark:bg-ink-surface dark:border-ink-line overflow-hidden">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 hover:bg-paper-200/40 dark:hover:bg-ink-surface-2 transition duration-150"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                src={member.avatar_url}
                fallbackText={member.display_name}
                size="sm"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-sans text-sm font-semibold text-ink-900 dark:text-paper-50 truncate">
                    {member.display_name}
                  </span>
                  {member.role === "admin" && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium font-sans px-1.5 py-0 rounded bg-amber-200/80 text-amber-950 border border-amber-300 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700">
                      <Crown className="w-2.5 h-2.5 text-amber-700 dark:text-amber-400" /> Admin
                    </span>
                  )}
                </div>
                <span className="text-xs text-ink-500 dark:text-paper-200/60 block">
                  @{member.username}
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              {member.current_page != null && (
                <div className="inline-flex items-center gap-1 text-xs font-medium text-amber-950 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-300/70 dark:border-amber-800/60 shadow-2xs">
                  <BookOpen className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                  <span>
                    {member.current_chapter ? `Cap. ${member.current_chapter} · ` : ""}
                    Pág. {member.current_page}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
