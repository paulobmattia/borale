"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, BookOpen, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CreateMesaModal } from "@/components/modules/mesa/CreateMesaModal";

export interface DashboardMesaItem {
  id: string;
  title: string;
  book_title: string;
  book_author: string;
  book_cover_url?: string | null;
  members_count: number;
  current_page: number;
  total_pages: number;
  target_milestone?: string;
}

export interface DashboardViewProps {
  activeMesas?: DashboardMesaItem[];
}

export function DashboardView({
  activeMesas = [
    {
      id: "a-hora-da-estrela",
      title: "Mesa aberta",
      book_title: "A Hora da Estrela",
      book_author: "Clarice Lispector",
      members_count: 3,
      current_page: 42,
      total_pages: 110,
      target_milestone: "Cap. 2 · Até Pág. 75",
    },
  ],
}: DashboardViewProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-paper-100 dark:bg-ink-bg flex flex-col">
      {/* Barra de Navegação */}
      <header className="border-b border-line dark:border-ink-line bg-paper-100/90 dark:bg-ink-bg/90 backdrop-blur sticky top-0 z-10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="font-display text-3xl font-normal text-ink-900 dark:text-paper-50"
            >
              Boralê
            </Link>
            <Badge variant="brand" className="text-[10px]">
              Mesas Síncronas
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/perfil/me"
              className="text-sm font-medium text-ink-700 hover:text-ink-900 dark:text-paper-200 dark:hover:text-paper-50 transition"
            >
              Meu Perfil
            </Link>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Nova Mesa
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 space-y-10">
        <div>
          <h1 className="font-display text-h2 text-ink-900 dark:text-paper-50 mb-1">
            Minhas Mesas de Leitura
          </h1>
          <p className="font-reading text-body text-ink-700 dark:text-paper-200">
            Acompanhe o ritmo dos livros que você está lendo em conjunto com seu círculo.
          </p>
        </div>

        {/* Mesas em Andamento */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200">
              Em andamento ({activeMesas.length})
            </h2>
          </div>

          {activeMesas.length === 0 ? (
            <div className="p-8 rounded-lg border border-dashed border-line dark:border-ink-line text-center bg-paper-200/20 dark:bg-ink-surface/20 space-y-3">
              <BookOpen className="w-8 h-8 mx-auto text-ink-500 dark:text-paper-200/60" />
              <div className="max-w-md mx-auto">
                <h3 className="font-display text-h3 text-ink-900 dark:text-paper-50 mb-1">
                  Nenhuma mesa ativa no momento
                </h3>
                <p className="font-reading text-body text-ink-700 dark:text-paper-200">
                  Você ainda não participa de nenhuma leitura síncrona. Inicie uma mesa ou explore leituras em aberto.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Criar Minha Primeira Mesa
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMesas.map((mesa) => {
                const percentage = Math.min(
                  100,
                  Math.round((mesa.current_page / mesa.total_pages) * 100)
                );

                return (
                  <Link
                    key={mesa.id}
                    href={`/mesa/${mesa.id}`}
                    className="block group"
                  >
                    <Card
                      elevated
                      className="p-5 hover:border-brand-700/50 dark:hover:border-brand-500/50 transition"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-28 rounded bg-paper-300 dark:bg-ink-surface-2 border border-line dark:border-ink-line flex-shrink-0 flex items-center justify-center text-ink-700 dark:text-paper-200 font-display text-xs text-center p-2 shadow-sm">
                          {mesa.book_cover_url ? (
                            <img
                              src={mesa.book_cover_url}
                              alt={mesa.book_title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <span>{mesa.book_title}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <Badge variant="brand" className="text-[10px] mb-1">
                            {mesa.title}
                          </Badge>
                          <h3 className="font-display text-h3 text-ink-900 dark:text-paper-50 truncate group-hover:text-brand-700 dark:group-hover:text-brand-300 transition">
                            {mesa.book_title}
                          </h3>
                          <p className="font-reading text-xs italic text-ink-700 dark:text-paper-200 mb-3">
                            {mesa.book_author}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-ink-500 dark:text-paper-200/60">
                            <span className="inline-flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-brand-700 dark:text-brand-300" />{" "}
                              {mesa.members_count} leitores
                            </span>
                            {mesa.target_milestone && (
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />{" "}
                                {mesa.target_milestone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-line/50 dark:border-ink-line/50">
                        <div className="flex justify-between text-xs text-ink-700 dark:text-paper-200 mb-1">
                          <span>
                            Seu progresso: Pág. {mesa.current_page} /{" "}
                            {mesa.total_pages}
                          </span>
                          <span className="font-semibold text-brand-700 dark:text-brand-300">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-paper-300 dark:bg-ink-surface-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-700 dark:bg-brand-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Mesas Abertas para Descobrir */}
        <section className="space-y-4 pt-6 border-t border-line dark:border-ink-line">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200">
            Descobrir novas mesas públicas
          </h2>

          <div className="p-8 rounded-lg border border-dashed border-line dark:border-ink-line text-center bg-paper-200/20 dark:bg-ink-surface/20 space-y-3">
            <BookOpen className="w-8 h-8 mx-auto text-ink-500 dark:text-paper-200/60" />
            <div className="max-w-md mx-auto">
              <h3 className="font-display text-h3 text-ink-900 dark:text-paper-50 mb-1">
                Junte-se a outros leitores
              </h3>
              <p className="font-reading text-body text-ink-700 dark:text-paper-200">
                Explore mesas de clássicos da literatura, clubes do livro e lançamentos com debates síncronos.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Criar ou Encontrar uma Mesa
            </Button>
          </div>
        </section>
      </main>

      {/* Modal de Criação de Mesa */}
      <CreateMesaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
