import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

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
  private readonly templateRef = inject<TemplateRef<NgxsmkLetContext<T>>>(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const value = this.ngxsmkLet();
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef, {
        $implicit: value,
        ngxsmkLet: value,
      });
    });
  }

  static ngTemplateContextGuard<T>(_dir: NgxsmkLet<T>, _ctx: unknown): _ctx is NgxsmkLetContext<T> {
    return true;
  }
}
