# @ngxsmk/cdk

Low-level, zoneless-friendly Angular behaviors that power NGXSMK components. Each behavior is its own secondary entry point, so you only bundle what you import.

Part of the [NGXSMK UI kit](https://github.com/NGXSMK/ngxsmk-ui-kit).

## Compatibility

- Angular **17.3+**
- `zone.js` optional (zoneless-friendly)

## Install

```bash
npm install @ngxsmk/cdk
```

`@ngxsmk/cdk` depends only on `@angular/core` and `@angular/common`.

## Usage

### Click outside

Emits when a pointer press lands outside the host element.

```html
<div class="menu" (ngxsmkClickOutside)="close()">…</div>
```

```ts
import { NgxsmkClickOutside } from '@ngxsmk/cdk/click-outside';
```

### Focus trap

Traps Tab focus inside a container. `ngxsmkFocusTrapAutoCapture` moves focus in on init and restores the previously focused element on destroy.

```html
<div ngxsmkFocusTrap ngxsmkFocusTrapAutoCapture>…</div>
```

### Scroll lock

Reference-counted body scroll lock for dialogs, drawers, and sheets. Compensates for scrollbar width to avoid layout shift.

```ts
import { NgxsmkScrollLock } from '@ngxsmk/cdk/scroll-lock';

constructor(private lock: NgxsmkScrollLock) {}
open() { this.lock.lock(); }
close() { this.lock.unlock(); }
```

### Live announcer

Announces messages to assistive technology via a visually hidden `aria-live` region.

```ts
import { NgxsmkLiveAnnouncer } from '@ngxsmk/cdk/live-announcer';

this.announcer.announce('Item deleted', 'polite');
```

### Media query

Reactive, signal-based media-query helper (call in an injection context).

```ts
import { injectMediaQuery } from '@ngxsmk/cdk/media-query';

private readonly isMobile = injectMediaQuery('(max-width: 767px)');
```

### Visually hidden

Hides content visually while keeping it available to screen readers.

```html
<span ngxsmkVisuallyHidden>Opens in a new window</span>
```

## Entry points

`click-outside`, `focusable`, `focus-trap`, `live-announcer`, `media-query`, `scroll-lock`, `visually-hidden`, `intersection-observer`, `resize-observer`, `autofocus`, `testing`.

Prefer deep imports (e.g. `@ngxsmk/cdk/click-outside`) so the bundler tree-shakes unused behaviors.
