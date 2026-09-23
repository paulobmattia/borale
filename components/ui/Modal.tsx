"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  footer,
  children,
  className,
}: ModalProps) {
  // Fecha ao pressionar Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-ink-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-6 flex items-center justify-center min-h-screen"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[88vh] flex flex-col rounded-lg border border-line bg-paper-100 shadow-editorial my-auto",
          "dark:bg-ink-surface dark:border-ink-line animate-in zoom-in-95 duration-200 overflow-hidden",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-md p-1.5 text-ink-500 hover:text-ink-900 dark:hover:text-paper-50 hover:bg-paper-200/60 dark:hover:bg-ink-surface-2 transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho Fixo */}
        {(title || description) && (
          <div className="p-6 pb-4 border-b border-line/60 dark:border-ink-line/60 pr-12 space-y-1 flex-shrink-0 bg-paper-100 dark:bg-ink-surface">
            {title && (
              <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 leading-snug">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-reading text-xs text-ink-700 dark:text-paper-200 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Conteúdo com Rolagem Suave */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
          {children}
        </div>

        {/* Rodapé Fixo Opcional */}
        {footer && (
          <div className="p-4 px-6 border-t border-line/70 dark:border-ink-line/70 bg-paper-100/95 dark:bg-ink-surface/95 backdrop-blur flex-shrink-0 flex justify-end gap-2 z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
