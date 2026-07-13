import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ngxsmk-empty-state',
  template: `
    <div class="ngxsmk-empty-state__wrapper">
      @if (icon()) {
        <div class="ngxsmk-empty-state__icon" [innerHTML]="icon()"></div>
      }
      @if (title()) {
        <h3 class="ngxsmk-empty-state__title">{{ title() }}</h3>
      }
      @if (description()) {
        <p class="ngxsmk-empty-state__description">{{ description() }}</p>
      }
      <div class="ngxsmk-empty-state__actions"><ng-content /></div>
    </div>
  `,
  host: { class: 'ngxsmk-empty-state' },
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--ngxsmk-space-12) var(--ngxsmk-space-6);
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-empty-state__wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 24rem;
    }

    .ngxsmk-empty-state__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      margin-bottom: var(--ngxsmk-space-4);
      color: var(--ngxsmk-color-on-surface-variant);
      opacity: 0.5;
    }

    .ngxsmk-empty-state__title {
      margin: 0 0 var(--ngxsmk-space-2);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: var(--ngxsmk-text-headline-sm-weight);
      line-height: var(--ngxsmk-text-headline-sm-line);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-empty-state__description {
      margin: 0 0 var(--ngxsmk-space-4);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-empty-state__actions {
      display: flex;
      gap: var(--ngxsmk-space-2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkEmptyState {
  readonly icon = input('');
  readonly title = input('');
  readonly description = input('');
}
