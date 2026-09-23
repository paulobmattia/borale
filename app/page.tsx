import Link from "next/link";
import { Users, ShieldAlert, Sparkles, ArrowRight, BookOpen, Compass, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AdSenseBanner } from "@/components/ui/AdSenseBanner";

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

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-ink-700 hover:text-ink-900 dark:text-paper-200 dark:hover:text-paper-50 transition-colors min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-paper-200/50 dark:hover:bg-ink-surface/50"
            >
              <LogIn className="w-4 h-4" />
              <span>Já tenho conta · Entrar</span>
            </Link>
            <Link href="/cadastro">
              <Button size="sm" leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
                Criar Conta Gratuita
              </Button>
            </Link>
          </nav>
        </header>

        {/* Hero Section Editorial */}
        <section className="py-16 md:py-20 text-center reading-column">
          <p className="text-xs md:text-sm uppercase tracking-widest text-brand-700 dark:text-brand-300 font-semibold mb-4">
            Leitura Social & Síncrona
          </p>
          <h1 className="font-display text-display-lg md:text-display-xl font-normal text-ink-900 dark:text-paper-50 mb-6 leading-tight">
            O livro continua depois que a página vira digital.
          </h1>
          <p className="font-reading text-body-lg text-ink-700 dark:text-paper-200 mb-10 leading-relaxed">
            Reúna seu clube do livro, defina metas semanais conjuntas e troque anotações de margem em tempo real — com proteção inteligente contra spoilers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/cadastro" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4 stroke-[1.75]" />}
              >
                Criar conta e começar a ler
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                Já tenho conta · Fazer login
              </Button>
            </Link>
          </div>

          {/* Esclarecimento sobre Mesas Privadas vs Mesas Abertas */}
          <div className="mt-10 p-5 rounded-lg border border-line dark:border-ink-line bg-paper-200/40 dark:bg-ink-surface/40 text-left max-w-2xl mx-auto space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
              <Compass className="w-4 h-4" />
              <span>Como funcionam as Mesas no Boralê?</span>
            </div>
            <p className="font-reading text-sm text-ink-700 dark:text-paper-200 leading-relaxed">
              Você pode criar <strong>Mesas Privadas</strong> exclusivas para seus amigos e clube de leitura com acesso restrito, ou participar de <strong>Mesas Abertas</strong> criadas pela comunidade para compartilhar impressões com novos leitores.
            </p>
            <div className="pt-1">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-brand-700 dark:text-brand-300 hover:underline inline-flex items-center gap-1"
              >
                Conhecer o catálogo de mesas públicas abertas <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
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

        {/* Espaço de Publicidade Discreta */}
        <AdSenseBanner className="py-2" />

        {/* Rodapé */}
        <footer className="py-8 border-t border-line dark:border-ink-line text-center space-y-3">
          <div className="flex justify-center items-center gap-4 text-xs font-sans text-ink-600 dark:text-paper-300">
            <Link
              href="/termos-de-uso"
              className="hover:text-ink-900 dark:hover:text-paper-50 transition underline underline-offset-2"
            >
              Termos de Uso
            </Link>
            <span className="text-ink-300 dark:text-ink-line">·</span>
            <Link
              href="/politica-de-privacidade"
              className="hover:text-ink-900 dark:hover:text-paper-50 transition underline underline-offset-2"
            >
              Política de Privacidade
            </Link>
          </div>
          <p className="text-xs text-ink-500 dark:text-paper-200/60 font-sans">
            Boralê — Plataforma de leitura conjunta · Design System Papel Pólen & Tinta Impressa
          </p>
        </footer>
      </main>
    </div>
  );
}
