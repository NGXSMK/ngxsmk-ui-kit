import { Directive, inject, ElementRef, output, HostListener } from '@angular/core';

@Directive({
  selector: '[ngxsmkClickOutside]',
})
export class NgxsmkClickOutside {
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly ngxsmkClickOutside = output<void>();

  @HostListener('document:click', ['$event'])
  protected onClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target as Node)) {
      this.ngxsmkClickOutside.emit();
    }
  }
}
