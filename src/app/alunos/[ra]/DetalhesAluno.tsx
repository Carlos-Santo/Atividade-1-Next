"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Carregando } from "@/components/Carregando";
import { Mensagem } from "@/components/Mensagem";
import { useDados } from "@/context/DadosContext";
import { disciplinas } from "@/data/disciplinas";

export function DetalhesAluno() {
  // RA obtido da rota dinâmica /alunos/[ra].
  const { ra: raDaRota } = useParams<{ ra: string }>();
  const { carregado, alunos, matriculas } = useDados();

  if (!carregado) return <Carregando />;

  const aluno = /^\d+$/.test(raDaRota)
    ? alunos.find((a) => a.ra === Number(raDaRota))
    : undefined;

  if (!aluno) {
    return (
      <>
        <h1>Aluno não encontrado</h1>
        <Mensagem tipo="erro">Não existe aluno cadastrado com o RA “{raDaRota}”.</Mensagem>
        <Link href="/alunos" className="botao botao-secundario">
          ← Voltar à lista de alunos
        </Link>
      </>
    );
  }

  const disciplinasDoAluno = matriculas
    .filter((m) => m.student_ra === aluno.ra)
    .map((m) => disciplinas.find((d) => d.id === m.course_id))
    .filter((d) => d !== undefined);

  return (
    <>
      <h1>{aluno.name}</h1>
      <dl className="ficha">
        <dt>RA</dt>
        <dd>{aluno.ra}</dd>
        <dt>Nome completo</dt>
        <dd>{aluno.name}</dd>
        <dt>Matrículas</dt>
        <dd>
          {disciplinasDoAluno.length === 0
            ? "Nenhuma disciplina"
            : `${disciplinasDoAluno.length} ${disciplinasDoAluno.length === 1 ? "disciplina" : "disciplinas"}`}
        </dd>
      </dl>

      {disciplinasDoAluno.length > 0 && (
        <>
          <h2>Disciplinas matriculadas</h2>
          <ul className="lista lista-simples">
            {disciplinasDoAluno.map((d) => (
              <li key={d.id}>
                <span className="lista-nome">{d.name}</span>
                <span className="lista-detalhe">ID {d.id}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <Link href="/alunos" className="botao botao-secundario">
        ← Voltar à lista de alunos
      </Link>
    </>
  );
}
