# @ngxsmk/core

## 2.1.0

### Minor Changes

- 0c2b5ad: Ionic support and Angular 17+ packaging fixes.

  **Fixed — packaging bugs that broke real consumers.** These were invisible in
  the repo (the lockfile masked them) and only surfaced once the packed tarballs
  were installed into a fresh app:

  - `@angular/cdk` was imported by `@ngxsmk/core/select` but never declared as a
    peer dependency. It is now declared.
  - `qrcode-generator` was imported by `@ngxsmk/core/qr-code` but never declared
    as a peer dependency. It is now declared.
  - The `ngxsmk-datepicker` peer range is narrowed to `>=2.3.1 <2.4.0`.
    `ngxsmk-datepicker@2.4.0` dropped the `"."` entry from its `exports` map,
    which makes `@ngxsmk/core/datepicker` — a bare `export * from
'ngxsmk-datepicker'` — unresolvable for anyone who installs it.
  - `@angular/material` is declared as an optional peer, documenting that
    `ngxsmk-tel-input` imports `@angular/material/form-field` unconditionally
    despite marking it optional itself.

  **Added — Ionic integration.**

  - `@ngxsmk/core/ionic`: `provideNgxsmkIonic()` wires the Ionic platform
    adapter, the Ionic button renderer, and a safe-area bridge in one call.
  - `@ngxsmk/cdk/platform`: `NGXSMK_PLATFORM_ADAPTER` abstracts which element
    scrolls and where overlays attach. `NgxsmkScrollLock` now locks the element
    the adapter names instead of always locking `document.body` — previously a
    silent no-op under Ionic, which scrolls inside `ion-content`. The imperative
    dialog services attach to the adapter's overlay container so overlays land
    inside `ion-app`'s stacking context.
  - `ionicVarsAdapter` is now complete: the six-variable set for all nine Ionic
    color roles, the `--ion-color-step-50`…`-950` ladder Ionic derives its
    neutrals from, surface variables, and a real dark-mode block. Previously it
    emitted a light-only `:root` block with no step ladder, so Ionic dark mode
    received no tokens at all.
  - Safe-area tokens (`--ngxsmk-safe-area-*`) backed by `env(safe-area-inset-*)`,
    applied to the toast, sheet, mobile-nav, and top-nav mega-menu.

  **Changed — `ButtonRenderer`.** `applyVariant`, `applyIconOnly`, and
  `applyDisabled` are removed. The button directive never called them; variant,
  size, and disabled state are reflected through host bindings. `IonicButtonRenderer`
  previously implemented all five methods as empty bodies; it now renders a real
  `<ion-spinner>`.

  Renderer selection moves to `NGXSMK_BUTTON_RENDERER_CLASS`, a root-level token.
  `NGXSMK_BUTTON_RENDERER` is provided by the button directive itself, and a
  directive's own providers shadow environment providers — so it could not be
  overridden from `bootstrapApplication` at all. A node-level
  `NGXSMK_BUTTON_RENDERER` provider still wins for a single subtree.

- Five new components, closing the most conspicuous gaps in the existing set.

  - **`ngxsmk-breadcrumb`** — the container `ngxsmk-breadcrumb-item` never had.
    Adds the `navigation` landmark, list semantics, and a `separator` shared by
    every item instead of repeated on each. Items now carry `role="listitem"` and
    read the separator through `NGXSMK_BREADCRUMB_SEPARATOR`, falling back to `/`
    when used on their own — so existing markup is unaffected.
  - **`ngxsmk-bottom-tab-bar` / `ngxsmk-bottom-tab`** — mobile bottom navigation,
    padded by the safe-area tokens so it clears the home indicator. Renders an
    `<a>` when `href` is set and a `<button>` when it is not, so semantics match
    behavior.
  - **`ngxsmkMask`** — the masking primitive underneath the kit's format-specific
    inputs. `applyNgxsmkMask()` is exported separately because the mask is pure
    string math and is useful outside a live field. Emits the unmasked value to
    the form model by default.
  - **`ngxsmk-response-feedback`** — thumbs up/down for a generated response, with
    reason chips and an optional comment that appear only after a downvote.
    Distinct from `ngxsmk-rating`, which captures a score on a scale.
  - **`ngxsmk-time-picker`** — time-of-day picking, which the date family lacked.
    Built from native `<select>`s for keyboard, screen-reader, and native mobile
    picker support. The value is always canonical 24-hour `HH:mm`, regardless of
    12-hour display.

  **Fixed — conformance harness leaked mounted components.** `mountForConformance`
  never destroyed its fixture, so every component it mounted kept its timers,
  observers, and listeners alive for the rest of the worker. That surfaced as
  unrelated tests failing at random on different runs. The harness now destroys
  the fixture in a `finally`, including when an assertion throws.

