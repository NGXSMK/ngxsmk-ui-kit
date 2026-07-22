import { computed, signal, type WritableSignal, type Signal } from '@angular/core';
import type {
  InputGroupConfig,
  InputGroupAddon,
  InputGroupInputType,
  InputGroupVariant,
  InputGroupSize,
  InputGroupRadius,
  InputGroupDensity,
  ValidationStatus,
} from './models';

export interface InputGroupEngineConfig extends InputGroupConfig {
  /** Initial value. */
  initialValue?: string;
  /** Async validator function. */
  asyncValidator?: (value: string) => Promise<ValidationStatus>;
  /** Sync validator function. */
  validator?: (value: string) => { status: ValidationStatus; message: string };
  /** Debounce for async validation in ms. */
  asyncDebounce?: number;
}

/**
 * InputGroupEngine — headless, signal-based state machine for input group behaviour.
 * Zero DOM, zero Angular template dependencies.
 */
export class InputGroupEngine {
  // ── Core State ──
  readonly value: WritableSignal<string>;
  readonly focused = signal(false);
  readonly hovered = signal(false);
  readonly touched = signal(false);
  readonly dirty = signal(false);
  readonly status = signal<ValidationStatus>('none');
  readonly message = signal('');
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly passwordVisible = signal(false);
  readonly loading = signal(false);
  readonly addons = signal<InputGroupAddon[]>([]);

  // ── Config ──
  readonly type: WritableSignal<InputGroupInputType>;
  readonly variant: WritableSignal<InputGroupVariant>;
  readonly size: WritableSignal<InputGroupSize>;
  readonly radius: WritableSignal<InputGroupRadius>;
  readonly density: WritableSignal<InputGroupDensity>;
  readonly placeholder = signal('');
  readonly label = signal('');
  readonly hint = signal('');
  readonly required = signal(false);
  readonly maxLength = signal<number | undefined>(undefined);
  readonly minLength = signal<number | undefined>(undefined);
  readonly showClear = signal(false);
  readonly showCounter = signal(false);
  readonly fullWidth = signal(true);
  readonly floatingLabel = signal(false);

  // ── Computed ──
  readonly charCount: Signal<number>;
  readonly hasContent: Signal<boolean>;
  readonly isActive: Signal<boolean>;
  readonly isOverLength: Signal<boolean>;
  readonly isUnderLength: Signal<boolean>;
  readonly hasError: Signal<boolean>;
  readonly hasSuccess: Signal<boolean>;
  readonly hasWarning: Signal<boolean>;
  readonly isInvalid: Signal<boolean>;
  readonly showPlaceholder: Signal<boolean>;
  readonly shouldFloat: Signal<boolean>;
  readonly leadingAddons: Signal<InputGroupAddon[]>;
  readonly trailingAddons: Signal<InputGroupAddon[]>;
  readonly hasLeading: Signal<boolean>;
  readonly hasTrailing: Signal<boolean>;
  readonly inputType: Signal<InputGroupInputType>;

  // ── Lifecycle Hooks ──
  readonly onFocus: WritableSignal<() => void>;
  readonly onBlur: WritableSignal<() => void>;
  readonly onChange: WritableSignal<(value: string) => void>;
  readonly onClear: WritableSignal<() => void>;
  readonly onValidationChange: WritableSignal<(status: ValidationStatus, message: string) => void>;

