import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtNumberField } from '../number-field/number-field';
import { ExtTextField } from '../text-field/text-field';
import { Field } from './field';

const fields: [string, Type<Field>][] = [
  ['ExtTextField', ExtTextField],
  ['ExtNumberField', ExtNumberField],
];

describe.each(fields)('Field on %s', (_name, field) => {
  async function render(inputs: Record<string, unknown> = {}): Promise<ComponentFixture<Field>> {
    const fixture = TestBed.createComponent(field);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await fixture.whenStable();

    return fixture;
  }

  async function type(fixture: ComponentFixture<Field>, text: string): Promise<void> {
    const input = inputOf(fixture);
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  function hostOf(fixture: ComponentFixture<Field>): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function inputOf(fixture: ComponentFixture<Field>): HTMLInputElement {
    return fixture.nativeElement.querySelector('input') as HTMLInputElement;
  }

  function labelOf(fixture: ComponentFixture<Field>): HTMLLabelElement | null {
    return fixture.nativeElement.querySelector('label');
  }

  it('should be 170px wide and show no label by default', async () => {
    const fixture = await render();

    expect(hostOf(fixture).style.width).toBe('170px');
    expect(labelOf(fixture)).toBeNull();
  });

  it('should add the label width when FieldLabel has text', async () => {
    const fixture = await render({ FieldLabel: 'test' });

    expect(hostOf(fixture).style.width).toBe('270px');
    expect(labelOf(fixture)?.textContent?.trim()).toBe('test');
    expect(labelOf(fixture)?.style.width).toBe('100px');
  });

  it('should follow LabelWidth for both the label and the default width', async () => {
    const fixture = await render({ FieldLabel: 'test', LabelWidth: '60' });

    expect(hostOf(fixture).style.width).toBe('230px');
    expect(labelOf(fixture)?.style.width).toBe('60px');
  });

  it('should keep the requested Width and Height', async () => {
    const fixture = await render({ FieldLabel: 'test', Width: '400', Height: 60 });

    expect(hostOf(fixture).style.width).toBe('400px');
    expect(hostOf(fixture).style.height).toBe('60px');
  });

  it('should not give the label a width when it sits on top', async () => {
    const fixture = await render({ FieldLabel: 'test', LabelAlign: 'Top' });

    expect(hostOf(fixture).style.width).toBe('170px');
    expect(hostOf(fixture).classList).toContain('ext-field--top');
    expect(labelOf(fixture)?.style.width).toBe('');
  });

  it('should flip the layout when the label is aligned Right', async () => {
    const fixture = await render({ FieldLabel: 'test', LabelAlign: 'Right' });

    expect(hostOf(fixture).classList).toContain('ext-field--right');
  });

  it('should disable the text box', async () => {
    expect(inputOf(await render({ Disabled: true })).disabled).toBe(true);
  });

  it('should show EmptyText as the placeholder', async () => {
    expect(inputOf(await render({ EmptyText: 'Vacio' })).placeholder).toBe('Vacio');
  });

  it('should mark the text box read only', async () => {
    expect(inputOf(await render({ ReadOnly: true })).readOnly).toBe(true);
  });

  it('should be valid while empty only when AllowBlank', async () => {
    const fixture = await render();
    expect(fixture.componentInstance.isValid()).toBe(true);

    fixture.componentRef.setInput('AllowBlank', false);
    await fixture.whenStable();
    expect(fixture.componentInstance.isValid()).toBe(false);

    await type(fixture, '1');
    expect(fixture.componentInstance.isValid()).toBe(true);
  });

  it('should validate MaxLength without blocking what is typed', async () => {
    const fixture = await render({ MaxLength: '7' });

    await type(fixture, '1234567');
    expect(fixture.componentInstance.isValid()).toBe(true);

    await type(fixture, '12345678');
    expect(inputOf(fixture).value).toBe('12345678');
    expect(fixture.componentInstance.isValid()).toBe(false);
  });

  it('should validate MinLength', async () => {
    const fixture = await render({ MinLength: 3 });

    await type(fixture, '12');
    expect(fixture.componentInstance.isValid()).toBe(false);

    await type(fixture, '123');
    expect(fixture.componentInstance.isValid()).toBe(true);
  });

  it('should cut the typed text at MaxLength when EnforceMaxLength', async () => {
    const fixture = await render({ MaxLength: 3, EnforceMaxLength: true });

    await type(fixture, '12345');

    expect(inputOf(fixture).value).toBe('123');
    expect(fixture.componentInstance.value()).toBe('123');
    expect(fixture.componentInstance.isValid()).toBe(true);
  });
});
