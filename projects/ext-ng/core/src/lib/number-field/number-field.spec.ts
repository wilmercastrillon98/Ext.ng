import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtNumberField } from './number-field';

async function render(
  inputs: Record<string, unknown> = {},
): Promise<ComponentFixture<ExtNumberField>> {
  const fixture = TestBed.createComponent(ExtNumberField);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();

  return fixture;
}

async function type(fixture: ComponentFixture<ExtNumberField>, text: string): Promise<void> {
  const input = inputOf(fixture);
  input.value = text;
  input.dispatchEvent(new Event('input'));
  await fixture.whenStable();
}

async function click(
  fixture: ComponentFixture<ExtNumberField>,
  direction: 'up' | 'down',
): Promise<void> {
  triggerOf(fixture, direction)?.click();
  await fixture.whenStable();
}

function inputOf(fixture: ComponentFixture<ExtNumberField>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

function triggerOf(
  fixture: ComponentFixture<ExtNumberField>,
  direction: 'up' | 'down',
): HTMLButtonElement | null {
  return fixture.nativeElement.querySelector(`.ext-numberfield__trigger--${direction}`);
}

describe('ExtNumberField', () => {
  it('should write 1 when the up arrow is used while empty', async () => {
    const fixture = await render();

    await click(fixture, 'up');

    expect(inputOf(fixture).value).toBe('1');
    expect(fixture.componentInstance.value()).toBe('1');
    expect(fixture.componentInstance.numericValue()).toBe(1);
  });

  it('should write -1 when the down arrow is used while empty', async () => {
    const fixture = await render();

    await click(fixture, 'down');

    expect(inputOf(fixture).value).toBe('-1');
    expect(fixture.componentInstance.numericValue()).toBe(-1);
  });

  it('should step the typed value by one', async () => {
    const fixture = await render();
    await type(fixture, '41');

    await click(fixture, 'up');
    expect(inputOf(fixture).value).toBe('42');

    await click(fixture, 'down');
    await click(fixture, 'down');
    expect(inputOf(fixture).value).toBe('40');
  });

  it('should not step past MaxValue or MinValue', async () => {
    const fixture = await render({ MinValue: '0', MaxValue: 2 });
    await type(fixture, '2');

    await click(fixture, 'up');
    expect(inputOf(fixture).value).toBe('2');

    await type(fixture, '0');
    await click(fixture, 'down');
    expect(inputOf(fixture).value).toBe('0');
  });

  it('should validate MinValue and MaxValue without blocking what is typed', async () => {
    const fixture = await render({ MinValue: 1, MaxValue: 10 });

    await type(fixture, '11');
    expect(inputOf(fixture).value).toBe('11');
    expect(fixture.componentInstance.isValid()).toBe(false);

    await type(fixture, '0');
    expect(fixture.componentInstance.isValid()).toBe(false);

    await type(fixture, '10');
    expect(fixture.componentInstance.isValid()).toBe(true);
  });

  it('should invalidate text that is not a number', async () => {
    const fixture = await render();

    await type(fixture, '4a');

    expect(fixture.componentInstance.isValid()).toBe(false);
    expect(fixture.componentInstance.numericValue()).toBeUndefined();
  });

  it('should hide the spinner and lock the text box when ReadOnly', async () => {
    const fixture = await render({ ReadOnly: true });

    expect(triggerOf(fixture, 'up')).toBeNull();
    expect(inputOf(fixture).readOnly).toBe(true);
  });

  it('should hide the spinner but keep typing when HideTrigger', async () => {
    const fixture = await render({ HideTrigger: true });

    expect(triggerOf(fixture, 'up')).toBeNull();
    expect(inputOf(fixture).readOnly).toBe(false);
  });

  it('should keep the spinner working when Editable is false', async () => {
    const fixture = await render({ Editable: false });

    expect(inputOf(fixture).readOnly).toBe(true);

    await click(fixture, 'up');
    expect(fixture.componentInstance.value()).toBe('1');
  });

  it('should disable the spinner along with the field', async () => {
    const fixture = await render({ Disabled: true });

    expect(triggerOf(fixture, 'up')?.disabled).toBe(true);
    expect(triggerOf(fixture, 'down')?.disabled).toBe(true);
  });
});
