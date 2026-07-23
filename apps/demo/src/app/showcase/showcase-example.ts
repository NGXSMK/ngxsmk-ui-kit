import { Component, computed, input, signal, Type, reflectComponentType } from '@angular/core';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { TranslatePipe } from '@ngx-translate/core';

type ApiPanel = 'code' | 'api' | 'customize';

interface ApiInput {
  readonly propName: string;
  readonly templateName: string;
  readonly transform?: (value: unknown) => unknown;
  readonly isSignal: boolean;
}

interface ApiOutput {
  readonly propName: string;
  readonly templateName: string;
}

/**
 * Reusable showcase block: a titled, described live demo of a single
 * component (or small group of related components) with an optional
 * collapsible code snippet. Used by every category page so the whole
 * demo stays consistent.
 */
@Component({
  selector: 'showcase-example',
  standalone: true,
  imports: [NgxsmkButton, TranslatePipe],
  host: {
    '[attr.id]': 'elementId()',
  },
  template: `
    <div class="ngxsmk-sc-ex">
      <div class="ngxsmk-sc-ex__head">
        <div class="ngxsmk-sc-ex__heading">
          <h3 class="ngxsmk-sc-ex__title">{{ title() }}</h3>
          @if (description()) {
            <p class="ngxsmk-sc-ex__desc">{{ description() }}</p>
          }
        </div>
        <div class="ngxsmk-sc-ex__actions">
          @if (code()) {
            <button
              ngxsmk-button
              size="sm"
              variant="ghost"
              [attr.aria-pressed]="panel() === 'code'"
              (click)="toggle('code')"
            >
              {{
                panel() === 'code'
                  ? ('showcaseExample.hideCode' | translate)
                  : ('showcaseExample.showCode' | translate)
              }}
            </button>
            <button
              ngxsmk-button
              size="sm"
              variant="ghost"
              (click)="openStackBlitz()"
              aria-label="Open in StackBlitz"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              StackBlitz
            </button>
          }
          @if (component()) {
            <button
              ngxsmk-button
              size="sm"
              variant="ghost"
              [attr.aria-pressed]="panel() === 'api'"
              (click)="toggle('api')"
            >
              {{ 'showcaseExample.api' | translate }}
            </button>
          }
          @if (customize()) {
            <button
              ngxsmk-button
              size="sm"
              variant="ghost"
              [attr.aria-pressed]="panel() === 'customize'"
              (click)="toggle('customize')"
            >
              {{ 'showcaseExample.customize' | translate }}
            </button>
          }
        </div>
      </div>

      <div class="ngxsmk-sc-ex__preview">
        <ng-content />
      </div>

      @if (panel() === 'code' && code()) {
        <pre class="ngxsmk-sc-ex__code"><code>{{ code() }}</code></pre>
      }

      @if (panel() === 'api' && component()) {
        <div class="ngxsmk-sc-ex__api">
          @if (inputs().length) {
            <h4 class="ngxsmk-sc-ex__api-title">
              {{ 'showcaseExample.inputsProperties' | translate }}
            </h4>
            <div class="ngxsmk-sc-ex__table-wrap">
              <table class="ngxsmk-sc-ex__table">
                <thead>
                  <tr>
                    <th>{{ 'showcaseExample.thProperty' | translate }}</th>
                    <th>{{ 'showcaseExample.thAttribute' | translate }}</th>
                    <th>{{ 'showcaseExample.thKind' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  @for (i of inputs(); track i.propName) {
                    <tr>
                      <td>
                        <code>{{ i.propName }}</code>
                      </td>
                      <td>
                        <code>{{ i.templateName }}</code>
                      </td>
                      <td>
                        {{
                          isModel(i.propName)
                            ? ('showcaseExample.twoWay' | translate)
                            : i.isSignal
                              ? ('showcaseExample.signal' | translate)
                              : ('showcaseExample.regular' | translate)
                        }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
          @if (outputs().length) {
            <h4 class="ngxsmk-sc-ex__api-title">
              {{ 'showcaseExample.outputsEvents' | translate }}
            </h4>
            <div class="ngxsmk-sc-ex__table-wrap">
              <table class="ngxsmk-sc-ex__table">
                <thead>
                  <tr>
                    <th>{{ 'showcaseExample.thProperty' | translate }}</th>
                    <th>{{ 'showcaseExample.thEvent' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  @for (o of outputs(); track o.propName) {
                    <tr>
                      <td>
                        <code>{{ o.propName }}</code>
                      </td>
                      <td>
                        <code>{{ o.templateName }}</code>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
          <p class="ngxsmk-sc-ex__api-note">
            Customize through design tokens - override the component's <code>--ngxsmk-*</code>
            variables on the host element or at the theme level. Switch to the
            <strong>Customize</strong> tab for a concrete snippet.
          </p>
        </div>
      }

      @if (panel() === 'customize' && customize()) {
        <pre class="ngxsmk-sc-ex__code"><code>{{ customize() }}</code></pre>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .ngxsmk-sc-ex {
      width: 100%;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      margin-block-end: var(--ngxsmk-space-6, 1.5rem);
    }

    .ngxsmk-sc-ex__head {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
      padding: var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-5, 1.25rem);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-sc-ex__heading {
      min-width: 0;
    }

    .ngxsmk-sc-ex__title {
      margin: 0;
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: var(--ngxsmk-text-body-md-size);
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-sc-ex__desc {
      margin: 0.25rem 0 0;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: 1.5;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-sc-ex__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-2, 0.5rem);
      flex-shrink: 0;
    }

    .ngxsmk-sc-ex__preview {
      padding: var(--ngxsmk-space-6, 1.5rem);
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-4, 1rem);
      align-items: center;
    }

    .ngxsmk-sc-ex__code {
      margin: 0;
      padding: var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-5, 1.25rem);
      border-top: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
      border-bottom-left-radius: calc(var(--ngxsmk-radius-lg, 0.5rem) - 1px);
      border-bottom-right-radius: calc(var(--ngxsmk-radius-lg, 0.5rem) - 1px);
    }

    .ngxsmk-sc-ex__api {
      padding: var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-5, 1.25rem);
      border-top: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-sc-ex__api-title {
      margin: 0 0 var(--ngxsmk-space-2, 0.5rem);
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-sc-ex__api-title + .ngxsmk-sc-ex__api-title {
      margin-top: var(--ngxsmk-space-4, 1rem);
    }

    .ngxsmk-sc-ex__table-wrap {
      overflow-x: auto;
    }

    .ngxsmk-sc-ex__table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--ngxsmk-text-body-sm-size);
    }

    .ngxsmk-sc-ex__table th,
    .ngxsmk-sc-ex__table td {
      text-align: left;
      padding: 0.35rem 0.75rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      color: var(--ngxsmk-color-on-surface, #09090b);
      white-space: nowrap;
    }

    .ngxsmk-sc-ex__table th {
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-sc-ex__table code {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
    }

    .ngxsmk-sc-ex__api-note {
      margin: var(--ngxsmk-space-4, 1rem) 0 0;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: 1.55;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-sc-ex__api-note code {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
    }

    @media (max-width: 480px) {
      .ngxsmk-sc-ex__head {
        padding: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
      }
      .ngxsmk-sc-ex__preview {
        padding: var(--ngxsmk-space-4, 1rem);
      }
      .ngxsmk-sc-ex__code,
      .ngxsmk-sc-ex__api {
        padding: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
      }
    }
  `,
})
export class ShowcaseExample {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  /** Optional source snippet shown in a collapsible panel. */
  readonly code = input<string>('');
  /**
   * Optional component class. When provided, the "API" panel lists the
   * component's public inputs (properties + attributes) and outputs,
   * extracted at runtime via `reflectComponentType`.
   */
  readonly component = input<Type<unknown> | null>(null);
  /** Optional customization snippet shown in the "Customize" panel. */
  readonly customize = input<string>('');

