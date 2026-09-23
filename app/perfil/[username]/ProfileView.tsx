"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, Bookmark, Share2, Check } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  Bookshelf,
  ReaderStats,
  GenrePicker,
  EditProfileModal,
  type BookItem,
} from "@/components/modules/profile";

export interface ProfileViewProps {
  username: string;
  initialProfile?: {
    display_name: string;
    bio: string | null;
    favorite_book?: string | null;
    avatar_url: string | null;
    favorite_genres: string[];
  };
  initialStats?: {
    activeGroups: number;
    completedBooks: number;
    totalNotes: number;
    pagesRead: number;
  };
  initialBooks?: BookItem[];
  isCurrentUser?: boolean;
}

export function ProfileView({
  username,
  initialProfile = {
    display_name: username,
    bio: null,
    favorite_book: null,
    avatar_url: null,
    favorite_genres: [],
  },
  initialStats = {
    activeGroups: 0,
    completedBooks: 0,
    totalNotes: 0,
    pagesRead: 0,
  },
  initialBooks = [],
  isCurrentUser = false,
}: ProfileViewProps) {
  const [profile, setProfile] = React.useState(initialProfile);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleShareProfile = async () => {
    const profileUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/perfil/${encodeURIComponent(username)}`
        : `/perfil/${username}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${profile.display_name} no Boralê`,
          text: `Conheça as preferências literárias e a estante de ${profile.display_name} no Boralê!`,
          url: profileUrl,
        });
        return;
      } catch {
        // Fallback para cópia
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-paper-100 dark:bg-ink-bg flex flex-col">
      <header className="border-b border-line dark:border-ink-line bg-paper-100/90 dark:bg-ink-bg/90 backdrop-blur sticky top-0 z-10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-700 hover:text-ink-900 dark:text-paper-200 dark:hover:text-paper-50 transition min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </Link>
          <span className="font-display text-2xl text-ink-900 dark:text-paper-50">
            Boralê
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 space-y-10">
        {/* Cabeçalho do Perfil */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-line dark:border-ink-line text-center sm:text-left">
          <Avatar
            src={profile.avatar_url}
            fallbackText={profile.display_name}
            size="xl"
            className="w-24 h-24 text-3xl font-display"
          />

          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-h2 text-ink-900 dark:text-paper-50">
                  {profile.display_name}
                </h1>
                <span className="text-sm text-ink-500 dark:text-paper-200/70 font-sans">
                  @{username}
                </span>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-end flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShareProfile}
                  leftIcon={
                    copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )
                  }
                  className="text-xs"
                >
                  {copied ? "Link copiado!" : "Compartilhar Perfil"}
                </Button>

                {isCurrentUser && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </div>

            {profile.bio ? (
              <p className="font-reading text-body text-ink-700 dark:text-paper-200 max-w-xl leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            ) : isCurrentUser ? (
              <p className="font-reading text-sm italic text-ink-500 dark:text-paper-300/70 max-w-xl">
                Você ainda não adicionou uma biografia literária. Clique em &ldquo;Editar Perfil&rdquo; para contar um pouco sobre suas preferências de leitura.
              </p>
            ) : null}

            {/* Destaque do Livro Favorito da Vida */}
            {profile.favorite_book ? (
              <div className="relative overflow-hidden rounded-md border border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-amber-100/40 to-paper-100 dark:from-amber-950/40 dark:via-amber-900/20 dark:to-ink-surface border-l-4 border-l-amber-500 p-3.5 shadow-xs max-w-xl text-left">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                  <Bookmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500/20" />
                  <span>Livro Favorito da Vida</span>
                </div>
                <p className="font-display text-base text-ink-900 dark:text-paper-50 italic leading-snug">
                  &ldquo;{profile.favorite_book}&rdquo;
                </p>
              </div>
            ) : isCurrentUser ? (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="group flex items-center gap-2.5 p-2.5 rounded-md border border-dashed border-line hover:border-amber-400 bg-paper-200/30 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 dark:border-ink-line text-left text-xs transition max-w-xl"
              >
                <Bookmark className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="text-ink-600 dark:text-paper-300 group-hover:text-amber-900 dark:group-hover:text-amber-200">
                  Qual é a sua <strong>obra favorita da vida</strong>? Clique para adicionar ao seu perfil.
                </span>
              </button>
            ) : null}

            {profile.favorite_genres?.length > 0 && (
              <GenrePicker
                selectedGenres={profile.favorite_genres}
                readOnly
              />
            )}
          </div>
        </div>

        {/* Estatísticas Literárias */}
        <ReaderStats stats={initialStats} />

        {/* Estante Literária com Abas */}
        <section className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50">
              Estante Literária
            </h2>
          </div>

          {initialBooks.length > 0 ? (
            <Bookshelf books={initialBooks} />
          ) : (
            <div className="p-8 rounded-lg border border-line bg-paper-100 dark:bg-ink-surface text-center space-y-3">
              <p className="font-display text-lg text-ink-900 dark:text-paper-100">
                A estante ainda está vazia
              </p>
              <p className="font-reading text-sm text-ink-600 dark:text-paper-300 max-w-md mx-auto">
                {isCurrentUser
                  ? "Ao ingressar ou criar uma mesa de leitura no painel, suas obras em andamento e marcos concluídos aparecerão aqui."
                  : "Este leitor ainda não participa de nenhuma mesa de leitura ativa."}
              </p>
              {isCurrentUser && (
                <Link href="/dashboard" className="inline-block pt-1">
                  <Button size="sm" variant="secondary">
                    Explorar Mesas de Leitura
                  </Button>
                </Link>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Modal de Edição de Perfil */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialDisplayName={profile.display_name}
        initialBio={profile.bio || ""}
        initialFavoriteBook={profile.favorite_book || ""}
        initialAvatarUrl={profile.avatar_url || ""}
        initialGenres={profile.favorite_genres || []}
        onProfileUpdated={(updated) => {
          setProfile((prev) => ({
            ...prev,
            display_name: updated.displayName,
            bio: updated.bio,
            favorite_book: updated.favoriteBook || null,
            avatar_url: updated.avatarUrl !== undefined ? updated.avatarUrl : prev.avatar_url,
            favorite_genres: updated.favoriteGenres,
          }));
        }}
      />
    </div>
  );
}
