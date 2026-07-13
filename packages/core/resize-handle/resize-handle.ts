import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ngxsmk-resize-handle',
  template: `
    <div
      class="ngxsmk-resize-handle__track"
      [style.cursor]="orientation() === 'horizontal' ? 'col-resize' : 'row-resize'"
      (mousedown)="onMouseDown($event)"
      role="separator"
      [attr.aria-orientation]="orientation()"
      [attr.aria-label]="'Resize'"
    >
      <div class="ngxsmk-resize-handle__knob"></div>
    </div>
  `,
  host: { class: 'ngxsmk-resize-handle', '[attr.data-orientation]': 'orientation()' },
  styles: `
    :host { display: flex; flex-shrink: 0; }
    :host([data-orientation='horizontal']) { width: 0.5rem; cursor: col-resize; }
    :host([data-orientation='vertical']) { height: 0.5rem; cursor: row-resize; }
    .ngxsmk-resize-handle__track { display: flex; align-items: center; justify-content: center; flex: 1; }
    :host([data-orientation='horizontal']) .ngxsmk-resize-handle__track { flex-direction: column; }
    .ngxsmk-resize-handle__knob { background: var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-full); }
    :host([data-orientation='horizontal']) .ngxsmk-resize-handle__knob { width: 0.25rem; height: 2rem; }
    :host([data-orientation='vertical']) .ngxsmk-resize-handle__knob { width: 2rem; height: 0.25rem; }
    :host(:hover) .ngxsmk-resize-handle__knob { background: var(--ngxsmk-color-primary); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkResizeHandle {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly resizing = output<MouseEvent>();

  protected onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.resizing.emit(event);
  }
}
