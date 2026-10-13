# Installing and Configuring NGXSMK

Get up and running with **NGXSMK** in your Angular application in less than 2 minutes.

---

## 1. Prerequisites

- **Angular**: Version `17.3.0` or later (Angular 18, 19, 20+ fully supported).
- **Node.js**: Version `20.x` or `22.x` LTS.

---

## 2. Step 1: Install Packages

Run the following command in your terminal:

```bash
npm install @ngxsmk/core @ngxsmk/theme @ngxsmk/cdk
```

Heavy peers (datepicker, tel-input, motion, `@angular/cdk` for select) are
**optional** — install them only for the entry points you use. See the
[component tiers](../COMPONENT_TIERS.md) and the
[@ngxsmk/core README](../../packages/core/README.md).

---

## 3. Step 2: Import Theme Styles

Add the generated NGXSMK theme stylesheet to your global styles (e.g.
`src/styles.scss` or `src/styles.css`). One file covers design tokens (light +
dark) and the base styles for attribute directives like `button` / `input`:

```scss
@import '@ngxsmk/theme/styles/ngxsmk.css';
```

Or add it to the `styles` array in your `angular.json`:

```json
"styles": [
  "node_modules/@ngxsmk/theme/styles/ngxsmk.css",
  "src/styles.scss"
]
```

---

## 4. Step 3: Use Your First Component

Import the component directly into your standalone component's `imports` array:

```ts
import { Component, signal } from '@angular/core';
import { NgxsmkButton } from '@ngxsmk/core/button';
import {
  NgxsmkCard,
  NgxsmkCardHeader,
  NgxsmkCardTitle,
  NgxsmkCardContent,
} from '@ngxsmk/core/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxsmkButton, NgxsmkCard, NgxsmkCardHeader, NgxsmkCardTitle, NgxsmkCardContent],
  template: `
    <ngxsmk-card>
      <div ngxsmkCardHeader>
        <h3 ngxsmkCardTitle>Welcome to NGXSMK</h3>
      </div>
      <div ngxsmkCardContent>
        <p>Your signal-native Angular UI kit is ready!</p>
        <button ngxsmk-button variant="primary" (click)="count.set(count() + 1)">
          Clicked {{ count() }} times
        </button>
      </div>
    </ngxsmk-card>
  `,
})
export class AppComponent {
  readonly count = signal(0);
}
```

---

## 5. Step 4: Configure Zoneless (Optional but Recommended)

In your `app.config.ts`, enable zoneless change detection:

```ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection()],
};
```
