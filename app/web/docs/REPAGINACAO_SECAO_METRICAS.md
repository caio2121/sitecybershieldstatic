# Repaginação da seção de métricas — Diferenciais técnicos

**Data:** Fevereiro 2026  
**Alteração:** Substituição da seção de 4 cards com números genéricos (Uptime, Ferramentas, Tempo de Resposta, Clientes) por uma seção de **diferenciais técnicos** em 4 pilares.

---

## Justificativa estratégica

1. **Problema das métricas antigas**  
   Números como "99,9% uptime", "25+ ferramentas", "15 min resposta", "150+ clientes" são vagos, não auditáveis e soam a marketing. Para um público de gestores de TI e decisores, isso reduz credibilidade em vez de aumentar.

2. **Objetivo da nova seção**  
   Transmitir **autoridade técnica** e **maturidade operacional**: mostrar *como* a CyberShield atua (metodologia, entregas, linguagem técnica) em vez de exibir números que não podem ser comprovados.

3. **Abordagem escolhida: Opção A — Diferenciais técnicos**  
   Quatro pilares com título + descrição objetiva:
   - **Segurança ofensiva real** — OWASP, MITRE ATT&CK, relatório executivo + técnico  
   - **Monitoramento contínuo** — Detecção proativa, correlação de eventos  
   - **Arquitetura segura por design** — Hardening, revisão contínua  
   - **Relatórios executivos estratégicos** — Visão técnica + executiva, priorização por risco  

   Isso comunica metodologia, padrões e tipo de entrega sem prometer números impossíveis de auditar.

4. **Público e posicionamento**  
   Empresas e gestores de TI valorizam **como** o trabalho é feito (frameworks, entregas, governança). A nova seção fala diretamente a isso e reforça posicionamento premium e enterprise-ready.

5. **Conversão**  
   CTA ao final da seção ("Fale com um especialista") mantém o fluxo para contato sem exagero visual.

---

## Estrutura visual implementada

- **Container:** mesma largura e padding do restante do site (tokens).
- **Cabeçalho:** título H2 "Como garantimos resultados" + subtítulo em uma linha.
- **Grid:** 4 cards em `auto-fit` (min 260px), gap consistente; em mobile vira 1 coluna.
- **Cards:** ícone discreto (48px, fundo primary-light), título (H3), descrição; borda sutil, barra superior verde no hover; microanimação de elevação no hover.
- **Cores e tipografia:** tokens existentes (ink, muted2, primary, radius-md, shadow-card).

---

## Textos otimizados (sugestão de revisão futura)

| Pilar | Título atual | Descrição atual |
|-------|----------------|------------------|
| 1 | Segurança ofensiva real | Testes de invasão com metodologia estruturada (OWASP, MITRE ATT&CK), exploração controlada e relatório executivo + técnico. |
| 2 | Monitoramento contínuo | Detecção proativa, correlação de eventos e análise de comportamento para resposta antecipada a ameaças. |
| 3 | Arquitetura segura por design | Infraestrutura preparada com boas práticas, hardening e revisão contínua para reduzir superfície de ataque. |
| 4 | Relatórios executivos estratégicos | Visão técnica para a equipe de TI e visão executiva para tomada de decisão, com plano de ação priorizado por risco. |

Podem ser encurtados ou ajustados por tom (mais formal/informal) conforme a voz da marca.

---

## Variação alternativa sugerida (Opção B — Indicadores reais)

Se no futuro for desejável **voltar a exibir métricas**, que sejam **técnicas e auditáveis**, por exemplo:

- **SLA de resposta inicial:** &lt; 30 min (contratual)
- **Cobertura:** alinhada a MITRE ATT&CK
- **Testes:** OWASP Top 10
- **Entregas:** relatório com plano priorizado por risco (ex.: CVSS)

Layout: 4 blocos compactos, número ou label + linha de texto, sem números “redondos” ou inflados. Exemplo de texto: *"Resposta inicial &lt; 30 min"*, *"Pentest alinhado ao OWASP Top 10"*.

---

## Outra variação (Opção C — “Como atuamos”)

Substituir por um **fluxo operacional** em 4 passos:

1. Diagnóstico e mapeamento  
2. Teste técnico controlado  
3. Análise de risco e impacto  
4. Plano de correção estruturado  

Visual: timeline horizontal (desktop) ou vertical (mobile), ícones numerados, texto curto por etapa. Transmite processo e previsibilidade.

---

## Arquivos alterados

- `app/web/index.html` — Seção de stats substituída pela seção de diferenciais (HTML semântico: section, article, header, h2/h3).
- `app/web/css/style.css` — Estilos antigos de .stats removidos; novos estilos para .differentiators, .differentiator-card, etc.; ajuste responsivo.
- `app/web/js/main.js` — Seletor de animação: .stat-item trocado por .differentiator-card (scroll-in).
- `config.js` — Objeto `metrics` mantido (pode ser usado em outro contexto); não é mais usado na home.
