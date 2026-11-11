"use client";

import Link from "next/link";
import { CabecalhoArea } from "@/components/CabecalhoArea";
import { Carregando } from "@/components/Carregando";
import { Mensagem } from "@/components/Mensagem";
import { useDados } from "@/context/DadosContext";
import { disciplinas } from "@/data/disciplinas";

export function TabelaMatriculas() {
  const { carregado, alunos, matriculas } = useDados();

  if (!carregado) return <Carregando />;

  // Os nomes vêm das coleções, buscados pelos identificadores de cada matrícula.
  const nomeDoAluno = new Map(alunos.map((a) => [a.ra, a.name]));
  const nomeDaDisciplina = new Map(disciplinas.map((d) => [d.id, d.name]));

  return (
    <>
      <CabecalhoArea
        titulo="Matrículas"
        total={`${matriculas.length} ${matriculas.length === 1 ? "matrícula" : "matrículas"} no total`}
        acoes={
          <Link href="/matriculas/nova" className="botao">
            Nova matrícula
          </Link>
        }
      />

      {matriculas.length === 0 ? (
        <Mensagem tipo="info">Nenhuma matrícula cadastrada.</Mensagem>
      ) : (
        <div className="tabela-rolagem">
          <table className="tabela">
            <thead>
              <tr>
                <th scope="col">RA</th>
                <th scope="col">Aluno</th>
                <th scope="col">Disciplina</th>
              </tr>
            </thead>
            <tbody>
              {matriculas.map((m) => (
                <tr key={`${m.student_ra}-${m.course_id}`}>
                  <td>{m.student_ra}</td>
                  <td>{nomeDoAluno.get(m.student_ra) ?? "Aluno não encontrado"}</td>
                  <td>{nomeDaDisciplina.get(m.course_id) ?? "Disciplina não encontrada"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
