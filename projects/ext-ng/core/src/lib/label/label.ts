import { Component, input } from '@angular/core';
import { ComponentBase } from '../component-base';

@Component({
  selector: 'ext-label',
  styleUrl: './label.css',
  templateUrl: './label.html',
})
export class ExtLabel extends ComponentBase {
  readonly Text = input('');
}
