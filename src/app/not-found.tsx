import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <section className="nao-encontrado">
      <p className="codigo">404</p>
      <h1>Endereço não encontrado</h1>
      <p>A página que você tentou acessar não existe ou foi movida.</p>
      <Link href="/" className="botao">
        Voltar ao início
      </Link>
    </section>
  );
}
