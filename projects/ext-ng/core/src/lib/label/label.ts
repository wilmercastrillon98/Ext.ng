import { booleanAttribute, Component, computed, input, numberAttribute } from '@angular/core';

/** Reads a numeric attribute, discarding anything that is not a finite number. */
function pixelAttribute(value: unknown): number | undefined {
  const pixels = numberAttribute(value);
  return Number.isFinite(pixels) ? pixels : undefined;
}

@Component({
  selector: 'ext-label',
  styleUrl: './label.css',
  templateUrl: './label.html',
  host: {
    '[style.display]': 'Hidden() ? "none" : null',
    '[style.width.px]': 'Width()',
    '[style.height.px]': 'Height()',
    '[style.margin]': 'margin()',
  },
})
export class ExtLabel {
  readonly Text = input('');
  readonly Width = input<number | undefined, unknown>(undefined, { transform: pixelAttribute });
  readonly Height = input<number | undefined, unknown>(undefined, { transform: pixelAttribute });
  readonly Margin = input<number | undefined, unknown>(undefined, { transform: pixelAttribute });
  readonly MarginSpec = input('');
  readonly Hidden = input(false, { transform: booleanAttribute });

  /** `MarginSpec` takes precedence over `Margin`; both become a CSS `margin` shorthand. */
  protected readonly margin = computed(() => {
    const spec = this.MarginSpec().trim().split(/\s+/).filter(Boolean).map(Number);
    if (spec.length > 0 && spec.every(Number.isFinite)) {
      return spec.map((pixels) => `${pixels}px`).join(' ');
    }

    const margin = this.Margin();
    return margin === undefined ? null : `${margin}px`;
  });
}
