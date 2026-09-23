import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Cookie, FileText } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade — Boralê",
  description:
    "Conheça como o Boralê protege sua privacidade, gerencia dados e utiliza cookies e publicidade conforme a LGPD e diretrizes do Google AdSense.",
};

export default function PoliticaPrivacidadePage() {
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
            <ShieldCheck className="w-4 h-4" />
            <span>Transparência e Conformidade LGPD</span>
          </div>
          <h1 className="font-display text-h1 text-ink-900 dark:text-paper-50">
            Política de Privacidade
          </h1>
          <p className="font-reading text-body text-ink-600 dark:text-paper-300">
            Última atualização: 23 de setembro de 2026.
          </p>
        </div>

        <article className="prose dark:prose-invert max-w-none space-y-8 font-reading text-body text-ink-800 dark:text-paper-200 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 flex items-center gap-2">
              1. Visão Geral
            </h2>
            <p>
              O <strong>Boralê</strong> (&ldquo;nós&rdquo;, &ldquo;plataforma&rdquo;) é um ambiente dedicado à leitura coletiva, síncrona e social. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e compartilhamos suas informações pessoais ao utilizar nossa plataforma, em total conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong> e com os padrões internacionais de transparência.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-700 dark:text-brand-300" />
              2. Informações que Coletamos
            </h2>
            <p>Para proporcionar a experiência de leitura conjunta, coletamos as seguintes categorias de dados:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong>Dados de Cadastro e Autenticação</strong>: Nome de exibição, nome de usuário (@username), endereço de e-mail e senha criptografada (ou dados públicos de perfil caso realize login via Google OAuth, como nome e foto).
              </li>
              <li>
                <strong>Dados de Perfil Literário</strong>: Biografia opcional, livro favorito da vida, gêneros de interesse e imagem de avatar.
              </li>
              <li>
                <strong>Dados de Leitura e Interação</strong>: Páginas e capítulos registrados no seu progresso, mesas criadas ou integradas, anotações de margem (comentários) e reações aos textos de outros leitores.
              </li>
              <li>
                <strong>Dados Técnicos</strong>: Endereço IP, tipo de navegador, páginas visitadas e dados de desempenho para segurança e estabilidade da aplicação.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 flex items-center gap-2">
              <Cookie className="w-4 h-4 text-brand-700 dark:text-brand-300" />
              3. Cookies, Terceiros e Google AdSense
            </h2>
            <p>
              Utilizamos cookies para manter sua sessão autenticada com segurança, lembrar preferências de navegação e viabilizar a sustentabilidade da plataforma por meio de publicidade.
            </p>
            <div className="p-4 rounded-lg bg-paper-200/50 dark:bg-ink-surface border border-line dark:border-ink-line space-y-2">
              <h4 className="font-sans font-semibold text-sm text-ink-900 dark:text-paper-50">
                Divulgação Obrigatória sobre Publicidade do Google:
              </h4>
              <p className="text-xs text-ink-700 dark:text-paper-200 leading-relaxed">
                Fornecedores terceiros, incluindo o <strong>Google</strong>, usam cookies para veicular anúncios com base nas visitas anteriores dos usuários a este site ou a outros sites na internet. O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios para os usuários com base nas visitas feitas ao Boralê e/ou a outros sites na Internet.
              </p>
              <p className="text-xs text-ink-700 dark:text-paper-200 leading-relaxed">
                Você pode optar por desativar a publicidade personalizada acessando as{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 dark:text-brand-300 underline font-semibold"
                >
                  Configurações de Anúncios do Google
                </a>
                . Alternativamente, você pode desativar o uso de cookies de fornecedores terceiros para publicidade personalizada acessando{" "}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 dark:text-brand-300 underline font-semibold"
                >
                  www.aboutads.info
                </a>
                .
              </p>
            </div>
            <p className="text-sm">
              <strong>Compromisso de Foco na Leitura</strong>: Conforme nosso compromisso com o leitor, nenhuma publicidade é exibida dentro das mesas de leitura ativas, garantindo um ambiente de leitura imersivo e sem distrações.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-700 dark:text-brand-300" />
              4. Armazenamento e Segurança dos Dados
            </h2>
            <p>
              Nossa infraestrutura utiliza banco de dados PostgreSQL com <em>Row Level Security (RLS)</em> no <strong>Supabase</strong>, garantindo que somente usuários autorizados possam acessar ou modificar seus respectivos registros. O tráfego entre seu dispositivo e nossos servidores é integralmente protegido por criptografia TLS/HTTPS de ponta a ponta.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-700 dark:text-brand-300" />
              5. Seus Direitos (LGPD - Artigo 18)
            </h2>
            <p>Na qualidade de titular de dados, você possui o direito de solicitar a qualquer momento:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Confirmação da existência de tratamento de seus dados pessoais.</li>
              <li>Acesso e retificação de dados incorretos, incompletos ou desatualizados.</li>
              <li>Eliminação definitiva dos dados tratados, mediante encerramento de sua conta.</li>
              <li>Portabilidade dos seus dados para outro fornecedor de serviço.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-line dark:border-ink-line pt-6">
            <h2 className="font-display text-h3 text-ink-900 dark:text-paper-50">
              6. Contato com a Equipe
            </h2>
            <p>
              Para esclarecer dúvidas sobre esta Política de Privacidade ou exercer seus direitos de privacidade, entre em contato através de nossa página de suporte ou pelo e-mail oficial da plataforma.
            </p>
          </section>
        </article>
      </main>

      {/* Rodapé */}
      <footer className="py-8 border-t border-line dark:border-ink-line text-center space-y-2">
        <div className="flex justify-center items-center gap-4 text-xs font-sans text-ink-600 dark:text-paper-300">
          <Link
            href="/termos-de-uso"
            className="hover:text-ink-900 dark:hover:text-paper-50 transition underline underline-offset-2"
          >
            Termos de Uso
          </Link>
          <span className="text-ink-300 dark:text-ink-line">·</span>
          <span className="text-ink-900 dark:text-paper-50 font-semibold">
            Política de Privacidade
          </span>
        </div>
        <p className="text-xs text-ink-500 dark:text-paper-200/60 font-sans">
          Boralê — Leitura Social & Síncrona · Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
