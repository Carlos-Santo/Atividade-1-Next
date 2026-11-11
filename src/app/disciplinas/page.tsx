import type { Metadata } from "next";
import { CabecalhoArea } from "@/components/CabecalhoArea";
import { disciplinas } from "@/data/disciplinas";

export const metadata: Metadata = { title: "Disciplinas" };

/** Catálogo fixo: apenas consulta, sem cadastro, edição ou exclusão. */
export default function PaginaDisciplinas() {
  return (
    <div className="area area-disciplinas">
      <CabecalhoArea
        titulo="Catálogo de disciplinas"
        total={`${disciplinas.length} disciplinas no total`}
      />

      <ul className="cartoes">
        {disciplinas.map((disciplina) => (
          <li key={disciplina.id} className="cartao">
            <span className="cartao-id">ID {disciplina.id}</span>
            <span className="cartao-nome">{disciplina.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
