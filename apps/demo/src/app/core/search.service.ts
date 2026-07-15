import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import MiniSearch from 'minisearch';
import { ComponentMetadata } from './component-registry';

export interface SearchResult {
  item: ComponentMetadata;
  score: number;
  matchedFields: string[];
}

export interface SearchOptions {
  query: string;
  category?: string;
  tags?: string[];
  limit?: number;
  boost?: Record<string, number>;
  fuzzy?: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'component' | 'category' | 'tag' | 'recent';
  metadata?: ComponentMetadata;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly document = inject(DOCUMENT);
  private index = signal<MiniSearch | null>(null);
  private documents = signal<ComponentMetadata[]>([]);
  private recentSearches = signal<string[]>([]);
  private favorites = signal<string[]>([]);

  readonly isIndexed = computed(() => this.index() !== null);

  buildIndex(components: ComponentMetadata[]): void {
    const miniSearch = new MiniSearch({
      idField: 'name',
      fields: ['name', 'selector', 'description', 'category', 'tags', 'packageName'],
      storeFields: ['name', 'selector', 'description', 'category', 'packageName', 'tags', 'subcategory', 'exportName'],
      searchOptions: {
        boost: { name: 4, selector: 3, description: 2, tags: 2, category: 1 },
        fuzzy: 0.2,
        prefix: true,
      },
      extractField: (document: ComponentMetadata, fieldName: string) => {
        if (fieldName === 'tags' && Array.isArray(document.tags)) {
          return document.tags.join(' ');
        }
        return String((document as unknown as Record<string, unknown>)[fieldName] ?? '');
      },
    });

    miniSearch.addAll(components);
    this.index.set(miniSearch);
    this.documents.set(components);
  }

  search(options: SearchOptions): SearchResult[] {
    const index = this.index();
    if (!index || !options.query?.trim()) return [];

    const { query, category, tags, limit = 20, boost, fuzzy = 0.2 } = options;

    const results = index.search(query, {
      boost: { name: 4, selector: 3, description: 2, tags: 2, category: 1, ...boost },
      fuzzy,
      prefix: true,
    });

    let filtered = results.map((r) => {
      const item = this.documents().find((d) => d.name === r.id) ?? (r as unknown as ComponentMetadata);
      return {
        item,
        score: r.score ?? 0,
        matchedFields: this.getMatchedFields(item, query),
      };
    });

    if (category) {
      filtered = filtered.filter((r) => r.item.category === category);
    }

    if (tags && tags.length > 0) {
      filtered = filtered.filter((r) =>
        r.item.tags && tags.some(t => r.item.tags?.includes(t))
      );
    }

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    this.addToRecent(options.query);

    return filtered;
  }

  getSuggestions(query: string, limit = 8): SearchSuggestion[] {
    const index = this.index();
    if (!index || !query.trim()) return this.getDefaultSuggestions(limit);

    const results = index.search(query, { prefix: true, fuzzy: 0.2, boost: { name: 3, selector: 2 } });
    const suggestions: SearchSuggestion[] = [];

    for (const result of results.slice(0, limit)) {
      suggestions.push({
        text: String(result.id),
        type: 'component',
        metadata: this.documents().find((d) => d.name === result.id),
      });
    }

    const categories = [...new Set(this.documents().map(d => d.category))];
    for (const cat of categories) {
      if (cat.toLowerCase().includes(query.toLowerCase()) && suggestions.length < limit) {
        suggestions.push({ text: cat, type: 'category' });
      }
    }

    return suggestions.slice(0, limit);
  }

