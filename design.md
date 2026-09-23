# Design System — Plataforma de Leitura Conjunta

## 01. Direção visual

**Ideia central:** a interface deve parecer um lugar onde o livro continua existindo depois que a página vira digital.

A linguagem combina três camadas:

- **Editorial:** papel-pólen, serifas, proporções generosas, linhas finas e ritmo de página.
- **Produto digital:** Inter para controles, navegação e estados; componentes claros e previsíveis.
- **Marca-texto/anotação:** cores semânticas derivadas de papéis adesivos e marca-textos, usadas com parcimônia para comentários, alertas, progresso e estados.

**Princípios:** silencioso, legível, táctil, elegante, humano. Evitar excesso de cards, sombras fortes, gradientes e cantos excessivamente arredondados.

---

## 02. Tipografia

### Fontes

| Uso | Família | Peso | Observação |
|---|---|---:|---|
| Texto de leitura | **EB Garamond** | 400 / 500 / 600 | Corpo literário, citações, descrições longas |
| Títulos editoriais | **GFS Didot** | 400 / 700 | Alto contraste, títulos de capítulo, hero e nomes de livros |
| Interface | **Inter** | 400 / 500 / 600 / 700 | Navegação, botões, labels, dados e controles |

### Escala

- `display-xl`: GFS Didot 72 / 0.95
- `display-lg`: GFS Didot 56 / 1.0
- `h1`: GFS Didot 44 / 1.0
- `h2`: GFS Didot 34 / 1.08
- `h3`: GFS Didot 26 / 1.12
- `h4`: Inter 20 / 1.2 / 600
- `body-lg`: EB Garamond 21 / 1.55
- `body`: EB Garamond 18 / 1.55
- `body-sm`: Inter 14 / 1.45
- `label`: Inter 12 / 1.3 / 600 / +0.04em
- `caption`: Inter 11 / 1.35 / 500

**Regra de leitura:** textos corridos devem manter largura de coluna entre ~55–75 caracteres quando possível.

**Itálico:** preferir EB Garamond Italic para termos literários, citações e ênfase textual; evitar itálico em controles.

---

## 03. Cores

### Light mode — “Papel Pólen”

| Token | Hex | Função |
|---|---|---|
| `paper-100` | `#F6F0E3` | Fundo primário |
| `paper-200` | `#EEE6D7` | Superfícies secundárias |
| `paper-300` | `#E2D7C5` | Separadores / superfícies elevadas |
| `ink-900` | `#1F1C19` | Texto principal |
| `ink-700` | `#4B4640` | Texto secundário |
| `ink-500` | `#777069` | Texto terciário / placeholder |
| `line` | `#CFC4B4` | Bordas e divisores |
| `brand-700` | `#7C303B` | Ação primária / links |
| `brand-500` | `#A64A54` | Hover / destaque editorial |

### Dark mode — “Tinta Impressa”

O preto não é absoluto. O fundo puxa levemente para **ciano**, lembrando uma tinta escura composta em impressão.

| Token | Hex | Função |
|---|---|---|
| `ink-bg` | `#20282B` | Fundo primário |
| `ink-surface` | `#293235` | Superfícies |
| `ink-surface-2` | `#323B3E` | Superfícies elevadas |
| `paper-50` | `#F3EDDF` | Texto principal |
| `paper-200` | `#D7D0C4` | Texto secundário |
| `ink-line` | `#475155` | Bordas / divisores |
| `brand-300` | `#D18A90` | Link / ação em fundo escuro |
| `brand-500` | `#B65A64` | Ação primária em dark |

### Semânticas / “marca-texto”

As cores semânticas devem parecer **papel adesivo ou marca-texto**, não neon digital.

| Token | Hex | Uso |
|---|---|---|
| `success` | `#B8D86A` | Concluído, salvo, progresso positivo |
| `warning` | `#F4D35E` | Atenção, pendência, limite |
| `error` | `#E9827D` | Erro, falha, ação destrutiva |
| `info` | `#7DBBDA` | Informação, dica, atualização |

Para fundos de alertas, usar as semânticas com 18–26% de opacidade sobre `paper-100` / `ink-bg`; para indicadores pequenos, usar a cor sólida.

### Marca-texto de leitura

Pode-se aplicar `warning`, `success`, `info` ou `error` a trechos selecionados. O texto permanece `ink-900` no light mode; no dark mode, usar `paper-50`.

---

## 04. Espaçamento e forma

Escala base de 4 px:

`4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80`

### Raios

- `radius-sm`: 4 px
- `radius-md`: 6 px
- `radius-lg`: 10 px
- `radius-pill`: 999 px — reservado a tags/status curtos

A maioria dos componentes utiliza `radius-md`. O produto não deve parecer excessivamente “app-like”.

### Bordas

- Padrão: 1 px `line`
- Foco: 2 px `brand-500` + 2 px de offset
- Divisores editoriais: 1 px

### Elevação

Sombras discretas e quentes no light mode; no dark mode, preferir contraste por superfície em vez de sombra.

`shadow-sm = 0 2px 8px rgba(31,28,25,.08)`

---

## 05. Ícones

**Sistema recomendado: Lucide.**

O ícone deve funcionar como marginalia: simples, fino e silencioso. Não usar emojis como ícones de interface.

- `icon-xs`: 14 px — metadados
- `icon-sm`: 16 px — labels e campos
- `icon-md`: 20 px — botões e navegação
- `icon-lg`: 24 px — ações principais
- stroke: 1.75–2 px
- cantos arredondados naturais do sistema; sem preenchimentos, exceto estados selecionados quando necessário

