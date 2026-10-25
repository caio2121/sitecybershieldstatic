# Agente 8 — SEO, GEO e conteúdo

**Status:** concluída

## Verificações

- Canonical, title, description e Open Graph estão presentes nas rotas premium auditadas.
- Sitemap inclui Home, famílias, páginas filhas — incluindo `/pentest/api/` —, Sobre, proposta, blog e conteúdos autorizados.
- JSON-LD usa tipos de página coerentes nas rotas premium e não contém identidade do fornecedor white label.
- Conteúdo é original, sem stuffing; a intenção é organizada por decisão, superfície e contexto.
- `robots.txt` aponta para o sitemap e mantém caminhos públicos permitidos.

## Recomendação sem alteração ampla

Manter páginas por intenção comercial real: Pentest, Red Team, Security Review e modalidades com pergunta própria. Não criar páginas artificiais para cada keyword.

## Riscos residuais

1. Páginas utilitárias legadas têm nomenclatura de navegação diferente (`Soluções`, `Metodologia`, `Solicitar proposta`) da camada premium (`Contextos`, `Método`, `Solicitar avaliação`).
2. Qualquer novo claim técnico precisa passar pela matriz de evidências antes de entrar em HTML, JSON-LD, sitemap ou metadado.
