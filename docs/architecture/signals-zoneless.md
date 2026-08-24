# Signals-Native & Zoneless Architecture in NGXSMK

> **Pillar**: Zero `zone.js` runtime assumptions, 100% fine-grained signal reactivity, minimal bundle sizes.

---

## 1. The Signals Paradigm

Every NGXSMK component is built exclusively using Angular's Signal primitives:

- **Inputs**: `input()` and `input.required()` replace legacy `@Input()` decorators.
- **Two-Way Models**: `model()` replaces manual `@Input()` + `@Output()` pairs.
- **Outputs**: `output()` replaces `EventEmitter`.
- **Derived State**: `computed()` derives state without manual RxJS subscriptions or event listeners.

```ts
import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'ngxsmk-counter',
  standalone: true,
  template: `
    <button (click)="decrement()">-</button>
    <span>{{ value() }} (Double: {{ doubleValue() }})</span>
    <button (click)="increment()">+</button>
  `,
})
export class NgxsmkCounter {
  readonly value = model(0);
  readonly step = input(1);
  readonly doubleValue = computed(() => this.value() * 2);
  readonly valueChanged = output<number>();

  increment() {
    this.value.update((v) => v + this.step());
    this.valueChanged.emit(this.value());
  }

  decrement() {
    this.value.update((v) => v - this.step());
    this.valueChanged.emit(this.value());
  }
}
```

---

## 2. Zoneless Compatibility

In traditional Angular, `zone.js` monkey-patches all browser asynchronous APIs (timers, microtasks, event listeners) and triggers dirty checks on the entire component tree.

In NGXSMK:
1. Components never rely on zone ticks.
2. Signal notifications directly mark the view dirty.
3. Over 248 FESM bundles contain **0 references to `zone.js`**.
4. Achieves over **150 Million signal mutations per second** in benchmark testing.

---

## 3. Server-Side Rendering (SSR) & Hydration

All NGXSMK components are built with SSR safety in mind:
- DOM operations (such as `window.matchMedia` or `document.activeElement`) check platform availability using `DOCUMENT` injection.
- Zero hydration mismatch flashes when bootstrapping server-rendered HTML shells.
