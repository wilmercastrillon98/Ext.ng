import { booleanAttribute, Component, computed, input, linkedSignal } from '@angular/core';
import { Field } from '../field/field';

/** Where the `BoxLabel` sits relative to the check box. */
export type ExtBoxLabelAlign = 'After' | 'Before';

@Component({
  selector: 'ext-checkbox',
  styleUrls: ['../field/field.css', './checkbox.css'],
  templateUrl: './checkbox.html',
})
export class ExtCheckbox extends Field {
  /** Whether the box starts out checked. */
  readonly Checked = input(false, { transform: booleanAttribute });
  /** Text shown beside the check box, apart from the `FieldLabel`. */
  readonly BoxLabel = input('');
  /** Whether the `BoxLabel` sits after or before the check box. */
  readonly BoxLabelAlign = input<ExtBoxLabelAlign>('After');

  /** Whether the box is checked right now. Follows `Checked` whenever that input changes. */
  readonly checked = linkedSignal(() => this.Checked());

  protected readonly showBoxLabel = computed(() => this.BoxLabel().length > 0);

  protected override readonly hostWidth = computed(() => this.Width());

  protected onClick(event: MouseEvent): void {
    if (this.ReadOnly()) {
      event.preventDefault();
    }
  }

  protected onChange(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
