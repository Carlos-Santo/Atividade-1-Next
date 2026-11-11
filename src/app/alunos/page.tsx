import type { Metadata } from "next";
import { ListaAlunos } from "./ListaAlunos";

export const metadata: Metadata = { title: "Alunos" };

export default function PaginaAlunos() {
  return <ListaAlunos />;
}
