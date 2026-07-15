import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { getFocusable } from './focusable';

describe('getFocusable', () => {
  let originalOffsetParent: any;

  beforeEach(() => {
    originalOffsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent');
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get() {
        // Return parentElement as a mock offsetParent if it's not hidden
        return this.style.display === 'none' ? null : this.parentElement;
      }
    });
  });

  afterEach(() => {
    if (originalOffsetParent) {
      Object.defineProperty(HTMLElement.prototype, 'offsetParent', originalOffsetParent);
    } else {
      delete (HTMLElement.prototype as any).offsetParent;
    }
  });

  it('identifies focusable elements', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <a href="https://google.com">Link</a>
      <button>Button</button>
      <input type="text" />
      <select><option>Opt</option></select>
      <textarea></textarea>
      <div tabindex="0">Div Tabindex</div>
      <div contenteditable="true">Editable</div>
      <span>Not Focusable</span>
    `;
    document.body.appendChild(container);

    const focusable = getFocusable(container);
    expect(focusable.length).toBe(7);
    expect(focusable[0].tagName).toBe('A');
    expect(focusable[1].tagName).toBe('BUTTON');
    expect(focusable[2].tagName).toBe('INPUT');
    expect(focusable[3].tagName).toBe('SELECT');
    expect(focusable[4].tagName).toBe('TEXTAREA');
    expect(focusable[5].getAttribute('tabindex')).toBe('0');
    expect(focusable[6].getAttribute('contenteditable')).toBe('true');

    document.body.removeChild(container);
  });

  it('filters out disabled, hidden, and negative tabindex elements', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button disabled>Disabled Button</button>
      <input type="text" disabled />
      <div tabindex="-1">Tabindex -1 Div</div>
      <button style="display: none;">Hidden Button</button>
      <button>Normal Button</button>
    `;
    document.body.appendChild(container);

    const focusable = getFocusable(container);
    // Only Normal Button should be focusable
    expect(focusable.length).toBe(1);
    expect(focusable[0].textContent).toBe('Normal Button');

    document.body.removeChild(container);
  });
});
