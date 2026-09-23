"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";

export interface GenrePickerProps {
  selectedGenres: string[];
  onChange?: (genres: string[]) => void;
  readOnly?: boolean;
}

const AVAILABLE_GENRES = [
  "Ficção Brasileira",
  "Realismo Mágico",
  "Clássicos",
  "Filosofia",
  "Poesia",
  "Ensaio",
  "Ficção Científica",
  "Distopia",
  "Suspense / Mistério",
  "Teoria Literária",
  "Não Ficção",
  "Biografia",
];

export function GenrePicker({
  selectedGenres,
  onChange,
  readOnly = false,
}: GenrePickerProps) {
  const toggleGenre = (genre: string) => {
    if (readOnly || !onChange) return;
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200">
          Gêneros Favoritos
        </label>
        {!readOnly && (
          <span className="text-[11px] text-ink-500">
            Selecione seus interesses de leitura
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {AVAILABLE_GENRES.map((genre) => {
          const isSelected = selectedGenres.includes(genre);

          if (readOnly && !isSelected) {
            return null;
          }

          return (
            <button
              key={genre}
              type="button"
              disabled={readOnly}
              onClick={() => toggleGenre(genre)}
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full font-medium transition border ${
                isSelected
                  ? "bg-brand-700/15 text-brand-700 border-brand-700/40 dark:bg-brand-500/25 dark:text-brand-300 dark:border-brand-500/50 shadow-sm"
                  : "bg-paper-200/50 text-ink-700 border-line hover:bg-paper-200 dark:bg-ink-surface dark:text-paper-200 dark:border-ink-line"
              } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            >
              {isSelected && <Check className="w-3 h-3" />}
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
