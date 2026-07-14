import { useEffect, useMemo, useState } from "react";
import type { Course, CourseLevel } from "../types/course";
import { fetchCourses } from "../services/courses";
import { getErrorMessage } from "../lib/errors";

export function useCourses() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<"" | CourseLevel>("");
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    let aborted = false;
    setLoading(true);
    setError(null);

    fetchCourses({ q: query, level })
      .then((data) => {
        if (!aborted) setItems(data);
      })
      .catch((error: unknown) => {
        if (!aborted) setError(getErrorMessage(error, "Erro ao carregar cursos"));
      })
      .finally(() => {
        if (!aborted) setLoading(false);
      });

    return () => {
      aborted = true;
    };
  }, [query, level]);

  const setFilters = (q: string, lv: "" | CourseLevel) => {
    setQuery(q);
    setLevel(lv);
  };

  const hasFilters = useMemo(() => Boolean(query || level), [query, level]);

  return {
    items,
    loading,
    error,
    query,
    level,
    hasFilters,
    setQuery,
    setLevel,
    setFilters,
  };
}
