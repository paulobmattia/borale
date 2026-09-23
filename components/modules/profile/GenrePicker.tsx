"use client";

import * as React from "react";
import { Check, Sparkles } from "lucide-react";

export interface GenrePickerProps {
  selectedGenres: string[];
  onChange?: (genres: string[]) => void;
  readOnly?: boolean;
}

export const AVAILABLE_GENRES = [
  "Aventura",
  "Biografia / Memórias",
  "Clássicos",
  "Contos",
  "Crítica Literária",
  "Crônicas",
  "Desenvolvimento Pessoal",
  "Distopia",
  "Drama / Teatro",
  "Ensaio",
  "Fantasia",
  "Ficção Brasileira",
  "Ficção Científica",
  "Ficção Histórica",
  "Filosofia",
  "Gótico",
  "Graphic Novels / HQs",
  "História",
  "Infantojuvenil / YA",
  "Literatura Estrangeira",
  "Mitologia / Folclore",
  "Não Ficção",
  "Poesia",
  "Policial / Thriller",
  "Realismo Mágico",
  "Romance",
  "Suspense / Mistério",
  "Terror / Horror",
];

/**
 * Retorna uma combinação de cores pastel de marcador / post-it estável por gênero
 */
export function getGenreHighlightColor(genre: string): string {
  const colors = [
    // Amarelo marca-texto clássico
    "bg-amber-100/90 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700",
    // Rosa marca-texto
    "bg-rose-100/90 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-700",
    // Verde menta marca-texto
    "bg-emerald-100/90 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-700",
    // Azul celeste / Post-it
    "bg-sky-100/90 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-700",
    // Lavanda / Lilás
    "bg-purple-100/90 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-700",
    // Laranja pêssego
    "bg-orange-100/90 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-700",
    // Verde limão marca-texto
    "bg-lime-100/90 text-lime-900 border-lime-300 dark:bg-lime-950/60 dark:text-lime-200 dark:border-lime-700",
    // Carmim / Sangria
    "bg-red-100/90 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-200 dark:border-red-700",
    // Azul anil profundo
    "bg-indigo-100/90 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-700",
    // Terracota suave
    "bg-amber-200/70 text-amber-950 border-amber-400 dark:bg-amber-900/60 dark:text-amber-100 dark:border-amber-600",
  ];

  let hash = 0;
  for (let i = 0; i < genre.length; i++) {
    hash = (hash << 5) - hash + genre.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

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
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-700 dark:text-brand-300" />
          Gêneros Favoritos
        </label>
        {!readOnly && (
          <span className="text-[11px] text-ink-500">
            {selectedGenres.length}{" "}
            {selectedGenres.length === 1 ? "selecionado" : "selecionados"}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {AVAILABLE_GENRES.map((genre) => {
          const isSelected = selectedGenres.includes(genre);

          if (readOnly && !isSelected) {
            return null;
          }

          const highlightStyle = getGenreHighlightColor(genre);

          return (
            <button
              key={genre}
              type="button"
              disabled={readOnly}
              onClick={() => toggleGenre(genre)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-medium transition border shadow-xs ${
                isSelected
                  ? `${highlightStyle} shadow-sm scale-100 font-semibold`
                  : "bg-paper-200/50 text-ink-700 border-line hover:bg-paper-200 hover:border-ink-400 dark:bg-ink-surface dark:text-paper-200 dark:border-ink-line opacity-85"
              } ${readOnly ? "cursor-default" : "cursor-pointer active:scale-95"}`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
