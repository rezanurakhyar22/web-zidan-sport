export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | Record<string, boolean | undefined | null>;

function toClassList(input: ClassValue): string[] {
  if (!input) return [];
  if (typeof input === "string" || typeof input === "number") {
    return [String(input)];
  }
  if (Array.isArray(input)) {
    return input.flatMap(toClassList);
  }
  if (typeof input === "object") {
    return Object.entries(input)
      .filter(([, active]) => Boolean(active))
      .map(([className]) => className);
  }
  return [];
}

export function cn(...inputs: ClassValue[]): string {
  return inputs.flatMap(toClassList).join(" ");
}
