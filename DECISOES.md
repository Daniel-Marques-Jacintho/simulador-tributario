# Simulador e Validador Tributário Rands · 0.2.0

A interface local não é um motor fiscal nem autentica usuários corporativos. A identidade declarada de um operador fictício não representa identidade Entra. Não inserir documentos ou cadastros de clientes. O controle de acesso e a auditoria imutável exigem serviço autorizado no ambiente Rands. Não há credenciais nem chamadas a APIs corporativas.

## Separação de regras
- `catalog.json`: referência legal local RTC-2026.1 com fontes e vigência. Os Anexos I a V param na quinta faixa. Não corresponde a uma versão da Receita.
- `engine.ts`: composições e cronogramas comerciais. `official` devolve indisponibilidade e resultados fiscais nulos. Ausência de apuração não equivale a imposto zero. Não inferir dedução de comissão ou crédito a partir da Selic/DI.
- `records.ts`: cada estudo possui linhagem e versões sucessivas contendo entradas, memória, versões, autor declarado e data. A UI não sobrescreve versões concluídas. O armazenamento local não é à prova de alteração.
- `operation.tsx`, `review.tsx`, `platform.tsx`: formulários por domínio, histórico, casos de teste e conciliações manuais. Valores digitados não recebem selo oficial. CSV neutraliza prefixos de fórmula; o JSON conserva valores em centavos.
- A calculadora ordinária de 2026 é independente. Seus parâmetros não são aplicados aos domínios especiais.

## Portões de produção
1. Fixar e verificar a distribuição oficial e seu hash conforme a Portaria Cotec 342/2026. Validar versões de código e tabelas e testar entradas conhecidas antes de rotular resultados oficiais.
2. Verificar suporte por operação, regime e data-base; homologar memória tributária e contábil com Fiscal/Tributário. Registrar indisponibilidade sem substituição silenciosa.
3. Integrar origens autorizadas por adaptadores; não armazenar payloads pessoais nos logs. Implantar autenticação, autorização no servidor, segregação de funções, retenção e trilha inviolável antes de receber dados reais.
4. Homologar amortização e arredondamento contratuais, Price invertida, feriados, calendário e eventos. Cenário comercial não representa CET regulamentar.
