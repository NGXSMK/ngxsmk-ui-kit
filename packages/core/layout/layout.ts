import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-layout',
  template: `<ng-content />`,
  host: { class: 'ngxsmk-layout' },
  styles: `
    :host {
      display: grid;
      grid-template-rows: auto 1fr auto;
      min-height: 100vh;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkLayout {}

@Directive({
  standalone: true,
  selector: 'ngxsmk-layout-header, [ngxsmkLayoutHeader]',
  host: { class: 'ngxsmk-layout-header' },
})
export class NgxsmkLayoutHeader {}

@Directive({
  standalone: true,
  selector: 'ngxsmk-layout-content, [ngxsmkLayoutContent]',
  host: { class: 'ngxsmk-layout-content' },
})
export class NgxsmkLayoutContent {}

@Directive({
  standalone: true,
  selector: 'ngxsmk-layout-footer, [ngxsmkLayoutFooter]',
  host: { class: 'ngxsmk-layout-footer' },
})
export class NgxsmkLayoutFooter {}

@Directive({
  standalone: true,
  selector: 'ngxsmk-layout-panel, [ngxsmkLayoutPanel]',
  host: { class: 'ngxsmk-layout-panel' },
})
export class NgxsmkLayoutPanel {}
