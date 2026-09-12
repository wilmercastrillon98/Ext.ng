import { Component, signal } from '@angular/core';
import { ExtButton } from '@ext-ng/core';

@Component({
  imports: [ExtButton],
  selector: 'app-button-demo',
  styleUrl: './button-demo.css',
  templateUrl: './button-demo.html',
})
export class ButtonDemo {
  protected readonly lastClicked = signal('(none)');
}
