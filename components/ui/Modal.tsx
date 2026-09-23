"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "relative w-full max-w-lg rounded-lg border border-line bg-paper-100 p-6 shadow-editorial",
          "dark:bg-ink-surface dark:border-ink-line animate-in zoom-in-95 duration-200",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm p-1 text-ink-500 hover:text-ink-900 dark:hover:text-paper-50 transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        {(title || description) && (
          <div className="mb-5 pr-6 space-y-1">
            {title && (
              <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-reading text-body text-ink-700 dark:text-paper-200">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Conteúdo */}
        <div>{children}</div>
      </div>
    </div>
  );
}
