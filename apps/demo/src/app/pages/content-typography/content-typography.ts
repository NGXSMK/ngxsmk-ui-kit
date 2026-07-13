import { NgxsmkText } from '@ngxsmk/core/text';
import { NgxsmkBlockquote } from '@ngxsmk/core/blockquote';
import { NgxsmkCode } from '@ngxsmk/core/code';
import { NgxsmkKbd } from '@ngxsmk/core/kbd';
import { NgxsmkLink } from '@ngxsmk/core/link';
import { NgxsmkThumbnail } from '@ngxsmk/core/thumbnail';
import { NgxsmkTimestamp } from '@ngxsmk/core/timestamp';
import { NgxsmkToken } from '@ngxsmk/core/token';
import { NgxsmkCitation } from '@ngxsmk/core/citation';
import { NgxsmkMarkdown } from '@ngxsmk/core/markdown';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { Component } from '@angular/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

@Component({
  selector: 'content-typography-page',
  standalone: true,
  imports: [
    ShowcaseExample,
    NgxsmkHeading,
    NgxsmkText,
    NgxsmkBlockquote,
    NgxsmkCode,
    NgxsmkKbd,
    NgxsmkLink,
    NgxsmkThumbnail,
    NgxsmkTimestamp,
    NgxsmkToken,
    NgxsmkCitation,
    NgxsmkMarkdown,
  ],
  template: `
    <h2 class="ngxsmk-page-title">Content &amp; Typography</h2>
    <p class="ngxsmk-page-desc">
      Primitives for structuring and styling text. All components inherit the
      theme token engine, so typography scales and recolors with your brand.
    </p>

    <showcase-example
      title="Heading"
      description="Semantic heading levels with adjustable visual size and weight."
      [code]="codeHeading"
    >
      <ngxsmk-heading level="h1">Display heading</ngxsmk-heading>
      <ngxsmk-heading level="h2">Section heading</ngxsmk-heading>
      <ngxsmk-heading level="h3" weight="bold">Subsection heading</ngxsmk-heading>
      <ngxsmk-heading level="h4" weight="light">Lightweight heading</ngxsmk-heading>
    </showcase-example>

    <showcase-example
      title="Text"
      description="Body, caption, and overline text variants with semantic colors."
      [code]="codeText"
    >
      <ngxsmk-text variant="body">Body text for paragraphs and general copy.</ngxsmk-text>
      <ngxsmk-text variant="caption" color="secondary">A smaller caption for hints.</ngxsmk-text>
      <ngxsmk-text variant="overline" color="brand">Overline eyebrow label</ngxsmk-text>
    </showcase-example>

    <showcase-example
      title="Blockquote"
      description="Quoted content with an optional citation line."
      [code]="codeBlockquote"
    >
      <ngxsmk-blockquote cite="'Ada Lovelace'">
        The Analytical Engine weaves algebraic patterns just as the Jacquard
        loom weaves flowers and leaves.
      </ngxsmk-blockquote>
    </showcase-example>

    <showcase-example
      title="Code"
      description="Inline code styling that respects the mono font token."
      [code]="codeCode"
    >
      <p>Install with <code ngxsmk-code>npm i @ngxsmk/core</code> and import a component.</p>
      <p>Larger snippet: <code ngxsmk-code size="lg">ng generate @ngxsmk/core:button</code></p>
    </showcase-example>

    <showcase-example
      title="Kbd"
      description="Keyboard key affordance for shortcuts and hints."
      [code]="codeKbd"
    >
      <span class="ngxsmk-sc-wrap">
        <kbd ngxsmk-kbd>Ctrl</kbd>
        <kbd ngxsmk-kbd>K</kbd>
        <kbd ngxsmk-kbd size="lg">⌘</kbd>
      </span>
    </showcase-example>

    <showcase-example
      title="Link"
      description="Accessible links with muted and external variants."
      [code]="codeLink"
    >
      <span class="ngxsmk-sc-wrap">
        <a ngxsmk-link href="#">Default link</a>
        <a ngxsmk-link variant="muted" href="#">Muted link</a>
        <a ngxsmk-link [underline]="true" href="#">Underlined on hover</a>
        <a ngxsmk-link [external]="true" href="https://angular.dev">External link</a>
      </span>
    </showcase-example>

    <showcase-example
      title="Thumbnail"
      description="Image preview with size and shape options plus letter fallback."
      [code]="codeThumbnail"
    >
      <span class="ngxsmk-sc-wrap">
        <ngxsmk-thumbnail src="https://i.pravatar.cc/120?img=12" alt="Ava" size="sm" shape="circle" />
        <ngxsmk-thumbnail src="https://i.pravatar.cc/120?img=32" alt="Ben" size="md" shape="square" />
        <ngxsmk-thumbnail src="https://i.pravatar.cc/120?img=5" alt="Cara" size="lg" shape="circle" />
        <ngxsmk-thumbnail alt="No image" size="md" shape="square" />
      </span>
    </showcase-example>

    <showcase-example
      title="Timestamp"
      description="Relative, absolute, or smart date formatting."
      [code]="codeTimestamp"
    >
      <span class="ngxsmk-sc-wrap">
        <ngxsmk-timestamp [date]="threeHoursAgo" format="relative" />
        <ngxsmk-timestamp [date]="yesterday" format="smart" />
        <ngxsmk-timestamp [date]="lastWeek" format="absolute" />
      </span>
    </showcase-example>

    <showcase-example
      title="Token"
      description="Compact, pill-shaped labels — perfect for tags and filters."
      [code]="codeToken"
    >
      <span class="ngxsmk-sc-wrap">
        <ngxsmk-token>Default</ngxsmk-token>
        <ngxsmk-token variant="primary">Primary</ngxsmk-token>
        <ngxsmk-token variant="success">Success</ngxsmk-token>
        <ngxsmk-token variant="warning">Warning</ngxsmk-token>
        <ngxsmk-token variant="error" [removable]="true">Error</ngxsmk-token>
      </span>
    </showcase-example>

    <showcase-example
      title="Citation"
      description="Inline numbered citation marker with an optional source link."
      [code]="codeCitation"
    >
      <p>
        Design systems improve consistency across teams
        <ngxsmk-citation [index]="1" url="https://example.com/ds" /> and reduce
        rework <ngxsmk-citation [index]="2" />
      </p>
    </showcase-example>

    <showcase-example
      title="Markdown"
      description="Renders a Markdown string to styled, theme-aware HTML."
      [code]="codeMarkdown"
    >
      <ngxsmk-markdown [content]="markdownSample" />
    </showcase-example>
  `,
})
export class ContentTypographyPage {
  protected readonly threeHoursAgo = new Date(Date.now() - 3 * 3600_000);
  protected readonly yesterday = new Date(Date.now() - 24 * 3600_000);
  protected readonly lastWeek = new Date(Date.now() - 7 * 24 * 3600_000);

