import type { Aluno } from "@/data/alunos";
import type { Matricula } from "@/data/matriculas";

/**
 * Regras de validação usadas pelos formulários e pelo armazenamento.
 * Cada função devolve o valor já limpo ou uma mensagem de erro para o usuário.
 */

export const RA_MIN_DIGITOS = 6;
export const RA_MAX_DIGITOS = 13;
export const NOME_MIN_CARACTERES = 5;
export const NOME_MAX_CARACTERES = 100;

export type Validacao<T> = { ok: true; valor: T } | { ok: false; erro: string };

// Palavras só com letras (inclui acentos); hífen e apóstrofo entre letras
// são aceitos (ex.: "Ana-Maria", "D'Ávila").
const PALAVRA = /^\p{L}+(?:['’-]\p{L}+)*$/u;

export function validarRa(texto: string): Validacao<number> {
  const ra = texto.trim();

  if (ra === "") return { ok: false, erro: "Informe o RA." };
  if (!/^\d+$/.test(ra)) return { ok: false, erro: "O RA deve conter apenas números." };
  if (ra.length < RA_MIN_DIGITOS) {
    return { ok: false, erro: `O RA deve ter pelo menos ${RA_MIN_DIGITOS} dígitos.` };
  }
  if (ra.length > RA_MAX_DIGITOS) {
    return { ok: false, erro: `O RA deve ter no máximo ${RA_MAX_DIGITOS} dígitos.` };
  }
  if (ra.startsWith("0")) return { ok: false, erro: "O RA não pode começar com zero." };

  return { ok: true, valor: Number(ra) };
}

export function validarNome(texto: string): Validacao<string> {
  const nome = texto.normalize("NFC").trim().replace(/\s+/g, " ");

  if (nome === "") return { ok: false, erro: "Informe o nome completo." };
  if (nome.length < NOME_MIN_CARACTERES) {
    return {
      ok: false,
      erro: `O nome está muito curto (mínimo de ${NOME_MIN_CARACTERES} caracteres).`,
    };
  }
  if (nome.length > NOME_MAX_CARACTERES) {
    return {
      ok: false,
      erro: `O nome está muito longo (máximo de ${NOME_MAX_CARACTERES} caracteres).`,
    };
  }

  const palavras = nome.split(" ");
  if (!palavras.every((p) => PALAVRA.test(p))) {
    return {
      ok: false,
      erro: "O nome deve conter apenas letras, espaços, hífen ou apóstrofo.",
    };
  }
  if (palavras.length < 2) return { ok: false, erro: "Informe nome e sobrenome." };

  return { ok: true, valor: nome };
}

/** Valida um aluno vindo do formulário (texto) e devolve o registro pronto. */
export function validarFormularioAluno(raTexto: string, nomeTexto: string): Validacao<Aluno> {
  const ra = validarRa(raTexto);
  if (!ra.ok) return ra;
  const nome = validarNome(nomeTexto);
  if (!nome.ok) return nome;
  return { ok: true, valor: { ra: ra.valor, name: nome.valor } };
}

/** Confere se um valor qualquer (ex.: lido do navegador) tem o formato de Aluno. */
export function ehAluno(valor: unknown): valor is Aluno {
  if (typeof valor !== "object" || valor === null) return false;
  const { ra, name } = valor as Record<string, unknown>;
  return Number.isSafeInteger(ra) && (ra as number) > 0 && typeof name === "string" && name.trim() !== "";
}

/** Confere se um valor qualquer tem o formato de Matricula. */
export function ehMatricula(valor: unknown): valor is Matricula {
  if (typeof valor !== "object" || valor === null) return false;
  const { student_ra, course_id } = valor as Record<string, unknown>;
  return (
    Number.isSafeInteger(student_ra) &&
    (student_ra as number) > 0 &&
    Number.isSafeInteger(course_id) &&
    (course_id as number) > 0
  );
}
