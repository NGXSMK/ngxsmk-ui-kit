import * as axe from 'axe-core';

/**
 * Runs axe-core analysis on the provided HTML element and throws an error if any accessibility
 * violations are detected.
 *
 * Pass axe `options` to tune the run — e.g. in jsdom-based tests disable the
 * `color-contrast` rule, which requires a real rendering engine.
 */
export async function expectNoA11yViolations(
  element: HTMLElement,
  options: axe.RunOptions = {},
): Promise<void> {
  const results = await axe.run(element, options);
  if (results.violations.length > 0) {
    const formatted = results.violations
      .map(
        (v) =>
          `[${v.id}] ${v.help}\n  - Help URL: ${v.helpUrl}\n  - Nodes affected:\n${v.nodes
            .map((n) => `    * ${n.html}`)
            .join('\n')}`,
      )
      .join('\n\n');
    throw new Error(`Accessibility violations detected:\n\n${formatted}`);
  }
}
