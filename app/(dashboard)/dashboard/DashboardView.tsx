"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, BookOpen, Clock, Users, ArrowRight, Compass, Library } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CreateMesaModal } from "@/components/modules/mesa/CreateMesaModal";
import { AdSenseBanner } from "@/components/ui/AdSenseBanner";

export interface DashboardMesaItem {
  id: string;
  title: string;
  book_title: string;
  book_author: string;
  book_cover_url?: string | null;
  members_count: number;
  current_page: number;
  total_pages?: number;
  target_milestone?: string;
  is_member?: boolean;
}

export interface DashboardViewProps {
  myMesas?: DashboardMesaItem[];
  publicMesas?: DashboardMesaItem[];
}

export function DashboardView({
  myMesas = [],
  publicMesas = [],
}: DashboardViewProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"my" | "explore">("my");

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
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div>
          <h1 className="font-display text-h2 text-ink-900 dark:text-paper-50 mb-1">
            Painel de Leitura
          </h1>
          <p className="font-reading text-body text-ink-700 dark:text-paper-200">
            Acompanhe suas leituras coletivas ativas ou descubra novas obras com a comunidade.
          </p>
        </div>

        {/* Abas de Navegação das Mesas */}
        <div className="flex border-b border-line dark:border-ink-line gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("my")}
            className={`pb-3 px-3 text-sm font-medium flex items-center gap-2 border-b-2 transition -mb-px ${
              activeTab === "my"
                ? "border-brand-700 text-brand-700 dark:border-brand-400 dark:text-brand-300 font-semibold"
                : "border-transparent text-ink-600 dark:text-paper-300 hover:text-ink-900 dark:hover:text-paper-50"
            }`}
          >
            <Library className="w-4 h-4" />
            Minhas Mesas
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700 font-semibold shadow-2xs">
              {myMesas.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("explore")}
            className={`pb-3 px-3 text-sm font-medium flex items-center gap-2 border-b-2 transition -mb-px ${
              activeTab === "explore"
                ? "border-brand-700 text-brand-700 dark:border-brand-400 dark:text-brand-300 font-semibold"
                : "border-transparent text-ink-600 dark:text-paper-300 hover:text-ink-900 dark:hover:text-paper-50"
            }`}
          >
            <Compass className="w-4 h-4" />
            Explorar Mesas Abertas
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-700 font-semibold shadow-2xs">
              {publicMesas.length}
            </span>
          </button>
        </div>

        {/* Conteúdo da Aba Ativa */}
        {activeTab === "my" && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200">
                Mesas em que você participa ({myMesas.length})
              </h2>
            </div>

            {myMesas.length === 0 ? (
              <div className="p-8 rounded-lg border border-dashed border-line dark:border-ink-line text-center bg-paper-200/20 dark:bg-ink-surface/20 space-y-4">
                <BookOpen className="w-10 h-10 mx-auto text-ink-500 dark:text-paper-200/60 stroke-[1.5]" />
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-display text-h3 text-ink-900 dark:text-paper-50">
                    Você ainda não participa de nenhuma mesa
                  </h3>
                  <p className="font-reading text-body text-ink-700 dark:text-paper-200">
                    Inicie uma nova mesa com seus amigos ou participe das mesas públicas já existentes na comunidade.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Criar Minha Primeira Mesa
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab("explore")}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Ver Mesas Abertas da Comunidade
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myMesas.map((mesa) => {
                  const hasTotalPages = Boolean(mesa.total_pages && mesa.total_pages > 0);
                  const percentage = hasTotalPages
                    ? Math.min(100, Math.round((mesa.current_page / (mesa.total_pages || 1)) * 100))
                    : 0;

                  return (
                    <Link
                      key={mesa.id}
                      href={`/mesa/${mesa.id}`}
                      className="block group"
                    >
                      <Card
                        elevated
                        className="p-5 hover:border-brand-700/50 dark:hover:border-brand-500/50 transition h-full flex flex-col justify-between"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-28 rounded bg-paper-300 dark:bg-ink-surface-2 border border-line dark:border-ink-line flex-shrink-0 flex items-center justify-center text-ink-700 dark:text-paper-200 font-display text-xs text-center p-2 shadow-sm overflow-hidden">
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
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-900/60 dark:text-amber-100 dark:border-amber-700 shadow-2xs mb-1">
                              {mesa.title}
                            </span>
                            <h3 className="font-display text-h3 text-ink-900 dark:text-paper-50 truncate group-hover:text-brand-700 dark:group-hover:text-brand-300 transition">
                              {mesa.book_title}
                            </h3>
                            <p className="font-reading text-xs italic text-ink-700 dark:text-paper-200 mb-3">
                              {mesa.book_author}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500 dark:text-paper-200/60">
                              <span className="inline-flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-brand-700 dark:text-brand-300" />{" "}
                                {mesa.members_count} leitores
                              </span>
                              {mesa.target_milestone && (
                                <span className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />{" "}
                                  {mesa.target_milestone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-line/50 dark:border-ink-line/50">
                          <div className="flex justify-between text-xs text-ink-700 dark:text-paper-200 mb-1">
                            <span>
                              {hasTotalPages
                                ? `Seu progresso: Pág. ${mesa.current_page} / ${mesa.total_pages}`
                                : `Seu progresso atual: Pág. ${mesa.current_page}`}
                            </span>
                            {hasTotalPages && (
                              <span className="font-semibold text-brand-700 dark:text-brand-300">
                                {percentage}%
                              </span>
                            )}
                          </div>
                          {hasTotalPages && (
                            <div className="w-full h-1.5 bg-paper-300 dark:bg-ink-surface-2 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-brand-700 via-amber-600 to-amber-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === "explore" && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-paper-200">
                  Mesas Abertas da Comunidade ({publicMesas.length})
                </h2>
                <p className="text-xs text-ink-500 dark:text-paper-200/70 mt-0.5">
                  Qualquer leitor pode ingressar, participar do ritmo conjunto e debater nas margens.
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Criar Mesa Pública
              </Button>
            </div>

            {publicMesas.length === 0 ? (
              <div className="p-8 rounded-lg border border-dashed border-line dark:border-ink-line text-center bg-paper-200/20 dark:bg-ink-surface/20 space-y-3">
                <BookOpen className="w-8 h-8 mx-auto text-ink-500 dark:text-paper-200/60" />
                <div className="max-w-md mx-auto">
                  <h3 className="font-display text-h3 text-ink-900 dark:text-paper-50 mb-1">
                    Nenhuma mesa aberta disponível
                  </h3>
                  <p className="font-reading text-body text-ink-700 dark:text-paper-200">
                    Seja a primeira pessoa a abrir uma leitura coletiva pública para outros leitores do Boralê!
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Criar Mesa Pública
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publicMesas.map((mesa) => (
                  <Link
                    key={mesa.id}
                    href={`/mesa/${mesa.id}`}
                    className="block group"
                  >
                    <Card
                      elevated
                      className="p-5 hover:border-brand-700/50 dark:hover:border-brand-500/50 transition h-full flex flex-col justify-between"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-28 rounded bg-paper-300 dark:bg-ink-surface-2 border border-line dark:border-ink-line flex-shrink-0 flex items-center justify-center text-ink-700 dark:text-paper-200 font-display text-xs text-center p-2 shadow-sm overflow-hidden">
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
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-900/60 dark:text-amber-100 dark:border-amber-700 shadow-2xs">
                              {mesa.title}
                            </span>
                            {mesa.is_member && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-100 dark:border-emerald-700 shadow-2xs">
                                Você participa
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-h3 text-ink-900 dark:text-paper-50 truncate group-hover:text-brand-700 dark:group-hover:text-brand-300 transition">
                            {mesa.book_title}
                          </h3>
                          <p className="font-reading text-xs italic text-ink-700 dark:text-paper-200 mb-3">
                            {mesa.book_author}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500 dark:text-paper-200/60">
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

                      <div className="mt-4 pt-3 border-t border-line/50 dark:border-ink-line/50 flex justify-between items-center text-xs text-brand-700 dark:text-brand-300 font-medium">
                        <span>{mesa.is_member ? "Continuar leitura" : "Conhecer e ingressar"}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Publicidade Discreta */}
        <AdSenseBanner className="pt-2" />
      </main>

      {/* Modal de Criação de Mesa */}
      <CreateMesaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
