# Secretaria Acadêmica — Atividade 1

Laboratório de Desenvolvimento Web — Prof. Arley — Fatec

## Integrantes

- Carlos Santo

## Sobre

Aplicação web em Next.js (App Router + TypeScript) para consultar e cadastrar alunos e
matrículas e consultar o catálogo de disciplinas do curso.

| Rota | O que faz |
| --- | --- |
| `/` | Objetivo do sistema e links para as três áreas |
| `/alunos` | Lista de alunos (nome e RA) com o total de registros |
| `/alunos/[ra]` | Detalhes do aluno pelo RA, com as disciplinas em que está matriculado |
| `/alunos/novo` | Cadastro de aluno (RA e nome completo) |
| `/disciplinas` | Catálogo das 39 disciplinas em cartões (somente consulta) |
| `/matriculas` | Tabela de matrículas (RA, aluno e disciplina) com o total |
| `/matriculas/nova` | Cadastro de matrícula (seleção de aluno e de disciplina) |
| qualquer outra | Página de endereço não encontrado com link para o início |

### Identidade de cada área

- **Alunos:** azul, com layout próprio (menu lateral + lista).
- **Disciplinas:** verde, em cartões.
- **Matrículas:** laranja, em tabela.

O menu principal aparece em todas as páginas e destaca a área atual, inclusive nas
telas de cadastro e de detalhes.

### Dados e persistência

- Os arquivos fornecidos estão em `src/data/` sem alteração.
- Alunos e matrículas são compartilhados entre as páginas por um contexto React
  (`src/context/DadosContext.tsx`). As disciplinas são uma coleção fixa.
- No primeiro acesso, os registros de `src/data/` são carregados e salvos no
  `localStorage` do navegador. Nos acessos seguintes, vale o que está salvo no navegador.
- Um cadastro só aparece como concluído depois de salvo. Se o navegador não conseguir
  salvar (armazenamento cheio ou bloqueado), a aplicação mostra o erro e o cadastro não
  entra na lista.
- Regras dos cadastros (cada violação mostra uma mensagem no formulário e nada é salvo):
  - RA: só números, de 6 a 13 dígitos, sem zero à esquerda e sem repetir.
  - Nome: de 5 a 100 caracteres, só letras (com acentos), espaços, hífen ou apóstrofo,
    com nome e sobrenome.
  - Matrícula: aluno e disciplina precisam existir, e o mesmo par aluno + disciplina
    não pode se repetir.
- Se os dados salvos no navegador forem alterados à mão e ficarem inválidos, os
  registros com problema são descartados e a aplicação continua funcionando.
- Não há banco de dados, API nem autenticação. Para voltar aos dados iniciais, limpe os
  dados do site no navegador.

## Como executar

Requer Node.js 20 ou mais recente.

```bash
npm install
npm run dev
```

Depois abra <http://localhost:3000>.

### Verificações

```bash
npm test        # testes automáticos (Vitest): dados fornecidos, cadastros e persistência
npm run lint    # ESLint
npm run build   # build de produção
```

## Estrutura

```
src/
├── app/
│   ├── layout.tsx            # layout raiz: cabeçalho, menu e rodapé
│   ├── page.tsx              # página inicial
│   ├── not-found.tsx         # endereço não encontrado
│   ├── globals.css
│   ├── alunos/
│   │   ├── layout.tsx        # layout da área de alunos (menu lateral)
│   │   ├── page.tsx          # lista
│   │   ├── [ra]/page.tsx     # detalhes
│   │   └── novo/page.tsx     # cadastro
│   ├── disciplinas/page.tsx
│   └── matriculas/
│       ├── page.tsx          # tabela
│       └── nova/page.tsx     # cadastro
├── components/               # cabeçalho, menus, rodapé, mensagens
├── context/DadosContext.tsx  # estado compartilhado (alunos e matrículas)
├── lib/armazenamento.ts      # leitura e gravação no localStorage
└── data/                     # arquivos fornecidos (alunos, disciplinas, matrículas)
```
