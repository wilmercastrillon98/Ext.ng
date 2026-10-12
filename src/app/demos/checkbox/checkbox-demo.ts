import { Component, signal } from '@angular/core';
import { ExtButton, ExtCheckbox } from '@ext-ng/core';

@Component({
  imports: [ExtButton, ExtCheckbox],
  selector: 'app-checkbox-demo',
  styleUrl: './checkbox-demo.css',
  templateUrl: './checkbox-demo.html',
})
export class CheckboxDemo {
  protected readonly hidden = signal(true);
}
