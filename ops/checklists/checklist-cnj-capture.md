# Captura de dados do checklist CNJ (GitHub Pages + GAS)

## 1) Preparar Google Sheets

- Crie uma planilha para receber os envios.
- Copie o ID da planilha (trecho entre `/d/` e `/edit` na URL).

## 2) Publicar Apps Script como Web App

- Crie um projeto Apps Script.
- Cole o conteúdo de `ops/checklists/checklist-cnj-capture.gs`.
- Atualize `CONFIG.spreadsheetId` com o ID da planilha.
- Faça deploy como **Web App**:
  - Execute as: `Me`
  - Who has access: `Anyone`
- Copie a URL final do Web App.

## 3) Configurar o endpoint no checklist

No arquivo `app/web/assets/checklists/checklist-cnj-interativo.html`, ajuste:

```html
<script>
  window.CHECKLIST_CONFIG = window.CHECKLIST_CONFIG || {
    captureEndpoint: "https://script.google.com/macros/s/SEU_DEPLOY_ID/exec",
    requestTimeoutMs: 12000
  };
</script>
```

## 4) O que é enviado

O front envia:

- `status`: `started`, `in_progress` ou `completed`
- `lead`: nome, e-mail, whatsapp, consentimento (`consentGivenAt`)
- `answers`: respostas por pergunta (`sim`, `nao`, `nao_sei`)
- `stats`: totais do diagnóstico
- `xp` e `conformity`
- `metadata`: timestamp, URL e user-agent
- `submissionKey`: chave de idempotência por sessão

## 5) Idempotência e falha de rede

- O backend faz upsert por `submissionKey` na mesma linha (`started` -> `in_progress` -> `completed`).
- Se houver falha de rede, o usuário pode clicar em "Tentar envio novamente" no relatório final.
