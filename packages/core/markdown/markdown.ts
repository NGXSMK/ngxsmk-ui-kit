import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Escape text for safe HTML text/attribute contexts. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Allow only safe URL schemes for markdown links and images. */
export function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed || /[\s"'<>`]/.test(trimmed)) return false;
  if (trimmed.startsWith('#')) return true;
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return true;
  }
  try {
    const parsed = new URL(trimmed, 'https://example.invalid');
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export interface RenderMarkdownOptions {
  /** When false (default), image markdown is rendered as a link label only. */
  allowImages?: boolean;
}

export function renderMarkdown(md: string, options: RenderMarkdownOptions = {}): string {
  const allowImages = options.allowImages === true;
  let html = escapeHtml(md);
  // code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const safeLang = String(lang).replace(/[^a-zA-Z0-9_-]/g, '');
    const langAttr = safeLang ? ` data-language="${safeLang}"` : '';
    return `<pre class="ngxsmk-markdown-pre"${langAttr}><code class="ngxsmk-markdown-code">${code.trim()}</code></pre>`;
  });
  // inline code
  html = html.replace(/`([^`]+)`/g, '<code class="ngxsmk-markdown-inline">$1</code>');
  // bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // strikethrough
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  // images before links so ![alt](url) is not eaten by the link regex
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
    if (!allowImages || !isSafeUrl(url)) {
      return escapeHtml(alt || 'image');
    }
    return `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" class="ngxsmk-markdown-img" />`;
  });
  // links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    if (!isSafeUrl(url)) {
      return label;
    }
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  // unordered lists
  html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  // ordered lists
  html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) =>
    match.startsWith('<ul>') ? match : `<ol>${match}</ol>`,
  );
  // headings
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  // horizontal rules
  html = html.replace(/^---$/gm, '<hr />');
  // paragraphs (double newlines)
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;
  // clean empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  return html;
}

/**
 * Lightweight markdown renderer for trusted or semi-trusted content.
 * URLs are scheme-allowlisted; images are off by default (`allowImages`).
 * Final HTML still passes through Angular's `[innerHTML]` sanitizer.
 *
 * ```html
 * <ngxsmk-markdown [content]="md" [allowImages]="true" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-markdown',
  template: `<div class="ngxsmk-markdown" [innerHTML]="html()"></div>`,
  host: { class: 'ngxsmk-markdown-host' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-markdown {
      max-width: 100%;
    }
    .ngxsmk-markdown h1,
    .ngxsmk-markdown h2,
    .ngxsmk-markdown h3,
    .ngxsmk-markdown h4,
    .ngxsmk-markdown h5 {
      margin: 1.5em 0 0.5em;
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-markdown h1 {
      font-size: var(--ngxsmk-text-headline-lg-size);
    }
    .ngxsmk-markdown h2 {
      font-size: var(--ngxsmk-text-headline-md-size);
    }
    .ngxsmk-markdown h3 {
      font-size: var(--ngxsmk-text-headline-sm-size);
    }
    .ngxsmk-markdown p {
      margin: 0 0 1em;
    }
    .ngxsmk-markdown a {
      color: var(--ngxsmk-color-primary);
      text-decoration: none;
    }
    .ngxsmk-markdown a:hover {
      text-decoration: underline;
    }
    .ngxsmk-markdown ul,
    .ngxsmk-markdown ol {
      margin: 0 0 1em;
      padding-inline-start: 1.5em;
    }
    .ngxsmk-markdown li {
      margin-bottom: 0.25em;
    }
    .ngxsmk-markdown blockquote {
      margin: 0 0 1em;
      padding: 0.5em 1em;
      border-inline-start: 3px solid var(--ngxsmk-color-primary);
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-sm);
    }
    .ngxsmk-markdown pre {
      margin: 0 0 1em;
      padding: 1em;
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-md);
      overflow-x: auto;
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      border: 1px solid var(--ngxsmk-color-outline);
    }
    .ngxsmk-markdown code {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .ngxsmk-markdown-inline {
      background: var(--ngxsmk-color-surface-variant);
      padding: 0.125rem 0.25rem;
      border-radius: var(--ngxsmk-radius-sm);
    }
    .ngxsmk-markdown hr {
      margin: 1.5em 0;
      border: none;
      border-top: 1px solid var(--ngxsmk-color-outline);
    }
    .ngxsmk-markdown img {
      max-width: 100%;
      border-radius: var(--ngxsmk-radius-md);
      margin: 1em 0;
    }
    .ngxsmk-markdown del {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-markdown table {
      width: 100%;
      border-collapse: collapse;
      margin: 0 0 1em;
    }
    .ngxsmk-markdown th,
    .ngxsmk-markdown td {
      padding: 0.5em;
      border: 1px solid var(--ngxsmk-color-outline);
      text-align: left;
    }
    .ngxsmk-markdown th {
      background: var(--ngxsmk-color-surface-variant);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMarkdown {
  readonly content = input.required<string>();
  /** When true, safe http(s) image URLs are rendered. Default false. */
  readonly allowImages = input(false);
  protected readonly html = computed(() =>
    renderMarkdown(this.content(), { allowImages: this.allowImages() }),
  );
}
