import { Injectable, signal, computed, Type } from '@angular/core';
import MiniSearch from 'minisearch';
import {
  COMPONENT_DATABASE,
  type ComponentInput as McpInput,
  type ComponentOutput as McpOutput,
} from '@ngxsmk/mcp/component-db';

export interface ComponentInput {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
  signal?: boolean;
}

export interface ComponentOutput {
  name: string;
  type: string;
  description: string;
}

export interface ComponentMethod {
  name: string;
  parameters: string[];
  returnType: string;
  description: string;
}

export interface ComponentSignal {
  name: string;
  type: string;
  readonly: boolean;
  description: string;
}

export interface ComponentExample {
  title: string;
  description: string;
  code: string;
  componentType?: Type<unknown>;
  customizeCode?: string;
}

export interface ComponentMetadata {
  name: string;
  selector: string;
  exportName: string;
  category: ComponentCategory;
  subcategory?: string;
  description: string;
  packageName: '@ngxsmk/core' | '@ngxsmk/theme' | '@ngxsmk/cdk';
  inputs: ComponentInput[];
  outputs: ComponentOutput[];
  methods: ComponentMethod[];
  signals: ComponentSignal[];
  examples: ComponentExample[];
  tags: string[];
  since?: string;
  deprecated?: boolean;
  accessibility?: {
    score: number;
    keyboardSupport: boolean;
    ariaSupport: boolean;
    screenReaderTested: boolean;
  };
  performance?: {
    bundleSizeKB: number;
    renderTimeMs: number;
  };
}

export type ComponentCategory =
  | 'form'
  | 'layout'
  | 'navigation'
  | 'data-display'
  | 'feedback'
  | 'overlay'
  | 'chart'
  | 'ai'
  | 'utility'
  | 'other';

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  form: 'Form Controls',
  layout: 'Layout Primitives',
  navigation: 'Navigation',
  'data-display': 'Data Display',
  feedback: 'Feedback & Status',
  overlay: 'Overlays & Popovers',
  chart: 'Charts & Visualization',
  ai: 'AI Interface',
  utility: 'Utilities & Hooks',
  other: 'Other',
};

export const CATEGORY_ICONS: Record<ComponentCategory, string> = {
  form: '📝',
  layout: '📐',
  navigation: '🧭',
  'data-display': '📊',
  feedback: '🔔',
  overlay: '🪟',
  chart: '📈',
  ai: '🤖',
  utility: '🔧',
  other: '📦',
};

