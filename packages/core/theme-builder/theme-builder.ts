import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgxsmkThemeService } from '@ngxsmk/theme';
import { ThemeConfig, RadiusPreset, DarkModeStrategy } from '@ngxsmk/theme';
import { buildThemeCss } from '@ngxsmk/theme';
import { NgxsmkSelect, NgxsmkSelectOption } from '@ngxsmk/core/select';

@Component({
  standalone: true,
  selector: 'ngxsmk-theme-builder',
  imports: [NgxsmkSelect],
  template: `
    <div class="ngxsmk-theme-builder">
      <h3 class="ngxsmk-theme-builder__title">Visual Theme Builder</h3>

      <div class="ngxsmk-theme-builder__grid">
        <div class="ngxsmk-theme-builder__controls">
          <div class="ngxsmk-theme-builder__control-group">
            <h4 class="ngxsmk-theme-builder__subtitle">Colors</h4>
            <div class="ngxsmk-theme-builder__field">
              <label for="primaryColor">Primary Brand Color</label>
              <div class="ngxsmk-theme-builder__color-input">
                <input
                  type="color"
                  id="primaryColor"
                  [value]="primaryColor()"
                  (input)="updatePrimaryColor($event)"
                />
                <span>{{ primaryColor() }}</span>
              </div>
            </div>
            <div class="ngxsmk-theme-builder__field">
              <label for="secondaryColor">Secondary Brand Color</label>
              <div class="ngxsmk-theme-builder__color-input">
                <input
                  type="color"
                  id="secondaryColor"
                  [value]="secondaryColor()"
                  (input)="updateSecondaryColor($event)"
                />
                <span>{{ secondaryColor() }}</span>
              </div>
            </div>
          </div>

          <div class="ngxsmk-theme-builder__control-group">
            <h4 class="ngxsmk-theme-builder__subtitle">Layout & Behavior</h4>
            <div class="ngxsmk-theme-builder__field">
              <label for="borderRadius">Border Radius</label>
              <ngxsmk-select
                id="borderRadius"
                [options]="borderRadiusOptions"
                [value]="borderRadius()"
                (changed)="updateBorderRadius($event)"
              />
            </div>
            <div class="ngxsmk-theme-builder__field">
              <label for="darkMode">Dark Mode Strategy</label>
              <ngxsmk-select
                id="darkMode"
                [options]="darkModeOptions"
                [value]="darkModeStrategy()"
                (changed)="updateDarkModeStrategy($event)"
              />
            </div>
          </div>
        </div>

        <div class="ngxsmk-theme-builder__preview">
          <div class="ngxsmk-theme-builder__preview-header">
            <h4 class="ngxsmk-theme-builder__subtitle">Generated Code</h4>
            <div class="ngxsmk-theme-builder__tabs">
              <button
                [class.active]="activeTab() === 'json'"
                (click)="activeTab.set('json')"
              >
                JSON
              </button>
              <button
                [class.active]="activeTab() === 'css'"
                (click)="activeTab.set('css')"
              >
                CSS
              </button>
            </div>
          </div>
          <div class="ngxsmk-theme-builder__code-wrapper">
            <pre><code>{{ generatedCode() }}</code></pre>
            <button
              type="button"
              class="ngxsmk-theme-builder__copy-btn"
              (click)="copyToClipboard()"
            >
              {{ copyStatus() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      padding: var(--ngxsmk-space-6);
      box-shadow: var(--ngxsmk-shadow-lg);
    }

    .ngxsmk-theme-builder__title {
      margin: 0 0 var(--ngxsmk-space-6) 0;
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: 600;
    }

    .ngxsmk-theme-builder__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--ngxsmk-space-6);
    }

    @media (min-width: 768px) {
      .ngxsmk-theme-builder__grid {
        grid-template-columns: 1fr 1.2fr;
      }
    }

    .ngxsmk-theme-builder__subtitle {
      margin: 0 0 var(--ngxsmk-space-4) 0;
      font-size: var(--ngxsmk-text-title-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-theme-builder__control-group {
      margin-bottom: var(--ngxsmk-space-6);
    }

    .ngxsmk-theme-builder__field {
      margin-bottom: var(--ngxsmk-space-4);
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
    }

    .ngxsmk-theme-builder__field label {
      font-size: var(--ngxsmk-text-label-sm-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-theme-builder__color-input {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
    }

    .ngxsmk-theme-builder__color-input input[type='color'] {
      border: none;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      border-radius: var(--ngxsmk-radius-md);
      cursor: pointer;
      background: transparent;
    }



    .ngxsmk-theme-builder__preview {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      overflow: hidden;
      background: var(--ngxsmk-color-background);
    }

    .ngxsmk-theme-builder__preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface-variant);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-theme-builder__preview-header .ngxsmk-theme-builder__subtitle {
      margin: 0;
    }

    .ngxsmk-theme-builder__tabs {
      display: flex;
      gap: var(--ngxsmk-space-1);
    }

    .ngxsmk-theme-builder__tabs button {
      background: transparent;
      border: none;
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      font-size: var(--ngxsmk-text-label-sm-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      border-radius: var(--ngxsmk-radius-sm);
    }
    .ngxsmk-theme-builder__tabs button.active {
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
    }

    .ngxsmk-theme-builder__code-wrapper {
      position: relative;
      flex: 1;
      padding: var(--ngxsmk-space-4);
      min-height: 250px;
      max-height: 400px;
      overflow-y: auto;
    }

    .ngxsmk-theme-builder__code-wrapper pre {
      margin: 0;
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      white-space: pre-wrap;
      word-break: break-all;
    }

    .ngxsmk-theme-builder__copy-btn {
      position: absolute;
      top: var(--ngxsmk-space-4);
      right: var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      padding: var(--ngxsmk-space-1) var(--ngxsmk-space-3);
      border-radius: var(--ngxsmk-radius-sm);
      cursor: pointer;
      font-size: var(--ngxsmk-text-label-sm-size);
      transition: background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-theme-builder__copy-btn:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkThemeBuilder {
  private readonly themeService = inject(NgxsmkThemeService);

  protected readonly primaryColor = signal('#7C3AED');
  protected readonly secondaryColor = signal('#2A333B');
  protected readonly borderRadius = signal<RadiusPreset>('md');
  protected readonly darkModeStrategy = signal<DarkModeStrategy>('class');
  protected readonly activeTab = signal<'json' | 'css'>('json');
  protected readonly copyStatus = signal('Copy');

  protected readonly borderRadiusOptions: NgxsmkSelectOption[] = [
    { value: 'none', label: 'None (0px)' },
    { value: 'sm', label: 'Small (4px)' },
    { value: 'md', label: 'Medium (8px)' },
    { value: 'lg', label: 'Large (12px)' },
    { value: 'xl', label: 'Extra Large (16px)' },
  ];
  protected readonly darkModeOptions: NgxsmkSelectOption[] = [
    { value: 'class', label: 'Class-based (.dark)' },
    { value: 'media', label: 'Media Query (OS Preference)' },
    { value: 'system', label: 'System (Hybrid)' },
  ];

  protected readonly resolvedConfig = computed<ThemeConfig>(() => ({
    name: 'custom-theme',
    brand: {
      primary: this.primaryColor(),
      secondary: this.secondaryColor(),
    },
    borderRadius: this.borderRadius(),
    darkMode: {
      strategy: this.darkModeStrategy(),
    },
  }));

  protected readonly generatedCode = computed(() => {
    const config = this.resolvedConfig();
    if (this.activeTab() === 'json') {
      return JSON.stringify(config, null, 2);
    }
    return buildThemeCss(config);
  });

  protected updatePrimaryColor(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.primaryColor.set(val);
    this.applyThemeChanges();
  }

  protected updateSecondaryColor(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.secondaryColor.set(val);
    this.applyThemeChanges();
  }

  protected updateBorderRadius(value: string): void {
    this.borderRadius.set(value as RadiusPreset);
    this.applyThemeChanges();
  }

  protected updateDarkModeStrategy(value: string): void {
    this.darkModeStrategy.set(value as DarkModeStrategy);
    this.applyThemeChanges();
  }

  private applyThemeChanges(): void {
    this.themeService.applyTheme(this.resolvedConfig());
  }

  protected copyToClipboard(): void {
    const code = this.generatedCode();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        this.copyStatus.set('Copied!');
        setTimeout(() => this.copyStatus.set('Copy'), 2000);
      });
    }
  }
}
