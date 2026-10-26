# Matriz de auditoria editorial e comercial

**Data:** 26/10/2026  
**Escopo:** 28 arquivos HTML publicáveis em `app/web`, incluindo rotas no sitemap, páginas legadas e 404.  
**Critério:** alterar apenas textos abstratos, internos ou pouco comerciais; manter textos adequados.

## Matriz página por página

| URL | Texto atual / sinal auditado | Proposta ou decisão | Justificativa |
|---|---|---|---|
| `/` | “Segurança ofensiva para identificar vulnerabilidades antes que se tornem incidentes.”; lede genérico sobre avaliações especializadas | Manter H1; lede explicita Pentest, Red Team, Security Review, aplicações, APIs, infraestrutura, identidades e nuvem. Seção passa a “Três serviços para reduzir risco com evidência” e entrega explicita relatórios, severidade, recomendação e acompanhamento. | H1 já comunica benefício; lede precisava nomear oferta e superfícies. |
| `/servicos/` | “Escolha a lente certa para o risco...” | Manter. | Já apresenta as três famílias, quando contratar, ambientes e entregáveis sem linguagem interna. |
| `/solucoes/` | “A mesma capacidade técnica, traduzida para a decisão do seu negócio.” | Manter. | Copy comercial adequada para compliance, transações e setores; não promete conformidade automática. |
| `/pentest/` | “Encontrar a falha é só o começo...” e rótulos `ATTACK PATH / MAP`, `FRAME`, `PROBE`, `CHAIN`, `READ` | H1 passa a “Pentest para validar vulnerabilidades e caminhos de exploração”; rótulos visuais traduzidos; amostra passa a mostrar executivo, severidade, evidência e recomendação. | Benefício e entrega ficam legíveis sem depender de metáfora ou inglês decorativo. |
| `/pentest/web/` | “Teste o caminho que um usuário não deveria conseguir percorrer.” | Manter. | Título específico, benefício compreensível e entrega demonstrativa sintética. |
| `/pentest/api/` | Título específico de APIs e preservação de `servico=pentest&modalidade=api` | Manter integralmente. | Rota e contexto comercial protegidos; conteúdo já comunica tokens, acesso e fluxo. |
| `/pentest/externo/` | Título específico para perímetro e posição interna | Manter. | Explica perguntas, escopo e entrega sem claims não comprovados. |
| `/ab-scan/` | “Uma primeira leitura da exposição para escolher o próximo passo.” | Manter. | Produto complementar está separado de Pentest e seus limites estão explícitos. |
| `/metodologia/` | “Transparência antes, durante e depois do teste.” | Manter. | Página já explica autorização, escopo, evidência, relatório e reteste sem virar argumento institucional indevido. |
| `/red-team/` | “Uma campanha adversarial, não uma lista de testes.” e rótulos `CAMPAIGN / OBJECTIVE`, `Goal`, `Access`, `Signal`, `Learn` | H1 passa a “Red Team para testar prevenção, detecção e resposta”; rótulos visuais traduzidos; amostra explicita objetivo, sinal, resposta e melhoria. | Benefício comercial aparece imediatamente e reduz inglês ornamental. |
| `/red-team/exercise/` | “Governança faz parte do exercício.” | Manter. | FAQ e sequência já deixam autorização, limites, parada e ausência de certificação claros. |
| `/security-review/` | “A postura de segurança aparece nas conexões.” e rótulos `CONTROL MAP / LAYERS`, `IDENTITY`, `ARCHITECTURE`, `EXPOSURE` | H1 passa a “Security Review para conectar controles, acessos e exposição ao risco”; rótulos traduzidos; amostra explicita controle, risco, severidade e ação. | Explica serviço e benefício antes da metáfora visual. |
| `/security-review/cloud/` | Título específico de nuvem e acesso | Manter. | Benefício, momento de contratação, escopo e entrega já são concretos. |
| `/security-review/active-directory/` | Título específico de privilégio e escalada | Manter. | Comunica problema, escopo e mapa de caminhos de forma suficiente. |
| `/sobre/` | “Quem é a ABREU & BRUM”; “A empresa organiza...” | Hero passa a declarar consultoria, portfólio, propósito, atuação autorizada e confidencialidade; seção “O que fazemos” fica institucional; “Como atendemos” substitui linguagem de execução; compromisso 04 passa a confidencialidade; nota registra 16 siglas autorizadas sem claim corporativo. | Responde quem somos, o que fazemos, como atendemos e como protegemos o contexto do cliente sem inventar equipe, histórico ou instalações. |
| `/conteudos/` | “Segurança ofensiva sem jargão desnecessário.” | Manter. | Posicionamento editorial e CTAs já são diretos. |
| `/solicitar-proposta/` | “Vamos definir a avaliação certa para sua decisão.” | Manter. | Formulário, consentimento, WhatsApp e contexto comercial já estão adequados; não alterar fluxo. |
| `/politica-privacidade.html` | Política de privacidade | Manter. | Conteúdo legal não deve ser reescrito na rodada comercial. |
| `/blog/` | “Artigos para entender risco e contratar melhor.” | Manter. | Página informa reorganização sem esconder o acesso aos conteúdos. |
| `/blog/pentest-teste-de-invasao-empresas.html` | Guia sobre contratação, metodologia e relatório | Manter. | Conteúdo já detalha entregáveis, severidade, evidências, correção e reteste. |
| `/blog/vulnerabilidades-web-aplicacoes-api.html` | Artigo sobre risco em web e APIs | Manter. | Texto orienta problema e contratação sem promessas. |
| `/blog/ataques-supply-chain-fornecedores.html` | Artigo sobre fornecedores e evidências | Manter. | Conteúdo específico para contexto B2B e homologação. |
| `/blog/provimento-213-cnj-cartorios-seguranca-informacao.html` | Conteúdo regulatório para cartórios | Manter. | Rota permanece fora da rodada comercial geral e preserva escopo CNJ. |
| `/blog/supply-chain.html` | Redirecionamento `noindex` para o artigo de supply chain | Manter. | Página legada, sem conteúdo comercial próprio. |
| `/blog/zero-trust.html` | Redirecionamento `noindex` para `/blog/index.html` | Manter. | Página legada, sem conteúdo comercial próprio. |
| `/assets/checklists/checklist-ciberseguranca.html` | Checklist de segurança e conformidade | Manter. | Material interativo não pertence ao redesenho institucional. |
| `/assets/checklists/checklist-cnj-interativo.html` | Diagnóstico CNJ interativo | Manter integralmente. | Guard CNJ, captura, consentimento e motor estão protegidos. |
| `/404.html` | “Página não encontrada.” | Manter. | Função de recuperação já é clara e acessível. |

## Entregáveis demonstrados

As amostras nas páginas de Pentest, Red Team e Security Review continuam explicitamente sintéticas. A apresentação visual agora separa:

- leitura executiva e decisão;
- severidade/prioridade contextual;
- evidência ou sinal observado;
- recomendação, ação ou melhoria;
- apresentação, acompanhamento, reteste e carta de atestado somente quando aplicáveis à modalidade e à proposta.

Não foram adicionados clientes, vulnerabilidades reais, resultados, métricas, preços, histórico, nomes de titulares ou certificações corporativas.

## Certificações e qualificações

As 16 siglas foram preservadas. O site usa “qualificações profissionais autorizadas” e não “certificação da ABREU & BRUM”. A matriz de controle é `reports/matriz-certificacoes.md`; ela registra autorização comercial, mas não evidência nominal de titularidade, validade ou vínculo. Nenhuma dessas informações foi exposta no texto público.

## Invariantes verificados por inspeção

- `servico=pentest` e `modalidade=api` preservados;
- AB Scan sem alteração de motor, API, preço, pagamento ou relatório;
- nenhum arquivo de JavaScript, analytics, consentimento, CSP ou guard CNJ alterado;
- sitemap atualizado apenas nas cinco rotas cujo conteúdo editorial mudou.
