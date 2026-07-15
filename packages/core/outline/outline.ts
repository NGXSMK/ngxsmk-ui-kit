import { 
  ChangeDetectionStrategy, 
  Component, 
  input, 
  model, 
  OnInit, 
  OnDestroy,
  inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  standalone: true,
  selector: 'ngxsmk-outline',
  template: `
    <nav class="ngxsmk-outline__nav" aria-label="Page outline">
      @for (item of items(); track item.id) {
        <a
          class="ngxsmk-outline__link"
          [class.ngxsmk-outline__link--active]="item.id === activeId()"
          [href]="'#' + item.id"
          (click)="onLinkClick($event, item.id)"
          [style.paddingLeft.px]="item.depth * 16 + 16"
        >
          {{ item.label }}
        </a>
      }
    </nav>
  `,
  host: { class: 'ngxsmk-outline' },
  styles: `
    :host { display: block; font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-outline__nav { display: flex; flex-direction: column; gap: var(--ngxsmk-space-1); }
    .ngxsmk-outline__link {
      display: block;
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
      color: var(--ngxsmk-color-on-surface-variant);
      text-decoration: none;
      border-radius: var(--ngxsmk-radius-sm);
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out), color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
      border-left: 2px solid transparent;
    }
    .ngxsmk-outline__link:hover { background: var(--ngxsmk-color-surface-hover); color: var(--ngxsmk-color-on-surface); }
    .ngxsmk-outline__link--active { color: var(--ngxsmk-color-primary); border-left-color: var(--ngxsmk-color-primary); font-weight: 500; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkOutline implements OnInit, OnDestroy {
  readonly items = input.required<OutlineItem[]>();
  readonly activeId = model('');

  private readonly document = inject(DOCUMENT);
  private destroyFn?: () => void;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const onScroll = () => {
      const items = this.items();
      if (items.length === 0) return;

      let active = items[0].id;
      for (const item of items) {
        const el = this.document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            active = item.id;
          }
        }
      }
      if (this.activeId() !== active) {
        this.activeId.set(active);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.destroyFn = () => window.removeEventListener('scroll', onScroll);
  }

  ngOnDestroy(): void {
    if (this.destroyFn) {
      this.destroyFn();
    }
  }

  protected onLinkClick(event: MouseEvent, id: string): void {
    event.preventDefault();
    this.activeId.set(id);
    if (typeof window !== 'undefined') {
      history.pushState(
        null,
        '',
        window.location.pathname + window.location.search + `#${id}`
      );
    }
    const el = this.document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

export interface OutlineItem {
  id: string;
  label: string;
  depth: number;
}
