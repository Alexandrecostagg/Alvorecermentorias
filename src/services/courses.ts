import type { Course } from "../types/course";

const MOCK: Course[] = [
  {
    id: "1",
    title: "Fundamentos da Fé",
    description: "Bases bíblicas essenciais para o crescimento espiritual.",
    level: "Iniciante",
    lessons: 12,
    duration: "6h",
    tag: "Novo",
  },
  {
    id: "2",
    title: "Leitura Bíblica Guiada",
    description: "Métodos práticos para compreender as Escrituras.",
    level: "Intermediário",
    lessons: 18,
    duration: "9h",
  },
  {
    id: "3",
    title: "Teologia do Novo Testamento",
    description: "Temas centrais dos Evangelhos e Cartas.",
    level: "Avançado",
    lessons: 20,
    duration: "10h",
    tag: "Atualizado",
  },
];

type FetchCoursesParams = {
  q?: string;
  level?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchCourses(params: FetchCoursesParams = {}): Promise<Course[]> {
  const base = import.meta.env.VITE_API_BASE as string | undefined;

  // Se tiver API configurada, tenta buscar
  if (base) {
    const url = new URL("/courses", base);
    if (params.q) url.searchParams.set("q", params.q);
    if (params.level) url.searchParams.set("level", params.level);
    if (params.page) url.searchParams.set("page", String(params.page));
    if (params.pageSize) url.searchParams.set("pageSize", String(params.pageSize));

    const res = await fetch(url.toString(), { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`Erro ao carregar cursos (${res.status})`);
    const data = await res.json();
    return data as Course[];
  }

  // Fallback: mock local + filtro simples
  let data = [...MOCK];
  if (params.q) {
    const q = params.q.toLowerCase();
    data = data.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }
  if (params.level) {
    data = data.filter((c) => c.level === params.level);
  }

  // Simula latência
  await new Promise((r) => setTimeout(r, 400));
  return data;
}