Ícones devem sempre acompanhar uma hierarquia textual clara; não usar ícones decorativos em excesso.

---

## 06. Componentes

### Buttons

**Primary:** fundo `brand-700`, texto `paper-50`; para dark, `brand-500`.

**Secondary:** superfície transparente, borda `line`, texto `ink-900`.

**Tertiary / text:** sem borda, sem fundo; usa `brand-700`.

Estados: default, hover, pressed, disabled, focus.

Alturas recomendadas: 36 / 40 / 48 px.

### Inputs

- altura default: 44 px
- borda 1 px
- `radius-md`
- label acima do campo
- placeholder em `ink-500`
- erro: borda `error` + mensagem de suporte abaixo

### Checkboxes / radios / switch

Usar traço fino e estados nítidos. O estado selecionado pode usar `brand-700`; sem gradiente.

### Labels / badges

Pequenas etiquetas com `Inter 11–12`. Preferir fundo de baixa intensidade para estados e categorias. Tags editoriais podem usar `paper-200` + `ink-700`.

### Tabs

Linha inferior sutil; item ativo com `brand-700` e peso 600. Evitar “pílulas” para navegação principal.

### Cards

Cards são superfícies funcionais, não blocos decorativos. Usar título, metadados e uma ação clara. Bordas finas são preferidas a sombras.

### Reader progress

Barra de progresso fina (2–4 px) no topo ou junto aos metadados do livro. Mostrar porcentagem apenas quando isso ajuda o usuário.

### Quote / annotation

Citações devem usar EB Garamond em tamanho maior, com uma linha vertical ou marca-texto discreto. Comentários de leitores devem parecer notas de margem, não “balões de chat”.

### Avatares

Círculos pequenos, fundo `paper-200`; iniciais ou foto. Tamanho recomendado: 28 / 36 / 48 px.

### Toast / alert

Usar fundo semântico de baixa intensidade + ícone Lucide + título curto + descrição opcional. A cor forte aparece no ícone, borda ou indicador, não em todo o bloco.

---

## 07. Leitura conjunta

### Princípios específicos

1. **O texto é o protagonista.** Comentários e presença social devem orbitar a página, não competir com ela.
2. **A margem é um padrão de interação.** Anotações aparecem lateralmente ou ancoradas ao trecho; evitar feed social ocupando o centro da leitura.
3. **O grupo é uma camada secundária.** Mostrar quem está lendo, progresso e atividade de forma compacta.
4. **Ritmo de livro.** Transições e estados devem ser discretos; sensação de virar página, revelar margem, destacar trecho.

### Componentes específicos

- `ReadingHeader`
- `BookProgress`
- `ReaderPresence`
- `PassageHighlight`
- `Annotation`
- `DiscussionThread`
- `ReadingSession`
- `ChapterDivider`
- `BookMeta`

---

## 08. Conteúdo e voz

Tom de microcopy: **calmo, inteligente, caloroso e direto**.

Preferir:

> “Você chegou até aqui.”

> “3 leitores estão nesta passagem.”

> “Salvar anotação”

Evitar microcopy excessivamente gamificada, infantilizada ou cheia de exclamações.

---

## 09. Responsividade

### Breakpoints

- `sm`: 640
- `md`: 768
- `lg`: 1024
- `xl`: 1280
- `2xl`: 1440

No mobile, a coluna de leitura permanece prioritária. Marginalia vira painel inferior, drawer ou camada contextual.

---

## 10. Acessibilidade

- Texto corrido: contraste mínimo equivalente a WCAG AA.
- Não usar apenas cor para comunicar estados.
- Foco sempre visível.
- Alvos interativos: mínimo recomendado de 44 × 44 px em touch.
- Seleção de texto, zoom e reflow não devem ser bloqueados no leitor.
- Não depender de emojis ou pictogramas para transmitir informação crítica.

---

## 11. Tokens CSS iniciais

```css
:root {
  --color-paper-100: #F6F0E3;
  --color-paper-200: #EEE6D7;
  --color-paper-300: #E2D7C5;
  --color-ink-900: #1F1C19;
  --color-ink-700: #4B4640;
  --color-ink-500: #777069;
  --color-line: #CFC4B4;
  --color-brand-700: #7C303B;
  --color-brand-500: #A64A54;
  --color-success: #B8D86A;
  --color-warning: #F4D35E;
  --color-error: #E9827D;
  --color-info: #7DBBDA;

  --font-display: "GFS Didot", serif;
  --font-reading: "EB Garamond", serif;
  --font-ui: "Inter", sans-serif;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 40px;
  --space-8: 48px;
  --space-9: 64px;
}

[data-theme="dark"] {
  --color-bg: #20282B;
  --color-surface: #293235;
  --color-surface-2: #323B3E;
  --color-text: #F3EDDF;
  --color-text-muted: #D7D0C4;
  --color-line: #475155;
  --color-brand: #B65A64;
}
```

---

## 12. Checklist de qualidade

Antes de considerar uma tela pronta:

- A hierarquia é compreensível em menos de 3 segundos?
- O texto de leitura continua confortável sem depender da interface?
- A cor semântica informa sem dominar a composição?
- Há consistência de raio, spacing, ícones e pesos?
- O estado de foco está visível?
- O modo escuro parece **tinta sobre papel**, e não um preto de dashboard?
- Há elementos que podem ser removidos sem perder função? Remova-os.
