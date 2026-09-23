"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { GenrePicker } from "./GenrePicker";
import { updateProfile } from "@/app/actions/profile";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { CheckCircle2 } from "lucide-react";

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDisplayName?: string;
  initialBio?: string;
  initialFavoriteBook?: string | null;
  initialAvatarUrl?: string;
  initialGenres?: string[];
  onProfileUpdated?: (data: {
    displayName: string;
    bio: string;
    favoriteBook?: string | null;
    avatarUrl?: string;
    favoriteGenres: string[];
  }) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  initialDisplayName = "",
  initialBio = "",
  initialFavoriteBook = "",
  initialAvatarUrl = "",
  initialGenres = [],
  onProfileUpdated,
}: EditProfileModalProps) {
  const [displayName, setDisplayName] = React.useState(initialDisplayName);
  const [bio, setBio] = React.useState(initialBio);
  const [favoriteBook, setFavoriteBook] = React.useState(
    initialFavoriteBook || ""
  );
  const [avatarUrl, setAvatarUrl] = React.useState(initialAvatarUrl);
  const [genres, setGenres] = React.useState<string[]>(initialGenres);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDisplayName(initialDisplayName);
    setBio(initialBio);
    setFavoriteBook(initialFavoriteBook || "");
    setAvatarUrl(initialAvatarUrl);
    setGenres(initialGenres);
  }, [
    initialDisplayName,
    initialBio,
    initialFavoriteBook,
    initialAvatarUrl,
    initialGenres,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Nome de exibição é obrigatório.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        favoriteBook: favoriteBook.trim() || undefined,
        avatarUrl: avatarUrl || undefined,
        favoriteGenres: genres,
      });

      onProfileUpdated?.({
        displayName: displayName.trim(),
        bio: bio.trim(),
        favoriteBook: favoriteBook.trim() || null,
        avatarUrl,
        favoriteGenres: genres,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Ocorreu um erro ao atualizar o perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Perfil de Leitor"
      description="Personalize sua apresentação e interesses literários para outros leitores."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs font-medium">
            {error}
          </div>
        )}

        <ImageUpload
          bucket="avatars"
          value={avatarUrl}
          onChange={setAvatarUrl}
          aspectRatio="avatar"
          label="Foto de Perfil"
          hint="Imagem circular visível nas mesas e anotações de margem"
        />

        <Input
          id="profile-name"
          label="Nome de Exibição"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Ex: Clarice Lispector"
        />

        <Input
          id="profile-favorite-book"
          label="Obra Favorita da Vida"
          value={favoriteBook}
          onChange={(e) => setFavoriteBook(e.target.value)}
          placeholder="Ex: Cem Anos de Solidão — Gabriel García Márquez"
          hint="Escreva por extenso o livro que mais te marcou. Ele aparecerá no seu perfil para gerar identificação com leitores afins."
        />

        <Textarea
          id="profile-bio"
          label="Biografia Literária"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Conte um pouco sobre suas leituras preferidas, autores favoritos..."
          className="min-h-[80px]"
        />

        <GenrePicker selectedGenres={genres} onChange={setGenres} />

        <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-3.5 bg-paper-100/95 dark:bg-ink-surface/95 backdrop-blur-sm border-t border-line dark:border-ink-line rounded-b-lg flex justify-end gap-2 z-10">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isLoading}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Salvar Perfil
          </Button>
        </div>
      </form>
    </Modal>
  );
}
