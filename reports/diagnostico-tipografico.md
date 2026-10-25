# Diagnóstico tipográfico

## Versão auditada

Na produção, a fonte Ethnocentric era aplicada a `.p-display` e dominava hero, títulos de seção, cards e páginas de serviço. A estética mantinha a identidade do logotipo, mas produzia quatro problemas observáveis:

1. leitura lenta em português, especialmente em mobile;
2. títulos com aparência de wordmark repetido, sem distinção entre marca e conteúdo;
3. baixa diferenciação semântica entre Pentest, Red Team e Security Review;
4. densidade visual alta em blocos longos e navegação editorial.

## Sistema adotado

| Token | Família | Uso |
|---|---|---|
| `--font-family-display` | Manrope 600–800 | hero, H1, H2, H3 e cards editoriais |
| `--font-family-base` | Inter 400–700 | corpo, navegação, botões, formulários e tabelas |
| `--font-family-mono` | IBM Plex Mono 400/600 | códigos, labels técnicos e estados |
| identidade legada | Ethnocentric | somente ativo de identidade que depende do logotipo |

Os arquivos são locais, subsetados em WOFF2 e carregados com `font-display: swap`. Tamanho, peso, line-height e letter-spacing foram reduzidos para priorizar legibilidade e evitar quebra intrapalavra.
