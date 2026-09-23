"use client";

import * as React from "react";
import { Check, Sparkles, Search, X } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = React.useState("");

  const toggleGenre = (genre: string) => {
    if (readOnly || !onChange) return;
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  const filteredGenres = React.useMemo(() => {
    if (!searchTerm.trim()) return AVAILABLE_GENRES;
    const term = searchTerm.toLowerCase().trim();
    return AVAILABLE_GENRES.filter((g) => g.toLowerCase().includes(term));
  }, [searchTerm]);

  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-700 dark:text-brand-300" />
          Gêneros Favoritos
        </label>
        {!readOnly && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-ink-500 font-sans">
              {selectedGenres.length}{" "}
              {selectedGenres.length === 1 ? "selecionado" : "selecionados"}
            </span>
            {selectedGenres.length > 0 && (
              <button
                type="button"
                onClick={() => onChange?.([])}
                className="text-[10px] text-ink-400 hover:text-ink-700 dark:hover:text-paper-200 underline font-sans"
              >
                Limpar
              </button>
            )}
          </div>
        )}
      </div>

      {!readOnly && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar gênero (ex: Terror, Contos, Distopia...)"
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-md border border-line bg-paper-200/50 dark:bg-ink-surface-2 dark:border-ink-line text-ink-900 dark:text-paper-50 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-ink-400 hover:text-ink-700 dark:hover:text-paper-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Caixa de Tags Rolável e Contida */}
      <div className="max-h-48 overflow-y-auto p-2.5 rounded-lg border border-line/70 dark:border-ink-line/70 bg-paper-200/30 dark:bg-ink-surface-2/30 flex flex-wrap gap-1.5 custom-scrollbar">
        {filteredGenres.map((genre) => {
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
                  : "bg-paper-100 text-ink-700 border-line hover:bg-paper-200 hover:border-ink-400 dark:bg-ink-surface dark:text-paper-200 dark:border-ink-line opacity-85"
              } ${readOnly ? "cursor-default" : "cursor-pointer active:scale-95"}`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
              {genre}
            </button>
          );
        })}

        {filteredGenres.length === 0 && (
          <p className="text-xs text-ink-500 py-3 w-full text-center font-sans">
            Nenhum gênero encontrado com &quot;{searchTerm}&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
