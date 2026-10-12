import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtCheckbox } from './checkbox';

async function render(
  inputs: Record<string, unknown> = {},
): Promise<ComponentFixture<ExtCheckbox>> {
  const fixture = TestBed.createComponent(ExtCheckbox);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();

  return fixture;
}

function hostOf(fixture: ComponentFixture<ExtCheckbox>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

function boxOf(fixture: ComponentFixture<ExtCheckbox>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

function fieldLabelOf(fixture: ComponentFixture<ExtCheckbox>): HTMLLabelElement | null {
  return fixture.nativeElement.querySelector('.ext-field__label');
}

function boxLabelOf(fixture: ComponentFixture<ExtCheckbox>): HTMLLabelElement | null {
  return fixture.nativeElement.querySelector('.ext-checkbox__box-label');
}

describe('ExtCheckbox', () => {
  it('should be unchecked, with no labels and no fixed width by default', async () => {
    const fixture = await render();

    expect(boxOf(fixture).checked).toBe(false);
    expect(fixture.componentInstance.checked()).toBe(false);
    expect(fieldLabelOf(fixture)).toBeNull();
    expect(boxLabelOf(fixture)).toBeNull();
    expect(hostOf(fixture).style.width).toBe('');
  });

  it('should start checked when Checked is set', async () => {
    const fixture = await render({ Checked: 'true' });

    expect(boxOf(fixture).checked).toBe(true);
    expect(fixture.componentInstance.checked()).toBe(true);
  });

  it('should not read a static Checked="false" as checked', async () => {
    expect(boxOf(await render({ Checked: 'false' })).checked).toBe(false);
  });

  it('should toggle checked when the box is clicked', async () => {
    const fixture = await render();

    boxOf(fixture).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.checked()).toBe(true);

    boxOf(fixture).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.checked()).toBe(false);
  });

  it('should follow a later change of Checked', async () => {
    const fixture = await render();

    fixture.componentRef.setInput('Checked', true);
    await fixture.whenStable();

    expect(boxOf(fixture).checked).toBe(true);
  });

  it('should not toggle while ReadOnly', async () => {
    const fixture = await render({ ReadOnly: true });

    boxOf(fixture).click();
    await fixture.whenStable();

    expect(boxOf(fixture).checked).toBe(false);
    expect(fixture.componentInstance.checked()).toBe(false);
  });

  it('should disable the box', async () => {
    expect(boxOf(await render({ Disabled: true })).disabled).toBe(true);
  });

  it('should show BoxLabel apart from FieldLabel', async () => {
    const fixture = await render({ FieldLabel: 'Terms', BoxLabel: 'I accept' });

    expect(fieldLabelOf(fixture)?.textContent?.trim()).toBe('Terms');
    expect(fieldLabelOf(fixture)?.style.width).toBe('100px');
    expect(boxLabelOf(fixture)?.textContent?.trim()).toBe('I accept');
  });

  it('should put BoxLabel before the box when BoxLabelAlign is Before', async () => {
    const after = await render({ BoxLabel: 'I accept' });
    expect(after.nativeElement.querySelector('.ext-checkbox__body--before')).toBeNull();

    const before = await render({ BoxLabel: 'I accept', BoxLabelAlign: 'Before' });
    expect(before.nativeElement.querySelector('.ext-checkbox__body--before')).not.toBeNull();
  });

  it('should toggle when BoxLabel is clicked', async () => {
    const fixture = await render({ BoxLabel: 'I accept' });

    boxLabelOf(fixture)?.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.checked()).toBe(true);
  });

  it('should keep the requested Width and Height', async () => {
    const fixture = await render({ FieldLabel: 'Terms', Width: '300', Height: 40 });

    expect(hostOf(fixture).style.width).toBe('300px');
    expect(hostOf(fixture).style.height).toBe('40px');
  });
});
