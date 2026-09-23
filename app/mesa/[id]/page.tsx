import { notFound } from "next/navigation";
import { MesaView } from "./MesaView";
import { getMesaDetails } from "@/app/actions/mesa";
import { getMesaComments } from "@/app/actions/comments";

interface MesaPageProps {
  params: Promise<{ id: string }>;
}

export default async function MesaPage({ params }: MesaPageProps) {
  const { id } = await params;

  let mesaData = null;
  let comments: any[] = [];

  try {
    mesaData = await getMesaDetails(id);
    if (mesaData) {
      comments = await getMesaComments(id);
    }
  } catch (err) {
    console.error("Erro ao carregar detalhes da mesa:", err);
  }

  // Se a mesa não existir no banco de dados, retorna 404
  if (!mesaData || !mesaData.mesa) {
    notFound();
  }

  const currentUserId = mesaData.currentUserId;
  const isCreator = Boolean(
    currentUserId && mesaData.mesa.created_by === currentUserId
  );
  const isAdmin = Boolean(
    currentUserId &&
      mesaData.members?.some(
        (m: any) => m.id === currentUserId && m.role === "admin"
      )
  );
  const isMember = Boolean(
    currentUserId &&
      (isCreator || mesaData.members?.some((m: any) => m.id === currentUserId))
  );
  const canEdit = isCreator || isAdmin;

  return (
    <MesaView
      id={id}
      initialMesa={{
        title: mesaData.mesa.title,
        book_title: mesaData.mesa.book_title,
        book_author: mesaData.mesa.book_author,
        book_cover_url: mesaData.mesa.book_cover_url,
        is_private: mesaData.mesa.is_private,
      }}
      initialMembers={mesaData.members || []}
      initialMilestones={mesaData.milestones || []}
      initialComments={comments || []}
      initialUserProgress={
        mesaData.currentUserProgress || {
          current_page: 0,
          current_chapter: 0,
        }
      }
      isMember={isMember}
      canEdit={canEdit}
    />
  );
}
