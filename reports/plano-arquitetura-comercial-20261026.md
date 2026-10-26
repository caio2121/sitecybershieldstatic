# Plano de arquitetura comercial — ABREU & BRUM

**Status:** proposta para aprovação editorial e visual  
**Data:** 26 de outubro de 2026  
**Escopo:** arquitetura, wireframes textuais e critérios para a próxima Home, navegação, AB Scan e páginas de serviço. Não altera a produção nesta etapa.

## 1. Fatos confirmados na release pública

- O HTML público consultado corresponde ao artefato local do commit `840c94f`, após normalização de BOM e finais de linha.
- A Home pública contém 16 siglas de certificações.
- `reports/matriz-certificacoes.md` registra autorização explícita do proprietário para publicação das siglas; certificado nominal, titularidade, validade e vínculo profissional continuam sem comprovação anexada.
- A Home pública não apresenta AB Scan como linha de produto destacada.
- A navegação varia entre rotas: Home e páginas premium usam `Contextos`, `Método` e `Solicitar avaliação`; páginas utilitárias usam `Soluções`, `Metodologia`, `Conteúdos` e `Solicitar proposta`.
- O formulário e a jornada WhatsApp permanecem fora deste plano. Não serão redesenhados nem terão texto ou instrumentação alterados nesta etapa.

## 2. Posicionamento aprovado para prototipação

### Mensagem principal

> **Segurança ofensiva para proteger os ativos mais críticos da sua empresa.**

Testes de intrusão, simulações adversariais e avaliações especializadas de aplicações, APIs, redes, nuvem e identidades. Conheça também o AB Scan, nossa solução de teste online.

### Duas linhas de negócio

| Linha | O que o visitante entende | Conversão |
|---|---|---|
| Serviços especializados | Pentest, Red Team e Security Review contratados por escopo, ambiente e objetivo | Solicitar proposta |
| AB Scan | Produto próprio de teste online para uma primeira leitura de exposição | Conhecer o AB Scan |

O AB Scan não deve ser apresentado como um Pentest manual reduzido. A página precisa explicar sua jornada, limites e próximo passo sem prometer cobertura, relatório ou resultado que ainda não tenham sido confirmados.

## 3. Navegação proposta

```text
Serviços        /servicos/
Soluções        /solucoes/
AB Scan         /ab-scan/
Como trabalhamos /metodologia/
Sobre           /sobre/
Conteúdos       /conteudos/
Solicitar proposta /solicitar-proposta/
```

### Gate antes da implementação

`/ab-scan/` hoje é marcado como legado e `noindex`. Antes de promovê-lo na navegação, aprovar:

1. se o produto está comercialmente disponível;
2. qual superfície o teste aceita;
3. quais saídas são entregues;
4. quando o visitante deve migrar para um serviço especializado;
5. se a rota deixa de ser legada e passa a ser indexável.

Até esse gate, o link pode existir apenas no protótipo, não na navegação publicada.

## 4. Protótipo textual da Home

### Desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│ ABREU & BRUM   Serviços  Soluções  AB Scan  Como trabalhamos  Sobre  │
│                                                    Solicitar proposta │
├──────────────────────────────────────────────────────────────────────┤
│ SEGURANÇA OFENSIVA                                                   │
│ Segurança ofensiva para proteger os ativos mais críticos da empresa. │
│ Pentest, Red Team e Security Review para aplicações, APIs, redes,     │
│ nuvem e identidades. Conheça também o AB Scan.                       │
│ [Solicitar proposta]                    [Conhecer o AB Scan]          │
├──────────────────────────────────────────────────────────────────────┤
│ SERVIÇOS ESPECIALIZADOS                                              │
│ [Pentest]                 [Red Team]              [Security Review]   │
│ Prove caminhos de         Simule objetivos        Revise postura,     │
│ exploração autorizados.   adversariais.           controles e exposição│
│ Ver serviços →            Ver serviços →          Ver serviços →      │
├──────────────────────────────────────────────────────────────────────┤
│ AB SCAN — TESTE ONLINE                                                │
│ Uma primeira leitura de exposição para decidir o próximo passo.       │
│ [Conhecer o AB Scan]                         [Falar sobre o ambiente] │
├──────────────────────────────────────────────────────────────────────┤
│ COMO ENTREGAMOS                                                       │
│ Escopo claro · Execução autorizada · Evidência acionável · Conversa   │
│ técnica para priorizar correções                                      │
├──────────────────────────────────────────────────────────────────────┤
│ CONTEXTOS DE CONTRATAÇÃO                                              │
│ Compliance, fornecedores, SaaS, fintech, saúde, indústria e M&A.     │
├──────────────────────────────────────────────────────────────────────┤
│ Escolha o próximo passo para o seu ambiente. [Solicitar proposta]     │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile

```text
ABREU & BRUM                                      [menu]

Segurança ofensiva para proteger
os ativos mais críticos da sua empresa.

[Solicitar proposta]
[Conhecer o AB Scan]

SERVIÇOS ESPECIALIZADOS
Pentest                         →
Red Team                       →
Security Review                →

AB SCAN — TESTE ONLINE
Uma primeira leitura de exposição
para decidir o próximo passo.
[Conhecer o AB Scan]

COMO ENTREGAMOS
Escopo · Execução · Evidência · Próximo passo
```

### Regras editoriais da Home

