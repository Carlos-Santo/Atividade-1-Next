import { describe, expect, it } from "vitest";
import {
  ehAluno,
  ehMatricula,
  validarFormularioAluno,
  validarNome,
  validarRa,
} from "@/lib/validacao";

function erroDe(resultado: { ok: boolean; erro?: string }) {
  expect(resultado.ok).toBe(false);
  return resultado.erro;
}

describe("RA", () => {
  it.each([
    ["", /Informe o RA/],
    ["   ", /Informe o RA/],
    ["abc123", /apenas números/],
    ["258 001", /apenas números/],
    ["-258001", /apenas números/],
    ["258001.5", /apenas números/],
    ["12345", /pelo menos 6/],
    ["12345678901234", /no máximo 13/],
    ["9".repeat(500), /no máximo 13/],
    ["012345", /começar com zero/],
  ])("recusa %j", (texto, mensagem) => {
    expect(erroDe(validarRa(texto))).toMatch(mensagem);
  });

  it.each([
    ["258004", 258004],
    ["  258004  ", 258004],
    ["2581392513004", 2581392513004], // RA de 13 dígitos (formato da Fatec)
  ])("aceita %j", (texto, esperado) => {
    expect(validarRa(texto)).toEqual({ ok: true, valor: esperado });
  });
});

describe("Nome", () => {
  it.each([
    ["", /Informe o nome/],
    ["    ", /Informe o nome/],
    ["Ana", /muito curto/],
    ["A B", /muito curto/],
    ["Ana " + "a".repeat(200), /muito longo/],
    ["Ana Silva 2", /apenas letras/],
    ["Ana @Silva", /apenas letras/],
    ["<script>alert(1)</script> Silva", /apenas letras/],
    ["Ana -Silva", /apenas letras/],
    ["Daniela", /nome e sobrenome/],
  ])("recusa %j", (texto, mensagem) => {
    expect(erroDe(validarNome(texto))).toMatch(mensagem);
  });

  it.each([
    ["Daniel Pereira Lima", "Daniel Pereira Lima"],
    ["  Daniel    Pereira   Lima  ", "Daniel Pereira Lima"],
    ["João D'Ávila", "João D'Ávila"],
    ["Ana-Maria Conceição", "Ana-Maria Conceição"],
  ])("aceita %j", (texto, esperado) => {
    expect(validarNome(texto)).toEqual({ ok: true, valor: esperado });
  });

  it("aceita exatamente o limite de 100 caracteres", () => {
    const nome = "Ana " + "a".repeat(96);
    expect(nome).toHaveLength(100);
    expect(validarNome(nome).ok).toBe(true);
  });
});

describe("formulário de aluno", () => {
  it("valida o RA antes do nome", () => {
    expect(erroDe(validarFormularioAluno("abc", ""))).toMatch(/RA/);
  });

  it("devolve o registro pronto", () => {
    expect(validarFormularioAluno(" 258004 ", " Daniel  Lima ")).toEqual({
      ok: true,
      valor: { ra: 258004, name: "Daniel Lima" },
    });
  });
});

describe("formato dos registros salvos", () => {
  it.each([null, 1, "texto", [], {}, { ra: "258001", name: "Ana" }, { ra: 1.5, name: "Ana" }, { ra: 1, name: "" }])(
    "aluno inválido: %j",
    (valor) => expect(ehAluno(valor)).toBe(false),
  );

  it.each([null, {}, { student_ra: 1 }, { student_ra: "1", course_id: 1 }, { student_ra: -1, course_id: 1 }])(
    "matrícula inválida: %j",
    (valor) => expect(ehMatricula(valor)).toBe(false),
  );

  it("aceita registros corretos", () => {
    expect(ehAluno({ ra: 258001, name: "Ana Clara Silva" })).toBe(true);
    expect(ehMatricula({ student_ra: 258001, course_id: 1 })).toBe(true);
  });
});
