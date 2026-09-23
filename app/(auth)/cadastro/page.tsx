"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { signUp, signInWithGoogle, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UserPlus } from "lucide-react";

export default function CadastroPage() {
  const [state, formAction, isPending] = useActionState(signUp, null);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-paper-100 dark:bg-ink-bg">
      <div className="w-full max-w-md bg-paper-200/50 dark:bg-ink-surface p-8 rounded-lg border border-line dark:border-ink-line shadow-editorial">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <span className="font-display text-4xl font-normal text-ink-900 dark:text-paper-50">
              Boralê
            </span>
          </Link>
          <h1 className="font-display text-h3 text-ink-900 dark:text-paper-50 mb-1">
            Crie sua identidade leitora
          </h1>
          <p className="font-reading text-body text-ink-700 dark:text-paper-200">
            Junte-se a mesas de leitura e compartilhe reflexões
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 rounded bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Nome Completo"
            type="text"
            required
            placeholder="Ex: Clarice Lispector"
          />

          <Input
            id="username"
            name="username"
            label="Nome de Usuário (@)"
            type="text"
            required
            placeholder="clarice"
          />

          <Input
            id="email"
            name="email"
            label="E-mail"
            type="email"
            required
            placeholder="seu.email@exemplo.com"
          />

          <Input
            id="password"
            name="password"
            label="Senha"
            type="password"
            required
            placeholder="Mínimo 6 caracteres"
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isPending}
            rightIcon={<UserPlus className="w-4 h-4" />}
          >
            Criar Perfil de Leitor
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-line dark:bg-ink-line" />
          <span className="text-xs uppercase tracking-wider text-ink-500">ou</span>
          <div className="flex-1 h-px bg-line dark:bg-ink-line" />
        </div>

        <form action={signInWithGoogle}>
          <Button
            type="submit"
            variant="secondary"
            className="w-full text-xs font-semibold"
          >
            Cadastrar com Google
          </Button>
        </form>

        <p className="mt-4 text-[11px] text-center text-ink-500 dark:text-paper-300/70 leading-relaxed">
          Ao continuar, você concorda com nossos{" "}
          <Link
            href="/termos-de-uso"
            className="underline hover:text-ink-900 dark:hover:text-paper-50 transition"
          >
            Termos de Uso
          </Link>{" "}
          e nossa{" "}
          <Link
            href="/politica-de-privacidade"
            className="underline hover:text-ink-900 dark:hover:text-paper-50 transition"
          >
            Política de Privacidade
          </Link>
          .
        </p>

        <div className="mt-6 pt-6 border-t border-line dark:border-ink-line text-center">
          <p className="text-sm text-ink-700 dark:text-paper-200">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-700 hover:text-brand-500 dark:text-brand-300"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
