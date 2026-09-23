"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";
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
    avatar_url: string | null;
    favorite_genres: string[];
  };
  initialStats?: {
    activeGroups: number;
    completedBooks: number;
    totalNotes: number;
    pagesRead: number;
  };
  isCurrentUser?: boolean;
}

export function ProfileView({
  username,
  initialProfile = {
    display_name: username === "clarice" ? "Clarice Fan" : username,
    bio: "Leitor em busca de boas conversas nas margens dos livros. Apreciador de ficção brasileira moderna, realismo mágico e ensaios literários.",
    avatar_url: null,
    favorite_genres: [
      "Ficção Brasileira",
      "Realismo Mágico",
      "Clássicos",
      "Filosofia",
    ],
  },
  initialStats = {
    activeGroups: 1,
    completedBooks: 12,
    totalNotes: 48,
    pagesRead: 2840,
  },
  isCurrentUser = true,
}: ProfileViewProps) {
  const [profile, setProfile] = React.useState(initialProfile);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const mockBooks: BookItem[] = [
    {
      id: "b1",
      title: "A Hora da Estrela",
      author: "Clarice Lispector",
      status: "reading",
      current_page: 42,
      total_pages: 110,
    },
    {
      id: "b2",
      title: "Grande Sertão: Veredas",
      author: "João Guimarães Rosa",
      status: "completed",
      current_page: 600,
      total_pages: 600,
    },
    {
      id: "b3",
      title: "Torto Arado",
      author: "Itamar Vieira Junior",
      status: "completed",
      current_page: 264,
      total_pages: 264,
    },
    {
      id: "b4",
      title: "Memórias Póstumas de Brás Cubas",
      author: "Machado de Assis",
      status: "want_to_read",
      total_pages: 200,
    },
  ];

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

              {isCurrentUser && (
                <div className="flex items-center gap-2 justify-center sm:justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    Editar Perfil
                  </Button>
                </div>
              )}
            </div>

            {profile.bio && (
              <p className="font-reading text-body text-ink-700 dark:text-paper-200 max-w-xl">
                {profile.bio}
              </p>
            )}

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
          <Bookshelf books={mockBooks} />
        </section>
      </main>

      {/* Modal de Edição de Perfil */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialDisplayName={profile.display_name}
        initialBio={profile.bio || ""}
        initialGenres={profile.favorite_genres || []}
        onProfileUpdated={(updated) => {
          setProfile((prev) => ({
            ...prev,
            display_name: updated.displayName,
            bio: updated.bio,
            favorite_genres: updated.favoriteGenres,
          }));
        }}
      />
    </div>
  );
}
