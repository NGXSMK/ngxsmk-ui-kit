import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-section',
  template: `
    @if (title()) {
      <h2 class="ngxsmk-section__title">{{ title() }}</h2>
    }
    <div class="ngxsmk-section__content"><ng-content /></div>
  `,
  host: { class: 'ngxsmk-section' },
  styles: `
    :host { display: block; font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-section__title { margin: 0 0 var(--ngxsmk-space-4); font-size: var(--ngxsmk-text-headline-sm-size); font-weight: 600; line-height: var(--ngxsmk-text-headline-sm-line); color: var(--ngxsmk-color-on-surface); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSection {
  readonly title = input('');
}
