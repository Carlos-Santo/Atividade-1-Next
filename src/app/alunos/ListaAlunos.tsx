"use client";

import Link from "next/link";
import { CabecalhoArea } from "@/components/CabecalhoArea";
import { Carregando } from "@/components/Carregando";
import { Mensagem } from "@/components/Mensagem";
import { useDados } from "@/context/DadosContext";

export function ListaAlunos() {
  const { carregado, alunos } = useDados();

  if (!carregado) return <Carregando />;

  const ordenados = [...alunos].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return (
    <>
      <CabecalhoArea
        titulo="Alunos cadastrados"
        total={`${alunos.length} ${alunos.length === 1 ? "aluno" : "alunos"} no total`}
        acoes={
          <Link href="/alunos/novo" className="botao">
            Cadastrar aluno
          </Link>
        }
      />

      {ordenados.length === 0 ? (
        <Mensagem tipo="info">Nenhum aluno cadastrado.</Mensagem>
      ) : (
        <ul className="lista">
          {ordenados.map((aluno) => (
            <li key={aluno.ra}>
              <Link href={`/alunos/${aluno.ra}`}>
                <span className="lista-nome">{aluno.name}</span>
                <span className="lista-detalhe">RA {aluno.ra}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
