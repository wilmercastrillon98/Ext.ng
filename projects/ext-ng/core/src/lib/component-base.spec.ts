import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ExtButton } from './button/button';
import { ComponentBase } from './component-base';
import { ExtLabel } from './label/label';
import { ExtTextField } from './text-field/text-field';

const components: [string, Type<ComponentBase>][] = [
  ['ExtButton', ExtButton],
  ['ExtLabel', ExtLabel],
  ['ExtTextField', ExtTextField],
];

describe.each(components)('ComponentBase on %s', (_name, component) => {
  async function render(inputs: Record<string, unknown>): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(component);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await fixture.whenStable();

    return fixture.nativeElement as HTMLElement;
  }

  it('should apply Width and Height in pixels', async () => {
    const host = await render({ Width: '200', Height: 40 });

    expect(host.style.width).toBe('200px');
    expect(host.style.height).toBe('40px');
  });

  it('should default to no margin, visible and enabled', async () => {
    const host = await render({});

    expect(host.style.height).toBe('');
    expect(host.style.margin).toBe('0px');
    expect(host.style.display).toBe('');
    expect(host.style.opacity).toBe('');
  });

  it('should apply Margin to the four sides', async () => {
    expect((await render({ Margin: '8' })).style.margin).toBe('8px');
  });

  it('should apply MarginSpec as top right bottom left', async () => {
    expect((await render({ MarginSpec: '1 2 3 4' })).style.margin).toBe('1px 2px 3px 4px');
  });

  it('should let MarginSpec win over Margin', async () => {
    // The browser collapses four equal sides into the `5px` shorthand.
    expect((await render({ Margin: 8, MarginSpec: '5 5 5 5' })).style.margin).toBe('5px');
  });

  it('should ignore a MarginSpec that is not numeric', async () => {
    expect((await render({ Margin: 8, MarginSpec: 'auto auto' })).style.margin).toBe('8px');
  });

  it('should fall back to no margin when Margin is not numeric', async () => {
    expect((await render({ Margin: 'auto' })).style.margin).toBe('0px');
  });

  it('should take no space when hidden', async () => {
    expect((await render({ Hidden: true })).style.display).toBe('none');
  });

  it('should treat the string "false" as not hidden', async () => {
    expect((await render({ Hidden: 'false' })).style.display).toBe('');
  });

  it('should dim the component when disabled', async () => {
    expect((await render({ Disabled: true })).style.opacity).toBe('0.5');
  });
});
