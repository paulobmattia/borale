"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

export interface UseMesaRealtimeOptions {
  groupId: string;
  onCommentChange?: () => void;
  onReactionChange?: () => void;
  onProgressChange?: () => void;
}

export function useMesaRealtime({
  groupId,
  onCommentChange,
  onReactionChange,
  onProgressChange,
}: UseMesaRealtimeOptions) {
  React.useEffect(() => {
    // Só conecta se estiver no cliente e houver URL do Supabase definida
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !groupId) return;

    const supabase = createClient();
    const channel = supabase.channel(`mesa_realtime_${groupId}`);

    channel
      // Escuta novos comentários ou remoções
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `group_id=eq.${groupId}`,
        },
        () => {
          onCommentChange?.();
        }
      )
      // Escuta novas reações
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reactions",
        },
        () => {
          onReactionChange?.();
        }
      )
      // Escuta atualizações de progresso dos membros
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_progress",
          filter: `group_id=eq.${groupId}`,
        },
        () => {
          onProgressChange?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, onCommentChange, onReactionChange, onProgressChange]);
}
