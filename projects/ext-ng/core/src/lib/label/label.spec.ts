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

  it('should leave Width unset by default', async () => {
    const fixture = TestBed.createComponent(ExtLabel);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).style.width).toBe('');
  });
});
