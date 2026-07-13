import { Directive } from '@angular/core';

@Directive({
  selector: '[ngxsmkVisuallyHidden]',
  host: {
    '[style.position]': '"absolute"',
    '[style.width]': '"1px"',
    '[style.height]': '"1px"',
    '[style.padding]': '"0"',
    '[style.margin]': '"-1px"',
    '[style.overflow]': '"hidden"',
    '[style.clip]': '"rect(0,0,0,0)"',
    '[style.white-space]': '"nowrap"',
    '[style.border]': '"0"',
  },
})
export class NgxsmkVisuallyHidden {}
