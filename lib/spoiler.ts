export interface UserProgressRef {
  current_page: number;
  current_chapter: number;
}

export interface CommentSpoilerRef {
  chapter_ref?: number | null;
  page_ref?: number | null;
  has_spoiler: boolean;
}

/**
 * Determina se um comentário deve ser ocultado por spoiler para o leitor atual.
 * 
 * Regra:
 * 1. Se o autor marcou manualmente 'has_spoiler = true', é considerado spoiler.
 * 2. Se o comentário faz referência a um capítulo à frente do progresso atual do leitor.
 * 3. Se está no mesmo capítulo, mas em uma página à frente do leitor.
 */
export function isSpoilerForUser(
  comment: CommentSpoilerRef,
  userProgress?: UserProgressRef | null
): boolean {
  // Se não temos o progresso do usuário, respeita a marcação explícita do comentário
  if (!userProgress) {
    return comment.has_spoiler;
  }

  // 1. Marcação manual explícita
  if (comment.has_spoiler) {
    return true;
  }

  const { current_chapter, current_page } = userProgress;
  const { chapter_ref, page_ref } = comment;

  // 2. Verificação por capítulo
  if (chapter_ref != null && chapter_ref > current_chapter) {
    return true;
  }

  // 3. Verificação por página quando no mesmo capítulo
  if (
    chapter_ref != null &&
    chapter_ref === current_chapter &&
    page_ref != null &&
    page_ref > current_page
  ) {
    return true;
  }

  // Se o comentário tem referência apenas de página e esta ultrapassa a do leitor
  if (chapter_ref == null && page_ref != null && page_ref > current_page) {
    return true;
  }

  return false;
}

/**
 * Formata o texto de referência do comentário (Ex: "Capítulo 4 · Pág. 120" ou "Pág. 45")
 */
export function formatReadingLocation(
  chapter?: number | null,
  page?: number | null
): string {
  const parts: string[] = [];
  if (chapter != null && chapter > 0) {
    parts.push(`Cap. ${chapter}`);
  }
  if (page != null && page > 0) {
    parts.push(`Pág. ${page}`);
  }
  return parts.length > 0 ? parts.join(" · ") : "Comentário geral";
}
