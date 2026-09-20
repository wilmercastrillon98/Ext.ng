import { Component, computed, input } from '@angular/core';
import { Field } from '../field/field';

@Component({
  selector: 'ext-textField',
  styleUrls: ['../field/field.css', './text-field.css'],
  templateUrl: './text-field.html',
})
export class ExtTextField extends Field {
  /** Expression every single character has to match. Others are dropped as they are typed. */
  readonly MaskRe = input('');

  private readonly maskRe = computed(() => {
    const source = this.MaskRe();
    if (source === '') {
      return undefined;
    }

    try {
      return new RegExp(source);
    } catch {
      return undefined;
    }
  });

  override isValid(): boolean {
    return super.isValid() && this.matchesMask(this.value());
  }

  protected onInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.commit(element, this.enforceMaxLength(this.applyMask(element.value)));
  }

  private applyMask(text: string): string {
    const maskRe = this.maskRe();
    return maskRe === undefined ? text : [...text].filter((char) => maskRe.test(char)).join('');
  }

  private matchesMask(text: string): boolean {
    const maskRe = this.maskRe();
    return maskRe === undefined || [...text].every((char) => maskRe.test(char));
  }
}
