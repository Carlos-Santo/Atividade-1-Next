import Link from "next/link";

const areas = [
  {
    href: "/alunos",
    area: "alunos",
    titulo: "Alunos",
    texto: "Consulte os alunos pelo RA, veja os detalhes de cada um e cadastre novos alunos.",
  },
  {
    href: "/disciplinas",
    area: "disciplinas",
    titulo: "Disciplinas",
    texto: "Veja o catálogo com todas as disciplinas do curso.",
  },
  {
    href: "/matriculas",
    area: "matriculas",
    titulo: "Matrículas",
    texto: "Consulte quem está matriculado em cada disciplina e registre novas matrículas.",
  },
];

export default function Inicio() {
  return (
    <>
      <section className="apresentacao">
        <h1>Secretaria Acadêmica</h1>
        <p>
          Este sistema reúne as informações acadêmicas do curso: permite consultar e cadastrar
          alunos e matrículas e consultar o catálogo de disciplinas. Os cadastros ficam salvos no
          seu navegador.
        </p>
      </section>

      <div className="atalhos">
        {areas.map((a) => (
          <Link key={a.href} href={a.href} className="atalho" data-area={a.area}>
            <h2>{a.titulo}</h2>
            <p>{a.texto}</p>
            <span className="atalho-seta">Acessar →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
