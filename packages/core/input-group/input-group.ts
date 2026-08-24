import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  InjectionToken,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  InputGroupEngine,
  type InputGroupConfig,
  type InputGroupAddon,
  type InputGroupInputType,
  type InputGroupVariant,
  type InputGroupSize,
  type InputGroupRadius,
  type InputGroupDensity,
  type ValidationStatus,
} from '@ngxsmk/cdk/input-group';
import { CvaBase } from '@ngxsmk/cdk/cva-base';
import { NGXSMK_FORM_FIELD_CONTROL, type NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

// ── Template Injection Tokens ──

export interface InputGroupLabelContext {
  $implicit: string;
  label: string;
  required: boolean;
  disabled: boolean;
}

export interface InputGroupHintContext {
  $implicit: string;
  hint: string;
}

export interface InputGroupErrorContext {
  $implicit: string;
  message: string;
  status: ValidationStatus;
}

export interface InputGroupCounterContext {
  $implicit: number;
  count: number;
  maxLength?: number;
}

export interface InputGroupLoadingContext {
  $implicit: boolean;
  loading: boolean;
}

export interface InputGroupAddonContext {
  $implicit: InputGroupAddon;
  addon: InputGroupAddon;
  disabled: boolean;
}

export interface InputGroupClearContext {
  $implicit: () => void;
  clear: () => void;
  disabled: boolean;
  visible: boolean;
}

export const INPUT_GROUP_LABEL_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupLabelContext> | null>('INPUT_GROUP_LABEL_TEMPLATE');
export const INPUT_GROUP_HINT_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupHintContext> | null>('INPUT_GROUP_HINT_TEMPLATE');
export const INPUT_GROUP_ERROR_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupErrorContext> | null>('INPUT_GROUP_ERROR_TEMPLATE');
export const INPUT_GROUP_COUNTER_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupCounterContext> | null>('INPUT_GROUP_COUNTER_TEMPLATE');
export const INPUT_GROUP_LOADING_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupLoadingContext> | null>('INPUT_GROUP_LOADING_TEMPLATE');
export const INPUT_GROUP_ADDON_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupAddonContext> | null>('INPUT_GROUP_ADDON_TEMPLATE');
export const INPUT_GROUP_CLEAR_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupClearContext> | null>('INPUT_GROUP_CLEAR_TEMPLATE');

// ── Provider Function ──

export function provideInputGroup(
  config: Partial<InputGroupConfig> = {},
): { provider: InjectionToken<unknown>; useValue: unknown }[] {
  const engine = new InputGroupEngine(config);
  return [{ provider: INPUT_GROUP_ENGINE, useValue: engine }];
}

export const INPUT_GROUP_ENGINE = new InjectionToken<InputGroupEngine>('INPUT_GROUP_ENGINE');

// ── Component ──

@Component({
  standalone: true,
  selector: 'ngxsmk-input-group',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngxsmk-input-group',
    '[class.ngxsmk-input-group--focused]': 'engine.focused()',
    '[class.ngxsmk-input-group--disabled]': 'engine.disabled()',
    '[class.ngxsmk-input-group--readonly]': 'engine.readonly()',
    '[class.ngxsmk-input-group--error]': 'engine.hasError()',
    '[class.ngxsmk-input-group--success]': 'engine.hasSuccess()',
    '[class.ngxsmk-input-group--warning]': 'engine.hasWarning()',
    '[class.ngxsmk-input-group--loading]': 'engine.loading()',
    '[class.ngxsmk-input-group--has-content]': 'engine.hasContent()',
    '[class.ngxsmk-input-group--has-leading]': 'engine.hasLeading()',
    '[class.ngxsmk-input-group--has-trailing]': 'engine.hasTrailing()',
    '[class.ngxsmk-input-group--floating]': 'engine.shouldFloat()',
    '[class.ngxsmk-input-group--full-width]': 'engine.fullWidth()',
    '[class.ngxsmk-input-group--rtl]': '_rtl()',
    '[attr.data-variant]': 'engine.variant()',
    '[attr.data-size]': 'engine.size()',
    '[attr.data-radius]': 'engine.radius()',
    '[attr.aria-disabled]': 'engine.disabled() ? "true" : null',
    '[attr.aria-busy]': 'engine.loading() ? "true" : null',
    '(mouseenter)': 'engine.hovered.set(true)',
    '(mouseleave)': 'engine.hovered.set(false)',
  },
  providers: [
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkInputGroup),
    },
  ],
  template: `
    <!-- Standard Label (rendered outside container) -->
    @if (engine.label() && !engine.floatingLabel()) {
      <label
        class="ngxsmk-input-group__label"
        [attr.for]="id()"
        [class.ngxsmk-input-group__label--error]="engine.hasError()"
      >
        {{ engine.label() }}
        @if (engine.required()) {
          <span class="ngxsmk-input-group__required" aria-hidden="true">*</span>
        }
      </label>
    }

    <!-- Main Container -->
    <div class="ngxsmk-input-group__container">
      <!-- Floating Label -->
      @if (engine.label() && engine.floatingLabel()) {
        <label
          class="ngxsmk-input-group__floating-label"
          [class.ngxsmk-input-group__floating-label--active]="engine.shouldFloat()"
          [class.ngxsmk-input-group__floating-label--error]="engine.hasError()"
          [attr.for]="id()"
        >
          {{ engine.label() }}
          @if (engine.required()) {
            <span class="ngxsmk-input-group__required" aria-hidden="true">*</span>
          }
        </label>
      }

      <!-- Projected Leading Content -->
      <ng-content
        select="ngxsmk-input-group-text:not([trailing]), [ngxsmkInputGroupText]:not([trailing])"
      ></ng-content>

      <!-- Leading Add-ons -->
      @for (addon of engine.leadingAddons(); track addon.id) {
        <div
          class="ngxsmk-input-group__addon ngxsmk-input-group__addon--leading"
          [class.ngxsmk-input-group__addon--interactive]="addon.interactive"
          [class.ngxsmk-input-group__addon--disabled]="addon.disabled"
          [attr.aria-label]="addon.ariaLabel"
          [attr.title]="addon.tooltip"
          [attr.data-addon-type]="addon.contentType"
        >
          @if (tplAddon) {
            <ng-container
              *ngTemplateOutlet="
                tplAddon;
                context: { $implicit: addon, addon: addon, disabled: addon.disabled }
              "
            ></ng-container>
          } @else if (addon.contentType === 'text') {
            <span class="ngxsmk-input-group__addon-text">{{ addon.text }}</span>
          } @else if (addon.contentType === 'icon') {
            <span class="ngxsmk-input-group__addon-icon" [attr.data-icon]="addon.icon">
              {{ addon.icon }}
            </span>
          } @else if (addon.contentType === 'spinner') {
            <span class="ngxsmk-input-group__spinner" aria-hidden="true"></span>
          }
        </div>
      }

      <!-- Input Wrapper -->
      <div class="ngxsmk-input-group__input-wrapper">
        <div class="ngxsmk-input-group__input-row">
          @if (engine.loading()) {
            <span class="ngxsmk-input-group__loading" aria-hidden="true">
              @if (tplLoading) {
                <ng-container
                  *ngTemplateOutlet="tplLoading; context: { $implicit: true, loading: true }"
                ></ng-container>
              } @else {
                <span class="ngxsmk-input-group__spinner"></span>
              }
            </span>
          }

          <input
            #inputEl
            class="ngxsmk-input-group__input"
            [class.ngxsmk-input-group__input--has-loading]="engine.loading()"
            [id]="id()"
            [type]="engine.inputType()"
            [placeholder]="engine.floatingLabel() ? '' : engine.placeholder()"
            [attr.aria-label]="engine.label() || engine.placeholder()"
            [attr.aria-invalid]="engine.isInvalid() ? 'true' : null"
            [attr.aria-describedby]="_describedBy()"
            [attr.aria-required]="engine.required() ? 'true' : null"
            [attr.aria-disabled]="engine.disabled() ? 'true' : null"
            [attr.aria-readonly]="engine.readonly() ? 'true' : null"
            [attr.maxlength]="engine.maxLength()"
            [attr.minlength]="engine.minLength()"
            [disabled]="engine.disabled()"
            [readonly]="engine.readonly()"
            [value]="engine.value()"
            (input)="_onInput($event)"
            (focus)="_onFocus()"
            (blur)="_onBlur()"
            (keydown)="_onKeydown($event)"
            (keyup)="_onKeyup($event)"
          />

          <!-- Clear Button -->
          @if (
            engine.showClear() && engine.hasContent() && !engine.disabled() && !engine.readonly()
          ) {
            @if (tplClear) {
              <ng-container
                *ngTemplateOutlet="
                  tplClear;
                  context: {
                    $implicit: _clear,
                    clear: _clear,
                    disabled: engine.disabled(),
                    visible: engine.showClear() && engine.hasContent(),
                  }
                "
              ></ng-container>
            } @else {
              <button
                type="button"
                class="ngxsmk-input-group__clear"
                (click)="_clear()"
                tabindex="-1"
                aria-label="Clear input"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            }
          }

          <!-- Password Toggle -->
          @if (engine.type() === 'password' && !engine.disabled()) {
            <button
              type="button"
              class="ngxsmk-input-group__toggle-password"
              (click)="engine.togglePasswordVisibility()"
              tabindex="-1"
              [attr.aria-label]="engine.passwordVisible() ? 'Hide password' : 'Show password'"
              [attr.aria-pressed]="engine.passwordVisible()"
            >
              @if (engine.passwordVisible()) {
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  ></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              } @else {
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              }
            </button>
          }

          <!-- Character Counter -->
          @if (engine.showCounter()) {
            @if (tplCounter) {
              <ng-container
                *ngTemplateOutlet="
                  tplCounter;
                  context: {
                    $implicit: engine.charCount(),
                    count: engine.charCount(),
                    maxLength: engine.maxLength(),
                  }
                "
              ></ng-container>
            } @else {
              <span
                class="ngxsmk-input-group__counter"
                [class.ngxsmk-input-group__counter--over]="engine.isOverLength()"
              >
                {{ engine.charCount() }}
                @if (engine.maxLength()) {
                  /{{ engine.maxLength() }}
                }
              </span>
            }
          }

          <!-- Status Icon -->
          @if (showStatusIcon()) {
            @if (engine.status() === 'success') {
              <span
                class="ngxsmk-input-group__status-icon ngxsmk-input-group__status-icon--success"
                aria-hidden="true"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
            } @else if (engine.status() === 'error') {
              <span
                class="ngxsmk-input-group__status-icon ngxsmk-input-group__status-icon--error"
                aria-hidden="true"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </span>
            } @else if (engine.status() === 'warning') {
              <span
                class="ngxsmk-input-group__status-icon ngxsmk-input-group__status-icon--warning"
                aria-hidden="true"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  ></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </span>
            } @else if (engine.status() === 'pending') {
              <span
                class="ngxsmk-input-group__status-icon ngxsmk-input-group__status-icon--pending"
                aria-hidden="true"
              >
                <span class="ngxsmk-input-group__spinner ngxsmk-input-group__spinner--sm"></span>
              </span>
            }
          }
        </div>
      </div>

      <!-- Trailing Add-ons -->
      @for (addon of engine.trailingAddons(); track addon.id) {
        <div
          class="ngxsmk-input-group__addon ngxsmk-input-group__addon--trailing"
          [class.ngxsmk-input-group__addon--interactive]="addon.interactive"
          [class.ngxsmk-input-group__addon--disabled]="addon.disabled"
          [attr.aria-label]="addon.ariaLabel"
          [attr.title]="addon.tooltip"
          [attr.data-addon-type]="addon.contentType"
        >
          @if (tplAddon) {
            <ng-container
              *ngTemplateOutlet="
                tplAddon;
                context: { $implicit: addon, addon: addon, disabled: addon.disabled }
              "
            ></ng-container>
          } @else if (addon.contentType === 'text') {
            <span class="ngxsmk-input-group__addon-text">{{ addon.text }}</span>
          } @else if (addon.contentType === 'icon') {
            <span class="ngxsmk-input-group__addon-icon" [attr.data-icon]="addon.icon">
              {{ addon.icon }}
            </span>
          } @else if (addon.contentType === 'spinner') {
            <span class="ngxsmk-input-group__spinner" aria-hidden="true"></span>
          }
        </div>
      }

      <!-- Projected Trailing Content -->
      <ng-content
        select="ngxsmk-input-group-text[trailing], [ngxsmkInputGroupText][trailing]"
      ></ng-content>
    </div>

    <!-- Hint / Error Message -->
    @if (engine.hasError() && engine.message()) {
      @if (tplError) {
        <ng-container
          *ngTemplateOutlet="
            tplError;
            context: {
              $implicit: engine.message(),
              message: engine.message(),
              status: engine.status(),
            }
          "
        ></ng-container>
      } @else {
        <p
          class="ngxsmk-input-group__message ngxsmk-input-group__message--error"
          role="alert"
          [id]="_messageId()"
        >
          {{ engine.message() }}
        </p>
      }
    } @else if (engine.hint()) {
      @if (tplHint) {
        <ng-container
          *ngTemplateOutlet="tplHint; context: { $implicit: engine.hint(), hint: engine.hint() }"
        ></ng-container>
      } @else {
        <p
          class="ngxsmk-input-group__message ngxsmk-input-group__message--hint"
          [id]="_messageId()"
        >
          {{ engine.hint() }}
        </p>
      }
    }
  `,
  styles: `
    :host {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-1, 0.25rem);
      font-family: var(--ngxsmk-input-group-font, var(--ngxsmk-font-sans));
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
      line-height: var(--ngxsmk-leading-normal, 1.5);
      color: var(--ngxsmk-color-on-surface);
      width: auto;
    }

    :host(.ngxsmk-input-group--floating) {
      margin-top: 0.5rem;
    }

    :host(.ngxsmk-input-group--full-width) {
      width: 100%;
    }

    /* ── Floating Label ── */
    .ngxsmk-input-group__floating-label {
      position: absolute;
      top: 50%;
      left: var(--ngxsmk-input-group-padding, 0.75rem);
      transform: translateY(-50%);
      font-size: var(--ngxsmk-text-body-md-size, 0.9rem);
      color: var(--ngxsmk-color-on-surface-variant);
      pointer-events: none;
      transition: all var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out);
      z-index: 5;
      background: transparent;
    }

    .ngxsmk-input-group__floating-label--active {
      top: 0;
      left: 0.65rem;
      transform: translateY(-50%);
      font-size: var(--ngxsmk-text-body-xs-size, 0.725rem);
      font-weight: 600;
      background: var(--ngxsmk-input-group-bg, var(--ngxsmk-color-surface));
      padding: 0 0.25rem;
      border-radius: var(--ngxsmk-radius-sm, 0.2rem);
      color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-input-group__floating-label--error {
      color: var(--ngxsmk-color-error);
    }

    /* ── Container ── */
    .ngxsmk-input-group__container {
      display: flex;
      align-items: stretch;
      position: relative;
      background: var(--ngxsmk-input-group-bg, var(--ngxsmk-color-surface));
      border: 1.5px solid var(--ngxsmk-input-group-border, var(--ngxsmk-color-outline-strong));
      border-radius: var(--ngxsmk-input-group-radius, var(--ngxsmk-radius-md, 0.5rem));
      box-shadow: var(--ngxsmk-input-group-shadow, none);
      transition:
        border-color var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out),
        background-color var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out);
      overflow: visible;
      min-height: var(--ngxsmk-input-group-height, 2.5rem);
    }

    /* ── Loading input padding ── */
    .ngxsmk-input-group__input--has-loading {
      padding-left: 2rem !important;
    }

    :host(.ngxsmk-input-group--focused) .ngxsmk-input-group__container {
      border-color: var(--ngxsmk-input-group-focus-border, var(--ngxsmk-color-primary));
      box-shadow: var(
        --ngxsmk-input-group-focus-shadow,
        0 0 0 3px color-mix(in srgb, var(--ngxsmk-color-primary) 15%, transparent)
      );
    }

    :host(.ngxsmk-input-group--error) .ngxsmk-input-group__container {
      border-color: var(--ngxsmk-input-group-error-border, var(--ngxsmk-color-error));
    }

    :host(.ngxsmk-input-group--error.ngxsmk-input-group--focused) .ngxsmk-input-group__container {
      box-shadow: var(
        --ngxsmk-input-group-error-focus-shadow,
        0 0 0 3px color-mix(in srgb, var(--ngxsmk-color-error) 15%, transparent)
      );
    }

    :host(.ngxsmk-input-group--success) .ngxsmk-input-group__container {
      border-color: var(--ngxsmk-input-group-success-border, var(--ngxsmk-color-success));
    }

    :host(.ngxsmk-input-group--warning) .ngxsmk-input-group__container {
      border-color: var(--ngxsmk-input-group-warning-border, var(--ngxsmk-color-warning));
    }

    :host(.ngxsmk-input-group--disabled) .ngxsmk-input-group__container {
      opacity: var(--ngxsmk-opacity-disabled, 0.5);
      cursor: not-allowed;
    }

    :host(.ngxsmk-input-group--readonly) .ngxsmk-input-group__container {
      background: var(--ngxsmk-color-surface-variant);
    }

    :host(.ngxsmk-input-group--loading) .ngxsmk-input-group__container {
      pointer-events: none;
    }

    /* ── Variant: Filled ── */
    :host([data-variant='filled']) .ngxsmk-input-group__container {
      background: var(--ngxsmk-color-surface-variant);
      border-color: transparent;
      border-bottom-width: 2px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    :host([data-variant='filled'].ngxsmk-input-group--focused) .ngxsmk-input-group__container {
      border-bottom-color: var(--ngxsmk-color-primary);
    }

    /* ── Variant: Soft ── */
    :host([data-variant='soft']) .ngxsmk-input-group__container {
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 8%, transparent);
      border-color: transparent;
    }

    :host([data-variant='soft'].ngxsmk-input-group--focused) .ngxsmk-input-group__container {
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 12%, transparent);
      border-color: var(--ngxsmk-color-primary);
    }

    /* ── Variant: Ghost ── */
    :host([data-variant='ghost']) .ngxsmk-input-group__container {
      background: transparent;
      border-color: transparent;
    }

    :host([data-variant='ghost'].ngxsmk-input-group--focused) .ngxsmk-input-group__container {
      background: var(--ngxsmk-color-surface-variant);
      border-color: var(--ngxsmk-color-outline);
    }

    /* ── Variant: Underline ── */
    :host([data-variant='underline']) .ngxsmk-input-group__container {
      background: transparent;
      border: none;
      border-bottom: 2px solid var(--ngxsmk-color-outline-strong);
      border-radius: 0;
    }

    :host([data-variant='underline'].ngxsmk-input-group--focused) .ngxsmk-input-group__container {
      border-bottom-color: var(--ngxsmk-color-primary);
    }

    /* ── Radius: Pill ── */
    :host([data-radius='pill']) .ngxsmk-input-group__container {
      border-radius: var(--ngxsmk-radius-full, 9999px);
    }

    /* ── Size: SM ── */
    :host([data-size='sm']) .ngxsmk-input-group__container {
      min-height: var(--ngxsmk-control-height-sm, 2rem);
    }

    :host([data-size='sm']) .ngxsmk-input-group__input {
      padding: var(--ngxsmk-space-1, 0.25rem) var(--ngxsmk-space-2, 0.5rem);
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
    }

    /* ── Size: LG ── */
    :host([data-size='lg']) .ngxsmk-input-group__container {
      min-height: var(--ngxsmk-control-height-lg, 3rem);
    }

    :host([data-size='lg']) .ngxsmk-input-group__input {
      padding: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
      font-size: var(--ngxsmk-text-body-lg-size, 1.125rem);
    }

    /* ── Size: XL ── */
    :host([data-size='xl']) .ngxsmk-input-group__container {
      min-height: 3.5rem;
    }

    :host([data-size='xl']) .ngxsmk-input-group__input {
      padding: var(--ngxsmk-space-3-5, 0.875rem) var(--ngxsmk-space-4, 1rem);
      font-size: var(--ngxsmk-text-body-lg-size, 1.125rem);
    }

    /* ── Label ── */
    .ngxsmk-input-group__label {
      display: block;
      font-size: var(--ngxsmk-text-label-lg-size, 0.875rem);
      font-weight: var(--ngxsmk-text-label-lg-weight, 500);
      line-height: var(--ngxsmk-text-label-lg-line, 1.25);
      color: var(--ngxsmk-color-on-surface);
      margin-bottom: var(--ngxsmk-space-1, 0.25rem);
    }

    .ngxsmk-input-group__label--error {
      color: var(--ngxsmk-color-error);
    }

    .ngxsmk-input-group__required {
      color: var(--ngxsmk-color-error);
      margin-left: 2px;
    }

    /* ── Input Wrapper ── */
    .ngxsmk-input-group__input-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      min-width: 0;
    }

    /* ── Input Row ── */
    .ngxsmk-input-group__input-row {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-input-group-gap, var(--ngxsmk-space-2, 0.5rem));
      position: relative;
      flex: 1;
      min-width: 0;
      height: 100%;
      padding-right: var(--ngxsmk-input-group-padding, 0.75rem);
    }

    :host([data-radius='pill']) .ngxsmk-input-group__input-row {
      padding-right: 1.25rem;
    }

    /* ── Input ── */
    .ngxsmk-input-group__input {
      flex: 1;
      min-width: 0;
      width: 100%;
      border: none;
      outline: none;
      background: transparent;
      padding: var(--ngxsmk-space-2, 0.5rem) 0 var(--ngxsmk-space-2, 0.5rem)
        var(--ngxsmk-input-group-padding, 0.75rem);
      font-family: var(--ngxsmk-input-group-font, var(--ngxsmk-font-sans));
      font-size: var(--ngxsmk-text-body-md-size, 1rem);
      line-height: var(--ngxsmk-leading-normal, 1.5);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-input-group__input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
      opacity: 0.7;
    }

    .ngxsmk-input-group__input:disabled {
      cursor: not-allowed;
    }

    .ngxsmk-input-group__input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px var(--ngxsmk-color-surface) inset !important;
      -webkit-text-fill-color: var(--ngxsmk-color-on-surface) !important;
    }

    /* ── Add-ons ── */
    .ngxsmk-input-group__addon,
    ::ng-deep .ngxsmk-input-group-text {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 var(--ngxsmk-space-3, 0.75rem);
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      white-space: nowrap;
      background: var(--ngxsmk-color-surface-variant);
      border-left: 1px solid var(--ngxsmk-input-group-border, var(--ngxsmk-color-outline-strong));
      user-select: none;
      min-height: 100%;
      transition:
        background var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out),
        border-color var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out);
    }

    .ngxsmk-input-group__addon--leading,
    ::ng-deep .ngxsmk-input-group-text:not([trailing]) {
      border-left: none;
      border-right: 1px solid var(--ngxsmk-input-group-border, var(--ngxsmk-color-outline-strong));
    }

    :host(.ngxsmk-input-group--focused) .ngxsmk-input-group__addon,
    :host(.ngxsmk-input-group--focused) ::ng-deep .ngxsmk-input-group-text {
      border-color: var(--ngxsmk-input-group-focus-border, var(--ngxsmk-color-primary));
    }

    .ngxsmk-input-group__addon--interactive {
      cursor: pointer;
      transition: background var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out);
    }

    .ngxsmk-input-group__addon--interactive:hover {
      background: var(--ngxsmk-color-surface-hover, rgba(0, 0, 0, 0.05));
    }

    .ngxsmk-input-group__addon--disabled {
      opacity: var(--ngxsmk-opacity-disabled, 0.5);
      cursor: not-allowed;
    }

    .ngxsmk-input-group__addon-text {
      font-weight: var(--ngxsmk-font-weight-medium, 500);
    }

    /* ── Clear Button ── */
    .ngxsmk-input-group__clear,
    .ngxsmk-input-group__toggle-password {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      border: none;
      background: transparent;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
      transition: all var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out);
    }

    .ngxsmk-input-group__clear:hover,
    .ngxsmk-input-group__toggle-password:hover {
      background: var(--ngxsmk-color-surface-hover, rgba(0, 0, 0, 0.05));
      color: var(--ngxsmk-color-on-surface);
    }

    /* ── Counter ── */
    .ngxsmk-input-group__counter {
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      color: var(--ngxsmk-color-on-surface-variant);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .ngxsmk-input-group__counter--over {
      color: var(--ngxsmk-color-error);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
    }

    /* ── Status Icon ── */
    .ngxsmk-input-group__status-icon {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .ngxsmk-input-group__status-icon--success {
      color: var(--ngxsmk-color-success);
    }

    .ngxsmk-input-group__status-icon--error {
      color: var(--ngxsmk-color-error);
    }

    .ngxsmk-input-group__status-icon--warning {
      color: var(--ngxsmk-color-warning);
    }

    .ngxsmk-input-group__status-icon--pending {
      color: var(--ngxsmk-color-on-surface-variant);
    }

    /* ── Spinner ── */
    .ngxsmk-input-group__spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid var(--ngxsmk-color-outline-variant);
      border-top-color: var(--ngxsmk-color-primary);
      border-radius: 50%;
      animation: ngxsmk-spin 0.6s linear infinite;
    }

    .ngxsmk-input-group__spinner--sm {
      width: 0.875rem;
      height: 0.875rem;
      border-width: 1.5px;
    }

    @keyframes ngxsmk-spin {
      to {
        transform: rotate(360deg);
      }
    }

    .ngxsmk-input-group__loading {
      position: absolute;
      left: var(--ngxsmk-space-2, 0.5rem);
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
    }

    /* ── Message ── */
    .ngxsmk-input-group__message {
      margin: 0;
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      line-height: 1.4;
    }

    .ngxsmk-input-group__message--error {
      color: var(--ngxsmk-color-error);
    }

    .ngxsmk-input-group__message--hint {
      color: var(--ngxsmk-color-on-surface-variant);
    }

    /* ── Dark Mode ── */
    :host-context(.dark) .ngxsmk-input-group__container {
      background: var(--ngxsmk-input-group-bg, var(--ngxsmk-color-surface));
      border-color: var(--ngxsmk-input-group-border, var(--ngxsmk-color-outline-strong));
    }

    :host-context(.dark) .ngxsmk-input-group__addon {
      background: var(--ngxsmk-color-surface-container);
      border-color: var(--ngxsmk-color-outline-variant, rgba(255, 255, 255, 0.06));
    }

    :host-context(.dark) .ngxsmk-input-group__input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }

    :host-context(.dark) .ngxsmk-input-group__input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px var(--ngxsmk-color-surface) inset !important;
      -webkit-text-fill-color: var(--ngxsmk-color-on-surface) !important;
    }
  `,
})
export class NgxsmkInputGroup
  extends CvaBase<string>
  implements NgxsmkFormFieldControl, AfterViewInit
{
  // ── Inputs ──
  readonly type = input<InputGroupInputType>('text');
  readonly variant = input<InputGroupVariant>('outlined');
  readonly size = input<InputGroupSize>('md');
  readonly radius = input<InputGroupRadius>('md');
  readonly density = input<InputGroupDensity>('comfortable');
  readonly placeholder = input('');
  readonly label = input('');
  readonly hint = input('');
  readonly required = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly maxLength = input<number | undefined>(undefined);
  readonly minLength = input<number | undefined>(undefined);
  readonly showClear = input(false);
  readonly showCounter = input(false);
  readonly showStatusIcon = input(false);
  readonly fullWidth = input(true);
  readonly loading = input(false);
  readonly floatingLabel = input(false);
  readonly addons = input<InputGroupAddon[]>([]);
  readonly inputType = input<InputGroupInputType | 'password'>('text');

  // ── Two-way Binding ──
  readonly value = model('');

  // ── Form-field Control ──
  readonly id = input(ngxsmkUniqueId('ngxsmk-input-group'));
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  // ── Outputs ──
  readonly focused = output<void>();
  readonly blurred = output<void>();
  readonly cleared = output<void>();
  readonly valueChanged = output<string>();
  readonly validationChanged = output<{ status: ValidationStatus; message: string }>();

  // ── Template Refs ──
  protected readonly tplLabel = inject(INPUT_GROUP_LABEL_TEMPLATE, { optional: true });
  protected readonly tplHint = inject(INPUT_GROUP_HINT_TEMPLATE, { optional: true });
  protected readonly tplError = inject(INPUT_GROUP_ERROR_TEMPLATE, { optional: true });
  protected readonly tplCounter = inject(INPUT_GROUP_COUNTER_TEMPLATE, { optional: true });
  protected readonly tplLoading = inject(INPUT_GROUP_LOADING_TEMPLATE, { optional: true });
  protected readonly tplAddon = inject(INPUT_GROUP_ADDON_TEMPLATE, { optional: true });
  protected readonly tplClear = inject(INPUT_GROUP_CLEAR_TEMPLATE, { optional: true });

  // ── DI ──
  readonly engine: InputGroupEngine;
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  protected readonly _rtl = signal(false);

  // ── Internal ──
  protected readonly _messageId = signal<string | null>(null);
  protected readonly _describedBy = signal<string | null>(null);

  constructor() {
    const provided = inject(INPUT_GROUP_ENGINE, { optional: true });
    const engine = provided ?? new InputGroupEngine();
    super();
    this.engine = engine;

    // ── Sync inputs → engine ──
    effect(() => {
      this.engine.type.set(this.type());
    });
    effect(() => {
      this.engine.variant.set(this.variant());
    });
    effect(() => {
      this.engine.size.set(this.size());
    });
    effect(() => {
      this.engine.radius.set(this.radius());
    });
    effect(() => {
      this.engine.density.set(this.density());
    });
    effect(() => {
      this.engine.disabled.set(this.disabled());
    });
    effect(() => {
      this.engine.readonly.set(this.readonly());
    });
    effect(() => {
      this.engine.placeholder.set(this.placeholder());
    });
    effect(() => {
      this.engine.label.set(this.label());
    });
    effect(() => {
      this.engine.hint.set(this.hint());
    });
    effect(() => {
      this.engine.required.set(this.required());
    });
    effect(() => {
      this.engine.maxLength.set(this.maxLength());
    });
    effect(() => {
      this.engine.minLength.set(this.minLength());
    });
    effect(() => {
      this.engine.showClear.set(this.showClear());
    });
    effect(() => {
      this.engine.showCounter.set(this.showCounter());
    });
    effect(() => {
      this.engine.fullWidth.set(this.fullWidth());
    });
    effect(() => {
      this.engine.loading.set(this.loading());
    });
    effect(() => {
      this.engine.floatingLabel.set(this.floatingLabel());
    });
    effect(() => {
      this.engine.addons.set(this.addons());
    });

    // ── Sync engine → model + CVA ──
    effect(() => {
      const val = this.engine.value();
      this.value.set(val);
      this.emitChange(val);
      this._cdr.markForCheck();
    });

    // ── Sync engine → outputs ──
    effect(() => {
      const status = this.engine.status();
      const message = this.engine.message();
      this.validationChanged.emit({ status, message });
    });

    // ── Derived IDs / aria ──
    effect(() => {
      this._messageId.set(`${this.id()}-message`);
    });

    effect(() => {
      const msgId = this._messageId();
      const hint = this.engine.hint();
      const error = this.engine.hasError() && this.engine.message();
      const describedby = error || hint ? msgId : null;
      this._describedBy.set(describedby);
      this.ariaDescribedby.set(describedby);
    });

    effect(() => {
      this.ariaInvalid.set(this.engine.isInvalid());
    });

    // ── RTL detection ──
    effect(() => {
      const el = this._inputEl()?.nativeElement;
      if (el) {
        const dir = el.closest('[dir="rtl"]') || document.documentElement;
        this._rtl.set(dir.getAttribute('dir') === 'rtl');
      }
    });
  }

  // ── CVA Implementation ──

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  writeValue(value: unknown): void {
    this.engine.setValue(String(value ?? ''));
    this._cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    // Set up engine lifecycle hooks
    this.engine.onFocus.set(() => this.focused.emit());
    this.engine.onBlur.set(() => {
      this.blurred.emit();
      this.emitTouched();
    });
    this.engine.onChange.set((val) => this.valueChanged.emit(val));
    this.engine.onClear.set(() => this.cleared.emit());
  }

  // ── Event Handlers ──

  protected _onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.engine.setValue(input.value);
  }

  protected _onFocus(): void {
    this.engine.focus();
  }

  protected _onBlur(): void {
    this.engine.blur();
  }

  protected _onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.engine.blur();
    }
    if (event.key === 'Escape') {
      this.engine.clear();
    }
  }

  protected _onKeyup(_event: KeyboardEvent): void {
    // No-op, extensible
  }

  protected _clear(): void {
    this.engine.clear();
    this._inputEl()?.nativeElement.focus();
  }

  // ── Public API ──

  focus(): void {
    this._inputEl()?.nativeElement.focus();
  }

  blur(): void {
    this._inputEl()?.nativeElement.blur();
  }

  select(): void {
    this._inputEl()?.nativeElement.select();
  }
}
