import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import qrcode from 'qrcode-generator';

@Component({
  standalone: true,
  selector: 'ngxsmk-qr-code',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.viewBox]="viewBox()"
      [style.background]="background()"
      class="ngxsmk-qr-code__svg"
    >
      <path [attr.d]="svgPath()" [attr.fill]="color()" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      line-height: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkQrCode {
  readonly value = input.required<string>();
  readonly size = input<number>(128);
  readonly level = input<'L' | 'M' | 'Q' | 'H'>('M');
  readonly color = input<string>('currentColor');
  readonly background = input<string>('transparent');

  private readonly qr = computed(() => {
    const qrObj = qrcode(0, this.level());
    qrObj.addData(this.value());
    qrObj.make();
    return qrObj;
  });

  protected readonly viewBox = computed(() => {
    const count = this.qr().getModuleCount();
    return `0 0 ${count} ${count}`;
  });

  protected readonly svgPath = computed(() => {
    const qrObj = this.qr();
    const count = qrObj.getModuleCount();
    let path = '';

    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qrObj.isDark(row, col)) {
          path += `M${col},${row}h1v1h-1z `;
        }
      }
    }
    return path;
  });
}
