import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EmbeddedViewRef,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  Renderer2,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-multi-selector',
  template: `
    <div
      #triggerEl
      class="ngxsmk-multi-selector__trigger"
      (click)="toggleOpen()"
      role="button"
      tabindex="0"
      (keydown.enter)="toggleOpen()"
      (keydown.space)="toggleOpen(); $event.preventDefault()"
    >
      <span class="ngxsmk-multi-selector__label">
        @if (selectedCount() === 0) {
          {{ placeholder() }}
        } @else {
          {{ selectedCount() }} selected
        }
      </span>
      <svg
        class="ngxsmk-multi-selector__chevron"
        [class.ngxsmk-multi-selector__chevron--open]="isOpen()"
        viewBox="0 0 16 16"
        width="12"
        height="12"
      >
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <ng-template #dropdownTpl>
      <div class="ngxsmk-multi-selector__dropdown">
        @for (opt of options(); track opt.value) {
          <label class="ngxsmk-multi-selector__option">
            <input
              type="checkbox"
              [checked]="isSelected(opt.value)"
              [disabled]="disabled()"
              (change)="toggleOption(opt.value)"
            />
            <span class="ngxsmk-multi-selector__option-label">{{ opt.label }}</span>
          </label>
        }
      </div>
    </ng-template>
  `,
  host: {
    class: 'ngxsmk-multi-selector',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '(document:click)': 'onClickOutside($event)',
  },
  styles: `
    :host {
      display: inline-block;
      position: relative;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface);
      user-select: none;
    }
    .ngxsmk-multi-selector__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-base);
      background: var(--ngxsmk-color-surface);
      cursor: pointer;
      min-width: 10rem;
      transition: border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-multi-selector__trigger:hover {
      border-color: var(--ngxsmk-color-outline);
    }
    :host([data-disabled]) .ngxsmk-multi-selector__trigger {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .ngxsmk-multi-selector__label {
      flex: 1;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-multi-selector__chevron {
      transition: transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-multi-selector__chevron--open {
      transform: rotate(180deg);
    }
    /* Rendered in a body-level portal (position: fixed) so it escapes
       overflow:hidden / transform ancestors and stacks above page content. */
    .ngxsmk-multi-selector__dropdown {
      position: fixed;
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      box-shadow: var(--ngxsmk-shadow-md);
      z-index: var(--ngxsmk-z-popover, 1500);
      max-height: 15rem;
      overflow-y: auto;
    }
    .ngxsmk-multi-selector__option {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      cursor: pointer;
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-multi-selector__option:hover {
      background: var(--ngxsmk-color-surface-variant);
    }
    .ngxsmk-multi-selector__option-label {
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMultiSelector implements OnDestroy {
  @ViewChild('triggerEl') private triggerEl!: ElementRef<HTMLElement>;
  @ViewChild('dropdownTpl') private dropdownTpl!: TemplateRef<unknown>;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly vcr = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);

  readonly options = input.required<{ value: string; label: string }[]>();
  readonly value = model<string[]>([]);
  readonly placeholder = input('Select...');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly changed = output<string[]>();

  protected readonly isOpen = signal(false);
  protected readonly selectedCount = computed(() => this.value().length);

  protected isSelected(val: string): boolean {
    return this.value().includes(val);
  }

  protected toggleOption(val: string): void {
    const current = this.value();
    if (current.includes(val)) {
      this.value.set(current.filter(v => v !== val));
    } else {
      this.value.set([...current, val]);
    }
    this.changed.emit(this.value());
  }

  protected toggleOpen(): void {
    if (this.disabled()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  private open(): void {
    if (this.dropdownView) return;
    this.isOpen.set(true);
    this.dropdownView = this.vcr.createEmbeddedView(this.dropdownTpl);
    this.dropdownView.detectChanges();
    const node = (this.dropdownView.rootNodes.find(
      (n) => n.nodeType === 1,
    ) as HTMLElement | undefined) ?? null;
    if (!node) {
      this.dropdownView.destroy();
      this.dropdownView = null;
      this.isOpen.set(false);
      return;
    }
    this.dropdownNode = node;
    this.renderer.appendChild(document.body, node);
    this.position();
    window.addEventListener('scroll', this.position, true);
    window.addEventListener('resize', this.position);
  }

  private close(): void {
    window.removeEventListener('scroll', this.position, true);
    window.removeEventListener('resize', this.position);
    if (this.dropdownView) {
      this.dropdownView.destroy();
      this.dropdownView = null;
    }
    this.dropdownNode = null;
    if (this.isOpen()) this.isOpen.set(false);
  }

  private readonly position = (): void => {
    if (!this.dropdownNode || !this.triggerEl) return;
    const r = this.triggerEl.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.dropdownNode, 'top', `${r.bottom + 4}px`);
    this.renderer.setStyle(this.dropdownNode, 'left', `${r.left}px`);
    this.renderer.setStyle(this.dropdownNode, 'width', `${r.width}px`);
  };

  protected onClickOutside(event: Event): void {
    if (!this.isOpen()) return;
    const target = event.target as Node;
    if (this.host.nativeElement.contains(target)) return;
    if (this.dropdownNode?.contains(target)) return;
    this.close();
  }

  ngOnDestroy(): void {
    this.close();
  }

  private dropdownView: EmbeddedViewRef<unknown> | null = null;
  private dropdownNode: HTMLElement | null = null;
}
