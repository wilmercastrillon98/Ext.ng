import { booleanAttribute, Component, computed, input, signal } from '@angular/core';
import { marginStyle, numericAttribute } from '../attributes';

export type ExtTextFieldLabelAlign = 'Left' | 'Right' | 'Top';

const DEFAULT_BOX_WIDTH = 170;

let nextId = 0;

@Component({
  selector: 'ext-textField',
  styleUrl: './text-field.css',
  templateUrl: './text-field.html',
  host: {
    '[style.display]': 'Hidden() ? "none" : null',
    '[style.width.px]': 'width()',
    '[style.height.px]': 'Height()',
    '[style.margin]': 'margin()',
    '[class.ext-textfield--right]': 'LabelAlign() === "Right"',
    '[class.ext-textfield--top]': 'LabelAlign() === "Top"',
    '[class.ext-textfield--disabled]': 'Disabled()',
  },
})
export class ExtTextField {
  readonly Width = input<number | undefined, unknown>(undefined, { transform: numericAttribute });
  readonly Height = input<number | undefined, unknown>(undefined, { transform: numericAttribute });
  readonly Margin = input<number | undefined, unknown>(undefined, { transform: numericAttribute });
  readonly MarginSpec = input('');
  readonly Hidden = input(false, { transform: booleanAttribute });
  readonly Disabled = input(false, { transform: booleanAttribute });

  readonly MaxLength = input<number | undefined, unknown>(undefined, {
    transform: numericAttribute,
  });
  readonly MinLength = input<number | undefined, unknown>(undefined, {
    transform: numericAttribute,
  });
  readonly AllowBlank = input(true, { transform: booleanAttribute });
  readonly MaskRe = input('');

  readonly FieldLabel = input('');
  readonly LabelAlign = input<ExtTextFieldLabelAlign>('Left');
  readonly LabelWidth = input<number, unknown>(100, {
    transform: (value) => numericAttribute(value) ?? 100,
  });
  readonly EmptyText = input('');
  readonly ReadOnly = input(false, { transform: booleanAttribute });

  readonly value = signal('');

  protected readonly inputId = `ext-textfield-${nextId++}`;
  protected readonly margin = computed(() => marginStyle(this.MarginSpec(), this.Margin()));
  protected readonly showLabel = computed(() => this.FieldLabel().length > 0);

  protected readonly width = computed(() => {
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

  private readonly maskRe = computed(() => {
    const source = this.MaskRe();
    if (source === '') {
      return undefined;
    }

    try {
      return new RegExp(source);
    } catch {
      return undefined;
    }
  });

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
    if (minLength !== undefined && value.length < minLength) {
      return false;
    }

    return this.matchesMask(value);
  }

  protected onInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    const typed = element.value;
    const masked = this.applyMask(typed);

    if (masked !== typed) {
      const caret = (element.selectionStart ?? typed.length) - (typed.length - masked.length);
      element.value = masked;
      element.setSelectionRange(caret, caret);
    }

    this.value.set(masked);
  }

  private applyMask(text: string): string {
    const maskRe = this.maskRe();
    return maskRe === undefined ? text : [...text].filter((char) => maskRe.test(char)).join('');
  }

  private matchesMask(text: string): boolean {
    const maskRe = this.maskRe();
    return maskRe === undefined || [...text].every((char) => maskRe.test(char));
  }
}
