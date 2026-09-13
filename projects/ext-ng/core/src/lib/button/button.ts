import { booleanAttribute, Component, input } from '@angular/core';

export type ExtButtonUI = 'Default' | 'Danger' | 'Info' | 'Primary' | 'Success' | 'Warning';

@Component({
  selector: 'ext-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
  host: { '[style.display]': 'Hidden() ? "none" : null' },
})
export class ExtButton {
  readonly Text = input('');
  readonly UI = input<ExtButtonUI>('Default');
  readonly Hidden = input(false, { transform: booleanAttribute });
  readonly Handler = input<(event: MouseEvent) => void>();

  protected onClick(event: MouseEvent): void {
    this.Handler()?.(event);
  }
}
