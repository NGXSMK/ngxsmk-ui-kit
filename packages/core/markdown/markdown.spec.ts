import { describe, expect, it } from 'vitest';
import { escapeHtml, isSafeUrl, renderMarkdown } from './markdown';

describe('escapeHtml', () => {
  it('escapes quotes and angle brackets', () => {
    expect(escapeHtml(`a<"'>`)).toBe('a&lt;&quot;&#39;&gt;');
  });
});

describe('isSafeUrl', () => {
  it('allows http(s), mailto, relative, and hash', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
    expect(isSafeUrl('http://example.com')).toBe(true);
    expect(isSafeUrl('mailto:a@b.c')).toBe(true);
    expect(isSafeUrl('/docs')).toBe(true);
    expect(isSafeUrl('./x')).toBe(true);
    expect(isSafeUrl('#section')).toBe(true);
  });

  it('rejects javascript and data URLs', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html;base64,xx')).toBe(false);
    expect(isSafeUrl('vbscript:x')).toBe(false);
  });
});

describe('renderMarkdown', () => {
  it('does not emit attribute breakout from crafted link URLs', () => {
    const html = renderMarkdown('[x](a" onmouseover="alert(1))');
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('onmouseover');
    expect(html).toContain('x');
  });

  it('strips javascript: links to plain text', () => {
    const html = renderMarkdown('[click](javascript:alert(1))');
    expect(html).not.toContain('href=');
    expect(html).toContain('click');
  });

  it('does not render images by default', () => {
    const html = renderMarkdown('![alt](https://example.com/a.png)');
    expect(html).not.toContain('<img');
    expect(html).toContain('alt');
  });

  it('renders safe images when allowImages is true', () => {
    const html = renderMarkdown('![alt](https://example.com/a.png)', { allowImages: true });
    expect(html).toContain('<img src="https://example.com/a.png"');
    expect(html).toContain('alt="alt"');
  });

  it('rejects javascript image URLs even when allowImages is true', () => {
    const html = renderMarkdown('![x](javascript:alert(1))', { allowImages: true });
    expect(html).not.toContain('<img');
  });
});
