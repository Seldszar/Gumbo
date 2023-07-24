export function remToPixels(value: number, base = document.documentElement): number {
  return value * parseFloat(getComputedStyle(base).fontSize);
}
