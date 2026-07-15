import * as axe from 'axe-core';

/**
 * Runs axe-core analysis on the provided HTML element and throws an error if any accessibility
 * violations are detected.
 */
export async function expectNoA11yViolations(element: HTMLElement): Promise<void> {
  const results = await axe.run(element);
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
