import { Component, input } from '@angular/core';

export type ExtButtonUi = 'default' | 'primary' | 'danger';

@Component({
  selector: 'ext-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
})
export class ExtButton {
  readonly text = input('');
  readonly ui = input<ExtButtonUi>('default');
  readonly disabled = input(false);
}
