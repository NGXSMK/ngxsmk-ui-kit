import { Directive } from '@angular/core';

@Directive({
  selector: '[ngxsmkInputGroupText], ngxsmk-input-group-text',
  host: { class: 'ngxsmk-input-group-text' },
})
export class NgxsmkInputGroupText {}
