# Captura CNJ — desativada

## Status atual

A captura automática do checklist CNJ está **desativada** nesta release.

Classificação da pendência externa: **EXTERNAL_DEFERRED — Legacy Apps Script Deployment**.
Investigação futura: tarefa `agent-tasks#1571`.

- O checklist público funciona localmente no navegador.
- O frontend não monta payload nem faz `fetch`, XHR ou `sendBeacon` para captura.
- `ops/checklists/checklist-cnj-capture.gs` responde como desativado e não grava planilhas.
- Nenhum endpoint público de captura foi configurado no HTML.
- Não foi possível verificar se versões antigas do Apps Script estão implantadas externamente.

## Ação operacional obrigatória

Antes da publicação, a operação deve verificar no Google Apps Script se existe
algum deployment antigo deste projeto. Se existir, deve suspendê-lo ou removê-lo.
Esta alteração no repositório não revoga deployments externos já publicados.

Não declarar a captura CNJ como ativa, nem reutilizar o endpoint antigo, até uma
tarefa independente definir backend autenticado, autorização, retenção, LGPD,
monitoramento e critérios de aprovação.

## Futura implementação

Uma tarefa futura deverá definir, antes de qualquer transmissão:

- backend server-side autenticado e autorizado;
- autenticação que não dependa de `metadata.pageUrl`, CORS, Origin ou Referer;
- endpoint e credenciais mantidos fora do frontend;
- política de retenção e acesso aos dados;
- confirmação de envio e tratamento de falhas;
- revisão independente de segurança e privacidade;
- teste de publicação que rejeite qualquer caminho de captura não aprovado.

O Apps Script existente é apenas referência histórica e permanece desativado.
Não preencher placeholders de planilha, API Secret, Measurement ID ou endpoint
nesta release.

## Analytics

O site pode registrar eventos de intenção sem dados pessoais após consentimento,
como `diagnostic_started` e `contact_channel_opened`. Esses eventos não confirmam
lead, envio de mensagem ou captura do checklist.

`generate_lead` e eventos offline dependem de um fluxo futuro que confirme o lead.