  protected readonly panel = signal<ApiPanel | null>(null);

  protected toggle(panel: ApiPanel): void {
    this.panel.update((current) => (current === panel ? null : panel));
  }

  protected readonly metadata = computed(() => {
    const component = this.component();
    return component ? reflectComponentType(component as Type<unknown>) : null;
  });

  protected readonly inputs = computed<readonly ApiInput[]>(() => this.metadata()?.inputs ?? []);

  protected readonly outputs = computed<readonly ApiOutput[]>(() => this.metadata()?.outputs ?? []);

  /** Names of the component's outputs, used to detect two-way (`model`) inputs. */
  protected readonly outputNames = computed(() => new Set(this.outputs().map((o) => o.propName)));

  /** A `model()` input exposes a `propNameChange` output - mark it as two-way. */
  protected isModel(propName: string): boolean {
    return this.outputNames().has(`${propName}Change`);
  }

  protected readonly elementId = computed(() => {
    return this.title()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
  });

  protected openStackBlitz(): void {
    if (typeof document === 'undefined') return;
    if (!this.code()) return;

    const project = {
      title: `NGXSMK - ${this.title()}`,
      description: this.description() || 'NGXSMK Component Live Sandbox',
      template: 'node' as const,
      files: {
        'package.json': JSON.stringify(
          {
            name: 'ngxsmk-demo',
            version: '0.0.0',
            scripts: {
              start: 'ng serve',
              build: 'ng build',
            },
            dependencies: {
              '@angular/core': '^19.0.0',
              '@angular/common': '^19.0.0',
              '@angular/compiler': '^19.0.0',
              '@angular/forms': '^19.0.0',
              '@angular/platform-browser': '^19.0.0',
              '@angular/platform-browser-dynamic': '^19.0.0',
              '@angular/router': '^19.0.0',
              '@ngxsmk/core': 'latest',
              '@ngxsmk/theme': 'latest',
              rxjs: '~7.8.0',
              tslib: '^2.3.0',
              'zone.js': '~0.15.0',
            },
            devDependencies: {
              '@angular-devkit/build-angular': '^19.0.0',
              '@angular/cli': '^19.0.0',
              '@angular/compiler-cli': '^19.0.0',
              typescript: '~5.6.0',
            },
          },
          null,
          2,
        ),
        'angular.json': JSON.stringify(
          {
            $schema: './node_modules/@angular/cli/lib/config/schema.json',
            version: 1,
            newProjectRoot: 'projects',
            projects: {
              demo: {
                projectType: 'application',
                root: '',
                sourceRoot: 'src',
                architect: {
                  build: {
                    builder: '@angular-devkit/build-angular:application',
                    options: {
                      outputPath: 'dist/demo',
                      index: 'src/index.html',
                      browser: 'src/main.ts',
                      polyfills: ['zone.js'],
                      tsConfig: 'tsconfig.app.json',
                      styles: ['src/styles.css'],
                    },
                  },
                  serve: {
                    builder: '@angular-devkit/build-angular:dev-server',
                    options: { buildTarget: 'demo:build' },
                  },
                },
              },
            },
          },
          null,
          2,
        ),
        'tsconfig.json': JSON.stringify(
          {
            compileOnSave: false,
            compilerOptions: {
              outDir: './dist/out-tsc',
              forceConsistentCasingInFileNames: true,
              strict: false,
              noImplicitOverride: true,
              noPropertyAccessFromIndexSignature: false,
              noImplicitReturns: true,
              noFallthroughCasesInSwitch: true,
              sourceMap: true,
              declaration: false,
              downlevelIteration: true,
              experimentalDecorators: true,
              moduleResolution: 'node',
              importHelpers: true,
              target: 'ES2022',
              module: 'ES2022',
              useDefineForClassFields: false,
              lib: ['ES2022', 'dom'],
            },
            angularCompilerOptions: { enableI18nLegacyMessageIdFormat: false },
          },
          null,
          2,
        ),
        'tsconfig.app.json': JSON.stringify(
          {
            extends: './tsconfig.json',
            compilerOptions: {
              outDir: './out-tsc/app',
              types: [],
            },
            files: ['src/main.ts'],
            include: ['src/**/*.d.ts'],
          },
          null,
          2,
        ),
        'src/index.html':
          '<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><title>Demo</title><base href="/"><meta name="viewport" content="width=device-width, initial-scale=1"></head>\n<body><app-root></app-root></body>\n</html>',
        'src/main.ts': [
          "import { bootstrapApplication } from '@angular/platform-browser';",
          "import { AppComponent } from './app/app.component';",
          '',
          'bootstrapApplication(AppComponent);',
        ].join('\n'),
        'src/app/app.component.ts': [
          "import { Component } from '@angular/core';",
          "import { DemoComponent } from './demo.component';",
          '',
          '@Component({',
          "  selector: 'app-root',",
          '  imports: [DemoComponent],',
          "  template: '<app-demo />',",
          '})',
          'export class AppComponent {}',
        ].join('\n'),
        'src/app/demo.component.ts': [
          "import { Component } from '@angular/core';",
          '',
          '@Component({',
          "  selector: 'app-demo',",
          '  template: `' +
            this.code().replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$') +
            '`,',
          '})',
          'export class DemoComponent {}',
        ].join('\n'),
        'src/styles.css':
          "@import '@ngxsmk/theme/css';\n\nbody { font-family: system-ui, sans-serif; padding: 2rem; }\n",
      },
    };

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@stackblitz/sdk@1/bundles/sdk.umd.js';
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sdk = (window as any).StackBlitzSDK as
        { openProject: (project: unknown, opts?: Record<string, unknown>) => void } | undefined;
      if (sdk) {
        sdk.openProject(project, {
          newWindow: true,
          openFile: 'src/app/demo.component.ts',
        });
      } else {
        this.fallbackFormPost(project);
      }
    };
    script.onerror = () => this.fallbackFormPost(project);
    document.body.appendChild(script);
  }

  private fallbackFormPost(project: {
    title: string;
    description: string;
    files: Record<string, string>;
  }): void {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://stackblitz.com/run';
    form.target = '_blank';
    form.style.display = 'none';

    const addField = (name: string, value: string) => {
      const field = document.createElement('input');
      field.type = 'hidden';
      field.name = name;
      field.value = value;
      form.appendChild(field);
    };

    addField('project[title]', project.title);
    addField('project[description]', project.description);
    addField('project[template]', 'angular-cli');
    addField(
      'project[dependencies]',
      JSON.stringify({
        '@angular/core': '^19.0.0',
        '@angular/common': '^19.0.0',
        '@angular/forms': '^19.0.0',
        '@ngxsmk/core': 'latest',
        '@ngxsmk/theme': 'latest',
        rxjs: '~7.8.0',
        tslib: '^2.3.0',
      }),
    );

    for (const [path, content] of Object.entries(project.files)) {
      addField(`project[files][${path}]`, content);
    }

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => document.body.removeChild(form), 100);
  }
}
