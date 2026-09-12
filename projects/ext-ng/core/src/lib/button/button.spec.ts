import { TestBed } from '@angular/core/testing';
import { ExtButton } from './button';

describe('ExtButton', () => {
  it('should render the text and the ui variant', async () => {
    const fixture = TestBed.createComponent(ExtButton);
    fixture.componentRef.setInput('text', 'Submit');
    fixture.componentRef.setInput('ui', 'primary');
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('Submit');
    expect(button.classList).toContain('ext-button--primary');
  });
});
