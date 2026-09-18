import { TestBed } from '@angular/core/testing';
import { ExtLabel } from './label';

describe('ExtLabel', () => {
  it('should render the text', async () => {
    const fixture = TestBed.createComponent(ExtLabel);
    fixture.componentRef.setInput('Text', 'Mova web 1');
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    expect(label.textContent?.trim()).toBe('Mova web 1');
  });

  it('should apply Width and Height in pixels', async () => {
    const fixture = TestBed.createComponent(ExtLabel);
    fixture.componentRef.setInput('Width', '200');
    fixture.componentRef.setInput('Height', 40);
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.width).toBe('200px');
    expect(host.style.height).toBe('40px');
  });

  it('should leave Width and Height unset by default', async () => {
    const fixture = TestBed.createComponent(ExtLabel);
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.width).toBe('');
    expect(host.style.height).toBe('');
  });

  it('should apply Margin to the four sides', async () => {
    const fixture = TestBed.createComponent(ExtLabel);
    fixture.componentRef.setInput('Margin', '8');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.margin).toBe('8px');
  });

  it('should apply MarginSpec as top right bottom left', async () => {
    const fixture = TestBed.createComponent(ExtLabel);
    fixture.componentRef.setInput('MarginSpec', '1 2 3 4');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.margin).toBe('1px 2px 3px 4px');
  });

  it('should let MarginSpec win over Margin', async () => {
    const fixture = TestBed.createComponent(ExtLabel);
    fixture.componentRef.setInput('Margin', 8);
    fixture.componentRef.setInput('MarginSpec', '5 5 5 5');
    await fixture.whenStable();

    // The browser collapses four equal sides into the `5px` shorthand.
    expect((fixture.nativeElement as HTMLElement).style.margin).toBe('5px');
  });

  it('should ignore a MarginSpec that is not numeric', async () => {
    const fixture = TestBed.createComponent(ExtLabel);
    fixture.componentRef.setInput('Margin', 8);
    fixture.componentRef.setInput('MarginSpec', 'auto auto');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.margin).toBe('8px');
  });

  it('should take no space when hidden', async () => {
    const fixture = TestBed.createComponent(ExtLabel);
    fixture.componentRef.setInput('Hidden', true);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.display).toBe('none');
  });

  it('should treat the string "false" as not hidden', async () => {
    const fixture = TestBed.createComponent(ExtLabel);
    fixture.componentRef.setInput('Hidden', 'false');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.display).toBe('');
  });
});
