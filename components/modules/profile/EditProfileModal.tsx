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
  initialAvatarUrl?: string;
  initialGenres?: string[];
  onProfileUpdated?: (data: {
    displayName: string;
    bio: string;
    avatarUrl?: string;
    favoriteGenres: string[];
  }) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  initialDisplayName = "",
  initialBio = "",
  initialAvatarUrl = "",
  initialGenres = [],
  onProfileUpdated,
}: EditProfileModalProps) {
  const [displayName, setDisplayName] = React.useState(initialDisplayName);
  const [bio, setBio] = React.useState(initialBio);
  const [avatarUrl, setAvatarUrl] = React.useState(initialAvatarUrl);
  const [genres, setGenres] = React.useState<string[]>(initialGenres);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDisplayName(initialDisplayName);
    setBio(initialBio);
    setAvatarUrl(initialAvatarUrl);
    setGenres(initialGenres);
  }, [initialDisplayName, initialBio, initialAvatarUrl, initialGenres]);

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
        avatarUrl: avatarUrl || undefined,
        favoriteGenres: genres,
      });

      onProfileUpdated?.({
        displayName: displayName.trim(),
        bio: bio.trim(),
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

        <Textarea
          id="profile-bio"
          label="Biografia Literária"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Conte um pouco sobre suas leituras preferidas, autores favoritos..."
          className="min-h-[80px]"
        />

        <GenrePicker selectedGenres={genres} onChange={setGenres} />

        <div className="flex justify-end gap-2 pt-3 border-t border-line dark:border-ink-line">
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
