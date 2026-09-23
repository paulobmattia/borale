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
                    <Badge variant="brand" className="text-[10px] px-1 py-0 gap-0.5">
                      <Crown className="w-2.5 h-2.5" /> Admin
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-ink-500 dark:text-paper-200/60 block">
                  @{member.username}
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              {member.current_page != null && (
                <div className="inline-flex items-center gap-1 text-xs font-medium text-ink-700 dark:text-paper-200 bg-paper-200/60 dark:bg-ink-surface-2 px-2 py-0.5 rounded border border-line dark:border-ink-line">
                  <BookOpen className="w-3 h-3 text-brand-700 dark:text-brand-300" />
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