const COMPONENT_CATEGORIES: Record<string, ComponentCategory> = {
  NgxsmkAccordion: 'overlay',
  NgxsmkAccordionItem: 'overlay',
  NgxsmkAgentCard: 'ai',
  NgxsmkAiChat: 'ai',
  NgxsmkAlert: 'feedback',
  NgxsmkAlertDialog: 'overlay',
  NgxsmkAppShell: 'layout',
  NgxsmkAspectRatio: 'layout',
  NgxsmkAudioPlayer: 'data-display',
  NgxsmkAutocomplete: 'form',
  NgxsmkAvatar: 'data-display',
  NgxsmkAvatarGroupOverflow: 'data-display',
  NgxsmkAvatarStatusDot: 'data-display',
  NgxsmkBadge: 'data-display',
  NgxsmkBanner: 'feedback',
  NgxsmkBlockquote: 'data-display',
  NgxsmkBreadcrumbItem: 'navigation',
  NgxsmkButton: 'form',
  NgxsmkButtonGroup: 'form',
  NgxsmkCard: 'data-display',
  NgxsmkCarousel: 'overlay',
  NgxsmkCenter: 'layout',
  NgxsmkChartArea: 'chart',
  NgxsmkChartBar: 'chart',
  NgxsmkChartCandlestick: 'chart',
  NgxsmkChartDashboard: 'chart',
  NgxsmkChartHeatmap: 'chart',
  NgxsmkChartLine: 'chart',
  NgxsmkChartPie: 'chart',
  NgxsmkChartScatter: 'chart',
  NgxsmkChatComposerDrawer: 'ai',
  NgxsmkChatComposerTokenElement: 'ai',
  NgxsmkChatDictationButton: 'ai',
  NgxsmkChatInput: 'ai',
  NgxsmkChatLayout: 'ai',
  NgxsmkChatLayoutScrollButton: 'ai',
  NgxsmkChatMessage: 'ai',
  NgxsmkChatMessageBubble: 'ai',
  NgxsmkChatMessageMetadata: 'ai',
  NgxsmkChatSendButton: 'ai',
  NgxsmkChatSystemMessage: 'ai',
  NgxsmkChatTokenizedText: 'ai',
  NgxsmkChatWindow: 'ai',
  NgxsmkCheckbox: 'form',
  NgxsmkCheckboxList: 'form',
  NgxsmkCheckboxListItem: 'form',
  NgxsmkCitation: 'ai',
  NgxsmkCitationViewer: 'ai',
  NgxsmkClickOutside: 'utility',
  NgxsmkCode: 'data-display',
  NgxsmkCodeBlock: 'data-display',
  NgxsmkCollapsible: 'overlay',
  NgxsmkCombobox: 'form',
  NgxsmkCommandPalette: 'overlay',
  NgxsmkContainer: 'layout',
  NgxsmkContextMenu: 'overlay',
  NgxsmkConversationList: 'ai',
  NgxsmkCopyToClipboard: 'utility',
  NgxsmkDataTable: 'data-display',
  NgxsmkDatePicker: 'form',
  NgxsmkDatepicker: 'form',
  NgxsmkDiagramBuilder: 'data-display',
  NgxsmkDialog: 'overlay',
  NgxsmkDiffViewer: 'data-display',
  NgxsmkDivider: 'layout',
  NgxsmkDropdownMenu: 'overlay',
  NgxsmkEmptyState: 'feedback',
  NgxsmkFab: 'form',
  NgxsmkField: 'form',
  NgxsmkFieldLabel: 'form',
  NgxsmkFieldStatus: 'form',
  NgxsmkFlex: 'layout',
  NgxsmkFlowEditor: 'data-display',
  NgxsmkFocusTrap: 'utility',
  NgxsmkFormField: 'form',
  NgxsmkFormLayout: 'form',
  NgxsmkGrid: 'layout',
  NgxsmkHStack: 'layout',
  NgxsmkHeading: 'data-display',
  NgxsmkHoverCard: 'overlay',
  NgxsmkI18n: 'utility',
  NgxsmkImageViewer: 'data-display',
  NgxsmkImperativeDialog: 'overlay',
  NgxsmkInput: 'form',
  NgxsmkInputGroup: 'form',
  NgxsmkInputGroupText: 'form',
  NgxsmkIntersectionObserver: 'utility',
  NgxsmkJsonViewer: 'data-display',
  NgxsmkKanbanBoard: 'data-display',
  NgxsmkKbd: 'data-display',
  NgxsmkKeyboardShortcut: 'utility',
  NgxsmkLayerProvider: 'utility',
  NgxsmkLazyLoad: 'utility',
  NgxsmkLet: 'utility',
  NgxsmkLightbox: 'overlay',
  NgxsmkLink: 'navigation',
  NgxsmkLinkProvider: 'utility',
  NgxsmkList: 'data-display',
  NgxsmkListItem: 'data-display',
  NgxsmkLiveDataTable: 'data-display',
  NgxsmkLiveAnnouncer: 'utility',
  NgxsmkMarkdown: 'data-display',
  NgxsmkMarkdownViewer: 'data-display',
  NgxsmkMediaQuery: 'utility',
  NgxsmkMediaTheme: 'utility',
  NgxsmkMemoryViewer: 'ai',
  NgxsmkMetadataList: 'data-display',
  NgxsmkMeter: 'data-display',
  NgxsmkMobileNav: 'navigation',
  NgxsmkMobileNavToggle: 'navigation',
  NgxsmkMultiSelect: 'form',
  NgxsmkMultiSelector: 'form',
  NgxsmkNavHeadingMenu: 'navigation',
  NgxsmkNavIcon: 'navigation',
  NgxsmkNumberInput: 'form',
  NgxsmkOrgChart: 'data-display',
  NgxsmkOutline: 'data-display',
  NgxsmkOverflowList: 'layout',
  NgxsmkPagination: 'navigation',
  NgxsmkPinInput: 'form',
  NgxsmkPivotTable: 'data-display',
  NgxsmkPopover: 'overlay',
  NgxsmkPowerSearch: 'form',
  NgxsmkProgress: 'feedback',
  NgxsmkProgressCircle: 'feedback',
  NgxsmkPromptCarousel: 'ai',
  NgxsmkQrCode: 'data-display',
  NgxsmkQueryBuilder: 'form',
  NgxsmkRadio: 'form',
  NgxsmkRadioGroup: 'form',
  NgxsmkRating: 'form',
  NgxsmkReasoningTimeline: 'ai',
  NgxsmkResizable: 'layout',
  NgxsmkResizeHandle: 'layout',
  NgxsmkResizeObserver: 'utility',
  NgxsmkRuleBuilder: 'form',
  NgxsmkScheduler: 'data-display',
  NgxsmkScrollLock: 'utility',
  NgxsmkSection: 'layout',
  NgxsmkSegmentedControl: 'form',
  NgxsmkSelect: 'form',
  NgxsmkSelector: 'form',
  NgxsmkSeo: 'utility',
  NgxsmkSheet: 'overlay',
  NgxsmkSideNav: 'navigation',
  NgxsmkSkeleton: 'feedback',
  NgxsmkSlider: 'form',
  NgxsmkSpacer: 'layout',
  NgxsmkSpinner: 'feedback',
  NgxsmkSplitButton: 'form',
  NgxsmkSpreadsheet: 'data-display',
  NgxsmkStack: 'layout',
  NgxsmkStackItem: 'layout',
  NgxsmkStat: 'data-display',
  NgxsmkStatusDot: 'data-display',
  NgxsmkStepper: 'navigation',
  NgxsmkStreamingText: 'ai',
  NgxsmkSwitch: 'form',
  NgxsmkTabMenu: 'navigation',
  NgxsmkTable: 'data-display',
  NgxsmkTableCell: 'data-display',
  NgxsmkTableHeaderCell: 'data-display',
  NgxsmkTableRow: 'data-display',
  NgxsmkTabs: 'navigation',
  NgxsmkTag: 'data-display',
  NgxsmkTelInput: 'form',
  NgxsmkTerminal: 'data-display',
  NgxsmkText: 'data-display',
  NgxsmkThemeBuilder: 'utility',
  NgxsmkThumbnail: 'data-display',
  NgxsmkTimelineGantt: 'data-display',
  NgxsmkTimestamp: 'data-display',
  NgxsmkToast: 'feedback',
  NgxsmkToggleButton: 'form',
  NgxsmkToggleButtonGroup: 'form',
  NgxsmkToken: 'data-display',
  NgxsmkTokenizer: 'form',
  NgxsmkToolCallView: 'ai',
  NgxsmkTooltip: 'overlay',
  NgxsmkTopNav: 'navigation',
  NgxsmkTopNavHeading: 'navigation',
  NgxsmkTopNavMegaMenu: 'navigation',
  NgxsmkTopNavMegaMenuFeaturedCard: 'navigation',
  NgxsmkTopNavMegaMenuItem: 'navigation',
  NgxsmkTopNavMenu: 'navigation',
  NgxsmkTopNavItem: 'navigation',
  NgxsmkTreeView: 'data-display',
  NgxsmkTypeahead: 'form',
  NgxsmkVisuallyHidden: 'utility',
  NgxsmkVoiceInput: 'ai',
  NgxsmkVStack: 'layout',
  NgxsmkWorkflowBuilder: 'data-display',
};

