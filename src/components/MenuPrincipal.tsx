"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itens = [
  { href: "/", rotulo: "Início", area: "inicio" },
  { href: "/alunos", rotulo: "Alunos", area: "alunos" },
  { href: "/disciplinas", rotulo: "Disciplinas", area: "disciplinas" },
  { href: "/matriculas", rotulo: "Matrículas", area: "matriculas" },
] as const;

/** A área fica ativa também nas subpáginas (cadastro e detalhes). */
function estaAtivo(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MenuPrincipal() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu principal" className="menu-principal">
      {itens.map((item) => {
        const ativo = estaAtivo(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            data-area={item.area}
            className={ativo ? "ativo" : undefined}
            aria-current={ativo ? "page" : undefined}
          >
            {item.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mostrado durante o pré-render, enquanto a rota atual ainda não é conhecida. */
export function MenuPrincipalSemDestaque() {
  return (
    <nav aria-label="Menu principal" className="menu-principal">
      {itens.map((item) => (
        <Link key={item.href} href={item.href} data-area={item.area}>
          {item.rotulo}
        </Link>
      ))}
    </nav>
  );
}
