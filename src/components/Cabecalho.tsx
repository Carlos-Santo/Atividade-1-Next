import Link from "next/link";
import { Suspense } from "react";
import { MenuPrincipal, MenuPrincipalSemDestaque } from "./MenuPrincipal";

export function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="conteudo-largo cabecalho-interno">
        <Link href="/" className="marca">
          Secretaria Acadêmica
        </Link>
        <Suspense fallback={<MenuPrincipalSemDestaque />}>
          <MenuPrincipal />
        </Suspense>
      </div>
    </header>
  );
}
