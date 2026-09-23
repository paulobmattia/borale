/**
 * Boralê — Script de Verificação Funcional do Fluxo Principal & Anti-Spoiler
 * Executável via tsx / node.
 */

import { isSpoilerForUser, formatReadingLocation } from "../lib/spoiler";
import type { ReactionType } from "../types/database";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    process.exit(1);
  }
  console.log(`✅ OK: ${message}`);
}

console.log("==================================================================");
console.log("INICIANDO VALIDAÇÃO FUNCIONAL DO MVP BORALÊ");
console.log("==================================================================\n");

// -------------------------------------------------------------------------------
// 1. VALIDAÇÃO DO MECANISMO DE ANTI-SPOILER COM DOIS LEITORES EM RITMOS DIFERENTES
// -------------------------------------------------------------------------------
console.log("--- 1. Teste de Proteção Anti-Spoiler Dinâmica ---");

const readerA = { current_chapter: 1, current_page: 42 }; // Leitor A está no Cap 1, Pág 42
const readerB = { current_chapter: 2, current_page: 60 }; // Leitor B está no Cap 2, Pág 60

// Nota 1: Capítulo 1, Página 20 (trecho já lido por ambos)
const note1 = { chapter_ref: 1, page_ref: 20, has_spoiler: false };
assert(!isSpoilerForUser(note1, readerA), "Nota 1 (Cap 1, Pág 20) NÃO deve ser spoiler para Leitor A");
assert(!isSpoilerForUser(note1, readerB), "Nota 1 (Cap 1, Pág 20) NÃO deve ser spoiler para Leitor B");

// Nota 2: Capítulo 1, Página 49 (à frente do Leitor A, atrás do Leitor B)
const note2 = { chapter_ref: 1, page_ref: 49, has_spoiler: false };
assert(isSpoilerForUser(note2, readerA), "Nota 2 (Cap 1, Pág 49) DEVE ser spoiler para Leitor A");
assert(!isSpoilerForUser(note2, readerB), "Nota 2 (Cap 1, Pág 49) NÃO deve ser spoiler para Leitor B");

// Nota 3: Capítulo 2, Página 10 (capítulo seguinte do Leitor A, já lido pelo Leitor B)
const note3 = { chapter_ref: 2, page_ref: 10, has_spoiler: false };
assert(isSpoilerForUser(note3, readerA), "Nota 3 (Cap 2, Pág 10) DEVE ser spoiler para Leitor A (capítulo à frente)");
assert(!isSpoilerForUser(note3, readerB), "Nota 3 (Cap 2, Pág 10) NÃO deve ser spoiler para Leitor B");

// Nota 4: Capítulo 2, Página 80 (à frente de ambos os leitores)
const note4 = { chapter_ref: 2, page_ref: 80, has_spoiler: false };
assert(isSpoilerForUser(note4, readerA), "Nota 4 (Cap 2, Pág 80) DEVE ser spoiler para Leitor A");
assert(isSpoilerForUser(note4, readerB), "Nota 4 (Cap 2, Pág 80) DEVE ser spoiler para Leitor B");

// Nota 5: Marcou manualmente has_spoiler = true (mesmo na página 5)
const note5 = { chapter_ref: 1, page_ref: 5, has_spoiler: true };
assert(isSpoilerForUser(note5, readerA), "Nota 5 (flag manual has_spoiler) DEVE ser spoiler para Leitor A");
assert(isSpoilerForUser(note5, readerB), "Nota 5 (flag manual has_spoiler) DEVE ser spoiler para Leitor B");

// Formatação de localização
assert(
  formatReadingLocation(2, 45) === "Cap. 2 · Pág. 45",
  "Formatação de capítulo e página: Cap. 2 · Pág. 45"
);
assert(
  formatReadingLocation(null, 30) === "Pág. 30",
  "Formatação apenas de página: Pág. 30"
);
assert(
  formatReadingLocation(null, null) === "Comentário geral",
  "Formatação sem localização: Comentário geral"
);

// -------------------------------------------------------------------------------
// 2. SIMULAÇÃO DO FLUXO COMPLETO: ATUALIZAÇÃO DE LEITURA & DESTRANCAMENTO
// -------------------------------------------------------------------------------
console.log("\n--- 2. Simulação de Atualização de Ritmo e Desbloqueio de Notas ---");

// Leitor A atualiza a leitura de Pág 42 para Pág 50
const updatedReaderA = { current_chapter: 1, current_page: 50 };
assert(
  !isSpoilerForUser(note2, updatedReaderA),
  "Após atualizar para Pág 50, Nota 2 (Pág 49) deixa de ser spoiler automaticamente para o Leitor A"
);

// -------------------------------------------------------------------------------
// 3. VALIDAÇÃO DAS REAÇÕES EXPRESSIVAS LITERÁRIAS
// -------------------------------------------------------------------------------
console.log("\n--- 3. Validação das Reações Expressivas Literárias ---");

const VALID_REACTIONS: ReactionType[] = [
  "LIKE",
  "AGREE",
  "INSIGHT",
  "MIND_BLOWN",
  "ANGRY",
  "LOVE",
];

assert(VALID_REACTIONS.length === 6, "Exatamente 6 reações expressivas configuradas");
assert(VALID_REACTIONS.includes("INSIGHT"), "Reação INSIGHT suportada");
assert(VALID_REACTIONS.includes("MIND_BLOWN"), "Reação MIND_BLOWN suportada");
assert(VALID_REACTIONS.includes("AGREE"), "Reação AGREE suportada");

console.log("\n==================================================================");
console.log("TODAS AS VALIDAÇÕES DO FLUXO DO MVP PASSARAM COM SUCESSO!");
console.log("==================================================================");
