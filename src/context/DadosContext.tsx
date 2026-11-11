"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import type { Aluno } from "@/data/alunos";
import type { Matricula } from "@/data/matriculas";
import {
  assinar,
  cadastrarAluno,
  cadastrarMatricula,
  obterDados,
  obterDadosNoServidor,
  type ResultadoCadastro,
} from "@/lib/armazenamento";

type ValorContexto = {
  /** false enquanto os dados do navegador ainda não foram lidos. */
  carregado: boolean;
  alunos: Aluno[];
  matriculas: Matricula[];
  cadastrarAluno: (aluno: Aluno) => ResultadoCadastro;
  cadastrarMatricula: (matricula: Matricula) => ResultadoCadastro;
};

const DadosContext = createContext<ValorContexto | null>(null);

/** Compartilha alunos e matrículas entre todas as páginas. */
export function DadosProvider({ children }: { children: ReactNode }) {
  const dados = useSyncExternalStore(assinar, obterDados, obterDadosNoServidor);

  const valor: ValorContexto = {
    carregado: dados !== null,
    alunos: dados?.alunos ?? [],
    matriculas: dados?.matriculas ?? [],
    cadastrarAluno,
    cadastrarMatricula,
  };

  return <DadosContext.Provider value={valor}>{children}</DadosContext.Provider>;
}

export function useDados(): ValorContexto {
  const contexto = useContext(DadosContext);
  if (!contexto) throw new Error("useDados deve ser usado dentro de <DadosProvider>.");
  return contexto;
}
