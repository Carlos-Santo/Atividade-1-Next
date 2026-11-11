import type { Metadata } from "next";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import { DadosProvider } from "@/context/DadosContext";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Secretaria Acadêmica", template: "%s · Secretaria Acadêmica" },
  description: "Consulta e cadastro de alunos e matrículas e catálogo de disciplinas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>
        <DadosProvider>
          <Cabecalho />
          <main className="conteudo-largo principal">{children}</main>
          <Rodape />
        </DadosProvider>
      </body>
    </html>
  );
}
