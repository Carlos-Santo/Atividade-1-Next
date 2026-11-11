import { alunos as alunosIniciais, type Aluno } from "@/data/alunos";
import { disciplinas } from "@/data/disciplinas";
import { matriculas as matriculasIniciais, type Matricula } from "@/data/matriculas";
import { ehAluno, ehMatricula, validarNome, validarRa } from "@/lib/validacao";

/**
 * Guarda alunos e matrículas no navegador (localStorage).
 *
 * - No primeiro acesso, carrega os registros dos arquivos de src/data/ e os salva.
 * - Nos acessos seguintes, lê o que estiver salvo no navegador. Registros salvos com
 *   formato inválido (ex.: editados à mão) são descartados em vez de quebrar a tela.
 * - Todo cadastro é validado aqui também, não só no formulário.
 * - Um cadastro só entra no estado depois de salvo; se o salvamento falhar, o estado
 *   não muda e quem chamou recebe o erro.
 *
 * O módulo segue o formato de "store externo" (subscribe/getSnapshot) para ser lido
 * com useSyncExternalStore pelo contexto em src/context/DadosContext.tsx.
 */

export type Dados = {
  alunos: Aluno[];
  matriculas: Matricula[];
};

export type ResultadoCadastro = { ok: true } | { ok: false; erro: string };

const CHAVE_ALUNOS = "lab-web:alunos";
const CHAVE_MATRICULAS = "lab-web:matriculas";

let dados: Dados | null = null;
const ouvintes = new Set<() => void>();

function lerLista<T>(
  chave: string,
  padrao: T[],
  ehValido: (valor: unknown) => valor is T,
  identificar: (item: T) => string,
): T[] {
  const salvo = window.localStorage.getItem(chave);
  if (salvo === null) {
    // Primeiro acesso: grava os dados fornecidos como ponto de partida.
    window.localStorage.setItem(chave, JSON.stringify(padrao));
    return [...padrao];
  }

  let lista: unknown;
  try {
    lista = JSON.parse(salvo);
  } catch {
    lista = null;
  }
  // Conteúdo corrompido nesta chave: usa os dados fornecidos só para esta lista,
  // sem descartar a outra.
  if (!Array.isArray(lista)) return [...padrao];

  // Mantém só registros com formato correto e sem repetição.
  const vistos = new Set<string>();
  return lista.filter((item): item is T => {
    if (!ehValido(item)) return false;
    const id = identificar(item);
    if (vistos.has(id)) return false;
    vistos.add(id);
    return true;
  });
}

function lerDoNavegador(): Dados {
  return {
    alunos: lerLista(CHAVE_ALUNOS, alunosIniciais, ehAluno, (a) => String(a.ra)),
    matriculas: lerLista(
      CHAVE_MATRICULAS,
      matriculasIniciais,
      ehMatricula,
      (m) => `${m.student_ra}-${m.course_id}`,
    ),
  };
}

function carregar(): Dados {
  try {
    return lerDoNavegador();
  } catch {
    // Armazenamento bloqueado ou corrompido: segue com os dados dos arquivos.
    // Novos cadastros vão falhar ao salvar e o usuário será avisado.
    return { alunos: [...alunosIniciais], matriculas: [...matriculasIniciais] };
  }
}

/**
 * Relê o navegador antes de cadastrar: se outra aba cadastrou algo, a checagem de
 * repetição considera esse registro. Se não der para ler, segue com o que está em memória.
 */
function dadosAtualizados(): Dados {
  try {
    dados = lerDoNavegador();
  } catch {
    dados = obterDados();
  }
  return dados;
}

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

function salvar(chave: string, lista: unknown[]): boolean {
  try {
    window.localStorage.setItem(chave, JSON.stringify(lista));
    return true;
  } catch {
    return false;
  }
}

// Se outra aba cadastrar algo, esta aba passa a mostrar o mesmo conteúdo.
function aoMudarEmOutraAba(evento: StorageEvent) {
  if (evento.key === CHAVE_ALUNOS || evento.key === CHAVE_MATRICULAS || evento.key === null) {
    dados = carregar();
    avisar();
  }
}

export function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  if (ouvintes.size === 1) window.addEventListener("storage", aoMudarEmOutraAba);
  return () => {
    ouvintes.delete(ouvinte);
    if (ouvintes.size === 0) window.removeEventListener("storage", aoMudarEmOutraAba);
  };
}

export function obterDados(): Dados {
  if (dados === null) dados = carregar();
  return dados;
}

/** No servidor não há navegador: a interface mostra "Carregando..." até hidratar. */
export function obterDadosNoServidor(): Dados | null {
  return null;
}

export function cadastrarAluno(aluno: Aluno): ResultadoCadastro {
  const ra = validarRa(String(aluno.ra));
  if (!ra.ok || !Number.isSafeInteger(aluno.ra)) {
    return { ok: false, erro: ra.ok ? "RA inválido." : ra.erro };
  }
  const nome = validarNome(String(aluno.name));
  if (!nome.ok) return nome;

  const atual = dadosAtualizados();
  if (atual.alunos.some((a) => a.ra === ra.valor)) {
    avisar();
    return { ok: false, erro: `Já existe um aluno com o RA ${ra.valor}.` };
  }

  const alunos = [...atual.alunos, { ra: ra.valor, name: nome.valor }];
  if (!salvar(CHAVE_ALUNOS, alunos)) {
    return {
      ok: false,
      erro: "Não foi possível salvar o aluno no navegador. O cadastro não foi concluído.",
    };
  }

  dados = { ...atual, alunos };
  avisar();
  return { ok: true };
}

export function cadastrarMatricula(matricula: Matricula): ResultadoCadastro {
  if (!ehMatricula(matricula)) {
    return { ok: false, erro: "Selecione um aluno e uma disciplina válidos." };
  }

  const atual = dadosAtualizados();
  if (!atual.alunos.some((a) => a.ra === matricula.student_ra)) {
    avisar();
    return { ok: false, erro: "O aluno selecionado não está cadastrado." };
  }
  if (!disciplinas.some((d) => d.id === matricula.course_id)) {
    return { ok: false, erro: "A disciplina selecionada não existe no catálogo." };
  }

  const duplicada = atual.matriculas.some(
    (m) => m.student_ra === matricula.student_ra && m.course_id === matricula.course_id,
  );
  if (duplicada) {
    avisar();
    return { ok: false, erro: "Este aluno já está matriculado nesta disciplina." };
  }

  const matriculas = [
    ...atual.matriculas,
    { student_ra: matricula.student_ra, course_id: matricula.course_id },
  ];
  if (!salvar(CHAVE_MATRICULAS, matriculas)) {
    return {
      ok: false,
      erro: "Não foi possível salvar a matrícula no navegador. O cadastro não foi concluído.",
    };
  }

  dados = { ...atual, matriculas };
  avisar();
  return { ok: true };
}
