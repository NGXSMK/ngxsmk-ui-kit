import {
  Directive,
  InjectionToken,
  inject,
  input,
  TemplateRef,
} from '@angular/core';

export interface NgxsmkLinkContext {
  href: string;
  label: string;
}

export const NGXSMK_LINK_PROVIDER = new InjectionToken<TemplateRef<NgxsmkLinkContext>>(
  'NgxsmkLinkProvider template',
);

@Directive({
  standalone: true,
  selector: '[ngxsmkLinkProvider]',
})
export class NgxsmkLinkProvider {
  readonly ngxsmkLinkProvider = input<TemplateRef<NgxsmkLinkContext>>();

  constructor() {
    const ref = this.ngxsmkLinkProvider();
    if (ref) {
      inject(NGXSMK_LINK_PROVIDER, { optional: true });
    }
  }
}