function mcpInputToComponentInput(input: McpInput): ComponentInput {
  return {
    name: input.name,
    type: input.type,
    required: input.required ?? false,
    defaultValue: input.default,
    description: '',
    signal: input.twoWay,
  };
}

function mcpOutputToComponentOutput(output: McpOutput): ComponentOutput {
  return {
    name: output.name,
    type: output.type,
    description: '',
  };
}

function entryPointToPackage(entryPoint: string): ComponentMetadata['packageName'] {
  if (entryPoint.startsWith('@ngxsmk/cdk')) return '@ngxsmk/cdk';
  if (entryPoint.startsWith('@ngxsmk/theme')) return '@ngxsmk/theme';
  return '@ngxsmk/core';
}

export interface SearchResult {
  item: ComponentMetadata;
  score: number;
  matchedFields: string[];
}

export interface SearchSuggestion {
  text: string;
  type: 'component' | 'category' | 'tag' | 'recent';
  metadata?: ComponentMetadata;
}

@Injectable({ providedIn: 'root' })
export class ComponentRegistry {
  private readonly components = signal<ComponentMetadata[]>([]);
  private readonly searchIndex = signal<MiniSearch<ComponentMetadata> | null>(null);
  private readonly initialized = signal(false);
  private readonly recentSearches = signal<string[]>([]);
  private readonly favorites = signal<string[]>([]);

