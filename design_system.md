# Design System — CyberShield (leve)

Documentação mínima dos tokens e componentes usados na repaginação do site. Referência visual: Proposta Comercial (HTML).

---

## 1. Tokens (CSS variables)

Arquivo: `app/web/css/tokens.css`. Carregado antes de `style.css` no HTML.

### 1.1 Cores

| Token | Valor | Uso |
|-------|--------|-----|
| `--color-ink` | #0f172a | Texto principal |
| `--color-muted` | #475569 | Texto secundário |
| `--color-muted2` | #64748b | Metadados, labels suaves |
| `--color-bg` | #ffffff | Fundo da página |
| `--color-surface` / `--color-card` | #ffffff | Fundo de cards e superfícies |
| `--color-border` | #e2e8f0 | Bordas |
| `--color-soft` | #f8fafc | Fundo suave (áreas secundárias) |
| `--color-primary` | #10b981 | Ação primária, links, ícones de destaque |
| `--color-primary-hover` | #059669 | Hover de botão primário |
| `--color-primary-light` | rgba(16,185,129,0.1) | Destaques de fundo |
| `--color-dark-1/2/3` | #0f172a, #1e293b, #334155 | Gradiente hero/footer |
| `--color-on-dark` | #e2e8f0 | Texto em fundo escuro |
| `--color-on-dark-muted` | #94a3b8 | Texto secundário em fundo escuro |

### 1.2 Tipografia

- **Fonte:** `--font-family-base` (Inter + fallbacks).
- **Corpo:** `--text-base-size` (1rem), `--text-base-line` (1.6); opcional `--text-sm`, `--text-lg`, `--text-xl`.
- **Títulos:** `--heading-1-size/weight` até `--heading-4-*`; `--letter-spacing-tight`, `--letter-spacing-tighter`.

### 1.3 Espaçamento

Escala em 4px: `--space-4` a `--space-48`. Uso consistente em padding/margin de seções e componentes.

### 1.4 Superfícies

- **Radius:** `--radius-sm` (10px), `--radius-md` (14px), `--radius-lg` (20px), `--radius-full` (50px para botões pill).
- **Sombras:** `--shadow-card`, `--shadow-card-hover`, `--shadow-button`.

### 1.5 Layout

- `--container-max`, `--container-padding`, `--header-height`, `--header-height-mobile`.

---

## 2. Componentes (classes existentes — não renomear)

Estes componentes são estilizados com tokens; **as classes e IDs são obrigatórias** para o JS (formulários, métricas, navegação).

### 2.1 Button

- **Classes:** `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, (opcional) `.btn-ghost`
- **Estados:** `:hover`, `:focus-visible` (outline visível), `:disabled`; loading via `.fa-spinner` já existente.
- **Tokens:** background/color/border com `--color-primary`, `--color-primary-hover`, `--radius-full`, `--shadow-button`.

### 2.2 Card

- **Classes:** `.service-card`, `.service-card.featured`, `.target-item`, `.value-item`, `.team-member`
- **Tokens:** border `--color-border`, radius `--radius-md` ou `--radius-lg`, padding com `--space-*`, `--shadow-card` / `--shadow-card-hover`.

### 2.3 Formulários

- **Classes:** `.form-group`, `.form-label`, `.form-help`; inputs/select/textarea
- **Estados:** `:focus` (outline com `--color-primary`), `.error` / invalid quando aplicável.
- **Não alterar:** IDs dos forms e campos (`#leadForm`, `#contactForm`, etc.).

### 2.4 Navbar e Footer

- **Header:** `.header`, `.nav`, `.mobile-menu` — cores com `--color-dark-*`, `--color-primary`, `--color-on-dark`.
- **Footer:** `.footer`, `.footer-content`, `.footer-brand`, `.footer-links`, `.footer-services`, `.footer-social`, `.social-links`
- **Atributos preservados:** `data-social`, `data-contact`, `data-metric`, `data-company`.

### 2.5 Seções

- **Hero:** `.hero` — gradiente com `--color-dark-1/2/3`, tipografia com tokens.
- **Stats:** `.stats`, `.stat-item`, `.stat-number` — `data-metric` preenchido por config.
- **Section header:** `.section-header` — títulos e subtítulos com tokens.

---

## 3. Diretrizes

### 3.1 Acessibilidade

- Contraste mínimo (WCAG AA onde possível).
- Focus visível em links e controles (`:focus-visible` com outline).
- Labels em todos os inputs; aria quando necessário (já presente nos forms).
- Heading order: um único h1 por página; h2/h3 em ordem lógica.

### 3.2 Responsivo

- Mobile-first; breakpoint principal 768px (já usado).
- Container e grids responsivos sem alterar estrutura do HTML.

### 3.3 Performance

- Evitar CSS desnecessário; reduzir duplicação usando tokens.
- Lazy-load de imagens apenas se adicionado sem quebrar comportamento.

### 3.4 Classes/IDs reservados ao JS

Não remover nem renomear:

- IDs: `leadForm`, `contactForm`, `leadSubmitBtn`, `submitBtn`, `leadBtnText`, `leadBtnLoading`, `btnText`, `btnLoading`, `lead-message`, `contact-message`, `contact-message-text`, `message-counter`; todos os `id` de campos e `aria-describedby`.
- Classes: `.header`, `.nav`, `.mobile-menu`, `.form-group`, `.service-card`, `.target-item`, `.team-member`, `.stat-item`, `.value-item`, `.stat-number`, `.hero`, `.hero-particles`, `.social-links`; seletores `[data-social]`, `[data-contact]`, `[data-metric]`, `[data-company]`.

Referência: `app/web/js/main.js` e `app/web/js/config.js`.
