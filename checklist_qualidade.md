# Checklist de Qualidade — Repaginação UI/UX

**Data:** Fevereiro 2026  
**Site:** CyberShield (app/web) — produção www.cybershieldgroup.com.br

---

## 1. Acessibilidade

| Item | Status | Observação |
|------|--------|------------|
| Navegação por teclado | Pass | Links e botões acessíveis por Tab; formulários em ordem lógica. |
| Focus visível | Pass | Outline 2px em inputs/select/textarea e checkbox (var(--color-primary)); .btn com :focus-visible. |
| Labels em todos os inputs | Pass | .form-label associados aos campos; aria-describedby e form-help presentes. |
| Headings em ordem | Pass | Home: h1 no hero, h2 nas seções; sem saltos (h1 → h2 → h3). |
| Contraste de texto | Pass | Cores do token (ink sobre bg, muted2 sobre soft) mantêm contraste legível; verificar com ferramenta externa em novos blocos. |
| Aria e roles | Pass | Legend sr-only nos forms; role="alert" e aria-live na mensagem de contato; aria-required onde aplicável. |

---

## 2. Performance

| Item | Status | Observação |
|------|--------|------------|
| Imagens (formato/dimensões) | Verificar | Logo e favicon em uso; não há pipeline de otimização (WebP, dimensões); recomendado checar tamanhos e considerar lazy-load em listagens. |
| CSS/JS sem bloat óbvio | Pass | Sem novas libs; tokens.css pequeno; style.css refatorado sem aumento de regras. |
| Ausência de libs pesadas | Pass | Apenas Inter (Google Fonts) e Font Awesome 6 (CDN); sem frameworks JS. |
| Cache / versionamento de assets | Verificar | Deploy estático; cache depende do GitHub Pages; não há query string de versão nos CSS (pode ser adicionado no futuro). |

---

## 3. SEO

| Item | Status | Observação |
|------|--------|------------|
| Title e meta description por página | Pass | index, blog, política de privacidade com title e description coerentes. |
| Open Graph básico | Pass | og:type, og:url, og:title, og:description, og:image presentes na home e no blog. |
| Alt em imagens relevantes | Pass | Logo e ícones decorativos com alt; imagens de conteúdo devem manter alt quando existirem. |
| Links e headings coerentes | Pass | Estrutura de links (nav, footer) e headings (h1 único na home) mantidas. |
| Canonical | Pass | index e blog com canonical URL. |

---

## 4. Produção

| Item | Status | Observação |
|------|--------|------------|
| Build / deploy | Pass | Workflow GitHub Actions copia app/web → _site; sem build Node; tokens e style estáticos. |
| Rotas e links | Pass | Nenhuma rota ou href alterado; links internos (#servicos, #contato, etc.) e externos (blog, política) preservados. |
| Console sem erros | Verificar | Validar no browser após deploy; recursos (tokens.css, style.css) devem carregar (paths relativos corretos). |
| Responsivo (mobile / tablet / desktop) | Pass | Breakpoint 768px; header height e hero ajustados com tokens; grid e container responsivos. |
| Formulários e WhatsApp | Pass | IDs e classes dos forms preservados; config.js e main.js inalterados; fluxo de envio via WhatsApp e download do checklist mantido. |

---

## Resumo

- **Pass:** 14 itens  
- **Verificar:** 3 itens (imagens/cache, console após deploy)

Recomenda-se rodar o site localmente (servindo app/web) e em produção após o merge para confirmar carregamento de `tokens.css` em todas as páginas e ausência de erros no console.
