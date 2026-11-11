import { Suspense } from "react";
import { MenuAlunos, MenuAlunosSemDestaque } from "@/components/MenuAlunos";

/** Layout próprio da área de alunos: menu lateral + conteúdo. */
export default function LayoutAlunos({ children }: LayoutProps<"/alunos">) {
  return (
    <div className="area area-alunos layout-alunos">
      <aside>
        <p className="area-titulo">Alunos</p>
        <Suspense fallback={<MenuAlunosSemDestaque />}>
          <MenuAlunos />
        </Suspense>
      </aside>
      <section className="layout-alunos-conteudo">{children}</section>
    </div>
  );
}
