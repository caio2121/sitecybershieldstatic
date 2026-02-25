# Changelog — Repaginação UI/UX Site CyberShield

**Data:** Fevereiro 2026  
**Escopo:** Identidade visual alinhada à Proposta Comercial; design system com tokens CSS; refatoração incremental sem quebrar formulários, tracking ou deploy.

---

## O que mudou

### 1. Design system e tokens

- **Novo arquivo:** `app/web/css/tokens.css`  
  Variáveis CSS para cores (ink, muted, primary, dark-1/2/3, border, soft, etc.), tipografia (font-family, tamanhos, pesos), espaçamento (space-4 a space-48), radius (sm, md, lg, full), sombras e layout (container, header-height).
- **Novo documento:** `design_system.md`  
  Descrição dos tokens, componentes e diretrizes (acessibilidade, mobile-first, performance). Lista de classes/IDs reservados ao JS.

### 2. Página inicial (`app/web/index.html`)

- Inclusão de `css/tokens.css` antes de `css/style.css` para carregar as variáveis em todas as páginas que usam o style principal.

### 3. CSS principal (`app/web/css/style.css`)

- **Base:** `body` e `.container` passam a usar `var(--font-family-base)`, `var(--color-ink)`, `var(--color-bg)`, `var(--container-max)`, `var(--container-padding)`, `var(--header-height)`.
- **Header:** Cores e bordas com `var(--color-dark-2)`, `var(--color-on-dark)`, `var(--color-primary)`; espaçamentos com `var(--space-*)`.
- **Hero:** Gradiente com `var(--color-dark-1/2/3)`; título e subtítulo com tokens de tipografia e `var(--color-on-dark-subtle)`; botões com `var(--shadow-button)`, `var(--radius-full)`; focus visível em `.btn` com `var(--color-primary)`.
- **Stats:** Fundo `var(--color-soft)`; cards com `var(--color-surface)`, `var(--color-border)`, `var(--radius-lg)`, `var(--shadow-card)`; números e labels com tokens de cor.
- **Serviços:** `.section-header` e `.service-card` (incl. `.featured`) usam tokens de cor, radius, sombra e tipografia; `.card-icon` e listas com `var(--color-primary)`; `.btn-outline` com tokens.
- **Target, About, Team:** Fundos, bordas, textos e ícones passam a usar `var(--color-soft)`, `var(--color-ink)`, `var(--color-muted2)`, `var(--color-border)`, `var(--color-primary)`, `var(--radius-*)`, `var(--space-*)`.
- **Contato:** `.contact-form`, `.contact-method`, inputs e focus com tokens; mensagens de sucesso/erro mantêm cores de feedback (sem alteração semântica).
- **Formulários:** `.form-group` com `var(--color-border)`, `var(--radius-sm)`, `var(--color-primary)` no focus e `var(--color-primary-light)` no box-shadow; focus visível para checkbox (outline com `var(--color-primary)`).
- **Footer:** Fundo `var(--color-dark-1)`; textos e links com `var(--color-on-dark)`, `var(--color-on-dark-muted)`, `var(--color-primary)`; redes sociais com `var(--color-dark-2)`, `var(--color-dark-3)`; bordas e espaçamentos com tokens.
- **Responsivo:** Media query 768px usa `var(--header-height-mobile)` e `var(--container-padding)`.
- **Outros:** `.floating-cta .btn`, `.lead-form`, `.standards` e demais seções que usavam cores literais passam a usar as variáveis correspondentes (primary, ink, muted2, border, soft, dark-1/2/3).

Nenhuma classe ou ID usado por `main.js` ou `config.js` foi removido ou renomeado.

### 4. Blog

- **`app/web/blog/index.html`:** Link para `../css/tokens.css` antes do CSS do blog; hero do blog com `var(--color-dark-1, #0f172a)`.
- **`app/web/blog/css/style.css`:** `@import url('../../css/tokens.css')` no topo; `body`, `.container`, `.logo i`, `.nav a:hover`/`.active` passam a usar tokens. Demais regras do blog mantidas (podem ser migradas gradualmente).

### 5. Política de privacidade

- **`app/web/politica-privacidade.html`:** Link para `css/tokens.css` antes de `css/style.css`; estilos inline atualizados para usar `var(--color-soft)`, `var(--color-bg)`, `var(--color-ink)`, `var(--color-primary)`, `var(--color-muted)`, `var(--color-muted2)`, `var(--color-dark-2)`, `var(--radius-lg)`, `var(--shadow-card)`, `.back-button` e `.contact-info` com tokens.

### 6. Documentação

- **`relatorio_diagnostico.md`:** Estrutura do site, UI, acoplamento (formulários/WhatsApp/config), extração do HTML de referência, problemas priorizados.
- **`design_system.md`:** Tokens, componentes (Button, Card, Forms, Navbar, Footer, Seções), diretrizes e lista de seletores reservados ao JS.
- **`checklist_qualidade.md`:** Itens de acessibilidade, performance, SEO e produção com Pass/Fail e observações.

---

## Antes / Depois (resumo visual)

- **Antes:** Cores e espaçamentos em valor literal; um único arquivo CSS longo; blog e política sem tokens.
- **Depois:** Paleta e espaçamentos centralizados em `tokens.css`; mesmo aspecto visual, com manutenção e consistência facilitadas; blog e política passam a consumir os mesmos tokens onde aplicado; focus e contraste preservados ou melhorados (outline explícito em botões).

---

## Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `app/web/css/tokens.css` | Novo |
| `app/web/css/style.css` | Refatorado com tokens |
| `app/web/index.html` | Link para tokens.css |
| `app/web/blog/index.html` | Link para tokens + var no hero |
| `app/web/blog/css/style.css` | @import tokens + base/header com vars |
| `app/web/politica-privacidade.html` | Link tokens + estilos inline com vars |
| `relatorio_diagnostico.md` | Novo |
| `design_system.md` | Novo |
| `CHANGELOG_REPAGINACAO.md` | Novo (este arquivo) |
| `checklist_qualidade.md` | Novo |

---

## O que não mudou

- `app/web/js/main.js` e `app/web/js/config.js` — sem alterações.
- IDs e nomes de campos dos formulários; atributos `data-contact`, `data-metric`, `data-company`, `data-social`.
- Estrutura HTML (seções, ordem, links internos e externos).
- Pipeline de deploy (`.github/workflows/deploy-pages.yml`), CNAME, sitemap, robots.
