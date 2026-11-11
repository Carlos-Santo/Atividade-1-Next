"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itens = [
  { href: "/alunos", rotulo: "Lista de alunos" },
  { href: "/alunos/novo", rotulo: "Cadastrar aluno" },
];

export function MenuAlunos() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu de alunos" className="menu-lateral">
      {itens.map((item) => {
        const ativo = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
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

export function MenuAlunosSemDestaque() {
  return (
    <nav aria-label="Menu de alunos" className="menu-lateral">
      {itens.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.rotulo}
        </Link>
      ))}
    </nav>
  );
}
