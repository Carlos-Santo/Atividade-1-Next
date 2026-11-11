import { describe, expect, it } from "vitest";
import { alunos } from "@/data/alunos";
import { disciplinas } from "@/data/disciplinas";
import { matriculas } from "@/data/matriculas";

describe("dados fornecidos", () => {
  it("tem as 39 disciplinas com ids únicos", () => {
    expect(disciplinas).toHaveLength(39);
    expect(new Set(disciplinas.map((d) => d.id)).size).toBe(39);
  });

  it("tem alunos com RA único", () => {
    expect(alunos.length).toBeGreaterThan(0);
    expect(new Set(alunos.map((a) => a.ra)).size).toBe(alunos.length);
  });

  it("toda matrícula aponta para um aluno e uma disciplina existentes", () => {
    for (const m of matriculas) {
      expect(alunos.some((a) => a.ra === m.student_ra)).toBe(true);
      expect(disciplinas.some((d) => d.id === m.course_id)).toBe(true);
    }
  });

  it("não tem matrícula duplicada", () => {
    const pares = matriculas.map((m) => `${m.student_ra}-${m.course_id}`);
    expect(new Set(pares).size).toBe(pares.length);
  });
});
