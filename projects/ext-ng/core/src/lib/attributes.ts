import { numberAttribute } from '@angular/core';

/** Reads a numeric attribute, discarding anything that is not a finite number. */
export function numericAttribute(value: unknown): number | undefined {
  const parsed = numberAttribute(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** `MarginSpec` takes precedence over `Margin`; both become a CSS `margin` shorthand. */
export function marginStyle(marginSpec: string, margin: number): string {
  const spec = marginSpec.trim().split(/\s+/).filter(Boolean).map(Number);
  if (spec.length > 0 && spec.every(Number.isFinite)) {
    return spec.map((pixels) => `${pixels}px`).join(' ');
  }

  return `${margin}px`;
}
