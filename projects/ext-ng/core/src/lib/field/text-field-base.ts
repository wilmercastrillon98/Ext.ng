import { booleanAttribute, Directive, input, signal } from '@angular/core';
import { numericAttribute } from '../attributes';
import { Field } from './field';

/** The text value and its validation configuration, shared by every field typed into. */
@Directive()
export abstract class TextFieldBase extends Field {
  /** Whether an empty value passes validation. */
  readonly AllowBlank = input(true, { transform: booleanAttribute });
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
