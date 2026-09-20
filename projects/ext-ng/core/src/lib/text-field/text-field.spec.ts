import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtTextField } from './text-field';

async function type(fixture: ComponentFixture<ExtTextField>, text: string): Promise<void> {
  const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
  input.value = text;
  input.dispatchEvent(new Event('input'));
  await fixture.whenStable();
}

function inputOf(fixture: ComponentFixture<ExtTextField>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

function labelOf(fixture: ComponentFixture<ExtTextField>): HTMLLabelElement | null {
  return fixture.nativeElement.querySelector('label');
}

describe('ExtTextField', () => {
  it('should be 170px wide and show no label by default', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.width).toBe('170px');
    expect(labelOf(fixture)).toBeNull();
  });

  it('should add the label width when FieldLabel has text', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('FieldLabel', 'test');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.width).toBe('270px');
    expect(labelOf(fixture)?.textContent?.trim()).toBe('test');
    expect(labelOf(fixture)?.style.width).toBe('100px');
  });

  it('should follow LabelWidth for both the label and the default width', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('FieldLabel', 'test');
    fixture.componentRef.setInput('LabelWidth', '60');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.width).toBe('230px');
    expect(labelOf(fixture)?.style.width).toBe('60px');
  });

  it('should keep the requested Width and Height', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('FieldLabel', 'test');
    fixture.componentRef.setInput('Width', '400');
    fixture.componentRef.setInput('Height', 60);
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.width).toBe('400px');
    expect(host.style.height).toBe('60px');
  });

  it('should not give the label a width when it sits on top', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('FieldLabel', 'test');
    fixture.componentRef.setInput('LabelAlign', 'Top');
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.width).toBe('170px');
    expect(host.classList).toContain('ext-textfield--top');
    expect(labelOf(fixture)?.style.width).toBe('');
  });

  it('should flip the layout when the label is aligned Right', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('FieldLabel', 'test');
    fixture.componentRef.setInput('LabelAlign', 'Right');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).classList).toContain('ext-textfield--right');
  });

  it('should disable the text box', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('Disabled', true);
    await fixture.whenStable();

    expect(inputOf(fixture).disabled).toBe(true);
  });

  it('should show EmptyText as the placeholder', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('EmptyText', 'Vacio');
    await fixture.whenStable();

    expect(inputOf(fixture).placeholder).toBe('Vacio');
  });

  it('should mark the text box read only', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('ReadOnly', true);
    await fixture.whenStable();

    expect(inputOf(fixture).readOnly).toBe(true);
  });

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

  it('should be valid while empty only when AllowBlank', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    await fixture.whenStable();
    expect(fixture.componentInstance.isValid()).toBe(true);

    fixture.componentRef.setInput('AllowBlank', false);
    await fixture.whenStable();
    expect(fixture.componentInstance.isValid()).toBe(false);

    await type(fixture, 'a');
    expect(fixture.componentInstance.isValid()).toBe(true);
  });

  it('should validate MaxLength without blocking what is typed', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('MaxLength', '7');
    await fixture.whenStable();

    await type(fixture, '1234567');
    expect(fixture.componentInstance.isValid()).toBe(true);

    await type(fixture, '12345678');
    expect(inputOf(fixture).value).toBe('12345678');
    expect(fixture.componentInstance.isValid()).toBe(false);
  });

  it('should validate MinLength', async () => {
    const fixture = TestBed.createComponent(ExtTextField);
    fixture.componentRef.setInput('MinLength', 3);
    await fixture.whenStable();

    await type(fixture, 'ab');
    expect(fixture.componentInstance.isValid()).toBe(false);

    await type(fixture, 'abc');
    expect(fixture.componentInstance.isValid()).toBe(true);
  });
});
