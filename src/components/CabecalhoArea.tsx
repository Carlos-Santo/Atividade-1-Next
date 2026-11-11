import type { ReactNode } from "react";

/** Título da página com o total de registros e ações opcionais à direita. */
export function CabecalhoArea({
  titulo,
  total,
  acoes,
}: {
  titulo: string;
  total?: string;
  acoes?: ReactNode;
}) {
  return (
    <div className="cabecalho-area">
      <div>
        <h1>{titulo}</h1>
        {total && <p className="total">{total}</p>}
      </div>
      {acoes && <div className="acoes">{acoes}</div>}
    </div>
  );
}
