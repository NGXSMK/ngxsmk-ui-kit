import { Directive, input, TemplateRef, ViewContainerRef, effect } from '@angular/core';

export interface NgxsmkLetContext<T> {
  $implicit: T;
  ngxsmkLet: T;
}

@Directive({
  selector: '[ngxsmkLet]',
  standalone: true,
})
export class NgxsmkLet<T> {
  readonly ngxsmkLet = input.required<T>();

  constructor(
    private templateRef: TemplateRef<NgxsmkLetContext<T>>,
    private viewContainer: ViewContainerRef,
  ) {
    effect(() => {
      const value = this.ngxsmkLet();
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef, {
        $implicit: value,
        ngxsmkLet: value,
      });
    });
  }

  static ngTemplateContextGuard<T>(_dir: NgxsmkLet<T>, ctx: unknown): ctx is NgxsmkLetContext<T> {
    return true;
  }
}
