import {
  Directive,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface NgxsmkRxLetContext<T> {
  $implicit: T;
  ngxsmkRxLet: T;
  $error: unknown;
  $complete: boolean;
}

@Directive({
  selector: '[ngxsmkRxLet]',
  standalone: true,
})
export class NgxsmkRxLet<T> {
  readonly ngxsmkRxLet = input.required<Observable<T>>();

  private readonly value = signal<T | undefined>(undefined);
  private readonly error = signal<unknown>(undefined);
  private readonly complete = signal(false);
  private readonly templateRef = inject<TemplateRef<NgxsmkRxLetContext<T>>>(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  constructor() {
    const destroyRef = inject(DestroyRef);

    effect((onCleanup) => {
      const obs = this.ngxsmkRxLet();
      this.value.set(undefined);
      this.error.set(undefined);
      this.complete.set(false);
      const sub = obs.pipe(takeUntilDestroyed(destroyRef)).subscribe({
        next: (v: T) => this.value.set(v),
        error: (e: unknown) => this.error.set(e),
        complete: () => this.complete.set(true),
      });
      onCleanup(() => sub.unsubscribe());
    });

    effect(() => {
      const v = this.value();
      this.viewContainer.clear();
      if (v !== undefined) {
        this.viewContainer.createEmbeddedView(this.templateRef, {
          $implicit: v,
          ngxsmkRxLet: v,
          $error: this.error(),
          $complete: this.complete(),
        });
      }
    });
  }

  static ngTemplateContextGuard<T>(
    _dir: NgxsmkRxLet<T>,
    _ctx: unknown,
  ): _ctx is NgxsmkRxLetContext<T> {
    return true;
  }
}
