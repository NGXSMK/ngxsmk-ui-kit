import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';

/**
 * Real-time password strength entropy meter and requirement checklist.
 *
 * ```html
 * <ngxsmk-password-strength-meter [password]="userPassword" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-password-strength-meter',
  template: `
    <div class="ngxsmk-pass-meter">
      <!-- PROGRESS BARS -->
      <div class="ngxsmk-pass-meter__bars">
        @for (seg of segments(); track $index) {
          <div
            class="ngxsmk-pass-meter__bar"
            [style.background]="
              $index <= score() ? statusColor() : 'var(--ngxsmk-color-surface-variant)'
            "
          ></div>
        }
      </div>

      <!-- STATUS TEXT -->
      <div class="ngxsmk-pass-meter__header">
        <span class="ngxsmk-pass-meter__label" [style.color]="statusColor()">
          {{ statusLabel() }}
        </span>
      </div>

      <!-- REQUIREMENTS CHECKLIST -->
      @if (showRequirements()) {
        <ul class="ngxsmk-pass-meter__checklist">
          <li [class.ngxsmk-pass-meter__req--valid]="reqs().length">
            <span class="ngxsmk-pass-meter__icon">{{ reqs().length ? '✓' : '•' }}</span>
            At least 8 characters
          </li>
          <li [class.ngxsmk-pass-meter__req--valid]="reqs().upper">
            <span class="ngxsmk-pass-meter__icon">{{ reqs().upper ? '✓' : '•' }}</span>
            Uppercase letter
          </li>
          <li [class.ngxsmk-pass-meter__req--valid]="reqs().number">
            <span class="ngxsmk-pass-meter__icon">{{ reqs().number ? '✓' : '•' }}</span>
            Number (0-9)
          </li>
          <li [class.ngxsmk-pass-meter__req--valid]="reqs().special">
            <span class="ngxsmk-pass-meter__icon">{{ reqs().special ? '✓' : '•' }}</span>
            Special character (!&#64;#$)
          </li>
        </ul>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-password-strength-meter',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-pass-meter {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .ngxsmk-pass-meter__bars {
      display: flex;
      gap: 0.25rem;
      width: 100%;
    }

    .ngxsmk-pass-meter__bar {
      flex: 1;
      height: 0.35rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      transition: background-color 0.25s ease;
    }

    .ngxsmk-pass-meter__header {
      display: flex;
      justify-content: flex-end;
    }

    .ngxsmk-pass-meter__label {
      font-size: 0.725rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .ngxsmk-pass-meter__checklist {
      list-style: none;
      margin: 0.25rem 0 0;
      padding: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.25rem 0.5rem;
      font-size: 0.75rem;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-pass-meter__checklist li {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      transition: color 0.15s ease;
    }

    .ngxsmk-pass-meter__req--valid {
      color: var(--ngxsmk-color-success);
      font-weight: 600;
    }

    .ngxsmk-pass-meter__icon {
      font-weight: 700;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPasswordStrengthMeter {
  /** Target password string to analyze. */
  readonly password = model<string>('');

  /** Display requirements checklist underneath. Default: true. */
  readonly showRequirements = input<boolean>(true);

  protected readonly segments = signal([0, 1, 2, 3]);

  protected readonly reqs = computed(() => {
    const val = this.password();
    return {
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[^A-Za-z0-9]/.test(val),
    };
  });

  protected readonly score = computed(() => {
    const r = this.reqs();
    if (!this.password()) return -1;
    let s = 0;
    if (r.length) s++;
    if (r.upper && r.lower) s++;
    if (r.number) s++;
    if (r.special) s++;
    return s - 1;
  });

  protected readonly statusLabel = computed(() => {
    const sc = this.score();
    switch (sc) {
      case 0:
        return 'Weak';
      case 1:
        return 'Fair';
      case 2:
        return 'Good';
      case 3:
        return 'Strong';
      default:
        return '';
    }
  });

  protected readonly statusColor = computed(() => {
    const sc = this.score();
    switch (sc) {
      case 0:
        return 'var(--ngxsmk-color-error)';
      case 1:
        return 'var(--ngxsmk-color-amber)';
      case 2:
        return 'var(--ngxsmk-color-secondary)';
      case 3:
        return 'var(--ngxsmk-color-success)';
      default:
        return 'var(--ngxsmk-color-surface-variant)';
    }
  });
}
