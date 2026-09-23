import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper-100 dark:bg-ink-bg text-ink-900 dark:text-paper-50 flex flex-col justify-between p-6 md:p-12">
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center py-4 border-b border-line dark:border-ink-line">
        <Link
          href="/dashboard"
          className="font-display text-3xl font-normal tracking-tight text-ink-900 dark:text-paper-50"
        >
          Boralê
        </Link>
      </header>

      <main className="max-w-md mx-auto w-full text-center py-16 space-y-6">
        <div className="w-16 h-16 rounded-full bg-paper-200 dark:bg-ink-surface border border-line dark:border-ink-line flex items-center justify-center mx-auto text-brand-700 dark:text-brand-300">
          <BookOpen className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-brand-700 dark:text-brand-300 font-semibold">
            Página Não Encontrada · 404
          </span>
          <h1 className="font-display text-h1 text-ink-900 dark:text-paper-50">
            Esta página não está na estante.
          </h1>
          <p className="font-reading text-body text-ink-700 dark:text-paper-200 leading-relaxed">
            A mesa de leitura que você procura pode ter sido encerrada, excluída ou o endereço informado está incorreto.
          </p>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <Link href="/dashboard">
            <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Voltar ao Painel
            </Button>
          </Link>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-ink-500 dark:text-paper-200/50 py-4 border-t border-line dark:border-ink-line">
        Boralê · Leitura Social & Síncrona
      </footer>
    </div>
  );
}
