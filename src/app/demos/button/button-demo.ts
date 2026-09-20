import { Component, signal } from '@angular/core';
import { ExtButton } from '@ext-ng/core';

@Component({
  imports: [ExtButton],
  selector: 'app-button-demo',
  styleUrl: './button-demo.css',
  templateUrl: './button-demo.html',
})
export class ButtonDemo {
  protected readonly message = signal('(nothing)');
  protected readonly hidden = signal(true);

  /** An arrow property so `this` stays bound when it is passed to `Handler`. */
  protected readonly login = () => this.message.set('login() ran');
}
