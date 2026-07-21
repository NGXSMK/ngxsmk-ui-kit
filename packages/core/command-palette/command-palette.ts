import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';

export interface CommandItem {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  icon?: string;
}

@Component({
  selector: 'ngxsmk-command-palette',
  standalone: true,
  template: `
    @if (isOpen()) {
      <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
      <div class="ngxsmk-cmd-backdrop" (click)="close()">
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events -->
        <div
          class="ngxsmk-cmd-modal"
          (click)="$event.stopPropagation()"
          role="dialog"
          aria-modal="true"
        >
          <div class="ngxsmk-cmd-search">
            <svg
              class="ngxsmk-cmd-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              #searchInput
              class="ngxsmk-cmd-input"
              type="text"
              [placeholder]="placeholder()"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              aria-label="Search commands"
            />
            <kbd class="ngxsmk-cmd-esc-kbd">ESC</kbd>
          </div>

          <div class="ngxsmk-cmd-list">
            @if (filteredGroups().length === 0) {
              <div class="ngxsmk-cmd-empty">No results found for "{{ searchQuery() }}"</div>
            }

            @for (group of filteredGroups(); track group.category) {
              <div class="ngxsmk-cmd-group">
                <div class="ngxsmk-cmd-group-title">{{ group.category }}</div>

                @for (cmd of group.items; track cmd.id) {
                  <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
                  <div
                    class="ngxsmk-cmd-item"
                    [class.ngxsmk-cmd-item--active]="isActive(cmd)"
                    (click)="selectItem(cmd)"
                    (mouseenter)="setActiveItem(cmd)"
                  >
                    <div class="ngxsmk-cmd-item-left">
                      @if (cmd.icon) {
                        <span class="ngxsmk-cmd-item-icon">{{ cmd.icon }}</span>
                      }
                      <span class="ngxsmk-cmd-item-label">{{ cmd.label }}</span>
                    </div>
                    @if (cmd.shortcut) {
                      <kbd class="ngxsmk-cmd-shortcut">{{ cmd.shortcut }}</kbd>
                    }
                  </div>
                }
              </div>
            }
          </div>

          <div class="ngxsmk-cmd-footer">
            <span class="ngxsmk-cmd-legend">
              <kbd>â†‘â†“</kbd> Navigate &nbsp;&bull;&nbsp; <kbd>â†µ</kbd> Select &nbsp;&bull;&nbsp;
              <kbd>esc</kbd> Close
            </span>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .ngxsmk-cmd-backdrop {
      position: fixed;
      inset: 0;
      z-index: var(--ngxsmk-z-modal, 1400);
      background: var(--ngxsmk-color-backdrop, rgba(9, 9, 11, 0.4));
      backdrop-filter: blur(8px);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 10vh;
      animation: ngxsmk-fade-in 0.15s ease-out;
    }

    .ngxsmk-cmd-modal {
      width: 100%;
      max-width: 540px;
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl, 0.75rem);
      box-shadow: var(--ngxsmk-shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 480px;
      animation: ngxsmk-scale-up 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ngxsmk-cmd-search {
      display: flex;
      align-items: center;
      padding: var(--ngxsmk-space-4, 1rem);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      position: relative;
    }

    .ngxsmk-cmd-search-icon {
      color: var(--ngxsmk-color-on-surface-variant);
      margin-inline-end: var(--ngxsmk-space-3, 0.75rem);
    }

    .ngxsmk-cmd-input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: var(--ngxsmk-text-body-md-size);
      outline: none;
    }

    .ngxsmk-cmd-input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-cmd-esc-kbd {
      font-size: var(--ngxsmk-text-body-xs-size);
      padding: 0.15rem 0.35rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      color: var(--ngxsmk-color-on-surface-variant);
      background: var(--ngxsmk-color-background);
    }

    .ngxsmk-cmd-list {
      flex: 1;
      overflow-y: auto;
      padding: var(--ngxsmk-space-2, 0.5rem);
    }

    .ngxsmk-cmd-empty {
      padding: var(--ngxsmk-space-8, 2rem);
      text-align: center;
      font-size: var(--ngxsmk-text-label-lg-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-cmd-group-title {
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      font-size: var(--ngxsmk-text-label-sm-size);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-cmd-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--ngxsmk-space-2-5, 0.625rem) var(--ngxsmk-space-3, 0.75rem);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      font-size: var(--ngxsmk-text-label-lg-size);
      color: var(--ngxsmk-color-on-surface);
      cursor: pointer;
      transition:
        background 0.1s,
        color 0.1s;
    }

    .ngxsmk-cmd-item--active {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
    }

    .ngxsmk-cmd-item-left {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3, 0.75rem);
    }

    .ngxsmk-cmd-item-icon {
      font-size: var(--ngxsmk-text-body-lg-size);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .ngxsmk-cmd-shortcut {
      font-size: var(--ngxsmk-text-label-sm-size);
      padding: 0.15rem 0.35rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface-variant);
      font-family: var(--ngxsmk-font-mono, monospace);
    }

    .ngxsmk-cmd-item--active .ngxsmk-cmd-shortcut {
      border-color: color-mix(in srgb, var(--ngxsmk-color-on-primary-container) 25%, transparent);
      background: color-mix(in srgb, var(--ngxsmk-color-surface) 55%, transparent);
      color: var(--ngxsmk-color-on-primary-container);
    }

    .ngxsmk-cmd-footer {
      padding: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
      border-top: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-background);
      font-size: var(--ngxsmk-text-label-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-cmd-legend kbd {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      padding: 0.1rem 0.3rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
    }

    @keyframes ngxsmk-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes ngxsmk-scale-up {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCommandPalette {
  readonly commands = input<CommandItem[]>([]);
  readonly triggerKey = input<string>('k');
  readonly placeholder = input('Type a command or search...');

  readonly isOpen = signal(false);
  readonly selected = output<CommandItem>();

  protected readonly searchQuery = signal('');
  protected readonly activeIndex = signal(0);

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        setTimeout(() => {
          this.searchInput?.nativeElement.focus();
        }, 50);
      } else {
        this.searchQuery.set('');
        this.activeIndex.set(0);
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    const isMeta = event.metaKey || event.ctrlKey;
    const key = event.key.toLowerCase();

    // Toggle on Ctrl+K or Cmd+K
    if (isMeta && key === this.triggerKey().toLowerCase()) {
      event.preventDefault();
      this.isOpen.update((open) => !open);
      return;
    }

    if (!this.isOpen()) return;

    // Handle open keyboard navigation
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveActive(-1);
        break;
      case 'Enter':
        event.preventDefault();
        this.triggerActive();
        break;
    }
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  protected onSearchInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.searchQuery.set(inputEl.value);
    this.activeIndex.set(0);
  }

  protected filteredGroups = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const allCmds = this.commands();

    const groupsMap = new Map<string, CommandItem[]>();

    allCmds.forEach((cmd) => {
      if (!q || cmd.label.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q)) {
        const groupList = groupsMap.get(cmd.category) || [];
        groupList.push(cmd);
        groupsMap.set(cmd.category, groupList);
      }
    });

    return Array.from(groupsMap.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  });

  protected flatFilteredItems = computed(() => {
    return this.filteredGroups().reduce<CommandItem[]>((acc, group) => {
      return acc.concat(group.items);
    }, []);
  });

  protected isActive(cmd: CommandItem): boolean {
    const flat = this.flatFilteredItems();
    const idx = this.activeIndex();
    return flat[idx]?.id === cmd.id;
  }

  protected setActiveItem(cmd: CommandItem): void {
    const flat = this.flatFilteredItems();
    const idx = flat.findIndex((item) => item.id === cmd.id);
    if (idx !== -1) {
      this.activeIndex.set(idx);
    }
  }

  protected selectItem(cmd: CommandItem): void {
    this.selected.emit(cmd);
    this.close();
  }

  private moveActive(delta: number): void {
    const flat = this.flatFilteredItems();
    if (flat.length === 0) return;
    this.activeIndex.update((curr) => {
      const next = curr + delta;
      if (next < 0) return flat.length - 1;
      if (next >= flat.length) return 0;
      return next;
    });
  }

  private triggerActive(): void {
    const flat = this.flatFilteredItems();
    const idx = this.activeIndex();
    const activeCmd = flat[idx];
    if (activeCmd) {
      this.selectItem(activeCmd);
    }
  }
}
