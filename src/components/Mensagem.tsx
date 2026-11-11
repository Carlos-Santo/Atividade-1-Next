import type { ReactNode } from "react";

export function Mensagem({ tipo, children }: { tipo: "erro" | "info"; children: ReactNode }) {
  return (
    <p className={`mensagem mensagem-${tipo}`} role={tipo === "erro" ? "alert" : "status"}>
      {children}
    </p>
  );
}
