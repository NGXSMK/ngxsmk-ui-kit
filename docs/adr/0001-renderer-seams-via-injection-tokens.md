# Renderer seams via injection tokens

We need to support two rendering backends — web (native HTML + CSS) and Ionic (ion-* components) — without duplicating behavioral logic. The question is how to abstract the rendering layer.

We chose per-component renderer interfaces backed by Angular injection tokens. Each component defines a `XxxRenderer` interface, an `NGXSMK_XXX_RENDERER` token, a `DefaultXxxRenderer` (current behavior), and optionally an `IonicXxxRenderer`. The component injects the token and delegates DOM manipulation to it. Behavioral state (signals, inputs, outputs, computed values) stays in the component class; only DOM creation, styling, and positioning move to the renderer.

**Considered Options:**

- **Template outlets** (`ngTemplateOutlet`) — flexible but no compile-time type safety, runtime overhead from repeated template instantiation, and awkward for imperative DOM work (spinner creation, positioning).
- **Class inheritance** (abstract base class per component) — tight coupling between hierarchy levels, hard to mix behaviors, and Angular's DI makes it harder to swap at runtime.
- **Renderer interfaces + injection tokens** — type-safe, DI-native, testable via mock renderers, and each renderer is a small focused class. Chosen.

**Consequences:**

- Adding a new platform (e.g., React wrapper) requires implementing ~8 renderer interfaces but zero changes to component logic.
- Component classes grow slightly (inject + delegate), but renderers are small and focused.
- The overlay strategy seam (`NgxsmkOverlayStrategy` in CDK) follows the same pattern for cross-cutting overlay concerns.
