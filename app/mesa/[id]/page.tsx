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
    comments = await getMesaComments(id);
  } catch {
    // Fallback gracioso para ambiente de testes locais
  }

  const isMember = mesaData?.currentUserId
    ? mesaData.members.some((m: any) => m.id === mesaData?.currentUserId)
    : true;

  const isCreator = Boolean(
    mesaData?.currentUserId &&
      mesaData?.mesa?.created_by === mesaData.currentUserId
  );
  const isAdmin = Boolean(
    mesaData?.currentUserId &&
      mesaData?.members?.some(
        (m: any) => m.id === mesaData.currentUserId && m.role === "admin"
      )
  );
  const canEdit = isCreator || isAdmin;

  return (
    <MesaView
      id={id}
      initialMesa={
        mesaData?.mesa
          ? {
              title: mesaData.mesa.title,
              book_title: mesaData.mesa.book_title,
              book_author: mesaData.mesa.book_author,
              book_cover_url: mesaData.mesa.book_cover_url,
              is_private: mesaData.mesa.is_private,
            }
          : undefined
      }
      initialMembers={mesaData?.members?.length ? mesaData.members : undefined}
      initialMilestones={
        mesaData?.milestones?.length ? mesaData.milestones : undefined
      }
      initialComments={comments.length ? comments : undefined}
      initialUserProgress={mesaData?.currentUserProgress}
      isMember={isMember}
      canEdit={canEdit}
    />
  );
}
