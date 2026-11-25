# Simulador e Validador Tributário Rands — código-fonte do rascunho

Entrega de 25/11/2026 para versionamento manual. Os arquivos de `src/` são cópias da lógica e da interface do aplicativo existente; não são uma reimplementação nem um projeto Databricks já implantável. Nenhum contrato, histórico de navegador, credencial ou conexão de ERP é necessário para esta entrega.

## Onde começar

| Área | Arquivos |
| --- | --- |
| Entrada e estilo | `src/routes.tsx`, `src/components/app-shell.tsx`, `src/index.css` |
| Navegação e início | `src/rands/platform.tsx`, `src/rands/overview.tsx` |
| Banco e Consórcio | `src/rands/operation.tsx`, `src/rands/fields.tsx`, `src/rands/engine.ts` |
| Calculadora ordinária e referências | `src/rands/calc2026.tsx`, `src/lib/tributos.ts`, `src/rands/catalog.json`, `src/pages/leia-me.tsx` |
| Memórias, comparação, validação e exportação | `src/rands/review.tsx` |
| Registros, versões e exclusão local | `src/rands/records.ts` |
| Área administrativa de demonstração | `src/rands/admin-area.tsx` |
| Testes e limitações | `src/rands/testes.test.mjs`, `src/rands/exclusao.test.mjs`, `src/rands/DECISOES.md` |

## Como levar ao Git

Extraia este arquivo, mantenha a estrutura de `src/` e envie o conteúdo a um repositório **privado** aprovado pela Rands. O pacote não inclui histórico Git, destino remoto ou credenciais. Não copie dados reais para o repositório.

## O que falta para executar fora do ambiente original

O pacote contém os fontes funcionais desenvolvidos, não a infraestrutura do ambiente gerenciado. Não contém um instalador, manifesto de dependências, ponto de inicialização autônomo, serviço de backend ou descritor de implantação. A equipe responsável pelo projeto de destino deve:

1. Integrar os fontes a um projeto React/TypeScript, configurar `@/` para `src/`, processar JSX/JSON e o CSS de Tailwind e montar o roteador, o contêiner da aplicação e o provedor de confirmação. Usar a fonte Co Headline somente com a licença apropriada; há fallback para Calibri e sans-serif.
2. Resolver as dependências chamadas nos fontes: React, React Router, Lucide React, Zod, XLSX, Tailwind CSS, tw-animate-css e o pacote local da fonte Geist. As importações `@/components/ui/{button,input,native-select,table,tabs,sonner}`, `@/components/live-status`, `@/hooks/use-confirm` e `@/components/pdf-export-button` referem-se a componentes fornecidos pelo ambiente original, não incluídos. Devem receber equivalentes no destino, incluindo confirmação de exclusão, mensagens acessíveis e exportação PDF.
3. Depois de preparar as dependências e o alias, executar `bun test src/rands/testes.test.mjs src/rands/exclusao.test.mjs`. Na origem passaram 21 testes (845 verificações). Isso não é comprovação de execução no Databricks nem homologação tributária.
4. Configurar a inicialização do serviço para Databricks Apps e validar a interface completa com dados fictícios antes de conectar qualquer ERP. Testar telas estreitas, seletores, entrada e saída do perfil Admin, histórico, exclusão, memória e exportações.

## Antes de usar contratos reais

- O perfil Admin atual demonstra navegação; **não autentica nem autoriza**. Implementar identidade corporativa e autorização no servidor e na fonte de dados.
- A persistência atual usa o navegador. Não guardar contratos reais nesse mecanismo. Consultar apenas os campos necessários em fontes autorizadas de leitura; separar os resultados de simulação dos contratos de origem e registrar acesso e alterações no servidor.
- Banco e Consórcio geram **estimativas comerciais**. Não há motor oficial da Receita instalado no app nem homologação das regras especiais. Resultados fiscais indisponíveis devem continuar pendentes e nunca virar zero.