  readonly allComponents = computed(() => this.components());
  readonly byCategory = computed(() => {
    const map = new Map<ComponentCategory, ComponentMetadata[]>();
    for (const comp of this.components()) {
      const arr = map.get(comp.category) ?? [];
      arr.push(comp);
      map.set(comp.category, arr);
    }
    return map;
  });
  readonly categories = computed(() => Array.from(this.byCategory().keys()));
  readonly totalCount = computed(() => this.components().length);

  async initialize(): Promise<void> {
    if (this.initialized()) return;

    const components = this.buildFromMcpDatabase();
    this.components.set(components);
    this.buildSearchIndex(components);
    this.initialized.set(true);
  }

  private buildFromMcpDatabase(): ComponentMetadata[] {
    const seen = new Set<string>();
    const components: ComponentMetadata[] = [];

    for (const entry of COMPONENT_DATABASE) {
      if (seen.has(entry.name)) continue;
      seen.add(entry.name);

      const category = COMPONENT_CATEGORIES[entry.name] ?? 'other';
      const packageName = entryPointToPackage(entry.entryPoint);
      const tags = this.generateTags(entry.name, category);

      components.push({
        name: entry.name,
        selector: entry.selector,
        exportName: entry.name,
        category,
        description: entry.description,
        packageName,
        inputs: entry.inputs.map(mcpInputToComponentInput),
        outputs: entry.outputs.map(mcpOutputToComponentOutput),
        methods: [],
        signals: [],
        examples: this.generateExamples(entry.name, entry.selector),
        tags,
        accessibility: {
          score: 95,
          keyboardSupport: true,
          ariaSupport: true,
          screenReaderTested: true,
        },
        performance: {
          bundleSizeKB: 0,
          renderTimeMs: 0,
        },
      });
    }

    return components;
  }

  private generateTags(name: string, category: ComponentCategory): string[] {
    const base = name
      .replace(/^Ngxsmk/, '')
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .trim()
      .split(' ');
    return [...base, category, 'ngxsmk', 'angular', 'signals', 'zoneless'];
  }

  private generateExamples(name: string, selector: string): ComponentExample[] {
    return [
      {
        title: 'Basic Usage',
        description: `Basic ${name} example`,
        code: `<${selector}>Basic ${name}</${selector}>`,
      },
    ];
  }

