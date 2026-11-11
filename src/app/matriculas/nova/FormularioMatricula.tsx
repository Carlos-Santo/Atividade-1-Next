"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Carregando } from "@/components/Carregando";
import { Mensagem } from "@/components/Mensagem";
import { useDados } from "@/context/DadosContext";
import { disciplinas } from "@/data/disciplinas";

export function FormularioMatricula() {
  const router = useRouter();
  // Os alunos vêm do contexto: quem acabou de ser cadastrado já aparece aqui.
  const { carregado, alunos, cadastrarMatricula } = useDados();
  const [ra, setRa] = useState("");
  const [idDisciplina, setIdDisciplina] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [concluido, setConcluido] = useState(false);

  if (!carregado) return <Carregando />;

  const alunosOrdenados = [...alunos].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (concluido) return; // evita cadastrar de novo com duplo clique

    if (!ra) {
      setErro("Selecione um aluno.");
      return;
    }
    if (!idDisciplina) {
      setErro("Selecione uma disciplina.");
      return;
    }

    const resultado = cadastrarMatricula({
      student_ra: Number(ra),
      course_id: Number(idDisciplina),
    });
    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    setConcluido(true);
    router.push("/matriculas");
  }

  return (
    <>
      <h1>Nova matrícula</h1>
      <form className="formulario" onSubmit={enviar} noValidate>
        <label>
          Aluno
          <select
            name="aluno"
            value={ra}
            onChange={(e) => {
              setRa(e.target.value);
              setErro(null);
            }}
            required
          >
            <option value="">Selecione um aluno</option>
            {alunosOrdenados.map((a) => (
              <option key={a.ra} value={a.ra}>
                {a.name} (RA {a.ra})
              </option>
            ))}
          </select>
        </label>
        <label>
          Disciplina
          <select
            name="disciplina"
            value={idDisciplina}
            onChange={(e) => {
              setIdDisciplina(e.target.value);
              setErro(null);
            }}
            required
          >
            <option value="">Selecione uma disciplina</option>
            {disciplinas.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id} — {d.name}
              </option>
            ))}
          </select>
        </label>

        {erro && <Mensagem tipo="erro">{erro}</Mensagem>}

        <div className="formulario-acoes">
          <button type="submit" className="botao" disabled={concluido}>
            Cadastrar matrícula
          </button>
          <Link href="/matriculas" className="botao botao-secundario">
            Voltar
          </Link>
        </div>
      </form>
    </>
  );
}
