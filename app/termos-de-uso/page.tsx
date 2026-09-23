import Link from "next/link";
import { ArrowLeft, BookOpen, ShieldCheck, Scale, Users, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Termos de Uso — Boralê",
  description:
    "Termos e condições gerais de uso da plataforma Boralê, diretrizes de comunidade, regras anti-spoiler e proteção de direitos autorais.",
};

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-paper-100 dark:bg-ink-bg text-ink-900 dark:text-paper-50 flex flex-col justify-between">
      {/* Topo Editorial */}
      <header className="border-b border-line dark:border-ink-line bg-paper-100/90 dark:bg-ink-bg/90 backdrop-blur sticky top-0 z-10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-700 hover:text-ink-900 dark:text-paper-200 dark:hover:text-paper-50 transition min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Início
          </Link>
          <span className="font-display text-2xl text-ink-900 dark:text-paper-50">
            Boralê
          </span>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12 space-y-10">
        <div className="space-y-3 border-b border-line dark:border-ink-line pb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-700 dark:text-brand-300 font-semibold">
            <Scale className="w-4 h-4" />
            <span>Diretrizes e Condições de Uso</span>
          </div>
          <h1 className="font-display text-h1 text-ink-900 dark:text-paper-50">
            Termos de Uso
          </h1>
          <p className="font-reading text-body text-ink-600 dark:text-paper-300">
            Última atualização: 23 de setembro de 2026.
          </p>
        </div>

        <article className="prose dark:prose-invert max-w-none space-y-8 font-reading text-body text-ink-800 dark:text-paper-200 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 flex items-center gap-2">
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao criar uma conta ou utilizar qualquer funcionalidade do <strong>Boralê</strong> (&ldquo;plataforma&rdquo;, &ldquo;nós&rdquo;), você concorda expressamente em vincular-se a estes <strong>Termos de Uso</strong> e à nossa{" "}
              <Link
                href="/politica-de-privacidade"
                className="text-brand-700 dark:text-brand-300 underline font-semibold"
              >
                Política de Privacidade
              </Link>
              . Caso não concorde com qualquer disposição aqui estabelecida, recomendamos a descontinuidade do uso do serviço.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-700 dark:text-brand-300" />
              2. Finalidade da Plataforma
            </h2>
            <p>
              O Boralê é um ambiente digital de leitura conjunta e social, criado para conectar leitores por meio de &ldquo;mesas de leitura&rdquo;, cronogramas colaborativos, anotações de margem e registros de progresso literário.
            </p>
            <p>
              A plataforma <strong>não comercializa livros digitais ou físicos</strong> e não distribui cópias piratas ou integrais de obras protegidas por direitos autorais. O Boralê atua exclusivamente como ferramenta de acompanhamento, estudo e debate entre leitores.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-700 dark:text-brand-300" />
              3. Propriedade Intelectual e Direitos Autorais
            </h2>
            <p>
              Respeitamos integralmente os direitos de propriedade intelectual de autores, editoras e criadores de conteúdo (Lei nº 9.610/1998 - Lei de Direitos Autorais):
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong>Obras Citadas</strong>: Títulos, nomes de autores e capas são utilizados exclusivamente para fins de identificação cultural e debate literário comunitário.
              </li>
              <li>
                <strong>Conteúdo do Usuário</strong>: Você mantém a titularidade sobre resenhas, comentários, notas marginais e impressões que publicar. Ao publicá-los no Boralê, você nos concede licença não exclusiva para exibi-los aos participantes da mesa e usuários da plataforma conforme as configurações de privacidade escolhidas.
              </li>
              <li>
                <strong>Proibição de Pirataria</strong>: É expressamente proibido carregar, anexar ou compartilhar links para downloads ilegais de obras inteiras protegidas.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-700 dark:text-brand-300" />
              4. Diretrizes de Comunidade e Etiqueta Literária
            </h2>
            <p>Para manter um ambiente acolhedor e enriquecedor, todos os usuários devem seguir os seguintes princípios:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong>Pacto Anti-Spoiler</strong>: Respeite o ritmo alheio. Comentários que revelem pontos cruciais da trama devem ser associados rigorosamente aos capítulos corretos e sinalizados adequadamente na ferramenta.
              </li>
              <li>
                <strong>Respeito e Urbanidade</strong>: É proibido publicar conteúdo que envolva discurso de ódio, assédio, discriminação de qualquer natureza, difamação ou ameaças a outros leitores.
              </li>
              <li>
                <strong>Uso Autêntico</strong>: É proibida a criação de perfis falsos, automação abusiva (bots) ou envio de spam e mensagens comerciais não solicitadas dentro das mesas.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-brand-700 dark:text-brand-300" />
              5. Suspensão e Encerramento de Contas
            </h2>
            <p>
              O Boralê reserva-se o direito de advertir, suspender temporariamente ou encerrar em definitivo contas de usuários que descumpram estes Termos de Uso ou violem normas legais vigentes, sem necessidade de aviso prévio em casos graves.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 flex items-center gap-2">
              6. Publicidade e Manutenção do Serviço
            </h2>
            <p>
              Para manter o Boralê gratuito e em contínuo desenvolvimento, a plataforma poderá exibir anúncios discretos de terceiros (como Google AdSense) em áreas periféricas (páginas públicas, painel e perfis).
            </p>
            <p>
              Reiteramos nosso compromisso de <strong>preservação absoluta da sala de leitura</strong>: nenhuma propaganda invasiva é permitida nas telas internas das mesas ativas.
            </p>
          </section>

          <section className="space-y-3 border-t border-line dark:border-ink-line pt-6">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50">
              7. Legislação Aplicável e Foro
            </h2>
            <p>
              Estes Termos de Uso são regidos e interpretados segundo as leis da República Federativa do Brasil, em especial o Marco Civil da Internet (Lei nº 12.965/2014) e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
          </section>
        </article>
      </main>

      {/* Rodapé */}
      <footer className="py-8 border-t border-line dark:border-ink-line text-center space-y-2">
        <div className="flex justify-center items-center gap-4 text-xs font-sans text-ink-600 dark:text-paper-300">
          <span className="text-ink-900 dark:text-paper-50 font-semibold">
            Termos de Uso
          </span>
          <span className="text-ink-300 dark:text-ink-line">·</span>
          <Link
            href="/politica-de-privacidade"
            className="hover:text-ink-900 dark:hover:text-paper-50 transition underline underline-offset-2"
          >
            Política de Privacidade
          </Link>
        </div>
        <p className="text-xs text-ink-500 dark:text-paper-200/60 font-sans">
          Boralê — Leitura Social & Síncrona · Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