  protected readonly markdownSample = [
    '# Title',
    'A paragraph with **bold**, *italic*, and `inline code`.',
    '',
    '- List item one',
    '- List item two',
    '',
    '> A blockquote for emphasis.',
  ].join('\n');

  protected readonly codeHeading = `<ngxsmk-heading level="h1">Display heading</ngxsmk-heading>\n<ngxsmk-heading level="h3" weight="bold">Subsection</ngxsmk-heading>`;
  protected readonly codeText = `<ngxsmk-text variant="body">Body text</ngxsmk-text>\n<ngxsmk-text variant="overline" color="brand">Eyebrow</ngxsmk-text>`;
  protected readonly codeBlockquote = `<ngxsmk-blockquote cite="'Author'">Quoted text.</ngxsmk-blockquote>`;
  protected readonly codeCode = `<code ngxsmk-code>npm i @ngxsmk/core</code>`;
  protected readonly codeKbd = `<kbd ngxsmk-kbd>Ctrl</kbd> <kbd ngxsmk-kbd>K</kbd>`;
  protected readonly codeLink = `<a ngxsmk-link href="#">Default</a>\n<a ngxsmk-link external href="https://angular.dev">External</a>`;
  protected readonly codeThumbnail = `<ngxsmk-thumbnail src="/a.png" alt="Ava" size="md" shape="circle" />`;
  protected readonly codeTimestamp = `<ngxsmk-timestamp [date]="date" format="relative" />`;
  protected readonly codeToken = `<ngxsmk-token variant="primary">Primary</ngxsmk-token>\n<ngxsmk-token variant="error" [removable]="true">Error</ngxsmk-token>`;
  protected readonly codeCitation = `<ngxsmk-citation [index]="1" url="https://example.com" />`;
  protected readonly codeMarkdown = `<ngxsmk-markdown [content]="markdownString" />`;
}
