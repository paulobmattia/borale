"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";

export interface BookItem {
  id: string;
  title: string;
  author: string;
  cover_url?: string | null;
  status: "reading" | "completed" | "want_to_read";
  current_page?: number;
  total_pages?: number;
  mesa_id?: string;
}

export interface BookshelfProps {
  books: BookItem[];
}

export function Bookshelf({ books }: BookshelfProps) {
  const [activeTab, setActiveTab] = React.useState<
    "reading" | "completed" | "want_to_read"
  >("reading");

  const filteredBooks = books.filter((b) => b.status === activeTab);

  return (
    <div className="space-y-4">
      {/* Abas da Estante */}
      <div className="flex border-b border-line dark:border-ink-line gap-6">
        <button
          onClick={() => setActiveTab("reading")}
          className={`pb-2.5 text-sm font-sans font-semibold transition border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "reading"
              ? "border-brand-700 text-brand-700 dark:border-brand-300 dark:text-brand-300"
              : "border-transparent text-ink-500 hover:text-ink-900 dark:text-paper-200"
          }`}
        >
          <Clock className="w-4 h-4" />
          Lendo Agora ({books.filter((b) => b.status === "reading").length})
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-2.5 text-sm font-sans font-semibold transition border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "completed"
              ? "border-brand-700 text-brand-700 dark:border-brand-300 dark:text-brand-300"
              : "border-transparent text-ink-500 hover:text-ink-900 dark:text-paper-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Lidos ({books.filter((b) => b.status === "completed").length})
        </button>

        <button
          onClick={() => setActiveTab("want_to_read")}
          className={`pb-2.5 text-sm font-sans font-semibold transition border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "want_to_read"
              ? "border-brand-700 text-brand-700 dark:border-brand-300 dark:text-brand-300"
              : "border-transparent text-ink-500 hover:text-ink-900 dark:text-paper-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Quero Ler ({books.filter((b) => b.status === "want_to_read").length})
        </button>
      </div>

      {/* Grid de Livros na Estante */}
      {filteredBooks.length === 0 ? (
        <div className="p-8 text-center rounded-lg border border-dashed border-line dark:border-ink-line bg-paper-200/20">
          <p className="font-reading text-body text-ink-700 dark:text-paper-200">
            Nenhum livro nesta seção da estante ainda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredBooks.map((book) => {
            const progress =
              book.current_page && book.total_pages
                ? Math.round((book.current_page / book.total_pages) * 100)
                : 0;

            const cardContent = (
              <div className="group rounded-md border border-line bg-paper-100 dark:bg-ink-surface dark:border-ink-line p-3 flex flex-col justify-between space-y-2 hover:shadow-editorial hover:border-brand-500/50 transition h-full">
                {/* Capa */}
                <div className="w-full aspect-[2/3] rounded bg-paper-300 dark:bg-ink-surface-2 border border-line dark:border-ink-line flex items-center justify-center p-2 text-center text-xs font-display text-ink-700 dark:text-paper-200 shadow-sm overflow-hidden">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span>{book.title}</span>
                  )}
                </div>

                <div>
                  <h4 className="font-display text-sm font-semibold text-ink-900 dark:text-paper-50 truncate group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                    {book.title}
                  </h4>
                  <p className="font-reading text-xs italic text-ink-700 dark:text-paper-200 truncate">
                    {book.author}
                  </p>
                </div>

                {book.current_page !== undefined && (
                  <div className="space-y-1 pt-1 border-t border-line/40">
                    <div className="flex justify-between text-[11px] text-ink-500 dark:text-paper-200/60 font-sans">
                      <span>Pág. {book.current_page}</span>
                      {book.total_pages && <span>{progress}%</span>}
                    </div>
                    {book.total_pages && (
                      <div className="w-full h-1 bg-paper-300 dark:bg-ink-surface-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-700 dark:bg-brand-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );

            return book.mesa_id ? (
              <Link key={book.id} href={`/mesa/${book.mesa_id}`} className="block">
                {cardContent}
              </Link>
            ) : (
              <div key={book.id}>{cardContent}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
