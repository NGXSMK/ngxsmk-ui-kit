import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxsmkLayerProvider], ngxsmk-layer-provider',
})
export class NgxsmkLayerProvider {
  // Provides portal/z-index layer context
}
