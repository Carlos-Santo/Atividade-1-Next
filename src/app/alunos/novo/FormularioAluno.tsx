"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Mensagem } from "@/components/Mensagem";
import { useDados } from "@/context/DadosContext";
import { validarFormularioAluno } from "@/lib/validacao";

export function FormularioAluno() {
  const router = useRouter();
  const { cadastrarAluno } = useDados();
  const [ra, setRa] = useState("");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [concluido, setConcluido] = useState(false);

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (concluido) return; // evita cadastrar de novo com duplo clique

    const validacao = validarFormularioAluno(ra, nome);
    if (!validacao.ok) {
      setErro(validacao.erro);
      return;
    }

    const resultado = cadastrarAluno(validacao.valor);
    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    setConcluido(true);
    router.push("/alunos");
  }

  return (
    <>
      <h1>Cadastrar aluno</h1>
      <form className="formulario" onSubmit={enviar} noValidate>
        <label>
          RA
          <input
            name="ra"
            inputMode="numeric"
            autoComplete="off"
            value={ra}
            onChange={(e) => setRa(e.target.value)}
            placeholder="Ex.: 258004"
            required
          />
        </label>
        <label>
          Nome completo
          <input
            name="nome"
            autoComplete="name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Daniel Pereira Lima"
            required
          />
        </label>

        {erro && <Mensagem tipo="erro">{erro}</Mensagem>}

        <div className="formulario-acoes">
          <button type="submit" className="botao" disabled={concluido}>
            Cadastrar
          </button>
          <Link href="/alunos" className="botao botao-secundario">
            Voltar
          </Link>
        </div>
      </form>
    </>
  );
}
