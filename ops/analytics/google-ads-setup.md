# Google Ads (AW-18216339237) — Instalação e Conversões

Guia de instalação da tag do Google Ads no site da ABREU & BRUM e de configuração
das conversões da campanha de Search.

Domínio canônico de produção: `https://abreuebrum.com.br`

## GA4 x Google Ads — não são a mesma coisa

| Produto | ID | Para que serve |
|---------|----|----------------|
| Google Analytics 4 | `G-K46VQ6H8MS` | Mede **todo o tráfego** do site (visitas, origem, localização, comportamento) |
| Google Ads | `AW-18216339237` | Mede **conversões** das campanhas quando configuradas; remarketing não está habilitado nesta release |

As duas tags **convivem** — uma não substitui a outra. O domínio
`googletagmanager.com` no script é apenas onde o `gtag.js` é hospedado; **não**
existe um container do Google Tag Manager (GTM) neste site.

## Regra de tag única

O Google avisa: *"Não inclua mais de uma tag do Google em cada página"*.
Portanto **não** colamos um segundo `<script async src="...gtag/js?id=AW-...">`.
Reaproveitamos o carregador `gtag.js` que já existe (do GA4) e adicionamos
apenas mais uma chamada de configuração, logo após a do GA4:

```html
gtag('config', 'G-K46VQ6H8MS');
gtag('config', 'AW-18216339237');
```

Isso está aplicado no `<head>` de todas as páginas HTML em `app/web/`.

## Consentimento (LGPD)

`app/web/js/analytics.js` usa Consent Mode v2. Por padrão tudo fica `denied`.
Quando o usuário **aceita** os cookies no banner, apenas
`analytics_storage` passa a `granted`. Os sinais
`ad_storage`, `ad_user_data` e `ad_personalization` permanecem `denied` nesta
release; portanto, remarketing e conversões Ads que dependam desses sinais não
devem ser tratados como habilitados. Quando recusa, todos permanecem `denied`.

## Medição das conversões (formulário, WhatsApp, blog)

A tag base já habilita remarketing e a conversão de visita. Para contar as
conversões específicas, há dois caminhos:

### Opção A — Importar um evento confirmado do GA4 (recomendada, sem código)

1. Vincular as contas: Google Ads > **Ferramentas > Vínculos de contas > Google Analytics (GA4)**.
2. Em **Ferramentas > Conversões > Nova ação de conversão > Importar > GA4**,
   importar somente um evento de lead confirmado, como `generate_lead`, após
   existir backend/CRM ou confirmação operacional. O site estático registra
   `whatsapp_message_prepared` e `contact_channel_opened`, que não significam
   envio ou recebimento de lead.
3. Marcar como conversão primária da campanha de Search.

### Opção B — Disparo direto via gtag (rótulo de conversão)

1. Em Google Ads > **Conversões > Nova ação de conversão > Site**, criar a ação
   (ex.: "Lead - Formulário"). O Google fornece um **rótulo** no formato
   `AW-18216339237/AbCdEfGhIjK`.
2. Preencher o rótulo em `app/web/js/config.js`:

   ```js
   analytics: {
       adsConversionId: 'AW-18216339237',
       adsConversionLabel: 'AbCdEfGhIjK', // rótulo fornecido pelo Ads
       ...
   }
   ```

3. O código só dispara a conversão direta quando o rótulo estiver configurado
   e a chamada indicar explicitamente um evento elegível (`ads_conversion: true`).
   Não habilite essa opção para abertura de WhatsApp ou preparo de mensagem.

> Use **uma** das opções para evitar contagem duplicada. A Opção A é a mais
> simples e centraliza tudo no GA4; a Opção B é útil para conversões em tempo
> real diretamente no Ads.

## Validação

1. Abrir `https://abreuebrum.com.br/` (ou servir localmente com `python3 -m http.server` em `app/web/`).
2. Abrir o **Google Tag Assistant** (tagassistant.google.com) e confirmar que
   na mesma página aparecem os dois IDs: `G-K46VQ6H8MS` e `AW-18216339237`,
   carregados por **um único** `gtag.js`.
3. Aceitar os cookies e confirmar no console/Network o disparo de `consent update`
   com `ad_storage: granted`.
4. Com a Opção B ativa, use um fluxo de teste que confirme o lead e verifique o
   evento `conversion`; não use apenas o clique em WhatsApp como prova.