- Five more new components.

  - **`*ngxsmkPortal`** — renders content elsewhere in the DOM while keeping it in
    the declaring component's logical tree, so bindings and change detection keep
    working. Targets the platform overlay container by default (`document.body`
    on the web, `ion-app` under Ionic), or any element or selector. This makes the
    seam the kit's own dialogs use available to applications, for escaping
    `overflow: hidden` and stacking-context traps.
  - **`ngxsmk-timeline` / `ngxsmk-timeline-item`** — a plain chronological feed.
    The kit had `timeline-gantt` (scheduling), `timeline-stepper` (progress
    through a known sequence), and `reasoning-timeline` (agent traces), but
    nothing for "what happened, in order". Emits `<time datetime>` so a relative
    label like "2h ago" still exposes the real instant.
  - **`ngxsmkSafeArea`** — applies the safe-area inset tokens to any element, as
    padding or margin, on chosen edges. The kit's edge-anchored components already
    did this internally; this exposes it for application layout.
  - **`ngxsmk-back-to-top`** — appears past a scroll threshold and returns to the
    top. Listens to whichever element the platform adapter reports as scrollable,
    so it works inside an Ionic `ion-content` as well as on a plain document. It
    is `aria-hidden` and untabbable while below the threshold, so it never becomes
    an unreachable tab stop.
  - **`ngxsmk-action-sheet`** — bottom-anchored list of choices in the native
    mobile shape, with destructive styling and a separated cancel. Distinct from
    `ngxsmk-sheet`, which is a general panel for arbitrary content. Releases its
    scroll lock on destroy, so a route change mid-sheet cannot leave the page
    permanently unscrollable.

### Patch Changes

- Baseline conformance coverage, and the accessibility defects it found.

  **Added — `@ngxsmk/cdk/testing` conformance harness.** `expectMountsCleanly()`
  mounts a standalone component and asserts it renders without throwing or
  logging; `expectConformance()` adds an axe audit. `color-contrast` is disabled
  because jsdom has no layout engine.

  **Added — generated baseline specs.** `npm run generate:conformance` emits a
  co-located `*.conformance.spec.ts` for every component that can be mounted with
  no arguments. Core goes from 192 to 341 tests, covering 149 previously untested
  classes. The 109 classes it skips are reported with a reason (directive, needs a
  host; required input; attribute selector; injects a parent) so the remaining gap
  stays visible rather than silent.

  **Fixed — accessibility defects found by the new suite.**

  - `NgxsmkStatusDot` set `aria-label` on a host with no `role`. ARIA prohibits
    naming a `generic` element, so the label never reached assistive tech. Now
    `role="img"`.
  - `NgxsmkStepper` had the same defect; now `role="group"`.
  - `NgxsmkTransfer` gave its `role="group"` wrapper an accessible name but not
    the `role="listbox"` inside it. Both listboxes are now named from `titles()`.

  **Fixed — `NgxsmkMasonryGrid` ignored custom item templates.** The component is
  `standalone: true` with no `imports` array, but its template uses
  `*ngTemplateOutlet`. The directive was never applied, so a caller-supplied
  `<ng-template #item>` silently rendered nothing and every item fell back to the
  default card. `NgTemplateOutlet` is now imported.

  **Known defects, tracked not hidden.** Seven components cannot be made
  accessible by a consumer today, because no labelling API exists:
  `NgxsmkProgressCircle` (`role="progressbar"` with no name), `NgxsmkNumberInput`
  (inner field unlabelled, though its +/- buttons are), `NgxsmkCodeEditor`,
  `NgxsmkDatePicker`, `NgxsmkImageCropper`, `NgxsmkAiChat` and `NgxsmkPromptInput`
  (internal icon buttons). Each has an `it.fails()` test, so the suite stays green
  while the defect stays visible — and the test flips to failing the moment the
  component is fixed, which is the signal to remove it. Fixing them means adding
  public API and is left as a deliberate decision.

  **Added — jsdom polyfills for the core test run.** `IntersectionObserver`,
  `ResizeObserver`, and `matchMedia` are absent in jsdom, which made every
  component using them impossible to test. Inert stubs are installed only when
  missing.

## 1.3.1

### Patch Changes

- Keyboard navigation, unified focus rings, and dark-mode fixes.

  **Added**

  - Keyboard navigation for the typeahead/select family — `autocomplete`, `combobox`, `multi-select`, and `multi-selector` now support arrow keys (with wrap-around), `Home`/`End`, `Enter` to select, and `Escape` to close, matching `select`. Includes `aria-activedescendant` wiring and `role="listbox"`/`role="option"` semantics.
  - Interaction and sizing tokens: `--ngxsmk-focus-ring` / `--ngxsmk-focus-ring-error`, `--ngxsmk-opacity-{disabled,muted,faint}`, `--ngxsmk-icon-{sm,md,lg}`, `--ngxsmk-control-height-{sm,md,lg}`, `--ngxsmk-tracking-{tight,normal,wide}`, `--ngxsmk-hover-lift`, and `--ngxsmk-press-scale`.

  **Changed**

  - Every component now renders its focus ring from `var(--ngxsmk-focus-ring)` instead of three competing ad-hoc patterns.
  - Refined elevation scale — shadows gain a hairline contact layer so surfaces read crisply against white.
  - `@ngxsmk/cdk`'s main barrel no longer re-exports `@ngxsmk/cdk/testing`, keeping `axe-core` (a CommonJS dependency) out of runtime bundles. Import test helpers from `@ngxsmk/cdk/testing` directly.

  **Fixed**

  - `prefers-reduced-motion` now suppresses all token-driven motion. The generated stylesheet previously zeroed only `--ngxsmk-motion-duration` while components animate with `--ngxsmk-duration-*` directly. A `.ngxsmk-reduce-motion` class offers the same as an app-level opt-in.
  - Dark-mode color regressions in 14 components that hardcoded light-only hex fallbacks (e.g. `var(--ngxsmk-color-surface, #ffffff)`).
  - `meter` referenced a non-existent `--ngxsmk-color-danger` token; it now uses `--ngxsmk-color-error`.
  - Disabled states used seven different opacity literals; all now use `--ngxsmk-opacity-disabled`.
  - `chart-pie` defaults to non-responsive so `size` controls the diameter.
