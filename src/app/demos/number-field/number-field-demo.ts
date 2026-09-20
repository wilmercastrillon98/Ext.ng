import { Component, signal, viewChild } from '@angular/core';
import { ExtButton, ExtNumberField } from '@ext-ng/core';

@Component({
  imports: [ExtButton, ExtNumberField],
  selector: 'app-number-field-demo',
  styleUrl: './number-field-demo.css',
  templateUrl: './number-field-demo.html',
})
export class NumberFieldDemo {
  protected readonly hidden = signal(true);
  protected readonly validation = signal('(not checked yet)');

  private readonly validated = viewChild.required('validated', { read: ExtNumberField });

  protected check(): void {
    const field = this.validated();
    this.validation.set(`"${field.value()}" is ${field.isValid() ? 'valid' : 'invalid'}`);
  }
}