  private buildSearchIndex(components: ComponentMetadata[]): void {
    const index = new MiniSearch({
      idField: 'name',
      fields: ['name', 'selector', 'description', 'category', 'tags'],
      storeFields: ['name', 'selector', 'description', 'category', 'packageName', 'tags'],
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

    index.addAll(components);
    this.searchIndex.set(index);
  }

  searchComponents(
    query: string,
    options?: { category?: ComponentCategory; limit?: number },
  ): ComponentMetadata[] {
    const index = this.searchIndex();
    if (!index || !query.trim()) return [];

    const results = index.search(query, {
      prefix: true,
      fuzzy: 0.2,
      boost: { name: 4, selector: 3, description: 2, tags: 2, category: 1 },
    });

    let filtered = results
      .map((r) => this.getComponent(r.id as string))
      .filter((c): c is ComponentMetadata => !!c);

    if (options?.category) {
      filtered = filtered.filter((c: ComponentMetadata) => c.category === options.category);
    }

    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  searchWithScore(options: {
    query: string;
    category?: string;
    limit?: number;
  }): SearchResult[] {
    const index = this.searchIndex();
    if (!index || !options.query?.trim()) return [];

    const { query, category, limit = 20 } = options;

    const results = index.search(query, {
      boost: { name: 4, selector: 3, description: 2, tags: 2, category: 1 },
      fuzzy: 0.2,
      prefix: true,
    });

    let filtered = results.map((r) => {
      const item = this.getComponent(r.id as string);
      return {
        item: item ?? (r as unknown as ComponentMetadata),
        score: r.score ?? 0,
        matchedFields: item ? this.getMatchedFields(item, query) : [],
      };
    });

    if (category) {
      filtered = filtered.filter((r) => r.item.category === category);
    }

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    this.addToRecent(query);
    return filtered;
  }

  getSuggestions(query: string, limit = 8): SearchSuggestion[] {
    const index = this.searchIndex();
    if (!index || !query.trim()) return this.getDefaultSuggestions(limit);

    const results = index.search(query, {
      prefix: true,
      fuzzy: 0.2,
      boost: { name: 3, selector: 2 },
    });
    const suggestions: SearchSuggestion[] = [];

    for (const result of results.slice(0, limit)) {
      suggestions.push({
        text: String(result.id),
        type: 'component',
        metadata: this.getComponent(result.id as string),
      });
    }

    const categories = [...new Set(this.components().map((d) => d.category))];
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

    const categories = [...new Set(this.components().map((d) => d.category))];
    for (const cat of categories.slice(0, limit - suggestions.length)) {
      suggestions.push({ text: cat, type: 'category' });
    }

    return suggestions.slice(0, limit);
  }

  private getMatchedFields(result: ComponentMetadata, query: string): string[] {
    const matched: string[] = [];
    const queryLower = query.toLowerCase();

    if (result.name?.toLowerCase().includes(queryLower)) matched.push('name');
    if (result.selector?.toLowerCase().includes(queryLower)) matched.push('selector');
    if (result.description?.toLowerCase().includes(queryLower)) matched.push('description');
    if (result.tags?.some((t: string) => t.toLowerCase().includes(queryLower)))
      matched.push('tags');
    if (result.category?.toLowerCase().includes(queryLower)) matched.push('category');

    return matched;
  }

  addToRecent(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;

    this.recentSearches.update((current) => {
      const filtered = current.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10);
    });
  }

  getRecentSearches(): string[] {
    return this.recentSearches();
  }

  clearRecent(): void {
    this.recentSearches.set([]);
  }

  addToFavorites(componentName: string): void {
    this.favorites.update((current) => {
      if (current.includes(componentName)) return current;
      return [componentName, ...current].slice(0, 20);
    });
  }

  removeFromFavorites(componentName: string): void {
    this.favorites.update((current) => current.filter((n) => n !== componentName));
  }

  isFavorite(componentName: string): boolean {
    return this.favorites().includes(componentName);
  }

  getFavorites(): string[] {
    return this.favorites();
  }

  getComponent(name: string): ComponentMetadata | undefined {
    return this.components().find((c) => c.name === name || c.selector === name);
  }

  getComponentsByCategory(category: ComponentCategory): ComponentMetadata[] {
    return this.byCategory().get(category) ?? [];
  }

  getAllCategories(): ComponentCategory[] {
    return this.categories();
  }
}
