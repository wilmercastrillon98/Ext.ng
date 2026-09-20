import { booleanAttribute, computed, Directive, input, Signal } from '@angular/core';
import { numericAttribute, spacingStyle } from './attributes';

/**
 * Layout and state configuration shared by every Ext.ng component. It is an abstract
 * directive, so the host bindings below reach the host element of each subclass.
 */
@Directive({
  host: {
    '[style.display]': 'Hidden() ? "none" : null',
    '[style.width.px]': 'hostWidth()',
    '[style.height.px]': 'Height()',
    '[style.margin]': 'hostMargin()',
    '[style.padding]': 'hostPadding()',
    '[style.opacity]': 'Disabled() ? 0.5 : null',
  },
})
export abstract class ComponentBase {
  /** Width of the component, in pixels. */
  readonly Width = input<number | undefined, unknown>(undefined, { transform: numericAttribute });
  /** Height of the component, in pixels. */
  readonly Height = input<number | undefined, unknown>(undefined, { transform: numericAttribute });
  /** Margin applied to the four sides, in pixels. */
  readonly Margin = input<number, unknown>(0, {
    transform: (value) => numericAttribute(value) ?? 0,
  });
  /** Top, right, bottom and left margins in pixels, separated by spaces. Wins over `Margin`. */
  readonly MarginSpec = input('');
  /** Padding applied to the four sides, in pixels. */
  readonly Padding = input<number, unknown>(0, {
    transform: (value) => numericAttribute(value) ?? 0,
  });
  /** Top, right, bottom and left padding in pixels, separated by spaces. Wins over `Padding`. */
  readonly PaddingSpec = input('');
  /** Hides the component without leaving any space behind. */
  readonly Hidden = input(false, { transform: booleanAttribute });
  /** Dims the component and stops it from being used. */
  readonly Disabled = input(false, { transform: booleanAttribute });

  /** Override to give a component a default width of its own. */
  protected readonly hostWidth: Signal<number | undefined> = computed(() => this.Width());

  protected readonly hostMargin = computed(() => spacingStyle(this.MarginSpec(), this.Margin()));

  protected readonly hostPadding = computed(() => spacingStyle(this.PaddingSpec(), this.Padding()));
}
