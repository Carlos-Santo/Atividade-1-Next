import { beforeEach, describe, expect, it, vi } from "vitest";
import { alunos as alunosIniciais } from "@/data/alunos";
import { matriculas as matriculasIniciais } from "@/data/matriculas";

/** localStorage simples em memória, com opção de falhar ao gravar. */
function criarLocalStorage() {
  const itens = new Map<string, string>();
  return {
    falharAoGravar: false,
    getItem: (chave: string) => itens.get(chave) ?? null,
    setItem(chave: string, valor: string) {
      if (this.falharAoGravar) throw new Error("QuotaExceededError");
      itens.set(chave, valor);
    },
    removeItem: (chave: string) => void itens.delete(chave),
    clear: () => itens.clear(),
  };
}

let storage: ReturnType<typeof criarLocalStorage>;

// O módulo guarda os dados em memória; cada teste importa uma cópia nova
// para simular um novo acesso à aplicação.
async function abrirAplicacao() {
  vi.resetModules();
  return import("@/lib/armazenamento");
}

beforeEach(() => {
  storage = criarLocalStorage();
  vi.stubGlobal("window", {
    localStorage: storage,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
});

describe("primeiro acesso", () => {
  it("carrega os registros dos arquivos fornecidos", async () => {
    const app = await abrirAplicacao();
    const dados = app.obterDados();
    expect(dados.alunos).toEqual(alunosIniciais);
    expect(dados.matriculas).toEqual(matriculasIniciais);
  });

  it("no servidor não há dados (a tela mostra Carregando)", async () => {
    const app = await abrirAplicacao();
    expect(app.obterDadosNoServidor()).toBeNull();
  });
});

describe("cadastro de aluno", () => {
  it("cadastra e mantém após um novo acesso", async () => {
    let app = await abrirAplicacao();
    expect(app.cadastrarAluno({ ra: 258004, name: "Daniel Pereira Lima" })).toEqual({ ok: true });
    expect(app.obterDados().alunos).toHaveLength(alunosIniciais.length + 1);

    app = await abrirAplicacao();
    expect(app.obterDados().alunos.some((a) => a.ra === 258004)).toBe(true);
  });

  it("recusa RA repetido", async () => {
    const app = await abrirAplicacao();
    const resultado = app.cadastrarAluno({ ra: 258001, name: "Outra Pessoa" });
    expect(resultado.ok).toBe(false);
    expect(app.obterDados().alunos).toHaveLength(alunosIniciais.length);
  });

  it("não conclui o cadastro se não conseguir salvar", async () => {
    const app = await abrirAplicacao();
    app.obterDados();
    storage.falharAoGravar = true;

    const resultado = app.cadastrarAluno({ ra: 258005, name: "Eva Costa" });
    expect(resultado.ok).toBe(false);
    expect(app.obterDados().alunos.some((a) => a.ra === 258005)).toBe(false);
  });

  it("avisa as telas quando há um novo cadastro", async () => {
    const app = await abrirAplicacao();
    const ouvinte = vi.fn();
    const cancelar = app.assinar(ouvinte);
    app.cadastrarAluno({ ra: 258006, name: "Fábio Souza" });
    expect(ouvinte).toHaveBeenCalledTimes(1);
    cancelar();
  });
});

describe("cadastro de matrícula", () => {
  it("cadastra um vínculo novo", async () => {
    const app = await abrirAplicacao();
    expect(app.cadastrarMatricula({ student_ra: 258001, course_id: 20 })).toEqual({ ok: true });
    expect(app.obterDados().matriculas).toHaveLength(matriculasIniciais.length + 1);
  });

  it("impede o mesmo aluno na mesma disciplina", async () => {
    const app = await abrirAplicacao();
    const resultado = app.cadastrarMatricula({ student_ra: 258001, course_id: 1 });
    expect(resultado.ok).toBe(false);
    expect(app.obterDados().matriculas).toHaveLength(matriculasIniciais.length);
  });

  it("permite o mesmo aluno em outra disciplina e a mesma disciplina com outro aluno", async () => {
    const app = await abrirAplicacao();
    expect(app.cadastrarMatricula({ student_ra: 258001, course_id: 6 }).ok).toBe(true);
    expect(app.cadastrarMatricula({ student_ra: 258003, course_id: 1 }).ok).toBe(true);
  });

  it("não conclui a matrícula se não conseguir salvar", async () => {
    const app = await abrirAplicacao();
    app.obterDados();
    storage.falharAoGravar = true;
    expect(app.cadastrarMatricula({ student_ra: 258002, course_id: 30 }).ok).toBe(false);
    expect(app.obterDados().matriculas).toHaveLength(matriculasIniciais.length);
  });
});

describe("armazenamento indisponível", () => {
  it("usa os dados dos arquivos quando o salvo está corrompido", async () => {
    storage.setItem("lab-web:alunos", "isto não é json");
    const app = await abrirAplicacao();
    expect(app.obterDados().alunos).toEqual(alunosIniciais);
  });
});

describe("validação no armazenamento (mesmo sem passar pelo formulário)", () => {
  it.each([
    [{ ra: 12, name: "Ana Clara" }, /pelo menos 6/],
    [{ ra: 258009, name: "x" }, /muito curto/],
    [{ ra: 258009, name: "Ana " + "a".repeat(300) }, /muito longo/],
    [{ ra: 258009, name: "Ana 123" }, /apenas letras/],
    [{ ra: Number.NaN, name: "Ana Clara" }, /RA/],
  ])("recusa aluno inválido %#", async (aluno, mensagem) => {
    const app = await abrirAplicacao();
    const resultado = app.cadastrarAluno(aluno);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.erro).toMatch(mensagem);
    expect(app.obterDados().alunos).toHaveLength(alunosIniciais.length);
  });

  it("recusa matrícula de aluno que não existe", async () => {
    const app = await abrirAplicacao();
    const resultado = app.cadastrarMatricula({ student_ra: 999999, course_id: 1 });
    expect(resultado).toEqual({ ok: false, erro: "O aluno selecionado não está cadastrado." });
  });

  it("recusa matrícula em disciplina que não existe", async () => {
    const app = await abrirAplicacao();
    const resultado = app.cadastrarMatricula({ student_ra: 258001, course_id: 40 });
    expect(resultado).toEqual({ ok: false, erro: "A disciplina selecionada não existe no catálogo." });
  });

  it("recusa ids que não são números inteiros", async () => {
    const app = await abrirAplicacao();
    expect(app.cadastrarMatricula({ student_ra: Number("abc"), course_id: 1 }).ok).toBe(false);
    expect(app.cadastrarMatricula({ student_ra: 258001, course_id: 1.5 }).ok).toBe(false);
  });
});

describe("dados adulterados no navegador", () => {
  it("descarta registros com formato errado e repetidos sem quebrar", async () => {
    storage.setItem(
      "lab-web:alunos",
      JSON.stringify([
        { ra: 258001, name: "Ana Clara Silva" },
        { x: 1 },
        null,
        { ra: "258002", name: "RA em texto" },
        { ra: 258001, name: "RA repetido" },
      ]),
    );
    storage.setItem(
      "lab-web:matriculas",
      JSON.stringify([{ student_ra: 258001, course_id: 1 }, { student_ra: 258001, course_id: 1 }, 42]),
    );
    const app = await abrirAplicacao();
    expect(app.obterDados().alunos).toEqual([{ ra: 258001, name: "Ana Clara Silva" }]);
    expect(app.obterDados().matriculas).toEqual([{ student_ra: 258001, course_id: 1 }]);
  });

  it("usa os dados dos arquivos quando o salvo não é uma lista", async () => {
    storage.setItem("lab-web:alunos", JSON.stringify({ ra: 1 }));
    const app = await abrirAplicacao();
    expect(app.obterDados().alunos).toEqual(alunosIniciais);
  });
});

describe("duas abas abertas", () => {
  it("não deixa repetir um RA cadastrado em outra aba", async () => {
    const aba1 = await abrirAplicacao();
    aba1.obterDados();

    // Outra aba grava direto no navegador.
    const salvos = JSON.parse(storage.getItem("lab-web:alunos")!);
    storage.setItem("lab-web:alunos", JSON.stringify([...salvos, { ra: 258010, name: "Gil Ramos" }]));

    const resultado = aba1.cadastrarAluno({ ra: 258010, name: "Outra Pessoa" });
    expect(resultado.ok).toBe(false);
  });
});

describe("uma lista corrompida não apaga a outra", () => {
  it("mantém os alunos salvos quando só as matrículas estão corrompidas", async () => {
    let app = await abrirAplicacao();
    app.cadastrarAluno({ ra: 258030, name: "Helena Prado" });
    storage.setItem("lab-web:matriculas", "{isto não é json");

    app = await abrirAplicacao();
    expect(app.obterDados().alunos.some((a) => a.ra === 258030)).toBe(true);
    expect(app.obterDados().matriculas).toEqual(matriculasIniciais);
  });
});
