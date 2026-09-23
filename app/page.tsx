import Link from "next/link";
import { Users, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper-100 dark:bg-ink-bg text-ink-900 dark:text-paper-50 flex flex-col justify-between">
      <main className="flex-1 flex flex-col justify-between p-6 md:p-12 max-w-6xl mx-auto w-full">
        {/* Cabeçalho */}
        <header className="flex justify-between items-center py-4 border-b border-line dark:border-ink-line">
          <div className="flex items-center gap-2">
            <span className="font-display text-3xl font-normal tracking-tight text-ink-900 dark:text-paper-50">
              Boralê
            </span>
            <span className="text-xs uppercase tracking-widest text-brand-700 dark:text-brand-300 font-semibold px-2 py-0.5 rounded bg-paper-200 dark:bg-ink-surface border border-line dark:border-ink-line">
              Alpha
            </span>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-ink-700 hover:text-ink-900 dark:text-paper-200 dark:hover:text-paper-50 transition-colors min-h-[36px] inline-flex items-center"
            >
              Entrar
            </Link>
            <Link href="/cadastro">
              <Button size="sm">Começar a ler</Button>
            </Link>
          </nav>
        </header>

        {/* Hero Section Editorial */}
        <section className="py-16 md:py-24 text-center reading-column">
          <p className="text-xs md:text-sm uppercase tracking-widest text-brand-700 dark:text-brand-300 font-semibold mb-4">
            Leitura Social & Síncrona
          </p>
          <h1 className="font-display text-display-lg md:text-display-xl font-normal text-ink-900 dark:text-paper-50 mb-6 leading-tight">
            O livro continua depois que a página vira digital.
          </h1>
          <p className="font-reading text-body-lg text-ink-700 dark:text-paper-200 mb-10 leading-relaxed">
            Crie Mesas de Leitura com seus amigos, acompanhe o progresso em tempo real
            e troque impressões nas margens com proteção automática contra spoilers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/cadastro" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4 stroke-[1.75]" />}
              >
                Criar minha primeira mesa
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Explorar mesas abertas
              </Button>
            </Link>
          </div>
        </section>

        {/* Pilares do Produto */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-t border-line dark:border-ink-line">
          <div className="p-6 rounded-lg bg-paper-200/50 dark:bg-ink-surface border border-line dark:border-ink-line space-y-2">
            <div className="w-10 h-10 rounded-md bg-paper-100 dark:bg-ink-surface-2 flex items-center justify-center mb-4 border border-line dark:border-ink-line text-brand-700 dark:text-brand-300">
              <Users className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-display text-h3 text-ink-900 dark:text-paper-50">
              Mesas de Leitura
            </h3>
            <p className="font-reading text-body text-ink-700 dark:text-paper-200 leading-relaxed">
              Reúna seu círculo em torno de uma mesma obra, com metas semanais e presença sincronizada.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-paper-200/50 dark:bg-ink-surface border border-line dark:border-ink-line space-y-2">
            <div className="w-10 h-10 rounded-md bg-paper-100 dark:bg-ink-surface-2 flex items-center justify-center mb-4 border border-line dark:border-ink-line text-brand-700 dark:text-brand-300">
              <ShieldAlert className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-display text-h3 text-ink-900 dark:text-paper-50">
              Sem Spoilers
            </h3>
            <p className="font-reading text-body text-ink-700 dark:text-paper-200 leading-relaxed">
              Notas e conversas de capítulos à frente do seu ritmo ficam ocultas por padrão.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-paper-200/50 dark:bg-ink-surface border border-line dark:border-ink-line space-y-2">
            <div className="w-10 h-10 rounded-md bg-paper-100 dark:bg-ink-surface-2 flex items-center justify-center mb-4 border border-line dark:border-ink-line text-brand-700 dark:text-brand-300">
              <Sparkles className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-display text-h3 text-ink-900 dark:text-paper-50">
              Reações Vivas
            </h3>
            <p className="font-reading text-body text-ink-700 dark:text-paper-200 leading-relaxed">
              Expresse percepções literárias com reações expressivas e silenciosas pensadas para quem lê.
            </p>
          </div>
        </section>

        {/* Rodapé */}
        <footer className="py-6 border-t border-line dark:border-ink-line text-center">
          <p className="text-xs text-ink-500 dark:text-paper-200/60 font-sans">
            Boralê — Plataforma de leitura conjunta · Design System Papel Pólen & Tinta Impressa
          </p>
        </footer>
      </main>
    </div>
  );
}
