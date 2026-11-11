import type { Metadata } from "next";
import { FormularioAluno } from "./FormularioAluno";

export const metadata: Metadata = { title: "Cadastrar aluno" };

export default function PaginaNovoAluno() {
  return <FormularioAluno />;
}
