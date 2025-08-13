export type CourseLevel = "Iniciante" | "Intermediário" | "Avançado";

export interface Course {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  lessons: number;
  duration: string; // ex.: "6h"
  tag?: string;     // ex.: "Novo", "Atualizado"
  coverUrl?: string;
}
