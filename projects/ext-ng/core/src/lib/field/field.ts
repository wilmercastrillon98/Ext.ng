import { booleanAttribute, computed, Directive, input, Signal } from '@angular/core';
import { numericAttribute } from '../attributes';
import { ComponentBase } from '../component-base';

/** Where the `FieldLabel` sits relative to the text box. */
export type ExtLabelAlign = 'Left' | 'Right' | 'Top';

/** Width of the text box on its own, before the label is taken into account. */
const DEFAULT_BOX_WIDTH = 170;

let nextId = 0;

/**
 * The label configuration shared by every data entry component. Subclasses own the
 * template, and take the `ext-field--right` / `ext-field--top` host classes contributed
 * here to lay the label out.
 */
@Directive({
  host: {
    '[class.ext-field--right]': 'LabelAlign() === "Right"',
    '[class.ext-field--top]': 'LabelAlign() === "Top"',
  },
})
export abstract class Field extends ComponentBase {
  /** Stops the value from being changed. */
  readonly ReadOnly = input(false, { transform: booleanAttribute });
  /** Text of the label. While empty the label is not rendered and takes no space. */
  readonly FieldLabel = input('');
  /** Where the label sits relative to the text box. */
  readonly LabelAlign = input<ExtLabelAlign>('Left');
  /** Width of the label alone, in pixels. The whole component is sized through `Width`. */
  readonly LabelWidth = input<number, unknown>(100, {
    transform: (value) => numericAttribute(value) ?? 100,
  });

  protected readonly inputId = `ext-field-${nextId++}`;
  protected readonly showLabel = computed(() => this.FieldLabel().length > 0);

  protected override readonly hostWidth: Signal<number | undefined> = computed(() => {
    const width = this.Width();
    if (width !== undefined) {
      return width;
    }

    const takesRow = this.showLabel() && this.LabelAlign() !== 'Top';
    return takesRow ? DEFAULT_BOX_WIDTH + this.LabelWidth() : DEFAULT_BOX_WIDTH;
  });

  protected readonly labelWidth = computed(() =>
    this.LabelAlign() === 'Top' ? null : this.LabelWidth(),
  );
}
