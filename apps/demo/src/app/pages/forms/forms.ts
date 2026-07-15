import { NgxsmkButtonGroup } from '@ngxsmk/core/button-group';
import { NgxsmkToggleButton } from '@ngxsmk/core/toggle-button';
import { NgxsmkToggleButtonGroup } from '@ngxsmk/core/toggle-button-group';
import { NgxsmkInput } from '@ngxsmk/core/input';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';
import { NgxsmkCheckboxList } from '@ngxsmk/core/checkbox-list';
import { NgxsmkRadio, NgxsmkRadioGroup } from '@ngxsmk/core/radio';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkTextarea } from '@ngxsmk/core/textarea';
import { NgxsmkNumberInput } from '@ngxsmk/core/number-input';
import { NgxsmkSelect } from '@ngxsmk/core/select';
import { NgxsmkMultiSelect } from '@ngxsmk/core/multi-select';
import { NgxsmkAutocomplete } from '@ngxsmk/core/autocomplete';
import { NgxsmkCombobox } from '@ngxsmk/core/combobox';
import { NgxsmkTypeahead } from '@ngxsmk/core/typeahead';
import { NgxsmkPowerSearch } from '@ngxsmk/core/power-search';
import { NgxsmkSlider } from '@ngxsmk/core/slider';
import { NgxsmkSegmentedControl } from '@ngxsmk/core/segmented-control';
import { NgxsmkSelector } from '@ngxsmk/core/selector';
import { NgxsmkMultiSelector } from '@ngxsmk/core/multi-selector';
import { NgxsmkTokenizer } from '@ngxsmk/core/tokenizer';
import { NgxsmkInputGroup } from '@ngxsmk/core/input-group';
import { NgxsmkInputGroupText } from '@ngxsmk/core/input-group-text';
import { NgxsmkField } from '@ngxsmk/core/field';
import { NgxsmkFieldLabel } from '@ngxsmk/core/field-label';
import { NgxsmkFieldStatus } from '@ngxsmk/core/field-status';
import { NgxsmkFormField } from '@ngxsmk/core/form-field';
import { NgxsmkCheckboxListItemComponent } from '@ngxsmk/core/checkbox-list-item';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShowcaseExample } from '../../showcase/showcase-example';
import { TelInputShowcase } from './tel-input-showcase';
import { DatepickerShowcase } from './datepicker-showcase';

interface Option {
  value: string;
  label: string;
}

