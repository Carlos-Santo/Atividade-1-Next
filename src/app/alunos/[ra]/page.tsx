import type { Metadata } from "next";
import { Suspense } from "react";
import { Carregando } from "@/components/Carregando";
import { DetalhesAluno } from "./DetalhesAluno";

export const metadata: Metadata = { title: "Detalhes do aluno" };

export default function PaginaDetalhesAluno() {
  // O RA só é conhecido na hora da requisição; o Suspense deixa o restante do
  // layout ser pré-renderizado enquanto isso.
  return (
    <Suspense fallback={<Carregando />}>
      <DetalhesAluno />
    </Suspense>
  );
}
