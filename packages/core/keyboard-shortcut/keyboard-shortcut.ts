import { Directive, input, output, HostListener } from '@angular/core';

@Directive({
  selector: '[ngxsmkKeyboardShortcut]',
})
export class NgxsmkKeyboardShortcut {
  readonly ngxsmkKeyboardShortcut = input<string>('');
  readonly shortcutPressed = output<void>();

  @HostListener('document:keydown', ['$event'])
  protected onKey(e: KeyboardEvent): void {
    const shortcut = this.ngxsmkKeyboardShortcut();
    if (!shortcut) return;
    const parts = shortcut.toLowerCase().split('+');
    const hasCtrl = parts.includes('ctrl');
    const hasShift = parts.includes('shift');
    const hasAlt = parts.includes('alt');
    const key = parts.find(p => !['ctrl', 'shift', 'alt', 'meta'].includes(p));
    if (
      e.ctrlKey === hasCtrl && e.shiftKey === hasShift && e.altKey === hasAlt &&
      key && e.key.toLowerCase() === key
    ) {
      e.preventDefault();
      this.shortcutPressed.emit();
    }
  }
}
