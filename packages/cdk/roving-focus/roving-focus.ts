import {
  Directive,
  ElementRef,
  InjectionToken,
  Signal,
  WritableSignal,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export type NgxsmkRovingOrientation = 'horizontal' | 'vertical' | 'both';

export interface NgxsmkRovingFocusContext {
  register(item: NgxsmkRovingFocusItem): void;
  unregister(item: NgxsmkRovingFocusItem): void;
  focusNext(current: NgxsmkRovingFocusItem): void;
  focusPrev(current: NgxsmkRovingFocusItem): void;
  focusFirst(): void;
  focusLast(): void;
  activeItem: WritableSignal<NgxsmkRovingFocusItem | null>;
  orientation: () => NgxsmkRovingOrientation;
  loop: () => boolean;
}

export const NGXSMK_ROVING_FOCUS_GROUP = new InjectionToken<NgxsmkRovingFocusContext>(
  'NGXSMK_ROVING_FOCUS_GROUP',
);

/**
 * Universal signals-native Roving Focus container directive.
 * Manages keyboard navigation (Arrow keys, Home, End) across a set of items,
 * keeping only the currently active item focusable via Tab (`tabindex="0"` vs `"-1"`).
 *
 * ```html
 * <div ngxsmkRovingFocusGroup orientation="horizontal" [loop]="true">
 *   <button ngxsmkRovingFocusItem>Tab 1</button>
 *   <button ngxsmkRovingFocusItem>Tab 2</button>
 * </div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkRovingFocusGroup]',
  providers: [
    {
      provide: NGXSMK_ROVING_FOCUS_GROUP,
      useExisting: NgxsmkRovingFocusGroup,
    },
  ],
})
export class NgxsmkRovingFocusGroup implements NgxsmkRovingFocusContext {
  readonly orientation = input<NgxsmkRovingOrientation>('horizontal');
  readonly loop = input(true, { transform: booleanAttribute });

  private readonly items = signal<NgxsmkRovingFocusItem[]>([]);
  readonly activeItem = signal<NgxsmkRovingFocusItem | null>(null);

  register(item: NgxsmkRovingFocusItem): void {
    this.items.update((list) => [...list, item]);
    if (this.activeItem() === null && !item.disabled()) {
      this.activeItem.set(item);
    }
  }

  unregister(item: NgxsmkRovingFocusItem): void {
    this.items.update((list) => list.filter((i) => i !== item));
    if (this.activeItem() === item) {
      const remaining = this.items().filter((i) => !i.disabled());
      this.activeItem.set(remaining.length > 0 ? remaining[0] : null);
    }
  }

  focusNext(current: NgxsmkRovingFocusItem): void {
    const list = this.items().filter((i) => !i.disabled());
    const idx = list.indexOf(current);
    if (idx === -1) return;

    if (idx < list.length - 1) {
      const next = list[idx + 1];
      this.setActiveAndFocus(next);
    } else if (this.loop()) {
      const first = list[0];
      this.setActiveAndFocus(first);
    }
  }

  focusPrev(current: NgxsmkRovingFocusItem): void {
    const list = this.items().filter((i) => !i.disabled());
    const idx = list.indexOf(current);
    if (idx === -1) return;

    if (idx > 0) {
      const prev = list[idx - 1];
      this.setActiveAndFocus(prev);
    } else if (this.loop()) {
      const last = list[list.length - 1];
      this.setActiveAndFocus(last);
    }
  }

  focusFirst(): void {
    const list = this.items().filter((i) => !i.disabled());
    if (list.length > 0) {
      this.setActiveAndFocus(list[0]);
    }
  }

  focusLast(): void {
    const list = this.items().filter((i) => !i.disabled());
    if (list.length > 0) {
      this.setActiveAndFocus(list[list.length - 1]);
    }
  }

  private setActiveAndFocus(item: NgxsmkRovingFocusItem): void {
    this.activeItem.set(item);
    item.focus();
  }
}

/**
 * Item in a Roving Focus group. Binds `[tabindex]` dynamically based on active state.
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkRovingFocusItem]',
  host: {
    '[attr.tabindex]': 'tabIndex()',
    '(keydown)': 'handleKeydown($event)',
    '(focus)': 'handleFocus()',
  },
})
export class NgxsmkRovingFocusItem {
  private readonly group = inject(NGXSMK_ROVING_FOCUS_GROUP);
  private readonly elRef = inject(ElementRef<HTMLElement>);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly focused = output<void>();

  readonly isActive = computed(() => this.group.activeItem() === this);
  readonly tabIndex = computed(() => {
    if (this.disabled()) return -1;
    return this.isActive() ? 0 : -1;
  });

  constructor() {
    this.group.register(this);
  }

  ngOnDestroy(): void {
    this.group.unregister(this);
  }

  focus(): void {
    this.elRef.nativeElement.focus();
  }

  protected handleFocus(): void {
    if (!this.disabled()) {
      this.group.activeItem.set(this);
      this.focused.emit();
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    const orient = this.group.orientation();
    const isHoriz = orient === 'horizontal' || orient === 'both';
    const isVert = orient === 'vertical' || orient === 'both';

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        if ((event.key === 'ArrowRight' && isHoriz) || (event.key === 'ArrowDown' && isVert)) {
          event.preventDefault();
          this.group.focusNext(this);
        }
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        if ((event.key === 'ArrowLeft' && isHoriz) || (event.key === 'ArrowUp' && isVert)) {
          event.preventDefault();
          this.group.focusPrev(this);
        }
        break;

      case 'Home':
        event.preventDefault();
        this.group.focusFirst();
        break;

      case 'End':
        event.preventDefault();
        this.group.focusLast();
        break;
    }
  }
}
