import { Component, input } from '@angular/core';
import { ComponentBase } from '../component-base';

export type ExtButtonUI = 'Default' | 'Danger' | 'Info' | 'Primary' | 'Success' | 'Warning';

@Component({
  selector: 'ext-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
})
export class ExtButton extends ComponentBase {
  readonly Text = input('');
  readonly UI = input<ExtButtonUI>('Default');
  readonly Handler = input<(event: MouseEvent) => void>();

  protected onClick(event: MouseEvent): void {
    this.Handler()?.(event);
  }
}
