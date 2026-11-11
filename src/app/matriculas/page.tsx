import type { Metadata } from "next";
import { TabelaMatriculas } from "./TabelaMatriculas";

export const metadata: Metadata = { title: "Matrículas" };

export default function PaginaMatriculas() {
  return (
    <div className="area area-matriculas">
      <TabelaMatriculas />
    </div>
  );
}
