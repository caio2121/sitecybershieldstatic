# Agente 5 — arquitetura comercial e CRO

**Status:** concluída  
**Fluxos auditados:** navegação principal, famílias de serviço, rotas filhas, solicitação de proposta e WhatsApp

## Jornada observada

1. O visitante identifica a decisão na Home.
2. Escolhe Pentest, Red Team ou Security Review.
3. Entra em páginas por família e modalidades prioritárias, incluindo Pentest API.
4. Usa CTA com `servico=` para chegar à solicitação de proposta.
5. O formulário organiza contexto e abre WhatsApp para revisão do usuário; não há envio automático fictício.

## Achados e prioridade

| Prioridade | Achado | Impacto qualitativo | Esforço | Recomendação |
|---|---|---|---|---|
| Alta | CTA e vocabulário das famílias estão alinhados ao objetivo de compra | reduz escolha errada | já tratado | preservar parâmetros e rotas |
| Alta | WhatsApp é o canal comercial operacional | evita backend inventado | já tratado | não trocar por captura não autorizada |
| Média | algumas modalidades de catálogo ainda são âncoras locais | pode gerar expectativa de página detalhada | baixo | tratar em tarefa editorial própria; apontar para solicitação quando houver decisão |
| Média | utilitários legados usam navegação e CTA antigos | reduz consistência cross-site | médio | migrar após aprovação visual do design system |

## Critérios de conversão

- CTA visível na primeira dobra e no final da página.
- Serviço escolhido preservado na URL.
- Formulário pede contexto, não segredo.
- Consentimento e analytics permanecem separados de PII.
- Nenhum endpoint novo ou promessa de recebimento foi criado.
- Pentest API preserva `servico=pentest` e acrescenta `modalidade=api` no CTA.
