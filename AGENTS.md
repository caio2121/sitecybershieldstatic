# Regras locais do repositório

## Publicação após alterações

Este repositório é validado visualmente no site publicado. Portanto, após
qualquer alteração de arquivos do repositório, o agente deve, nesta ordem:

1. executar as verificações aplicáveis;
2. criar um commit com a alteração validada;
3. fazer push para `main`;
4. aguardar a conclusão bem-sucedida do workflow de GitHub Pages;
5. executar smoke test externo no site publicado.

Não concluir a tarefa como publicada sem evidência do commit, push, workflow e
smoke test. Se uma verificação, autenticação, workflow ou publicação falhar, o
fluxo deve parar e reportar o bloqueio; não contornar a falha nem declarar
sucesso.

Esta regra vale somente para este repositório e não autoriza alterações em
outros repositórios, servidores, segredos ou sistemas externos fora do fluxo de
publicação do GitHub Pages.
