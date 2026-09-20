import { Component, signal, viewChild } from '@angular/core';
import { ExtButton, ExtTextField } from '@ext-ng/core';

@Component({
  imports: [ExtButton, ExtTextField],
  selector: 'app-text-field-demo',
  styleUrl: './text-field-demo.css',
  templateUrl: './text-field-demo.html',
})
export class TextFieldDemo {
  protected readonly hidden = signal(true);
  protected readonly validation = signal('(not checked yet)');

  private readonly validated = viewChild.required('validated', { read: ExtTextField });

  protected check(): void {
    const field = this.validated();
    this.validation.set(`"${field.value()}" is ${field.isValid() ? 'valid' : 'invalid'}`);
  }
}
