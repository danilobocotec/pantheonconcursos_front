export const DEFAULT_VADE_PRIORITY: string[] = [
  "Código de Processo Penal - Decreto-Lei nº 3.689, de 3 de outubro de 1941.",
  "Código do Consumidor - Lei nº 8.078, de 11 de setembro de 1990",
  "Código Penal - Decreto-Lei nº 2.848, de 7 de dezembro de 1940",
  "Código Florestal - Lei nº 12.651, de 25 de maio de 2012",
  "Código de Processo Civil - Lei nº 13.105, de 16 de março de 2015",
  "Código Eleitoral - Lei nº 4.737, de 15 de julho de 1965",
  "Consolidação das Leis de Trabalho - Decreto-Lei n° 5.452, de 1° de maio de 1943",
  "Código Civil - Lei nº 10.406, de 10 de janeiro de 2002",
  "Código Tributário Nacional - CTN - Lei nº 5.172, de 25 de outubro de 1966",
];

const STORAGE_KEY = "pantheon:vadePriority";

const sanitizeOrder = (order: unknown): string[] => {
  if (!Array.isArray(order)) return [];
  return order.filter((value): value is string => typeof value === "string");
};

export const loadVadePriority = (): string[] => {
  if (typeof window === "undefined") return DEFAULT_VADE_PRIORITY;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_VADE_PRIORITY;
    const parsed = JSON.parse(stored);
    const sanitized = sanitizeOrder(parsed);
    const filtered = sanitized.filter((item) => DEFAULT_VADE_PRIORITY.includes(item));
    const unique = Array.from(new Set(filtered));
    if (unique.length === 0) return DEFAULT_VADE_PRIORITY;

    const missing = DEFAULT_VADE_PRIORITY.filter((item) => !unique.includes(item));
    return [...unique, ...missing];
  } catch (error) {
    console.warn("Falha ao carregar prioridade do Vade Mecum.", error);
    return DEFAULT_VADE_PRIORITY;
  }
};

export const saveVadePriority = (order: string[]): void => {
  if (typeof window === "undefined") return;
  const filtered = order.filter((item) => DEFAULT_VADE_PRIORITY.includes(item));
  const unique = Array.from(new Set(filtered));
  const completed = [...unique, ...DEFAULT_VADE_PRIORITY.filter((item) => !unique.includes(item))];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  window.dispatchEvent(new Event("pantheon-vade-priority-changed"));
};