- Remover rótulos de implementação, como `Engagement / readout`, `ALIGNED`, `MAPPED`, `TESTED`, `READABLE` e `DECIDABLE`.
- Trocar frases sobre a construção do site por verbos comerciais: testar, simular, revisar, priorizar, corrigir e contratar.
- Apresentar as 16 siglas somente como credenciais autorizadas; não convertê-las em certificações corporativas nem acrescentar titular, selo, número ou validade sem evidência nominal.
- Usar a seção de autoridade para explicar superfícies, método e entregáveis verificáveis; credenciais nominais só entram após autorização documentada.

## 5. Protótipo do AB Scan

```text
AB SCAN — TESTE ONLINE

Uma primeira leitura de exposição para entender se o ambiente precisa
de investigação especializada.

[Iniciar conversa sobre o AB Scan]

1. Defina o alvo autorizado
   Domínio, contexto e limites são combinados antes do teste.

2. Execute a avaliação disponível
   A página deve descrever somente a cobertura realmente implementada.

3. Entenda o próximo passo
   Quando a decisão exigir validação manual, exploração controlada ou
   análise de outra superfície, encaminhe para Pentest ou Security Review.

Limites claros: o AB Scan não substitui automaticamente um Pentest,
Red Team ou Security Review.

[Conhecer serviços especializados]
```

O texto acima é wireframe de conteúdo. Os trechos “cobertura realmente implementada” e “saídas entregues” exigem confirmação do produto antes de virar copy pública.

## 6. Modelo de página de serviço

Aplicável às páginas de Pentest, Red Team e Security Review, com variação de família:

```text
HERO
Pentest Web para empresas
Valide autenticação, autorização, lógica de negócio e exposição de dados.
[Solicitar proposta] [Ver modalidades]

QUANDO CONTRATAR
Lançamento · mudança relevante · auditoria · exposição crítica

O QUE AVALIAMOS
Alvos, premissas, limites e profundidade compatíveis com o objetivo.

O QUE VOCÊ RECEBE
Relatório técnico · visão executiva · evidências · prioridades de correção

COMO FUNCIONA
Objetivo → autorização → escopo → execução → readout → próximo passo

MODALIDADES RELACIONADAS
Links para páginas reais; itens sem página apontam para proposta com
parâmetros preservados.

[Solicitar proposta]
```

### O que retirar

- “Uma página por decisão, não uma grade de cards”.
- “Os links abaixo preservam as ofertas da família”.
- “A narrativa muda conforme o objetivo”.
- “O catálogo completo permanece disponível”.
- Referências à intenção de busca, migração editorial ou decisão interna de design.

Essas informações pertencem ao plano de produto, não à experiência do comprador.

## 7. Nova abordagem para Sobre

Sequência proposta:

1. **Quem somos:** empresa de segurança ofensiva e avaliações técnicas para ambientes críticos.
2. **O que fazemos:** Pentest, Red Team e Security Review, com exemplos de superfícies.
3. **Como atendemos:** objetivo, autorização, escopo, execução, evidência e conversa técnica.
4. **Por que contratar:** precisão técnica, comunicação clara, confidencialidade e entregáveis acionáveis.
5. **Credenciais:** apenas evidências autorizadas; nunca transformar credencial individual em certificação corporativa.
6. **Próximo passo:** solicitação de proposta.

Evitar a seção “qualificações sob consulta” como destaque institucional. Se uma limitação precisar ser mantida, ela deve aparecer como nota contextual e não como protagonista da página.

## 8. Direção visual para prototipação

Combinar:

- **Consultoria premium:** composição editorial, títulos diretos, espaço, autoridade próxima do CTA.
- **Produto digital:** painel demonstrativo reservado ao AB Scan, com jornada visual própria e limites explícitos.

Manter navy, dourado e a tipografia já aprovada. Evitar neon, excesso de cards, códigos como elemento principal e gráficos que pareçam documentação interna.

## 9. Gates de conteúdo e segurança

Antes de implementar:

- decidir o status comercial e a cobertura real do AB Scan;
- registrar a autorização já recebida para as 16 siglas e, antes de expandir o claim, anexar evidência nominal de titularidade, emissor, validade e vínculo;
- confirmar a navegação única para todas as rotas;
- preservar `servico=` e demais parâmetros dos CTAs existentes;
- não alterar formulário, WhatsApp, consentimento, privacidade, CSP, analytics ou guard CNJ;
- não publicar clientes, métricas, logos, cases, preços ou resultados garantidos;
- não mencionar fornecedor white label.

## 10. Sequência de implementação após aprovação

1. Aprovar mensagem principal, navegação e decisão sobre AB Scan.
2. Aprovar wireframes e hierarquia visual em capturas estáticas.
3. Reescrever Home e Sobre.
4. Normalizar headers, labels e CTAs das rotas públicas.
5. Aplicar o modelo às páginas de família e modalidades prioritárias.
6. Implementar a página comercial do AB Scan somente após o gate de produto.
7. Validar copy, acessibilidade, responsividade, links, parâmetros e invariantes.
8. Fazer captura visual real em desktop e mobile antes do deploy.

## Critérios de aceite da próxima implementação

- Em até cinco segundos, a Home deixa claras as duas linhas de negócio.
- Os três serviços especializados são identificáveis sem interpretar códigos de catálogo.
- Cada CTA leva à rota correta e preserva o contexto comercial.
- O AB Scan possui jornada e limites próprios, sem ser confundido com Pentest manual.
- Home, Serviços, Sobre, Conteúdos e páginas filhas usam a mesma navegação.
- Nenhuma credencial sem autorização aparece como selo, certificação corporativa ou prova de capacidade.
- Nenhuma superfície protegida — formulário, WhatsApp, consentimento, privacidade, CSP, analytics ou guard CNJ — é alterada.
- Capturas reais confirmam hierarquia, legibilidade e ausência de overflow antes da publicação.