@Component({
  selector: 'forms-page',
  standalone: true,
  imports: [
    ShowcaseExample,
    FormsModule,
    NgxsmkButton,
    NgxsmkButtonGroup,
    NgxsmkToggleButton,
    NgxsmkToggleButtonGroup,
    NgxsmkInput,
    NgxsmkCheckbox,
    NgxsmkCheckboxList,
    NgxsmkRadio,
    NgxsmkRadioGroup,
    NgxsmkSwitch,
    NgxsmkTextarea,
    NgxsmkNumberInput,
    NgxsmkSelect,
    NgxsmkMultiSelect,
    NgxsmkAutocomplete,
    NgxsmkCombobox,
    NgxsmkTypeahead,
    NgxsmkPowerSearch,
    NgxsmkSlider,
    NgxsmkSegmentedControl,
    NgxsmkSelector,
    NgxsmkMultiSelector,
    NgxsmkTokenizer,
    NgxsmkInputGroup,
    NgxsmkInputGroupText,
    NgxsmkField,
    NgxsmkFieldLabel,
    NgxsmkFieldStatus,
    NgxsmkFormField,
    NgxsmkCheckboxListItemComponent,
    TelInputShowcase,
    DatepickerShowcase,
  ],
  template: `
    <h2 class="ngxsmk-page-title">Forms</h2>
    <p class="ngxsmk-page-desc">
      Buttons, inputs, selects, and rich form controls. Every component below is live and
      interactive — try them out, then reveal the code to copy it.
    </p>

    <div class="ngxsmk-sc-col">
      <showcase-example
        title="Button"
        description="Native button/anchor directive with variants, sizes, and a loading state."
        [code]="codeButton"
        [component]="NgxsmkButton"
      >
        <span class="ngxsmk-sc-wrap">
          <button ngxsmk-button>Primary</button>
          <button ngxsmk-button variant="secondary">Secondary</button>
          <button ngxsmk-button variant="outline">Outline</button>
          <button ngxsmk-button variant="ghost">Ghost</button>
          <button ngxsmk-button variant="destructive">Delete</button>
          <button ngxsmk-button variant="link">Link</button>
          <button ngxsmk-button loading>Saving</button>
          <button ngxsmk-button [disabled]="true">Disabled</button>
        </span>
      </showcase-example>

      <showcase-example
        title="Button Group"
        description="Segments a set of related actions into a single connected control."
        [code]="codeButtonGroup"
        [component]="NgxsmkButtonGroup"
        [customize]="customizeNgxsmkButtonGroup"
      >
        <ngxsmk-button-group>
          <button ngxsmk-button variant="outline">Left</button>
          <button ngxsmk-button variant="outline">Center</button>
          <button ngxsmk-button variant="outline">Right</button>
        </ngxsmk-button-group>
      </showcase-example>

      <showcase-example
        title="Toggle Button"
        description="A pressable button that keeps an on/off pressed state."
        [code]="codeToggleButton"
        [component]="NgxsmkToggleButton"
        [customize]="customizeNgxsmkToggleButton"
      >
        <button ngxsmkToggleButton [(pressed)]="starred">
          {{ starred() ? '★ Starred' : '☆ Star' }}
        </button>
      </showcase-example>

      <showcase-example
        title="Toggle Button Group"
        description="Groups toggle buttons for formatting-style controls."
        [code]="codeToggleButtonGroup"
        [component]="NgxsmkToggleButtonGroup"
        [customize]="customizeNgxsmkToggleButtonGroup"
      >
        <ngxsmk-toggle-button-group>
          <button ngxsmkToggleButton [(pressed)]="bold">Bold</button>
          <button ngxsmkToggleButton [(pressed)]="italic">Italic</button>
          <button ngxsmkToggleButton [(pressed)]="underline">Underline</button>
        </ngxsmk-toggle-button-group>
      </showcase-example>

      <showcase-example
        title="Input"
        description="Themes native text inputs — pair it with a Form Field for labels."
        [code]="codeInput"
        [component]="NgxsmkInput"
        [customize]="customizeNgxsmkInput"
      >
        <div class="ngxsmk-sc-col" style="width: 100%; max-width: 320px">
          <ngxsmk-input type="email" placeholder="you@example.com" [(value)]="email" />
          <small>Value: {{ email() || '—' }}</small>
        </div>
      </showcase-example>

      <showcase-example
        title="Textarea"
        description="Multi-line input with a configurable row count."
        [code]="codeTextarea"
        [component]="NgxsmkTextarea"
        [customize]="customizeNgxsmkTextarea"
      >
        <ngxsmk-textarea placeholder="Share your feedback…" [rows]="4" [(value)]="feedback" />
      </showcase-example>

      <showcase-example
        title="Number Input"
        description="Numeric field with min, max, and step constraints."
        [code]="codeNumber"
        [component]="NgxsmkNumberInput"
        [customize]="customizeNgxsmkNumberInput"
      >
        <div class="ngxsmk-sc-col">
          <ngxsmk-number-input [min]="0" [max]="10" [step]="1" [(value)]="quantity" />
          <small>Quantity: {{ quantity() }}</small>
        </div>
      </showcase-example>

      <showcase-example
        title="Select"
        description="Single-choice dropdown with full keyboard nav and typeahead, themed like the input family."
        [code]="codeSelect"
        [component]="NgxsmkSelect"
        [customize]="customizeNgxsmkSelect"
      >
        <div class="ngxsmk-sc-col" style="width: 100%; max-width: 260px">
          <ngxsmk-select [options]="colors" placeholder="Pick a color" [(value)]="color" />
          <small>Selected: {{ color() || '—' }}</small>
        </div>
      </showcase-example>

      <showcase-example
        title="Multi Select"
        description="Choose several values, shown as removable tags."
        [code]="codeMultiSelect"
        [component]="NgxsmkMultiSelect"
        [customize]="customizeNgxsmkMultiSelect"
      >
        <div class="ngxsmk-sc-col" style="width: 100%; max-width: 320px">
          <ngxsmk-multi-select [options]="colors" placeholder="Add colors" [(value)]="colorList" />
          <small>{{ colorList().length }} selected</small>
        </div>
      </showcase-example>

      <showcase-example
        title="Autocomplete"
        description="Free-text input that suggests matching options as you type."
        [code]="codeAutocomplete"
        [component]="NgxsmkAutocomplete"
        [customize]="customizeNgxsmkAutocomplete"
      >
        <ngxsmk-autocomplete
          [options]="fruitOptions"
          placeholder="Search a fruit…"
          [(value)]="fruit"
        />
      </showcase-example>

      <showcase-example
        title="Combobox"
        description="Filterable dropdown that resolves to a single selected option."
        [code]="codeCombobox"
        [component]="NgxsmkCombobox"
        [customize]="customizeNgxsmkCombobox"
      >
        <ngxsmk-combobox
          [options]="countries"
          placeholder="Choose a country…"
          [(value)]="country"
        />
      </showcase-example>

      <showcase-example
        title="Typeahead"
        description="String-list search with keyboard-friendly suggestions."
        [code]="codeTypeahead"
        [component]="NgxsmkTypeahead"
        [customize]="customizeNgxsmkTypeahead"
      >
        <ngxsmk-typeahead
          [options]="frameworks"
          placeholder="Search a framework…"
          [(value)]="framework"
        />
      </showcase-example>

      <showcase-example
        title="Power Search"
        description="A search bar combined with faceted filter dropdowns."
        [code]="codePowerSearch"
        [component]="NgxsmkPowerSearch"
        [customize]="customizeNgxsmkPowerSearch"
      >
        <div class="ngxsmk-sc-col" style="width: 100%; max-width: 480px">
          <ngxsmk-power-search
            placeholder="Search issues…"
            [filters]="searchFilters"
            [(query)]="searchQuery"
          />
          <small>Query: {{ searchQuery() || '—' }}</small>
        </div>
      </showcase-example>

      <showcase-example
        title="Checkbox"
        description="Single boolean control built on a native checkbox."
        [code]="codeCheckbox"
        [component]="NgxsmkCheckbox"
        [customize]="customizeNgxsmkCheckbox"
      >
        <ngxsmk-checkbox [(checked)]="agreed">I accept the terms</ngxsmk-checkbox>
      </showcase-example>

      <showcase-example
        title="Checkbox List"
        description="Multiple checkboxes bound to an array of selected values."
        [code]="codeCheckboxList"
        [component]="NgxsmkCheckboxList"
        [customize]="customizeNgxsmkCheckboxList"
      >
        <div class="ngxsmk-sc-col">
          <ngxsmk-checkbox-list [items]="topics" [(selected)]="selectedTopics" />
          <small>{{ selectedTopics().length }} topic(s) chosen</small>
        </div>
      </showcase-example>

      <showcase-example
        title="Radio"
        description="Mutually exclusive options within a radio group."
        [code]="codeRadio"
        [component]="NgxsmkRadioGroup"
        [customize]="customizeNgxsmkRadioGroup"
      >
        <ngxsmk-radio-group [(value)]="plan">
          <ngxsmk-radio value="free">Free</ngxsmk-radio>
          <ngxsmk-radio value="pro">Pro</ngxsmk-radio>
          <ngxsmk-radio value="team">Team</ngxsmk-radio>
        </ngxsmk-radio-group>
      </showcase-example>

      <showcase-example
        title="Switch"
        description="Instant on/off toggle for settings."
        [code]="codeSwitch"
        [component]="NgxsmkSwitch"
        [customize]="customizeNgxsmkSwitch"
      >
        <ngxsmk-switch [(checked)]="notifications">Email notifications</ngxsmk-switch>
      </showcase-example>

      <showcase-example
        title="Slider"
        description="Range control for selecting a numeric value."
        [code]="codeSlider"
        [component]="NgxsmkSlider"
        [customize]="customizeNgxsmkSlider"
      >
        <div class="ngxsmk-sc-col" style="width: 100%; max-width: 320px">
          <ngxsmk-slider [min]="0" [max]="100" [step]="5" [(value)]="volume" />
          <small>Volume: {{ volume() }}</small>
        </div>
      </showcase-example>

      <datepicker-showcase />

      <showcase-example
        title="Telephone input"
        description="International phone input (ngxsmk-tel-input) with country dropdown, flags, and E.164 validation via libphonenumber-js."
        [code]="codeTelInput"
      >
        <tel-input-showcase />
      </showcase-example>

      <showcase-example
        title="Segmented Control"
        description="Compact single-choice switcher for views or modes."
        [code]="codeSegmented"
        [component]="NgxsmkSegmentedControl"
        [customize]="customizeNgxsmkSegmentedControl"
      >
        <ngxsmk-segmented-control [options]="viewOptions" [(value)]="view" />
      </showcase-example>

      <showcase-example
        title="Selector"
        description="Chip-style multi-select for tags and quick filters."
        [code]="codeSelector"
        [component]="NgxsmkSelector"
        [customize]="customizeNgxsmkSelector"
      >
        <ngxsmk-selector [options]="interests" [(selected)]="selectedInterests" />
      </showcase-example>

      <showcase-example
        title="Multi Selector"
        description="Dropdown of checkboxes with a compact summary trigger."
        [code]="codeMultiSelector"
        [component]="NgxsmkMultiSelector"
        [customize]="customizeNgxsmkMultiSelector"
      >
        <ngxsmk-multi-selector
          [options]="colors"
          placeholder="Select colors"
          [(value)]="selectorColors"
        />
      </showcase-example>

      <showcase-example
        title="Tokenizer"
        description="Enter free-form tags; press Enter to add, Backspace to remove."
        [code]="codeTokenizer"
        [component]="NgxsmkTokenizer"
        [customize]="customizeNgxsmkTokenizer"
      >
        <ngxsmk-tokenizer placeholder="Add a tag…" [(tokens)]="tags" />
      </showcase-example>

      <showcase-example
        title="Input Group"
        description="Attach text add-ons before and after an input."
        [code]="codeInputGroup"
        [component]="NgxsmkInputGroup"
      >
        <ngxsmk-input-group>
          <ngxsmk-input-group-text>$</ngxsmk-input-group-text>
          <ngxsmk-input type="text" placeholder="0.00" />
          <ngxsmk-input-group-text>USD</ngxsmk-input-group-text>
        </ngxsmk-input-group>
      </showcase-example>

      <showcase-example
        title="Field"
        description="Composable layout for a label, control, and status message."
        [code]="codeField"
        [component]="NgxsmkField"
        [customize]="customizeNgxsmkField"
      >
        <ngxsmk-field hint="Choose a unique handle.">
          <ngxsmk-field-label [required]="true">Username</ngxsmk-field-label>
          <ngxsmk-input type="text" placeholder="e.g. ada_lovelace" />
          <ngxsmk-field-status variant="error" message="This username is already taken." />
        </ngxsmk-field>
      </showcase-example>

      <showcase-example
        title="Form Field"
        description="Batteries-included wrapper wiring label, hint, and error to the control."
        [code]="codeFormField"
        [component]="NgxsmkFormField"
        [customize]="customizeNgxsmkFormField"
      >
        <ngxsmk-form-field label="Email" required error="Please enter a valid email address.">
          <ngxsmk-input type="email" placeholder="you@example.com" />
        </ngxsmk-form-field>
      </showcase-example>

      <showcase-example
        title="Checkbox List Item"
        description="Compose a multi-select list from individual NgxsmkCheckboxListItem children with their own checked state and optional descriptions."
        [code]="codeCheckboxListItem"
        [component]="NgxsmkCheckboxListItemComponent"
        [customize]="customizeNgxsmkCheckboxListItemComponent"
      >
        <div class="ngxsmk-sc-col ngxsmk-sc-surface">
          <ngxsmk-checkbox-list-item
            description="Statically typed, great tooling."
            [checked]="langs().includes('ts')"
            (changed)="toggleLang('ts', $event)"
            >TypeScript</ngxsmk-checkbox-list-item
          >
          <ngxsmk-checkbox-list-item
            description="The full-stack framework."
            [checked]="langs().includes('ng')"
            (changed)="toggleLang('ng', $event)"
            >Angular</ngxsmk-checkbox-list-item
          >
          <ngxsmk-checkbox-list-item
            description="No framework required."
            disabled
            [checked]="langs().includes('js')"
            (changed)="toggleLang('js', $event)"
            >JavaScript</ngxsmk-checkbox-list-item
          >
          <small>{{ langs().length }} language(s) chosen</small>
        </div>
      </showcase-example>
    </div>
  `,
})
export class FormsPage {
  protected readonly NgxsmkButton = NgxsmkButton;
  protected readonly NgxsmkButtonGroup = NgxsmkButtonGroup;
  protected readonly customizeNgxsmkButtonGroup = `/* Theme <ngxsmk-button-group> via design tokens */
ngxsmk-button-group {
  --ngxsmk-radius-md: ;
  --ngxsmk-space-1: ;
}`;
  protected readonly NgxsmkToggleButton = NgxsmkToggleButton;
  protected readonly customizeNgxsmkToggleButton = `/* Theme [ngxsmkToggleButton] via design tokens */
[ngxsmkToggleButton] {
  --ngxsmk-color-on-primary-container: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkToggleButtonGroup = NgxsmkToggleButtonGroup;
  protected readonly customizeNgxsmkToggleButtonGroup = `/* Theme <ngxsmk-toggle-button-group> via design tokens */
ngxsmk-toggle-button-group {
  --ngxsmk-radius-md: ;
  --ngxsmk-space-1: ;
}`;
  protected readonly NgxsmkInput = NgxsmkInput;
  protected readonly customizeNgxsmkInput = `/* Theme <ngxsmk-input> via design tokens */
ngxsmk-input {
  --ngxsmk-color-error: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-control-height: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-base: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
}`;
  protected readonly NgxsmkTextarea = NgxsmkTextarea;
  protected readonly customizeNgxsmkTextarea = `/* Theme <ngxsmk-textarea> via design tokens */
ngxsmk-textarea {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-base: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
}`;
  protected readonly NgxsmkNumberInput = NgxsmkNumberInput;
  protected readonly customizeNgxsmkNumberInput = `/* Theme <ngxsmk-number-input> via design tokens */
ngxsmk-number-input {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-control-height: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-base: ;
  --ngxsmk-space-2: ;
  --ngxsmk-text-body-md-size: ;
}`;
  protected readonly NgxsmkSelect = NgxsmkSelect;
  protected readonly customizeNgxsmkSelect = `/* Theme <ngxsmk-select> via design tokens */
ngxsmk-select {
  --ngxsmk-color-error: ;
  --ngxsmk-color-on-primary-container: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-control-height: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-base: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-shadow-lg: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-1-5: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
  --ngxsmk-text-body-sm-size: ;
  --ngxsmk-z-dropdown: ;
}`;
  protected readonly NgxsmkMultiSelect = NgxsmkMultiSelect;
  protected readonly customizeNgxsmkMultiSelect = `/* Theme <ngxsmk-multi-select> via design tokens */
ngxsmk-multi-select {
  --ngxsmk-button-disabled-opacity: ;
  --ngxsmk-color-on-primary-container: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-control-height: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-base: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-shadow-md: ;
  --ngxsmk-space-0-5: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-1-5: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-md-size: ;
  --ngxsmk-z-dropdown: ;
}`;
  protected readonly NgxsmkAutocomplete = NgxsmkAutocomplete;
  protected readonly customizeNgxsmkAutocomplete = `/* Theme <ngxsmk-autocomplete> via design tokens */
ngxsmk-autocomplete {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-shadow-lg: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-z-dropdown: ;
}`;
  protected readonly NgxsmkCombobox = NgxsmkCombobox;
  protected readonly customizeNgxsmkCombobox = `/* Theme <ngxsmk-combobox> via design tokens */
ngxsmk-combobox {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-control-height: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-shadow-lg: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
  --ngxsmk-z-dropdown: ;
}`;
  protected readonly NgxsmkTypeahead = NgxsmkTypeahead;
  protected readonly customizeNgxsmkTypeahead = `/* Theme <ngxsmk-typeahead> via design tokens */
ngxsmk-typeahead {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-shadow-lg: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-z-dropdown: ;
}`;
  protected readonly NgxsmkPowerSearch = NgxsmkPowerSearch;
  protected readonly customizeNgxsmkPowerSearch = `/* Theme <ngxsmk-power-search> via design tokens */
ngxsmk-power-search {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-control-height: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
}`;
  protected readonly NgxsmkCheckbox = NgxsmkCheckbox;
  protected readonly customizeNgxsmkCheckbox = `/* Theme <ngxsmk-checkbox> via design tokens */
ngxsmk-checkbox {
  --ngxsmk-color-on-primary: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-2: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
}`;
  protected readonly NgxsmkCheckboxList = NgxsmkCheckboxList;
  protected readonly customizeNgxsmkCheckboxList = `/* Theme <ngxsmk-checkbox-list> via design tokens */
ngxsmk-checkbox-list {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-space-2: ;
}`;
  protected readonly NgxsmkRadioGroup = NgxsmkRadioGroup;
  protected readonly customizeNgxsmkRadioGroup = `/* Theme <ngxsmk-radio-group> via design tokens */
ngxsmk-radio-group {
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkSwitch = NgxsmkSwitch;
  protected readonly customizeNgxsmkSwitch = `/* Theme <ngxsmk-switch> via design tokens */
ngxsmk-switch {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-shadow-sm: ;
  --ngxsmk-space-2: ;
  --ngxsmk-switch-bg: ;
  --ngxsmk-switch-checked-bg: ;
  --ngxsmk-switch-height: ;
  --ngxsmk-switch-radius: ;
  --ngxsmk-switch-thumb-bg: ;
  --ngxsmk-switch-thumb-size: ;
  --ngxsmk-switch-width: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
}`;
  protected readonly NgxsmkSlider = NgxsmkSlider;
  protected readonly customizeNgxsmkSlider = `/* Theme <ngxsmk-slider> via design tokens */
ngxsmk-slider {
  --ngxsmk-color-primary: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-space-2: ;
}`;
  protected readonly NgxsmkSegmentedControl = NgxsmkSegmentedControl;
  protected readonly customizeNgxsmkSegmentedControl = `/* Theme <ngxsmk-segmented-control> via design tokens */
ngxsmk-segmented-control {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-shadow-sm: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-1-5: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkSelector = NgxsmkSelector;
  protected readonly customizeNgxsmkSelector = `/* Theme <ngxsmk-selector> via design tokens */
ngxsmk-selector {
  --ngxsmk-color-on-primary-container: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkMultiSelector = NgxsmkMultiSelector;
  protected readonly customizeNgxsmkMultiSelector = `/* Theme <ngxsmk-multi-selector> via design tokens */
ngxsmk-multi-selector {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-base: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-shadow-md: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
  --ngxsmk-z-popover: ;
}`;
  protected readonly NgxsmkTokenizer = NgxsmkTokenizer;
  protected readonly customizeNgxsmkTokenizer = `/* Theme <ngxsmk-tokenizer> via design tokens */
ngxsmk-tokenizer {
  --ngxsmk-color-on-primary-container: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-0-5: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
}`;
  protected readonly NgxsmkInputGroup = NgxsmkInputGroup;
  protected readonly NgxsmkField = NgxsmkField;
  protected readonly customizeNgxsmkField = `/* Theme <ngxsmk-field> via design tokens */
ngxsmk-field {
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkFormField = NgxsmkFormField;
  protected readonly customizeNgxsmkFormField = `/* Theme <ngxsmk-form-field> via design tokens */
ngxsmk-form-field {
  --ngxsmk-color-error: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-space-1-5: ;
  --ngxsmk-text-body-sm-line: ;
  --ngxsmk-text-body-sm-size: ;
  --ngxsmk-text-label-lg-line: ;
  --ngxsmk-text-label-lg-size: ;
  --ngxsmk-text-label-lg-weight: ;
}`;
  protected readonly NgxsmkCheckboxListItemComponent = NgxsmkCheckboxListItemComponent;
  protected readonly customizeNgxsmkCheckboxListItemComponent = `/* Theme <ngxsmk-checkbox-list-item> via design tokens */
ngxsmk-checkbox-list-item {
  --ngxsmk-color-on-primary: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-base: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-0-5: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
  --ngxsmk-text-body-sm-line: ;
  --ngxsmk-text-body-sm-size: ;
}`;

  protected readonly colors: Option[] = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
  ];
  protected readonly fruitOptions: Option[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'apricot', label: 'Apricot' },
    { value: 'banana', label: 'Banana' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'mango', label: 'Mango' },
  ];
  protected readonly countries: Option[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'jp', label: 'Japan' },
    { value: 'lk', label: 'Sri Lanka' },
  ];
  protected readonly frameworks = ['Angular', 'React', 'Vue', 'Svelte', 'Solid', 'Qwik'];
  protected readonly topics = [
    { value: 'news', label: 'Product news' },
    { value: 'tips', label: 'Tips & tricks' },
    { value: 'events', label: 'Events' },
  ];
  protected readonly interests: Option[] = [
    { value: 'design', label: 'Design' },
    { value: 'code', label: 'Engineering' },
    { value: 'ai', label: 'AI' },
    { value: 'product', label: 'Product' },
  ];
  protected readonly viewOptions: Option[] = [
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'board', label: 'Board' },
  ];
  protected readonly searchFilters = [
    {
      id: 'status',
      label: 'Status',
      items: [
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' },
      ],
    },
    {
      id: 'type',
      label: 'Type',
      items: [
        { value: 'bug', label: 'Bug' },
        { value: 'feat', label: 'Feature' },
      ],
    },
  ];

  protected readonly starred = signal(false);
  protected readonly bold = signal(true);
  protected readonly italic = signal(false);
  protected readonly underline = signal(false);
  protected readonly email = signal('');
  protected readonly feedback = signal('');
  protected readonly quantity = signal(2);
  protected readonly color = signal('green');
  protected readonly colorList = signal<string[]>(['red']);
  protected readonly fruit = signal('');
  protected readonly country = signal('');
  protected readonly framework = signal('');
  protected readonly searchQuery = signal('');
  protected readonly agreed = signal(false);
  protected readonly selectedTopics = signal<string[]>(['news']);
  protected readonly plan = signal<unknown>('pro');
  protected readonly notifications = signal(true);
  protected readonly volume = signal(40);
  protected readonly view = signal('list');
  protected readonly selectedInterests = signal<string[]>(['design', 'ai']);
  protected readonly selectorColors = signal<string[]>([]);
  protected readonly tags = signal<string[]>(['angular', 'signals']);
  protected readonly langs = signal<string[]>(['ts', 'ng']);

  protected toggleLang(value: string, checked: boolean): void {
    this.langs.update((curr) =>
      checked ? [...new Set([...curr, value])] : curr.filter((v) => v !== value),
    );
  }

  protected readonly codeButton = `<button ngxsmk-button variant="primary">Primary</button>\n<button ngxsmk-button loading>Saving</button>\n<button ngxsmk-button [disabled]="true">Disabled</button>`;
  protected readonly codeButtonGroup = `<ngxsmk-button-group>\n  <button ngxsmk-button variant="outline">Left</button>\n  <button ngxsmk-button variant="outline">Right</button>\n</ngxsmk-button-group>`;
  protected readonly codeToggleButton = `<button ngxsmkToggleButton [(pressed)]="starred">Star</button>`;
  protected readonly codeToggleButtonGroup = `<ngxsmk-toggle-button-group>\n  <button ngxsmkToggleButton [(pressed)]="bold">Bold</button>\n  <button ngxsmkToggleButton [(pressed)]="italic">Italic</button>\n</ngxsmk-toggle-button-group>`;
  protected readonly codeInput = `<ngxsmk-input type="email" placeholder="you@example.com" [(value)]="email" />`;
  protected readonly codeTextarea = `<ngxsmk-textarea [rows]="4" [(value)]="feedback" placeholder="Share your feedback…" />`;
  protected readonly codeNumber = `<ngxsmk-number-input [min]="0" [max]="10" [step]="1" [(value)]="quantity" />`;
  protected readonly codeSelect = `<ngxsmk-select [options]="colors" [(value)]="color" placeholder="Pick a color" />`;
  protected readonly codeMultiSelect = `<ngxsmk-multi-select [options]="colors" [(value)]="colorList" placeholder="Add colors" />`;
  protected readonly codeAutocomplete = `<ngxsmk-autocomplete [options]="fruitOptions" [(value)]="fruit" placeholder="Search a fruit…" />`;
  protected readonly codeCombobox = `<ngxsmk-combobox [options]="countries" [(value)]="country" placeholder="Choose a country…" />`;
  protected readonly codeTypeahead = `<ngxsmk-typeahead [options]="frameworks" [(value)]="framework" placeholder="Search a framework…" />`;
  protected readonly codePowerSearch = `<ngxsmk-power-search [filters]="searchFilters" [(query)]="searchQuery" placeholder="Search issues…" />`;
  protected readonly codeCheckbox = `<ngxsmk-checkbox [(checked)]="agreed">I accept the terms</ngxsmk-checkbox>`;
  protected readonly codeCheckboxList = `<ngxsmk-checkbox-list [items]="topics" [(selected)]="selectedTopics" />`;
  protected readonly codeRadio = `<ngxsmk-radio-group [(value)]="plan">\n  <ngxsmk-radio value="free">Free</ngxsmk-radio>\n  <ngxsmk-radio value="pro">Pro</ngxsmk-radio>\n</ngxsmk-radio-group>`;
  protected readonly codeSwitch = `<ngxsmk-switch [(checked)]="notifications">Email notifications</ngxsmk-switch>`;
  protected readonly codeSlider = `<ngxsmk-slider [min]="0" [max]="100" [step]="5" [(value)]="volume" />`;
  protected readonly codeTelInput = `<ngxsmk-tel-input [ngModel]="phone()" (ngModelChange)="phone.set($event)" label="Phone" hint="Include area code" [initialCountry]="'US'" [separateDialCode]="true" />`; // requires NO_ERRORS_SCHEMA (see TelInputShowcase)
  protected readonly codeSegmented = `<ngxsmk-segmented-control [options]="viewOptions" [(value)]="view" />`;
  protected readonly codeSelector = `<ngxsmk-selector [options]="interests" [(selected)]="selectedInterests" />`;
  protected readonly codeMultiSelector = `<ngxsmk-multi-selector [options]="colors" [(value)]="selectorColors" placeholder="Select colors" />`;
  protected readonly codeTokenizer = `<ngxsmk-tokenizer [(tokens)]="tags" placeholder="Add a tag…" />`;
  protected readonly codeInputGroup = `<ngxsmk-input-group>\n  <ngxsmk-input-group-text>$</ngxsmk-input-group-text>\n  <ngxsmk-input placeholder="0.00" />\n  <ngxsmk-input-group-text>USD</ngxsmk-input-group-text>\n</ngxsmk-input-group>`;
  protected readonly codeField = `<ngxsmk-field hint="Choose a unique handle.">\n  <ngxsmk-field-label [required]="true">Username</ngxsmk-field-label>\n  <ngxsmk-input placeholder="e.g. ada_lovelace" />\n  <ngxsmk-field-status variant="error" message="This username is already taken." />\n</ngxsmk-field>`;
  protected readonly codeFormField = `<ngxsmk-form-field label="Email" required error="Please enter a valid email address.">\n  <ngxsmk-input type="email" placeholder="you@example.com" />\n</ngxsmk-form-field>`;
  protected readonly codeCheckboxListItem = `<ngxsmk-checkbox-list-item\n  description="Statically typed, great tooling."\n  [checked]="langs().includes('ts')"\n  (changed)="toggleLang('ts', $event)"\n>TypeScript</ngxsmk-checkbox-list-item>\n<ngxsmk-checkbox-list-item\n  [checked]="langs().includes('ng')"\n  (changed)="toggleLang('ng', $event)"\n>Angular</ngxsmk-checkbox-list-item>`;
}
