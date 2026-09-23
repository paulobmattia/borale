import { getDashboardMesas } from "@/app/actions/mesa";
import { DashboardView } from "./DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let myMesas: any[] = [];
  let publicMesas: any[] = [];

  try {
    const res = await getDashboardMesas();
    myMesas = res.myMesas;
    publicMesas = res.publicMesas;
  } catch (error) {
    console.error("Erro ao carregar mesas do dashboard:", error);
  }

  return <DashboardView myMesas={myMesas} publicMesas={publicMesas} />;
}
