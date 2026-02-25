# Relatório de Diagnóstico — Site CyberShield em Produção

**Data:** Fevereiro 2026  
**Objetivo:** Base para repaginação UI/UX alinhada ao HTML de referência (Proposta Comercial) e design system leve.

---

## 1. Estrutura do site

### 1.1 Páginas e seções

| Página | Caminho | Conteúdo principal |
|--------|---------|--------------------|
| Home | `app/web/index.html` | Header, hero, stats, serviços, lead form, público-alvo, sobre, equipe, contato, footer |
| Blog (listagem) | `app/web/blog/index.html` | Grid de artigos |
| Artigos | `app/web/blog/*.html` | ~25 artigos com header/nav/article/footer |
| Política de privacidade | `app/web/politica-privacidade.html` | Texto legal, estilos inline |
| Checklist | `app/web/assets/checklists/checklist-ciberseguranca.html` | Documento tipo A4 |

### 1.2 Componentes repetidos

- **Header:** `.header` (fixo), `.logo`, `.nav`, `.mobile-menu`
- **Hero:** `#home`, `.hero`, `.hero-content`, `.hero-buttons`, `.hero-visual`
- **Stats:** `.stats`, `.stat-item`, `.stat-number` (valores via `data-metric` + config.js)
- **Cards:** `.service-card` (com `.featured`), `.target-item`, `.team-member`, `.value-item`
- **Formulários:** `#leadForm` (checklist/WhatsApp), `#contactForm` (contato/WhatsApp)
- **Footer:** `.footer`, `.footer-content`, `.footer-brand`, `.footer-links`, `.footer-services`, `.footer-social`, `.social-links` com `data-social`

### 1.3 Build e deploy

- **Build:** Não há Node/npm; site é estático. Deploy = cópia de `app/web` para `_site` no GitHub Actions.
- **Workflow:** `.github/workflows/deploy-pages.yml` — substitui domínio em HTML/XML/TXT, grava CNAME, deploy no GitHub Pages.
- **Domínio:** `www.cybershieldgroup.com.br` (CNAME em `app/web/CNAME`).

---

## 2. Como a UI é construída

- **CSS:** Apenas CSS próprio em `app/web/css/style.css` (~1678 linhas). Sem Tailwind, Bootstrap ou variáveis CSS (`:root`).
- **Fontes:** Inter (Google Fonts) + Font Awesome 6 (CDN).
- **Valores:** Cores e espaçamentos em valor literal (#0f172a, #10b981, #64748b, #e2e8f0, 20px, 2rem, etc.).
- **Blog:** `app/web/blog/css/style.css` + blocos `<style>` em `blog/index.html`; não compartilha tokens com o site principal.

---

## 3. Acoplamento (o que não pode quebrar)

### 3.1 Formulários e envio

- Formulários **não** postam para servidor. Botões são `type="button"`.
- **Lead form:** validação em JS → download do PDF (URL em `config.js`) → abertura do WhatsApp com dados do form.
- **Contato:** validação em JS → montagem da mensagem → abertura do WhatsApp.
- Número WhatsApp e dados de contato vêm de `config.js`; elementos são atualizados via `data-contact`, `data-email-type`, `data-metric`, `data-company`.

### 3.2 IDs obrigatórios (main.js)

- Formulários: `leadForm`, `contactForm`, `leadSubmitBtn`, `submitBtn`, `leadBtnText`, `leadBtnLoading`, `btnText`, `btnLoading`
- Mensagens: `lead-message`, `contact-message`, `contact-message-text`, `message-counter`
- Campos e aria: `contact-name`, `contact-email`, `name-help`, `lead-privacy-help`, etc. (todos os `id` usados em `getElementById` e `aria-describedby`)

### 3.3 Classes e atributos obrigatórios

- Layout/nav: `.header`, `.nav`, `.mobile-menu`
- Formulários: `.form-group`, `.form-help`
- Conteúdo: `.service-card`, `.target-item`, `.team-member`, `.stat-item`, `.value-item`, `.stat-number`
- Hero/animations: `.hero`, `.hero-particles`
- Footer: `.social-links a[data-social]`, `[data-contact]`, `[data-metric]`, `[data-company]`

---

## 4. Extração do HTML de referência (Proposta Comercial)

### 4.1 Paleta

| Token (referência) | Valor | Uso |
|--------------------|--------|-----|
| --ink | #0f172a | Texto principal |
| --muted | #475569 | Texto secundário |
| --muted2 | #64748b | Metadados, notas |
| --bg | #ffffff | Fundo |
| --card | #ffffff | Fundo de cards |
| --border | #e2e8f0 | Bordas |
| --soft | #f8fafc | Fundo suave (tabelas, áreas secundárias) |
| --accent | #10b981 | Primária, checks, destaques |
| --dark1 | #0f172a | Gradiente (início) |
| --dark2 | #1e293b | Gradiente (meio) |
| --dark3 | #334155 | Gradiente (fim) |

### 4.2 Estilo visual

- **Cards:** border 1px solid var(--border), border-radius 14px, padding 12px; título com ícone e cor accent.
- **Listas:** sem marcador; check (✓) verde à esquerda.
- **Highlight:** fundo verde suave, border-left 4px accent, border-radius 12px.
- **Badges:** inline-flex, border-radius 999px, borda e fundo semitransparentes.
- **Tabelas:** cabeçalho com --soft, bordas --border, border-radius 12px.

### 4.3 Tipografia

- Fonte: Inter (300–800).
- Títulos: letter-spacing negativo (-0.02em a -0.03em), font-weight 900 para títulos de página.
- Hierarquia: page-title 22px, section-title 16px, corpo 12–13px no documento.

### 4.4 Grid e espaçamento

- grid-2 / grid-3 com gap 10px; espaçamentos 8/10/12/14px; padding de página 16mm/15mm.

---

## 5. Problemas do site atual (prioridade)

### 5.1 Alto

| Problema | Impacto | Observação |
|----------|---------|------------|
| Cores e espaçamentos hardcoded | Inconsistência e manutenção difícil | Sem tokens; risco de divergência em novas páginas e no blog |
| CSS único e longo (~1678 linhas) | Duplicação, difícil evolução | Valores repetidos; sem separação base/componentes |

### 5.2 Médio

| Problema | Impacto | Observação |
|----------|---------|------------|
| Tipografia não formalizada | Hierarquia fraca em alguns blocos | Escalas e pesos não documentados; gradient em section-header pode afetar contraste |
| Radius e sombras inconsistentes | Visual menos profissional | Botões 50px, cards 20px; sem escala de radius |
| Blog e política sem tokens | Divergência entre páginas | Blog e política não usam o mesmo sistema visual |

### 5.3 Baixo

| Problema | Impacto | Observação |
|----------|---------|------------|
| Contraste e heading order | Acessibilidade | Verificar em checklist; index já tem labels e aria |
| Imagens (formato/dimensões) | Performance | Checar no checklist; sem build de otimização |
| SEO básico | Indexação | index já tem title, description, OG, canonical |

---

## 6. Resumo e próximos passos

- **Site:** Estático, CSS puro, sem variáveis; formulários e métricas dependem de IDs/classes e de `config.js`/`main.js`.
- **Referência:** Paleta e componentes da Proposta Comercial devem guiar tokens e componentes do site.
- **Risco:** Qualquer alteração em IDs, nomes de campos ou classes usadas por `main.js`/config quebra envio WhatsApp e métricas.
- **Próximo passo:** Definir design system (tokens + componentes) e refatorar CSS em ordem de baixo para alto risco, preservando toda a estrutura HTML e JS.
