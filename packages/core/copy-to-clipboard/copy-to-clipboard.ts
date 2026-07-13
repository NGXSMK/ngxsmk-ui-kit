import { Directive, input, output, HostListener } from '@angular/core';

@Directive({
  selector: '[ngxsmkCopyToClipboard]',
})
export class NgxsmkCopyToClipboard {
  readonly ngxsmkCopyToClipboard = input<string>('');
  readonly copied = output<void>();

  @HostListener('click')
  protected copy(): void {
    const text = this.ngxsmkCopyToClipboard();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => this.copied.emit());
  }
}
