import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { numericAttribute } from '../attributes';
import { Field } from '../field/field';

@Component({
  selector: 'ext-numberField',
  styleUrls: ['../field/field.css', './number-field.css'],
  templateUrl: './number-field.html',
})
export class ExtNumberField extends Field {
  /** Whether the value can be typed. The spinner keeps working either way. */
  readonly Editable = input(true, { transform: booleanAttribute });
  /** Smallest accepted value. The spinner never steps below it. Validation only while typing. */
  readonly MinValue = input<number | undefined, unknown>(undefined, {
    transform: numericAttribute,
  });
  /** Largest accepted value. The spinner never steps above it. Validation only while typing. */
  readonly MaxValue = input<number | undefined, unknown>(undefined, {
    transform: numericAttribute,
  });
  /** Hides the spinner, which then takes no room inside the text box. */
  readonly HideTrigger = input(false, { transform: booleanAttribute });

  /** The value as a number, or `undefined` while the text is empty or not a number. */
  readonly numericValue = computed(() => parseNumber(this.value()));

  protected readonly showTrigger = computed(() => !this.HideTrigger() && !this.ReadOnly());

  private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('input');

  constructor() {
    super();

    effect(() => {
      const element = this.inputElement()?.nativeElement;
      const value = this.value();
      if (element !== undefined && element.value !== value) {
        element.value = value;
      }
    });
  }

  override isValid(): boolean {
    if (!super.isValid()) {
      return false;
    }

    const value = this.numericValue();
    if (value === undefined) {
      return this.value() === '';
    }

    const minValue = this.MinValue();
    const maxValue = this.MaxValue();
    return (
      (minValue === undefined || value >= minValue) && (maxValue === undefined || value <= maxValue)
    );
  }

  /** Moves the value by `delta`, refusing to step outside `MinValue` / `MaxValue`. */
  protected step(delta: number): void {
    const next = (this.numericValue() ?? 0) + delta;
    const minValue = this.MinValue();
    const maxValue = this.MaxValue();
    if (
      (minValue !== undefined && next < minValue) ||
      (maxValue !== undefined && next > maxValue)
    ) {
      return;
    }

    this.value.set(String(next));
  }

  protected onInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.commit(element, this.enforceMaxLength(element.value));
  }
}

function parseNumber(text: string): number | undefined {
  const trimmed = text.trim();
  if (trimmed === '') {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}
