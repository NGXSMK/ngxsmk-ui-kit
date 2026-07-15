import { Injectable, signal, computed, Type } from '@angular/core';
import MiniSearch from 'minisearch';

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

const PACKAGE_EXPORTS: Record<
  string,
  { name: string; category: ComponentCategory; description: string }[]
> = {
  '@ngxsmk/core': [
    {
      name: 'NgxsmkButton',
      category: 'form',
      description: 'Native button/anchor directive with variants, sizes, and loading state',
    },
    {
      name: 'NgxsmkButtonGroup',
      category: 'form',
      description: 'Groups related buttons into a single connected control',
    },
    {
      name: 'NgxsmkToggleButton',
      category: 'form',
      description: 'Pressable button that maintains an on/off pressed state',
    },
    {
      name: 'NgxsmkToggleButtonGroup',
      category: 'form',
      description: 'Groups toggle buttons for formatting-style controls',
    },
    {
      name: 'NgxsmkInput',
      category: 'form',
      description: 'Themed native text input with placeholder and value binding',
    },
    {
      name: 'NgxsmkTextarea',
      category: 'form',
      description: 'Multi-line input with configurable row count',
    },
    {
      name: 'NgxsmkNumberInput',
      category: 'form',
      description: 'Numeric field with min, max, and step constraints',
    },
    {
      name: 'NgxsmkSelect',
      category: 'form',
      description: 'Single-choice dropdown with keyboard navigation and typeahead',
    },
    {
      name: 'NgxsmkMultiSelect',
      category: 'form',
      description: 'Multi-value select displayed as removable tags',
    },
    {
      name: 'NgxsmkAutocomplete',
      category: 'form',
      description: 'Free-text input with matching option suggestions',
    },
    {
      name: 'NgxsmkCombobox',
      category: 'form',
      description: 'Filterable dropdown resolving to a single selected option',
    },
    {
      name: 'NgxsmkTypeahead',
      category: 'form',
      description: 'String-list search with keyboard-friendly suggestions',
    },
    {
      name: 'NgxsmkPowerSearch',
      category: 'form',
      description: 'Search bar combined with faceted filter dropdowns',
    },
    {
      name: 'NgxsmkCheckbox',
      category: 'form',
      description: 'Single boolean control built on native checkbox',
    },
    {
      name: 'NgxsmkCheckboxList',
      category: 'form',
      description: 'Multiple checkboxes bound to an array of selected values',
    },
    {
      name: 'NgxsmkCheckboxListItemComponent',
      category: 'form',
      description: 'Individual checkbox item for composing multi-select lists',
    },
    { name: 'NgxsmkRadio', category: 'form', description: 'Single radio option within a group' },
    {
      name: 'NgxsmkRadioGroup',
      category: 'form',
      description: 'Mutually exclusive radio options group',
    },
    { name: 'NgxsmkSwitch', category: 'form', description: 'Instant on/off toggle for settings' },
    {
      name: 'NgxsmkSlider',
      category: 'form',
      description: 'Range control for selecting a numeric value',
    },
    {
      name: 'NgxsmkSegmentedControl',
      category: 'form',
      description: 'Compact single-choice switcher for views or modes',
    },
    {
      name: 'NgxsmkSelector',
      category: 'form',
      description: 'Chip-style multi-select for tags and quick filters',
    },
    {
      name: 'NgxsmkMultiSelector',
      category: 'form',
      description: 'Dropdown of checkboxes with compact summary trigger',
    },
    {
      name: 'NgxsmkTokenizer',
      category: 'form',
      description: 'Free-form tag entry with Enter to add, Backspace to remove',
    },
    {
      name: 'NgxsmkInputGroup',
      category: 'form',
      description: 'Attach text add-ons before and after an input',
    },
    { name: 'NgxsmkInputGroupText', category: 'form', description: 'Text add-on for input groups' },
    {
      name: 'NgxsmkField',
      category: 'form',
      description: 'Composable layout for label, control, and status message',
    },
    {
      name: 'NgxsmkFieldLabel',
      category: 'form',
      description: 'Label component for field wrapper',
    },
    {
      name: 'NgxsmkFieldStatus',
      category: 'form',
      description: 'Status message (hint/error) for field wrapper',
    },
    {
      name: 'NgxsmkFormField',
      category: 'form',
      description: 'Batteries-included wrapper wiring label, hint, and error to control',
    },
    {
      name: 'NgxsmkCheckboxListItemComponent',
      category: 'form',
      description: 'Individual checkbox list item component',
    },

    {
      name: 'NgxsmkLayout',
      category: 'layout',
      description: 'Responsive layout primitive for page-level structure',
    },
    {
      name: 'NgxsmkGrid',
      category: 'layout',
      description: 'Responsive grid layout with configurable columns and gaps',
    },
    {
      name: 'NgxsmkFlex',
      category: 'layout',
      description: 'Flexbox layout primitive with alignment and gap control',
    },
    {
      name: 'NgxsmkStack',
      category: 'layout',
      description: 'Stack layout with configurable spacing and alignment',
    },
    {
      name: 'NgxsmkContainer',
      category: 'layout',
      description: 'Constrained width container with responsive padding',
    },
    {
      name: 'NgxsmkHStack',
      category: 'layout',
      description: 'Horizontal stack with spacing and alignment',
    },
    {
      name: 'NgxsmkVStack',
      category: 'layout',
      description: 'Vertical stack with spacing and alignment',
    },
    {
      name: 'NgxsmkCenter',
      category: 'layout',
      description: 'Centers content horizontally and vertically',
    },
    {
      name: 'NgxsmkDivider',
      category: 'layout',
      description: 'Horizontal or vertical divider line',
    },
    { name: 'NgxsmkSpacer', category: 'layout', description: 'Flexible spacer for layout gaps' },
    {
      name: 'NgxsmkResizable',
      category: 'layout',
      description: 'Resizable panel with drag handle',
    },
    {
      name: 'NgxsmkResizeHandle',
      category: 'layout',
      description: 'Drag handle for resizable panels',
    },
    { name: 'NgxsmkResizablePanel', category: 'layout', description: 'Resizable panel component' },
    {
      name: 'NgxsmkResizablePanelGroup',
      category: 'layout',
      description: 'Group of resizable panels',
    },
    {
      name: 'NgxsmkResizableSplitter',
      category: 'layout',
      description: 'Splitter between resizable panels',
    },

    { name: 'NgxsmkTabs', category: 'navigation', description: 'Tabbed navigation interface' },
    { name: 'NgxsmkTabMenu', category: 'navigation', description: 'Tab menu navigation component' },
    {
      name: 'NgxsmkBreadcrumb',
      category: 'navigation',
      description: 'Breadcrumb navigation trail',
    },
    {
      name: 'NgxsmkPagination',
      category: 'navigation',
      description: 'Pagination controls for data sets',
    },
    { name: 'NgxsmkStepper', category: 'navigation', description: 'Multi-step progress indicator' },
    {
      name: 'NgxsmkSideNav',
      category: 'navigation',
      description: 'Collapsible side navigation drawer',
    },
    {
      name: 'NgxsmkMobileNav',
      category: 'navigation',
      description: 'Mobile-optimized navigation drawer',
    },
    {
      name: 'NgxsmkTopNav',
      category: 'navigation',
      description: 'Top navigation bar with branding and actions',
    },
    {
      name: 'NgxsmkNavHeadingMenu',
      category: 'navigation',
      description: 'Heading with integrated menu for navigation',
    },
    { name: 'NgxsmkNavIcon', category: 'navigation', description: 'Navigation icon component' },
    { name: 'NgxsmkPagination', category: 'navigation', description: 'Pagination controls' },
    { name: 'NgxsmkTabs', category: 'navigation', description: 'Tabbed navigation interface' },

    {
      name: 'NgxsmkDataTable',
      category: 'data-display',
      description: 'Feature-rich data table with sorting, filtering, pagination',
    },
    { name: 'NgxsmkTable', category: 'data-display', description: 'Base table component' },
    { name: 'NgxsmkTableCell', category: 'data-display', description: 'Table cell component' },
    { name: 'NgxsmkList', category: 'data-display', description: 'Styled list component' },
    { name: 'NgxsmkListItem', category: 'data-display', description: 'List item component' },
    {
      name: 'NgxsmkCard',
      category: 'data-display',
      description: 'Card container with header, content, footer',
    },
    { name: 'NgxsmkCardHeader', category: 'data-display', description: 'Card header section' },
    { name: 'NgxsmkCardContent', category: 'data-display', description: 'Card content section' },
    { name: 'NgxsmkCardTitle', category: 'data-display', description: 'Card title element' },
    {
      name: 'NgxsmkAvatar',
      category: 'data-display',
      description: 'User avatar with fallback initials',
    },
    { name: 'NgxsmkChip', category: 'data-display', description: 'Compact tag/chip component' },
    { name: 'NgxsmkTag', category: 'data-display', description: 'Tag/label component' },
    {
      name: 'NgxsmkStat',
      category: 'data-display',
      description: 'Statistic display with value and label',
    },
    { name: 'NgxsmkProgress', category: 'data-display', description: 'Linear progress indicator' },
    {
      name: 'NgxsmkProgressCircle',
      category: 'data-display',
      description: 'Circular progress indicator',
    },
    {
      name: 'NgxsmkMetadataList',
      category: 'data-display',
      description: 'Metadata key-value display list',
    },
    {
      name: 'NgxsmkTreeView',
      category: 'data-display',
      description: 'Hierarchical tree view with expand/collapse',
    },
    {
      name: 'NgxsmkOrgChart',
      category: 'data-display',
      description: 'Organizational chart visualization',
    },
    {
      name: 'NgxsmkPivotTable',
      category: 'data-display',
      description: 'Pivot table for data aggregation',
    },
    {
      name: 'NgxsmkDiffViewer',
      category: 'data-display',
      description: 'Side-by-side diff comparison viewer',
    },
    { name: 'NgxsmkQrCode', category: 'data-display', description: 'QR code generator' },
    {
      name: 'NgxsmkThumbnail',
      category: 'data-display',
      description: 'Image thumbnail with loading states',
    },

    { name: 'NgxsmkToast', category: 'feedback', description: 'Transient notification toast' },
    {
      name: 'NgxsmkAlert',
      category: 'feedback',
      description: 'Alert banner for important messages',
    },
    { name: 'NgxsmkSkeleton', category: 'feedback', description: 'Placeholder skeleton loader' },
    { name: 'NgxsmkSpinner', category: 'feedback', description: 'Loading spinner animation' },
    {
      name: 'NgxsmkEmptyState',
      category: 'feedback',
      description: 'Empty state illustration with message',
    },
    { name: 'NgxsmkProgress', category: 'feedback', description: 'Progress bar indicator' },
    {
      name: 'NgxsmkProgressCircle',
      category: 'feedback',
      description: 'Circular progress indicator',
    },
    { name: 'NgxsmkStatusDot', category: 'feedback', description: 'Status indicator dot' },
    { name: 'NgxsmkRating', category: 'feedback', description: 'Star rating input component' },

    {
      name: 'NgxsmkDialog',
      category: 'overlay',
      description: 'Modal dialog with focus trap and animations',
    },
    { name: 'NgxsmkDrawer', category: 'overlay', description: 'Slide-over panel from screen edge' },
    { name: 'NgxsmkSheet', category: 'overlay', description: 'Bottom sheet modal' },
    {
      name: 'NgxsmkPopover',
      category: 'overlay',
      description: 'Floating popover anchored to trigger',
    },
    {
      name: 'NgxsmkTooltip',
      category: 'overlay',
      description: 'Contextual tooltip on hover/focus',
    },
    {
      name: 'NgxsmkHoverCard',
      category: 'overlay',
      description: 'Rich hover card with custom content',
    },
    { name: 'NgxsmkLightbox', category: 'overlay', description: 'Image lightbox viewer' },
    { name: 'NgxsmkContextMenu', category: 'overlay', description: 'Right-click context menu' },
    {
      name: 'NgxsmkDropdownMenu',
      category: 'overlay',
      description: 'Dropdown menu with keyboard navigation',
    },
    {
      name: 'NgxsmkImperativeDialog',
      category: 'overlay',
      description: 'Programmatically controlled dialog',
    },
    {
      name: 'NgxsmkChatComposerDrawer',
      category: 'overlay',
      description: 'Drawer for chat composer',
    },

    { name: 'NgxsmkChartLine', category: 'chart', description: 'Line chart visualization' },
    { name: 'NgxsmkChartBar', category: 'chart', description: 'Bar chart visualization' },
    { name: 'NgxsmkChartPie', category: 'chart', description: 'Pie/donut chart visualization' },
    { name: 'NgxsmkChartArea', category: 'chart', description: 'Area chart visualization' },
    { name: 'NgxsmkChartScatter', category: 'chart', description: 'Scatter plot visualization' },
    { name: 'NgxsmkChartHeatmap', category: 'chart', description: 'Heatmap visualization' },
    {
      name: 'NgxsmkChartCandlestick',
      category: 'chart',
      description: 'Candlestick chart for financial data',
    },
    {
      name: 'NgxsmkChartDashboard',
      category: 'chart',
      description: 'Dashboard layout for multiple charts',
    },

    { name: 'NgxsmkChatLayout', category: 'ai', description: 'Complete chat application layout' },
    { name: 'NgxsmkChatWindow', category: 'ai', description: 'Chat message display area' },
    { name: 'NgxsmkChatMessage', category: 'ai', description: 'Individual chat message bubble' },
    {
      name: 'NgxsmkChatMessageBubble',
      category: 'ai',
      description: 'Chat message bubble component',
    },
    {
      name: 'NgxsmkChatMessageMetadata',
      category: 'ai',
      description: 'Message metadata (timestamp, status)',
    },
    { name: 'NgxsmkChatComposer', category: 'ai', description: 'Chat message input composer' },
    { name: 'NgxsmkChatComposerDrawer', category: 'ai', description: 'Drawer for chat composer' },
    {
      name: 'NgxsmkChatComposerTokenElement',
      category: 'ai',
      description: 'Token element in composer',
    },
    { name: 'NgxsmkChatDictationButton', category: 'ai', description: 'Voice dictation button' },
    { name: 'NgxsmkChatInput', category: 'ai', description: 'Chat message input field' },
    { name: 'NgxsmkChatSendButton', category: 'ai', description: 'Send button for chat' },
    { name: 'NgxsmkChatSystemMessage', category: 'ai', description: 'System message display' },
    { name: 'NgxsmkChatTokenizedText', category: 'ai', description: 'Tokenized text display' },
    { name: 'NgxsmkChatTokenElement', category: 'ai', description: 'Individual token element' },
    { name: 'NgxsmkChatTokenElement', category: 'ai', description: 'Chat token element' },
    {
      name: 'NgxsmkChatLayoutScrollButton',
      category: 'ai',
      description: 'Scroll button for chat layout',
    },
    { name: 'NgxsmkCitationViewer', category: 'ai', description: 'Citation reference viewer' },
    { name: 'NgxsmkCitation', category: 'ai', description: 'Citation reference component' },
    { name: 'NgxsmkReasoningTimeline', category: 'ai', description: 'AI reasoning step timeline' },
    { name: 'NgxsmkStreamingText', category: 'ai', description: 'Streaming text animation' },
    { name: 'NgxsmkVoiceInput', category: 'ai', description: 'Voice input button' },
    { name: 'NgxsmkDictationButton', category: 'ai', description: 'Dictation button' },
    { name: 'NgxsmkPromptCarousel', category: 'ai', description: 'Carousel of prompt suggestions' },

    {
      name: 'NgxsmkHooks',
      category: 'utility',
      description: 'Collection of reactive utility hooks',
    },
    {
      name: 'NgxsmkCopyToClipboard',
      category: 'utility',
      description: 'Copy text to clipboard directive',
    },
    {
      name: 'NgxsmkKeyboardShortcut',
      category: 'utility',
      description: 'Global keyboard shortcut registration',
    },
    { name: 'NgxsmkFocusTrap', category: 'utility', description: 'Focus trap for modal dialogs' },
    {
      name: 'NgxsmkLazyLoad',
      category: 'utility',
      description: 'Lazy load content on viewport intersection',
    },
    {
      name: 'NgxsmkIntersectionObserver',
      category: 'utility',
      description: 'Intersection observer directive',
    },
    { name: 'NgxsmkResizeObserver', category: 'utility', description: 'Resize observer directive' },
    { name: 'NgxsmkMediaQuery', category: 'utility', description: 'Reactive media query matching' },
    { name: 'NgxsmkMediaTheme', category: 'utility', description: 'Media theme detection' },
    {
      name: 'NgxsmkClickOutside',
      category: 'utility',
      description: 'Click outside detection directive',
    },
    { name: 'NgxsmkScrollLock', category: 'utility', description: 'Body scroll locking utility' },
    { name: 'NgxsmkToken', category: 'utility', description: 'Design token display' },
    { name: 'NgxsmkTerminal', category: 'utility', description: 'Terminal emulator component' },
    {
      name: 'NgxsmkJsonViewer',
      category: 'utility',
      description: 'JSON syntax highlighted viewer',
    },
    { name: 'NgxsmkMarkdownViewer', category: 'utility', description: 'Markdown renderer' },
    { name: 'NgxsmkMarkdown', category: 'utility', description: 'Markdown component' },
    { name: 'NgxsmkDiffViewer', category: 'utility', description: 'Diff comparison viewer' },
    { name: 'NgxsmkMemoryViewer', category: 'utility', description: 'Memory usage visualization' },
    { name: 'NgxsmkCodeBlock', category: 'utility', description: 'Syntax highlighted code block' },
    { name: 'NgxsmkCode', category: 'utility', description: 'Inline code component' },
    { name: 'NgxsmkKbd', category: 'utility', description: 'Keyboard key display' },
    {
      name: 'NgxsmkVisuallyHidden',
      category: 'utility',
      description: 'Visually hidden but screen reader accessible',
    },
    {
      name: 'NgxsmkImperativeDialog',
      category: 'utility',
      description: 'Imperative dialog service',
    },
    {
      name: 'NgxsmkLayerProvider',
      category: 'utility',
      description: 'Portal layer provider for overlays',
    },
    {
      name: 'NgxsmkLinkProvider',
      category: 'utility',
      description: 'Link provider for navigation',
    },
    {
      name: 'NgxsmkCommandPalette',
      category: 'utility',
      description: 'Command palette for quick actions',
    },
    {
      name: 'NgxsmkPromptCarousel',
      category: 'utility',
      description: 'Prompt suggestions carousel',
    },
    { name: 'NgxsmkCarousel', category: 'utility', description: 'Carousel/slider component' },

    {
      name: 'NgxsmkLetDirective',
      category: 'other',
      description: 'Structural directive for local variable binding',
    },
    {
      name: 'NgxsmkRxLetDirective',
      category: 'other',
      description: 'RxJS-powered structural directive',
    },
    { name: 'NgxsmkI18nPipe', category: 'other', description: 'Internationalization pipe' },
    { name: 'NgxsmkKbd', category: 'other', description: 'Keyboard key display' },
    { name: 'NgxsmkCode', category: 'other', description: 'Inline code formatting' },
    { name: 'NgxsmkCodeBlock', category: 'other', description: 'Syntax highlighted code block' },
    { name: 'NgxsmkJsonViewer', category: 'other', description: 'JSON syntax highlighted viewer' },
    { name: 'NgxsmkDiffViewer', category: 'other', description: 'Diff comparison viewer' },
    { name: 'NgxsmkTerminal', category: 'other', description: 'Terminal emulator' },
    { name: 'NgxsmkTerminal', category: 'other', description: 'Terminal emulator component' },
  ],
  '@ngxsmk/theme': [
    {
      name: 'NgxsmkThemeService',
      category: 'utility',
      description: 'Runtime theme control and dynamic theme application',
    },
    {
      name: 'NgxsmkThemeBuilder',
      category: 'utility',
      description: 'Visual theme builder component',
    },
    { name: 'NgxsmkI18nPipe', category: 'utility', description: 'Internationalization pipe' },
    { name: 'NgxsmkCreateI18n', category: 'utility', description: 'Create i18n instance' },
    { name: 'NgxsmkProvideI18n', category: 'utility', description: 'Provide i18n configuration' },
    {
      name: 'NgxsmkUseDirection',
      category: 'utility',
      description: 'Use RTL/LTR direction signal',
    },
  ],
  '@ngxsmk/cdk': [
    {
      name: 'NgxsmkAutofocusDirective',
      category: 'utility',
      description: 'Auto-focus element on render',
    },
    {
      name: 'NgxsmkIntersectionObserverDirective',
      category: 'utility',
      description: 'Intersection observer directive',
    },
    {
      name: 'NgxsmkResizeObserverDirective',
      category: 'utility',
      description: 'Resize observer directive',
    },
    { name: 'NgxsmkFocusTrapDirective', category: 'utility', description: 'Focus trap for modals' },
    {
      name: 'NgxsmkClickOutsideDirective',
      category: 'utility',
      description: 'Click outside detection',
    },
    { name: 'NgxsmkScrollLockDirective', category: 'utility', description: 'Body scroll lock' },
    { name: 'NgxsmkMediaQuery', category: 'utility', description: 'Reactive media query' },
    {
      name: 'NgxsmkLazyLoadDirective',
      category: 'utility',
      description: 'Lazy load on viewport entry',
    },
    {
      name: 'NgxsmkResizeHandleDirective',
      category: 'utility',
      description: 'Resize handle for panels',
    },
    {
      name: 'NgxsmkA11yTesting',
      category: 'utility',
      description: 'Accessibility testing utilities',
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class ComponentRegistry {
  private readonly components = signal<ComponentMetadata[]>([]);
  private readonly searchIndex = signal<MiniSearch<ComponentMetadata> | null>(null);
  private readonly initialized = signal(false);

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

  readonly search = signal<{
    query: string;
    results: ComponentMetadata[];
    loading: boolean;
  }>({ query: '', results: [], loading: false });

  async initialize(): Promise<void> {
    if (this.initialized()) return;

    const components = await this.buildRegistry();
    this.components.set(components);
    this.buildSearchIndex(components);
    this.initialized.set(true);
  }

  private async buildRegistry(): Promise<ComponentMetadata[]> {
    const components: ComponentMetadata[] = [];
    const seen = new Set<string>();

    for (const [pkg, exports] of Object.entries(PACKAGE_EXPORTS)) {
      for (const exp of exports) {
        if (seen.has(exp.name)) continue;
        seen.add(exp.name);
        const meta = this.createMetadata(exp.name, pkg, exp.category, exp.description);
        components.push(meta);
      }
    }

    return components;
  }

  private createMetadata(
    name: string,
    pkg: string,
    category: ComponentCategory,
    baseDescription: string,
  ): ComponentMetadata {
    const selector = this.nameToSelector(name);
    const tags = this.generateTags(name, category);
    const { inputs, signals } = this.inferApi(name);

    return {
      name,
      selector,
      exportName: name,
      category,
      description: baseDescription,
      packageName: pkg as ComponentMetadata['packageName'],
      inputs,
      outputs: [],
      methods: [],
      signals,
      examples: this.generateExamples(name),
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
    };
  }

  private nameToSelector(name: string): string {
    return name
      .replace(/^Ngxsmk/, '')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
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

  private inferApi(name: string): {
    inputs: ComponentInput[];
    outputs: ComponentOutput[];
    signals: ComponentSignal[];
  } {
    const lower = name.toLowerCase();
    const inputs: ComponentInput[] = [];
    const outputs: ComponentOutput[] = [];
    const signals: ComponentSignal[] = [];

    if (lower.includes('button') && !lower.includes('group')) {
      inputs.push(
        {
          name: 'variant',
          type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'",
          required: false,
          defaultValue: "'primary'",
          description: 'Visual style variant',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          required: false,
          defaultValue: "'md'",
          description: 'Button size',
        },
        {
          name: 'loading',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Show loading spinner',
        },
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Disable the button',
        },
      );
      outputs.push({
        name: 'clicked',
        type: 'EventEmitter<void>',
        description: 'Emitted when button is clicked',
      });
    } else if (lower.includes('input') && !lower.includes('group')) {
      inputs.push(
        {
          name: 'value',
          type: 'string',
          required: false,
          defaultValue: "''",
          description: 'Input value (two-way)',
          signal: true,
        },
        {
          name: 'placeholder',
          type: 'string',
          required: false,
          defaultValue: "''",
          description: 'Placeholder text',
        },
        {
          name: 'type',
          type: "'text' | 'email' | 'password' | 'number' | 'tel' | 'url'",
          required: false,
          defaultValue: "'text'",
          description: 'Input type',
        },
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Disable the input',
        },
        {
          name: 'required',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Mark as required',
        },
        { name: 'ariaLabel', type: 'string', required: false, description: 'Accessible label' },
      );
      outputs.push({
        name: 'valueChange',
        type: 'EventEmitter<string>',
        description: 'Emitted when value changes',
      });
    } else if (
      lower.includes('select') ||
      lower.includes('autocomplete') ||
      lower.includes('combobox') ||
      lower.includes('typeahead')
    ) {
      inputs.push(
        {
          name: 'options',
          type: 'NgxsmkSelectOption[]',
          required: true,
          description: 'Array of selectable options',
        },
        {
          name: 'value',
          type: 'string',
          required: false,
          defaultValue: "''",
          description: 'Selected value (two-way)',
          signal: true,
        },
        {
          name: 'placeholder',
          type: 'string',
          required: false,
          defaultValue: "'Pick an option'",
          description: 'Placeholder text',
        },
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Disable the select',
        },
        {
          name: 'searchable',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Enable search within options',
        },
      );
      outputs.push({
        name: 'valueChange',
        type: 'EventEmitter<string>',
        description: 'Emitted when selection changes',
      });
      outputs.push({
        name: 'selectionChange',
        type: 'EventEmitter<NgxsmkSelectOption>',
        description: 'Emitted when option is selected',
      });
    } else if (lower.includes('checkbox') && !lower.includes('list')) {
      inputs.push(
        {
          name: 'checked',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Checked state (two-way)',
          signal: true,
        },
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Disable the checkbox',
        },
        {
          name: 'indeterminate',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Indeterminate state',
        },
      );
      outputs.push({
        name: 'checkedChange',
        type: 'EventEmitter<boolean>',
        description: 'Emitted when checked state changes',
      });
    } else if (lower.includes('radio')) {
      inputs.push(
        {
          name: 'value',
          type: 'string',
          required: false,
          defaultValue: "''",
          description: 'Selected value (two-way)',
          signal: true,
        },
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Disable the radio group',
        },
      );
      outputs.push({
        name: 'valueChange',
        type: 'EventEmitter<string>',
        description: 'Emitted when selection changes',
      });
    } else if (lower.includes('switch')) {
      inputs.push(
        {
          name: 'checked',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'On/off state (two-way)',
          signal: true,
        },
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Disable the switch',
        },
      );
      outputs.push({
        name: 'checkedChange',
        type: 'EventEmitter<boolean>',
        description: 'Emitted when toggled',
      });
    } else if (lower.includes('slider')) {
      inputs.push(
        {
          name: 'value',
          type: 'number',
          required: false,
          defaultValue: '0',
          description: 'Slider value (two-way)',
          signal: true,
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          defaultValue: '0',
          description: 'Minimum value',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          defaultValue: '100',
          description: 'Maximum value',
        },
        {
          name: 'step',
          type: 'number',
          required: false,
          defaultValue: '1',
          description: 'Step increment',
        },
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Disable the slider',
        },
      );
      outputs.push({
        name: 'valueChange',
        type: 'EventEmitter<number>',
        description: 'Emitted when value changes',
      });
    } else if (
      lower.includes('dialog') ||
      lower.includes('drawer') ||
      lower.includes('sheet') ||
      lower.includes('popover') ||
      lower.includes('tooltip') ||
      lower.includes('hover') ||
      lower.includes('lightbox') ||
      lower.includes('contextmenu') ||
      lower.includes('dropdown')
    ) {
      inputs.push(
        {
          name: 'open',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Open state (two-way)',
          signal: true,
        },
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          defaultValue: 'false',
          description: 'Disable the overlay',
        },
      );
      outputs.push({
        name: 'openChange',
        type: 'EventEmitter<boolean>',
        description: 'Emitted when open state changes',
      });
      outputs.push({
        name: 'closed',
        type: 'EventEmitter<void>',
        description: 'Emitted when overlay closes',
      });
    } else if (
      lower.includes('toast') ||
      lower.includes('alert') ||
      lower.includes('skeleton') ||
      lower.includes('spinner') ||
      lower.includes('empty') ||
      lower.includes('progress') ||
      lower.includes('status') ||
      lower.includes('rating')
    ) {
      // Feedback components
    } else if (lower.includes('chart')) {
      inputs.push(
        { name: 'data', type: 'any[]', required: true, description: 'Chart data' },
        {
          name: 'config',
          type: 'ChartConfig',
          required: false,
          description: 'Chart configuration',
        },
      );
    } else if (
      lower.includes('chat') ||
      lower.includes('ai') ||
      lower.includes('prompt') ||
      lower.includes('streaming') ||
      lower.includes('reasoning') ||
      lower.includes('citation') ||
      lower.includes('tokenized') ||
      lower.includes('voice') ||
      lower.includes('dictation')
    ) {
      // AI components
    } else if (
      lower.includes('layout') ||
      lower.includes('grid') ||
      lower.includes('flex') ||
      lower.includes('stack') ||
      lower.includes('container') ||
      lower.includes('divider') ||
      lower.includes('spacer') ||
      lower.includes('center') ||
      lower.includes('resizable')
    ) {
      // Layout components
    } else if (
      lower.includes('hook') ||
      lower.includes('copy') ||
      lower.includes('keyboard') ||
      lower.includes('focus') ||
      lower.includes('lazy') ||
      lower.includes('intersection') ||
      lower.includes('resize') ||
      lower.includes('media') ||
      lower.includes('click') ||
      lower.includes('scroll') ||
      lower.includes('token') ||
      lower.includes('terminal') ||
      lower.includes('json') ||
      lower.includes('markdown') ||
      lower.includes('diff') ||
      lower.includes('memory') ||
      lower.includes('code') ||
      lower.includes('kbd') ||
      lower.includes('visually') ||
      lower.includes('imperative') ||
      lower.includes('layer') ||
      lower.includes('link') ||
      lower.includes('command') ||
      lower.includes('prompt') ||
      lower.includes('carousel')
    ) {
      // Utility components
    }

    return { inputs, outputs, signals };
  }

  private generateExamples(name: string): ComponentExample[] {
    const selector = this.nameToSelector(name);
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
        boost: { name: 3, selector: 2, description: 1, tags: 1 },
        fuzzy: 0.2,
        prefix: true,
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
      boost: { name: 3, selector: 2, description: 1, tags: 1 },
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
