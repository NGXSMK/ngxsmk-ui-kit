/** Supported HTML input types that the group can wrap. */
export type InputGroupInputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'color'
  | 'file';

/** Visual variant of the input group container. */
export type InputGroupVariant = 'outlined' | 'filled' | 'soft' | 'ghost' | 'underline';

/** Size preset controlling height, padding, and font size. */
export type InputGroupSize = 'sm' | 'md' | 'lg' | 'xl';

/** Corner radius preset. */
export type InputGroupRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill';

/** Density preset controlling spacing. */
export type InputGroupDensity = 'compact' | 'comfortable' | 'spacious';

/** Validation status displayed on the group. */
export type ValidationStatus = 'error' | 'warning' | 'success' | 'info' | 'pending' | 'none';

/** Position of an add-on element. */
export type AddonPosition = 'leading' | 'trailing';

/** Content type for an add-on slot. */
export type AddonContentType = 'text' | 'icon' | 'button' | 'avatar' | 'badge' | 'chip' | 'toggle' | 'spinner' | 'custom';

/** Configuration for a single add-on element. */
export interface InputGroupAddon {
  /** Unique key for tracking. */
  readonly id: string;
  /** Position: leading or trailing. */
  readonly position: AddonPosition;
  /** What kind of content this add-on holds. */
  readonly contentType: AddonContentType;
  /** Text content (when contentType is 'text'). */
  readonly text?: string;
  /** Icon name or SVG path (when contentType is 'icon'). */
  readonly icon?: string;
  /** Whether this add-on is interactive (clickable). */
  readonly interactive?: boolean;
  /** Whether this add-on is disabled. */
  readonly disabled?: boolean;
  /** Custom CSS class applied to the add-on element. */
  readonly className?: string;
  /** ARIA label for the add-on. */
  readonly ariaLabel?: string;
  /** Tooltip text for the add-on. */
  readonly tooltip?: string;
  /** Template key for custom rendering. */
  readonly templateKey?: string;
}

/** Full configuration for the input group. */
export interface InputGroupConfig {
  /** HTML input type. */
  type?: InputGroupInputType;
  /** Visual variant. */
  variant?: InputGroupVariant;
  /** Size. */
  size?: InputGroupSize;
  /** Corner radius. */
  radius?: InputGroupRadius;
  /** Density. */
  density?: InputGroupDensity;
  /** Whether the entire group is disabled. */
  disabled?: boolean;
  /** Whether the input is read-only. */
  readonly?: boolean;
  /** Placeholder text. */
  placeholder?: string;
  /** Label text (can also be provided via template). */
  label?: string;
  /** Hint text below the input. */
  hint?: string;
  /** Whether the input is required. */
  required?: boolean;
  /** Maximum character length. */
  maxLength?: number;
  /** Minimum character length. */
  minLength?: number;
  /** Whether to show a clear button. */
  showClear?: boolean;
  /** Whether to show a character counter. */
  showCounter?: boolean;
  /** Whether the input takes full width. */
  fullWidth?: boolean;
  /** Whether the input is loading. */
  loading?: boolean;
  /** Whether the input group supports RTL. */
  rtl?: boolean;
  /** Floating label mode. */
  floatingLabel?: boolean;
}

/** Runtime state tracked by the engine. */
export interface InputGroupState {
  /** Current value. */
  readonly value: string;
  /** Whether the input has focus. */
  readonly focused: boolean;
  /** Whether the mouse is hovering. */
  readonly hovered: boolean;
  /** Whether the value has been touched (blurred at least once). */
  readonly touched: boolean;
  /** Whether the value has been modified from initial. */
  readonly dirty: boolean;
  /** Current validation status. */
  readonly status: ValidationStatus;
  /** Validation message text. */
  readonly message: string;
  /** Whether the input is disabled. */
  readonly disabled: boolean;
  /** Whether the input is read-only. */
  readonly readonly: boolean;
  /** Whether the password is currently visible (reveal toggle). */
  readonly passwordVisible: boolean;
  /** Whether the loading indicator is showing. */
  readonly loading: boolean;
  /** Current character count. */
  readonly charCount: number;
  /** Registered add-ons. */
  readonly addons: ReadonlyArray<InputGroupAddon>;
  /** Whether the input has content (for floating label positioning). */
  readonly hasContent: boolean;
}
