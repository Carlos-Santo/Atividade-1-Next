import type { Metadata } from "next";
import { FormularioMatricula } from "./FormularioMatricula";

export const metadata: Metadata = { title: "Nova matrícula" };

export default function PaginaNovaMatricula() {
  return (
    <div className="area area-matriculas">
      <FormularioMatricula />
    </div>
  );
}
