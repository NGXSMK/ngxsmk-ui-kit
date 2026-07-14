import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

/**
 * Isolated showcase for `ngxsmk-tel-input`.
 *
 * `ngxsmk-tel-input@1.8.4` was published for older Angular versions, so its
 * prebuilt component inputs are not statically resolvable by the Angular 22
 * template type checker (NG8002). The component itself works correctly at
 * runtime. `NO_ERRORS_SCHEMA` is scoped to THIS tiny component only, so the
 * rest of the demo stays strictly type-checked.
 *
 * The tel-input component and its heavy transitive peers (`intl-tel-input`,
 * `libphonenumber-js`, `@angular/material`) are loaded lazily via `@defer`
 * so they stay out of the main `forms` route chunk.
 */
@Component({
  selector: 'tel-input-showcase',
  standalone: true,
  imports: [FormsModule],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    @defer (on viewport) {
      <div class="ngxsmk-sc-col" style="width: 100%; max-width: 360px">
        <ngxsmk-tel-input
          [ngModel]="phone()"
          (ngModelChange)="phone.set($event)"
          label="Phone"
          hint="Include area code"
          [initialCountry]="'US'"
          [separateDialCode]="true"
        />
        <small>Value (E.164): {{ phone() || '—' }}</small>
      </div>
    } @placeholder (minimum 200ms) {
      <div class="ngxsmk-sc-col" style="width: 100%; max-width: 360px; min-height: 56px"></div>
    }
  `,
})
export class TelInputShowcase {
  phone = signal<string | null>(null);
}
