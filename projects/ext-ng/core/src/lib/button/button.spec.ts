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

  it('should take no space when hidden', async () => {
    const fixture = TestBed.createComponent(ExtButton);
    fixture.componentRef.setInput('Hidden', true);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.display).toBe('none');
  });

  it('should treat the string "false" as not hidden', async () => {
    const fixture = TestBed.createComponent(ExtButton);
    fixture.componentRef.setInput('Hidden', 'false');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.display).toBe('');
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
