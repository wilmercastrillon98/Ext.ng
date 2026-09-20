import { numberAttribute } from '@angular/core';

/** Reads a numeric attribute, discarding anything that is not a finite number. */
export function numericAttribute(value: unknown): number | undefined {
  const parsed = numberAttribute(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** The `*Spec` form takes precedence over the single value; both become a CSS shorthand. */
export function spacingStyle(spec: string, value: number): string {
  const sides = spec.trim().split(/\s+/).filter(Boolean).map(Number);
  if (sides.length > 0 && sides.every(Number.isFinite)) {
    return sides.map((pixels) => `${pixels}px`).join(' ');
  }

  return `${value}px`;
}
