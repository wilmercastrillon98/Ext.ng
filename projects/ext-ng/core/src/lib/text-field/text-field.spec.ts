import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtTextField } from './text-field';

async function type(fixture: ComponentFixture<ExtTextField>, text: string): Promise<void> {
  const input = inputOf(fixture);
  input.value = text;
  input.dispatchEvent(new Event('input'));
  await fixture.whenStable();
}

function inputOf(fixture: ComponentFixture<ExtTextField>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

describe('ExtTextField', () => {
  it('should drop the characters MaskRe does not accept', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('MaskRe', '([a-zA-Z0-9])');
    await fixture.whenStable();

    await type(fixture, 'ab-1 $c');

    expect(inputOf(fixture).value).toBe('ab1c');
    expect(fixture.componentInstance.value()).toBe('ab1c');
  });

  it('should ignore a MaskRe that is not a valid expression', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('MaskRe', '([a-z');
    await fixture.whenStable();

    await type(fixture, 'ab-1');

    expect(fixture.componentInstance.value()).toBe('ab-1');
  });

  it('should invalidate a value the mask does not accept', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('MaskRe', '([0-9])');
    await fixture.whenStable();

    fixture.componentInstance.value.set('12a');

    expect(fixture.componentInstance.isValid()).toBe(false);
  });
});
