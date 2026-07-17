type ClassValue = string | number | null | false | undefined | ClassValue[];

function flatten(value: ClassValue, out: string[]) {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach((v) => flatten(v, out));
    return;
  }
  out.push(String(value));
}

/** Minimal `clsx`-style class name joiner, no extra dependency required. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  values.forEach((v) => flatten(v, out));
  return out.join(" ");
}
