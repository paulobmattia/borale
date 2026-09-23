"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { signIn, signInWithGoogle, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, null);

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
            Retome sua leitura
          </h1>
          <p className="font-reading text-body text-ink-700 dark:text-paper-200">
            Acesse suas mesas de leitura ativas
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 rounded bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            label="E-mail"
            required
            placeholder="seu.email@exemplo.com"
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Senha"
            required
            placeholder="••••••••"
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isPending}
            rightIcon={<LogIn className="w-4 h-4" />}
          >
            Entrar na Mesa
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
            Continuar com Google
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-line dark:border-ink-line text-center">
          <p className="text-sm text-ink-700 dark:text-paper-200">
            Ainda não tem conta?{" "}
            <Link
              href="/cadastro"
              className="font-semibold text-brand-700 hover:text-brand-500 dark:text-brand-300"
            >
              Criar perfil de leitor
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
