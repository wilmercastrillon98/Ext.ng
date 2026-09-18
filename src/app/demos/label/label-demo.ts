import { Component, signal } from '@angular/core';
import { ExtButton, ExtLabel } from '@ext-ng/core';

@Component({
  imports: [ExtButton, ExtLabel],
  selector: 'app-label-demo',
  styleUrl: './label-demo.css',
  templateUrl: './label-demo.html',
})
export class LabelDemo {
  protected readonly hidden = signal(true);
}
