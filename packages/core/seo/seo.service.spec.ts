import { TestBed } from '@angular/core/testing';
import { NgxsmkSeoService } from './seo.service';

describe('NgxsmkSeoService', () => {
  let service: NgxsmkSeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxsmkSeoService);
    document.head.innerHTML = '';
  });

  it('sets the document title and og:title', () => {
    service.setTitle('Hello World');
    expect(document.title).toBe('Hello World');
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'Hello World',
    );
  });

  it('mirrors the description to meta, og and twitter tags', () => {
    service.setDescription('A great page');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'A great page',
    );
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe(
      'A great page',
    );
    expect(
      document.querySelector('meta[name="twitter:description"]')?.getAttribute('content'),
    ).toBe('A great page');
  });

  it('upserts a canonical link', () => {
    service.setCanonical('https://ngxsmk.dev/docs');
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://ngxsmk.dev/docs');

    service.setCanonical('https://ngxsmk.dev/about');
    const links = document.querySelectorAll('link[rel="canonical"]');
    expect(links.length).toBe(1);
    expect((links[0] as HTMLLinkElement).getAttribute('href')).toBe('https://ngxsmk.dev/about');
  });

  it('sets open graph and twitter tags from key maps', () => {
    service.setOpenGraph({ type: 'website', image: 'https://ngxsmk.dev/og.png' });
    service.setTwitterCard({ card: 'summary_large_image' });
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      'website',
    );
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://ngxsmk.dev/og.png',
    );
    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image',
    );
  });

  it('upserts JSON-LD structured data', () => {
    service.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'NGXSMK',
    });
    const script = document.getElementById('ngxsmk-seo-jsonld') as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.type).toBe('application/ld+json');
    expect(JSON.parse(script.textContent ?? '{}').name).toBe('NGXSMK');
  });

  it('applies a full config via update()', () => {
    service.update({
      title: 'Docs',
      description: 'Read the docs',
      canonical: 'https://ngxsmk.dev/docs',
      url: 'https://ngxsmk.dev/docs',
      image: 'https://ngxsmk.dev/og.png',
      siteName: 'NGXSMK',
      type: 'website',
      jsonLd: { '@type': 'WebSite', name: 'NGXSMK' },
    });
    expect(document.title).toBe('Docs');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'index, follow',
    );
    expect(document.querySelector('meta[property="og:site_name"]')?.getAttribute('content')).toBe(
      'NGXSMK',
    );
    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image',
    );
    expect(document.getElementById('ngxsmk-seo-jsonld')).toBeTruthy();
  });

  it('updates existing tags instead of duplicating them', () => {
    service.setDescription('first');
    service.setDescription('second');
    expect(document.querySelectorAll('meta[name="description"]').length).toBe(1);
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'second',
    );
  });
});
