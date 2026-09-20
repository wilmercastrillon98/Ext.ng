import { TestBed } from '@angular/core/testing';
import { ExtButton } from './button';

describe('ExtButton', () => {
  it('should render the text and the ui variant', async () => {
    const fixture = TestBed.createComponent(ExtButton);
    fixture.componentRef.setInput('Text', 'Ingresar');
    fixture.componentRef.setInput('UI', 'Success');
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('Ingresar');
    expect(button.classList).toContain('ext-button--success');
  });

  it('should default to the Default variant', async () => {
    const fixture = TestBed.createComponent(ExtButton);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList).toContain('ext-button--default');
  });

  it('should leave Width unset by default', async () => {
    const fixture = TestBed.createComponent(ExtButton);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.width).toBe('');
  });

  it('should disable the native button', async () => {
    const fixture = TestBed.createComponent(ExtButton);
    fixture.componentRef.setInput('Disabled', true);
    await fixture.whenStable();

    expect((fixture.nativeElement.querySelector('button') as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('should not invoke the handler while disabled', async () => {
    const fixture = TestBed.createComponent(ExtButton);
    let clicks = 0;
    fixture.componentRef.setInput('Handler', () => clicks++);
    fixture.componentRef.setInput('Disabled', true);
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    expect(clicks).toBe(0);
  });

  it('should invoke the handler on click', async () => {
    const fixture = TestBed.createComponent(ExtButton);
    let clicks = 0;
    fixture.componentRef.setInput('Handler', () => clicks++);
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    expect(clicks).toBe(1);
  });

  it('should not fail when clicked without a handler', async () => {
    const fixture = TestBed.createComponent(ExtButton);
    await fixture.whenStable();

    expect(() =>
      (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click(),
    ).not.toThrow();
  });
});