  private _config: InputGroupEngineConfig;
  private _asyncTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(config: InputGroupEngineConfig = {}) {
    this._config = config;

    // Initialize config signals
    this.value = signal(config.initialValue ?? '');
    this.type = signal(config.type ?? 'text');
    this.variant = signal(config.variant ?? 'outlined');
    this.size = signal(config.size ?? 'md');
    this.radius = signal(config.radius ?? 'md');
    this.density = signal(config.density ?? 'comfortable');
    this.disabled.set(config.disabled ?? false);
    this.readonly.set(config.readonly ?? false);
    this.placeholder.set(config.placeholder ?? '');
    this.label.set(config.label ?? '');
    this.hint.set(config.hint ?? '');
    this.required.set(config.required ?? false);
    this.maxLength.set(config.maxLength);
    this.minLength.set(config.minLength);
    this.showClear.set(config.showClear ?? false);
    this.showCounter.set(config.showCounter ?? false);
    this.fullWidth.set(config.fullWidth ?? true);
    this.floatingLabel.set(config.floatingLabel ?? false);

    if (config.initialValue) {
      this.dirty.set(true);
      this.touched.set(true);
    }

    // Lifecycle hooks
    this.onFocus = signal(() => {
      /* noop */
    });
    this.onBlur = signal(() => {
      /* noop */
    });
    this.onChange = signal(() => {
      /* noop */
    });
    this.onClear = signal(() => {
      /* noop */
    });
    this.onValidationChange = signal(() => {
      /* noop */
    });

    // ── Computed ──

    this.charCount = computed(() => this.value().length);

    this.hasContent = computed(() => this.value().length > 0);

    this.isActive = computed(() => this.focused() || this.hasContent());

    this.isOverLength = computed(() => {
      const max = this.maxLength();
      return max != null ? this.value().length > max : false;
    });

    this.isUnderLength = computed(() => {
      const min = this.minLength();
      return min != null && this.touched() ? this.value().length < min : false;
    });

    this.hasError = computed(() => this.status() === 'error');
    this.hasSuccess = computed(() => this.status() === 'success');
    this.hasWarning = computed(() => this.status() === 'warning');
    this.isInvalid = computed(() => this.hasError() || this.isOverLength() || this.isUnderLength());

    this.showPlaceholder = computed(() => {
      return !this.hasContent() && !this.focused();
    });

    this.shouldFloat = computed(() => {
      if (this.floatingLabel()) return this.isActive() || this.hasContent();
      return false;
    });

    this.leadingAddons = computed(() => this.addons().filter((a) => a.position === 'leading'));

    this.trailingAddons = computed(() => this.addons().filter((a) => a.position === 'trailing'));

    this.hasLeading = computed(() => this.leadingAddons().length > 0);
    this.hasTrailing = computed(() => this.trailingAddons().length > 0);

    this.inputType = computed(() => {
      if (this.type() === 'password') {
        return this.passwordVisible() ? 'text' : 'password';
      }
      return this.type();
    });
  }

  // ── Value Operations ──

  setValue(value: string): void {
    this.value.set(value);
    this.dirty.set(true);
    this._runValidation(value);
    this.onChange()(value);
  }

  clear(): void {
    this.setValue('');
    this.onClear()();
  }

  getValue(): string {
    return this.value();
  }

  // ── Focus Operations ──

  focus(): void {
    this.focused.set(true);
    this.onFocus()();
  }

  blur(): void {
    this.focused.set(false);
    this.touched.set(true);
    this._runValidation(this.value());
    this.onBlur()();
  }

  // ── Password ──

  togglePasswordVisibility(): void {
    this.passwordVisible.update((v) => !v);
  }

  // ── Loading ──

  showLoading(): void {
    this.loading.set(true);
  }

  hideLoading(): void {
    this.loading.set(false);
  }

  // ── Add-ons ──

  addAddon(addon: InputGroupAddon): void {
    this.addons.update((list) => [...list, addon]);
  }

  removeAddon(id: string): void {
    this.addons.update((list) => list.filter((a) => a.id !== id));
  }

  // ── Validation ──

  setStatus(status: ValidationStatus, message = ''): void {
    this.status.set(status);
    this.message.set(message);
    this.onValidationChange()(status, message);
  }

  private _runValidation(value: string): void {
    const validator = this._config.validator;
    if (validator) {
      const result = validator(value);
      this.status.set(result.status);
      this.message.set(result.message);
      this.onValidationChange()(result.status, result.message);
      return;
    }

    // Built-in validations
    if (this.required() && !value) {
      this.status.set('error');
      this.message.set('This field is required');
      this.onValidationChange()('error', 'This field is required');
      return;
    }

    if (this.isOverLength()) {
      this.status.set('error');
      this.message.set(`Maximum ${this.maxLength()} characters`);
      this.onValidationChange()('error', `Maximum ${this.maxLength()} characters`);
      return;
    }

    if (this.isUnderLength()) {
      this.status.set('error');
      this.message.set(`Minimum ${this.minLength()} characters`);
      this.onValidationChange()('error', `Minimum ${this.minLength()} characters`);
      return;
    }

    this.status.set('none');
    this.message.set('');
    this.onValidationChange()('none', '');

    // Async validation
    const asyncValidator = this._config.asyncValidator;
    if (asyncValidator && value) {
      if (this._asyncTimer) clearTimeout(this._asyncTimer);
      this.status.set('pending');
      this.message.set('');
      this._asyncTimer = setTimeout(async () => {
        const result = await asyncValidator(value);
        if (this.value() === value) {
          this.status.set(result);
          this.onValidationChange()(result, '');
        }
      }, this._config.asyncDebounce ?? 300);
    }
  }

  // ── Reset ──

  reset(): void {
    this.value.set(this._config.initialValue ?? '');
    this.focused.set(false);
    this.touched.set(false);
    this.dirty.set(false);
    this.status.set('none');
    this.message.set('');
    this.passwordVisible.set(false);
  }

  // ── Enable/Disable ──

  enable(): void {
    this.disabled.set(false);
  }

  disable(): void {
    this.disabled.set(true);
  }
}