  private getDefaultSuggestions(limit: number): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];

    for (const recent of this.recentSearches().slice(0, 3)) {
      suggestions.push({ text: recent, type: 'recent' });
    }

    const categories = [...new Set(this.documents().map(d => d.category))];
    for (const cat of categories.slice(0, limit - suggestions.length)) {
      suggestions.push({ text: cat, type: 'category' });
    }

    return suggestions.slice(0, limit);
  }

  getComponent(name: string): ComponentMetadata | undefined {
    return this.documents().find(d => d.name === name || d.selector === name);
  }

  getByCategory(category: string): ComponentMetadata[] {
    return this.documents().filter(d => d.category === category);
  }

  getAllCategories(): string[] {
    return [...new Set(this.documents().map(d => d.category))].sort();
  }

  getAllTags(): string[] {
    const tags = new Set<string>();
    for (const doc of this.documents()) {
      if (doc.tags) doc.tags.forEach((t: string) => tags.add(t));
    }
    return [...tags].sort();
  }

  private getMatchedFields(result: ComponentMetadata, query: string): string[] {
    const matched: string[] = [];
    const queryLower = query.toLowerCase();

    if (result.name?.toLowerCase().includes(queryLower)) matched.push('name');
    if (result.selector?.toLowerCase().includes(queryLower)) matched.push('selector');
    if (result.description?.toLowerCase().includes(queryLower)) matched.push('description');
    if (result.tags?.some((t: string) => t.toLowerCase().includes(queryLower))) matched.push('tags');
    if (result.category?.toLowerCase().includes(queryLower)) matched.push('category');

    return matched;
  }

  addToRecent(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;

    this.recentSearches.update(current => {
      const filtered = current.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10);
    });
  }

  addToFavorites(componentName: string): void {
    this.favorites.update(current => {
      if (current.includes(componentName)) return current;
      return [componentName, ...current].slice(0, 20);
    });
  }

  removeFromFavorites(componentName: string): void {
    this.favorites.update(current => current.filter(n => n !== componentName));
  }

  isFavorite(componentName: string): boolean {
    return this.favorites().includes(componentName);
  }

  getRecentSearches(): string[] {
    return this.recentSearches();
  }

  getFavorites(): string[] {
    return this.favorites();
  }

  clearRecent(): void {
    this.recentSearches.set([]);
  }

  exportIndex(): string {
    const index = this.index();
    if (!index) return '';
    return JSON.stringify(index.toJSON());
  }

  importIndex(json: string): void {
    const index = MiniSearch.loadJSON(JSON.parse(json), { fields: ['name', 'selector', 'description', 'category', 'tags', 'packageName'] });
    this.index.set(index);
  }
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class KeyboardShortcutsService {
  private shortcuts = signal<KeyboardShortcut[]>([]);
  private listenerAttached = false;

  register(shortcut: KeyboardShortcut): void {
    this.shortcuts.update(current => [...current, shortcut]);
    this.ensureListener();
  }

  unregister(key: string, ctrlKey?: boolean, metaKey?: boolean): void {
    this.shortcuts.update(current =>
      current.filter(s =>
        !(s.key === key && s.ctrlKey === ctrlKey && s.metaKey === metaKey)
      )
    );
  }

  getAll(): KeyboardShortcut[] {
    return this.shortcuts();
  }

  getByCategory(category: string): KeyboardShortcut[] {
    return this.shortcuts().filter(s => s.category === category);
  }

  private ensureListener(): void {
    if (this.listenerAttached) return;
    this.listenerAttached = true;

    document.addEventListener('keydown', (event) => {
      if (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement ||
          (event.target as HTMLElement)?.isContentEditable) {
        return;
      }

      for (const shortcut of this.shortcuts()) {
        if (
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          !!shortcut.ctrlKey === event.ctrlKey &&
          !!shortcut.metaKey === event.metaKey &&
          !!shortcut.shiftKey === event.shiftKey &&
          !!shortcut.altKey === event.altKey
        ) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    });
  }
}

export function defineShortcut(
  shortcuts: KeyboardShortcutsService,
  key: string,
  action: () => void,
  description: string,
  category: string,
  modifiers: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {}
): void {
  shortcuts.register({
    key,
    action,
    description,
    category,
    ...modifiers,
  });
}