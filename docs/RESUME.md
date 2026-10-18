# Retomada — HOLDINGTOTAL-STUDY-20261018

Root: `C:\Users\VTz produti\holdingtotal-study`.
URL local: `http://127.0.0.1:3081/imersao`.

Implementação concluída em 11 módulos gerados do DOM vivo; componentes React
para FAQ/carrossel/checkout/CTAs/reveals. CSS original e 62 tokens preservados.
O extrator foi corrigido para usar o DOM do Chromium, em vez da interpretação
de um fechamento `h3`/`h2` inválido pelo parser Python.

Evidências e resultado vigente: `docs/validation.md`,
`reference/verification/checks.json`, `reference/verification/pixel-diff.json` e
`reference/rea-final.json`. Consulte esses arquivos antes de repetir trabalho.

Se o preview não responder, execute `INICIAR-SITE.bat`. Se editar fonte, rode
`npm run typecheck` e `npm run build`; reinicie somente o listener deste projeto
na porta 3081, conferindo PID/CommandLine, antes de `npm run verify`.
O processo já aberto não passa automaticamente a usar um build novo.

Comando de comparação: `python scripts/pixel-diff.py` após `npm run verify`.
O Chromium pode ser configurado por `STUDY_CHROME`.

Limites: serviços externos não reconstruídos; pagamentos não exercitados;
Voomly pode bloquear automação; nenhum aparelho físico/aceite independente.
Publicação no GitHub Pages autorizada pelo proprietário em 18/10/2026.
Build estático: `npm run build:pages`; workflow: `.github/workflows/pages.yml`.
Não alterar outros estudos, projetos GOTHAM ou a instalação REA.
