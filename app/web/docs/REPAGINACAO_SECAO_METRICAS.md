# RepaginaÃ§Ã£o da seÃ§Ã£o de mÃ©tricas â€” Diferenciais tÃ©cnicos

**Data:** Fevereiro 2026  
**AlteraÃ§Ã£o:** SubstituiÃ§Ã£o da seÃ§Ã£o de 4 cards com nÃºmeros genÃ©ricos (Uptime, Ferramentas, Tempo de Resposta, Clientes) por uma seÃ§Ã£o de **diferenciais tÃ©cnicos** em 4 pilares.

---

## Justificativa estratÃ©gica

1. **Problema das mÃ©tricas antigas**  
   NÃºmeros como "99,9% uptime", "25+ ferramentas", "15 min resposta", "150+ clientes" sÃ£o vagos, nÃ£o auditÃ¡veis e soam a marketing. Para um pÃºblico de gestores de TI e decisores, isso reduz credibilidade em vez de aumentar.

2. **Objetivo da nova seÃ§Ã£o**  
   Transmitir **autoridade tÃ©cnica** e **maturidade operacional**: mostrar *como* a ABREU & BRUM atua (metodologia, entregas, linguagem tÃ©cnica) em vez de exibir nÃºmeros que nÃ£o podem ser comprovados.

3. **Abordagem escolhida: OpÃ§Ã£o A â€” Diferenciais tÃ©cnicos**  
   Quatro pilares com tÃ­tulo + descriÃ§Ã£o objetiva:
   - **SeguranÃ§a ofensiva real** â€” OWASP, MITRE ATT&CK, relatÃ³rio executivo + tÃ©cnico  
   - **Monitoramento contÃ­nuo** â€” DetecÃ§Ã£o proativa, correlaÃ§Ã£o de eventos  
   - **Arquitetura segura por design** â€” Hardening, revisÃ£o contÃ­nua  
   - **RelatÃ³rios executivos estratÃ©gicos** â€” VisÃ£o tÃ©cnica + executiva, priorizaÃ§Ã£o por risco  

   Isso comunica metodologia, padrÃµes e tipo de entrega sem prometer nÃºmeros impossÃ­veis de auditar.

4. **PÃºblico e posicionamento**  
   Empresas e gestores de TI valorizam **como** o trabalho Ã© feito (frameworks, entregas, governanÃ§a). A nova seÃ§Ã£o fala diretamente a isso e reforÃ§a posicionamento premium e enterprise-ready.

5. **ConversÃ£o**  
   CTA ao final da seÃ§Ã£o ("Fale com um especialista") mantÃ©m o fluxo para contato sem exagero visual.

---

## Estrutura visual implementada

- **Container:** mesma largura e padding do restante do site (tokens).
- **CabeÃ§alho:** tÃ­tulo H2 "Como garantimos resultados" + subtÃ­tulo em uma linha.
- **Grid:** 4 cards em `auto-fit` (min 260px), gap consistente; em mobile vira 1 coluna.
- **Cards:** Ã­cone discreto (48px, fundo primary-light), tÃ­tulo (H3), descriÃ§Ã£o; borda sutil, barra superior verde no hover; microanimaÃ§Ã£o de elevaÃ§Ã£o no hover.
- **Cores e tipografia:** tokens existentes (ink, muted2, primary, radius-md, shadow-card).

---

## Textos otimizados (sugestÃ£o de revisÃ£o futura)

| Pilar | TÃ­tulo atual | DescriÃ§Ã£o atual |
|-------|----------------|------------------|
| 1 | SeguranÃ§a ofensiva real | Testes de invasÃ£o com metodologia estruturada (OWASP, MITRE ATT&CK), exploraÃ§Ã£o controlada e relatÃ³rio executivo + tÃ©cnico. |
| 2 | Monitoramento contÃ­nuo | DetecÃ§Ã£o proativa, correlaÃ§Ã£o de eventos e anÃ¡lise de comportamento para resposta antecipada a ameaÃ§as. |
| 3 | Arquitetura segura por design | Infraestrutura preparada com boas prÃ¡ticas, hardening e revisÃ£o contÃ­nua para reduzir superfÃ­cie de ataque. |
| 4 | RelatÃ³rios executivos estratÃ©gicos | VisÃ£o tÃ©cnica para a equipe de TI e visÃ£o executiva para tomada de decisÃ£o, com plano de aÃ§Ã£o priorizado por risco. |

Podem ser encurtados ou ajustados por tom (mais formal/informal) conforme a voz da marca.

---

## VariaÃ§Ã£o alternativa sugerida (OpÃ§Ã£o B â€” Indicadores reais)

Se no futuro for desejÃ¡vel **voltar a exibir mÃ©tricas**, que sejam **tÃ©cnicas e auditÃ¡veis**, por exemplo:

- **SLA de resposta inicial:** &lt; 30 min (contratual)
- **Cobertura:** alinhada a MITRE ATT&CK
- **Testes:** OWASP Top 10
- **Entregas:** relatÃ³rio com plano priorizado por risco (ex.: CVSS)

Layout: 4 blocos compactos, nÃºmero ou label + linha de texto, sem nÃºmeros â€œredondosâ€ ou inflados. Exemplo de texto: *"Resposta inicial &lt; 30 min"*, *"Pentest alinhado ao OWASP Top 10"*.

---

## Outra variaÃ§Ã£o (OpÃ§Ã£o C â€” â€œComo atuamosâ€)

Substituir por um **fluxo operacional** em 4 passos:

1. DiagnÃ³stico e mapeamento  
2. Teste tÃ©cnico controlado  
3. AnÃ¡lise de risco e impacto  
4. Plano de correÃ§Ã£o estruturado  

Visual: timeline horizontal (desktop) ou vertical (mobile), Ã­cones numerados, texto curto por etapa. Transmite processo e previsibilidade.

---

## Arquivos alterados

- `app/web/index.html` â€” SeÃ§Ã£o de stats substituÃ­da pela seÃ§Ã£o de diferenciais (HTML semÃ¢ntico: section, article, header, h2/h3).
- `app/web/css/style.css` â€” Estilos antigos de .stats removidos; novos estilos para .differentiators, .differentiator-card, etc.; ajuste responsivo.
- `app/web/js/main.js` â€” Seletor de animaÃ§Ã£o: .stat-item trocado por .differentiator-card (scroll-in).
- `config.js` â€” Objeto `metrics` mantido (pode ser usado em outro contexto); nÃ£o Ã© mais usado na home.

