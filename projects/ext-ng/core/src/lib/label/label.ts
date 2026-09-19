import { booleanAttribute, Component, computed, input } from '@angular/core';
import { marginStyle, numericAttribute } from '../attributes';

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
  readonly Width = input<number | undefined, unknown>(undefined, { transform: numericAttribute });
  readonly Height = input<number | undefined, unknown>(undefined, { transform: numericAttribute });
  readonly Margin = input<number | undefined, unknown>(undefined, { transform: numericAttribute });
  readonly MarginSpec = input('');
  readonly Hidden = input(false, { transform: booleanAttribute });

  protected readonly margin = computed(() => marginStyle(this.MarginSpec(), this.Margin()));
}
