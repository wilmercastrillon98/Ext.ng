import { booleanAttribute, computed, Directive, input, signal } from '@angular/core';
import { numericAttribute } from '../attributes';
import { ComponentBase } from '../component-base';

/** Where the `FieldLabel` sits relative to the text box. */
export type ExtLabelAlign = 'Left' | 'Right' | 'Top';

/** Width of the text box on its own, before the label is taken into account. */
const DEFAULT_BOX_WIDTH = 170;

let nextId = 0;

/**
 * The label, text box and validation configuration shared by every data entry component.
 * Subclasses own the template, and take the `ext-field--right` / `ext-field--top` host
 * classes contributed here to lay the label out.
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
  /** Whether an empty value passes validation. */
  readonly AllowBlank = input(true, { transform: booleanAttribute });
  /** Text of the label. While empty the label is not rendered and takes no space. */
  readonly FieldLabel = input('');
  /** Where the label sits relative to the text box. */
  readonly LabelAlign = input<ExtLabelAlign>('Left');
  /** Width of the label alone, in pixels. The whole component is sized through `Width`. */
  readonly LabelWidth = input<number, unknown>(100, {
    transform: (value) => numericAttribute(value) ?? 100,
  });
  /** Placeholder shown while the field is empty. */
  readonly EmptyText = input('');
  /** Longest accepted value. Validation only, unless `EnforceMaxLength` is set. */
  readonly MaxLength = input<number | undefined, unknown>(undefined, {
    transform: numericAttribute,
  });
  /** Shortest accepted value. Validation only: shorter text can still be typed. */
  readonly MinLength = input<number | undefined, unknown>(undefined, {
    transform: numericAttribute,
  });
  /** Stops more than `MaxLength` characters from being typed. */
  readonly EnforceMaxLength = input(false, { transform: booleanAttribute });

  /** Text currently held by the field. */
  readonly value = signal('');

  protected readonly inputId = `ext-field-${nextId++}`;
  protected readonly showLabel = computed(() => this.FieldLabel().length > 0);

  protected override readonly hostWidth = computed(() => {
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

  /** Whether the current value passes every validation option. */
  isValid(): boolean {
    const value = this.value();
    if (value === '') {
      return this.AllowBlank();
    }

    const maxLength = this.MaxLength();
    if (maxLength !== undefined && value.length > maxLength) {
      return false;
    }

    const minLength = this.MinLength();
    return minLength === undefined || value.length >= minLength;
  }

  protected enforceMaxLength(text: string): string {
    const maxLength = this.MaxLength();
    return this.EnforceMaxLength() && maxLength !== undefined ? text.slice(0, maxLength) : text;
  }

  /** Keeps `value` and the text box in step after the typed text has been sanitized. */
  protected commit(element: HTMLInputElement, text: string): void {
    if (element.value !== text) {
      const caret =
        (element.selectionStart ?? element.value.length) - (element.value.length - text.length);
      element.value = text;
      element.setSelectionRange(caret, caret);
    }

    this.value.set(text);
  }
}
