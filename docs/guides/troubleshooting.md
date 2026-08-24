# NGXSMK Developer Troubleshooting & Solutions Guide

> Solutions for common Angular integration questions, SSR dark mode flash, form validation, and focus trapping.

---

## 1. Problem: Styles / Tokens Not Rendering

### Symptom:

Components appear unstyled or colors render as plain black/white.

### Solution:

Ensure `@ngxsmk/theme/css/tokens.css` is imported in your global stylesheet (`src/styles.scss`):

```scss
@import '@ngxsmk/theme/css/tokens.css';
```

---

## 2. Problem: Dark Mode Flash on SSR Page Load

### Symptom:

Page briefly flashes light mode before applying the dark theme when rendering with Angular SSR.

### Solution:

Inject the `dark` class into the `<html>` root before body hydration in `src/index.html`:

```html
<script>
  if (
    localStorage.getItem('ngxsmk-theme-mode') === 'dark' ||
    (!localStorage.getItem('ngxsmk-theme-mode') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  }
</script>
```

---

## 3. Problem: Reactive Form Control Disabled State Warning

### Symptom:

Angular emits a console warning: `It looks like you're using the disabled attribute with a reactive form directive...`

### Solution:

Pass the `disabled` state directly into the `FormControl` definition rather than binding `[disabled]` in the template:

```ts
// ✅ Recommended
emailControl = new FormControl({ value: '', disabled: true }, Validators.required);

// Controls can be dynamically enabled/disabled in code:
this.emailControl.enable();
this.emailControl.disable();
```

---

## 4. Problem: Dialog Modal Closing Immediately on Click

### Symptom:

Clicking inside the modal overlay triggers the backdrop dismiss callback.

### Solution:

Use stopPropagation on the inner dialog card or use the built-in `NgxsmkDialog` component which handles backdrop click isolation automatically.
