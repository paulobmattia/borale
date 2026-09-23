"use client";

import * as React from "react";

export interface AdSenseBannerProps {
  slotId?: string;
  format?: "auto" | "horizontal" | "rectangle";
  responsive?: boolean;
  className?: string;
}

export function AdSenseBanner({
  slotId,
  format = "auto",
  responsive = true,
  className = "",
}: AdSenseBannerProps) {
  const adRef = React.useRef<HTMLModElement>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const targetSlot = slotId || process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;
  const isDev = process.env.NODE_ENV === "development";

  React.useEffect(() => {
    if (!clientId) return;

    try {
      if (typeof window !== "undefined" && adRef.current) {
        // Evita erro de push duplicado no React StrictMode / navegação SPA
        const isLoaded = adRef.current.getAttribute("data-adsbygoogle-status") === "done";
        if (!isLoaded) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      }
    } catch {
      // Silencia erros normais de bloqueadores de anúncio ou re-renderizações
    }
  }, [clientId, targetSlot]);

  // Se não houver Client ID configurado no ambiente:
  if (!clientId) {
    if (isDev) {
      // Em desenvolvimento local, exibe um marcador discreto demonstrando o espaço reservado
      return (
        <aside
          aria-label="Espaço de Publicidade"
          className={`w-full max-w-4xl mx-auto my-6 p-3 rounded-lg border border-dashed border-line/60 dark:border-ink-line/60 bg-paper-200/20 dark:bg-ink-surface/20 text-center select-none ${className}`}
        >
          <span className="text-[9px] uppercase tracking-widest text-ink-400 dark:text-paper-300/50 font-sans block mb-0.5">
            Publicidade Discreta
          </span>
          <p className="text-xs font-sans text-ink-500/70 dark:text-paper-300/60">
            [Espaço reservado para Google AdSense · Configure{" "}
            <code className="text-[11px] font-mono bg-paper-200/50 dark:bg-ink-surface-2 px-1 py-0.5 rounded">
              NEXT_PUBLIC_ADSENSE_CLIENT_ID
            </code>
            ]
          </p>
        </aside>
      );
    }
    // Em produção, se a variável não estiver definida, não exibe nada
    return null;
  }

  return (
    <aside
      aria-label="Publicidade"
      className={`w-full max-w-4xl mx-auto my-6 flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <span className="text-[9px] uppercase tracking-widest text-ink-400 dark:text-paper-300/50 font-sans mb-1.5 select-none">
        Publicidade
      </span>
      <div className="w-full min-h-[90px] rounded-lg border border-line/40 dark:border-ink-line/40 bg-paper-200/20 dark:bg-ink-surface/20 flex items-center justify-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={clientId}
          {...(targetSlot ? { "data-ad-slot": targetSlot } : {})}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </aside>
  );
}
