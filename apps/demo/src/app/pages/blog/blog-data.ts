export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  tagColor: string;
  date: Date;
  readTime: string;
  author: string;
  featured?: boolean;
  code?: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'introducing',
    title: 'Introducing NGXSMK',
    excerpt:
      'Why we built a signals-native, zoneless design system for Angular — and how the universal token engine keeps your brand portable across CSS, SCSS, Tailwind, and Ionic.',
    tag: 'Announcement',
    tagColor: '#6366f1',
    date: new Date(Date.now() - 2 * 86400000),
    readTime: '8 min read',
    author: 'Sachin',
    featured: true,
    code: `// Install in one command
npm install @ngxsmk/core @ngxsmk/theme

// Add a component
npx ngxsmk add button

// Use in your template
<button ngxsmk-button variant="solid">
  Get Started
</button>`,
    content: `
<p>Building a UI kit for Angular in 2026 means confronting a simple truth: the ecosystem has matured past the point where generic component libraries survive. Developers expect signal-native reactivity, zoneless change detection, and a theming system that doesn't lock them into a single CSS methodology.</p>

<p>NGXSMK was born from this reality. We didn't want another Material clone or a Bootstrap port. We wanted a design system that treats Angular's modern primitives — signals, standalone components, and the new control flow syntax — as first-class citizens from day one.</p>

<h2>Why Signals Matter</h2>
<p>Angular signals aren't just a syntax change. They represent a fundamental shift in how state propagates through a component tree. Every NGXSMK component uses <code>input()</code>, <code>model()</code>, <code>computed()</code>, and <code>effect()</code> — never decorators, never <code>@Input()</code>.</p>

<p>This means:</p>
<ul>
  <li><strong>Finer granularity</strong> — change detection runs only where state actually changed</li>
  <li><strong>No Zone.js dependency</strong> — smaller bundles, faster SSR, predictable timing</li>
  <li><strong>Better TypeScript inference</strong> — signal types flow naturally through templates</li>
</ul>

<h2>The Universal Token Engine</h2>
<p>Most UI kits force you to pick a styling methodology. NGXSMK's token engine outputs to four formats simultaneously:</p>
<ul>
  <li><strong>CSS Custom Properties</strong> — for vanilla CSS and SCSS</li>
  <li><strong>SCSS Variables</strong> — for preprocessor workflows</li>
  <li><strong>Tailwind Preset</strong> — v3 preset and v4 CSS theme</li>
  <li><strong>JSON</strong> — for programmatic access and build tools</li>
</ul>

<p>Switch your entire brand at runtime by updating a handful of HSL coordinates. Dark mode is a CSS class toggle, not a JavaScript re-render.</p>

<h2>What's Next</h2>
<p>This is v2.0.0 — the culmination of months of architectural decisions. We've shipped 150+ components, an MCP server for AI assistants, a Claude Code skill, and a CLI that copies source code directly into your project.</p>

<p>The roadmap ahead includes more enterprise widgets, additional chart types, and deeper motion.dev integration. But the core principle remains: own your code, control your tokens, and never fight your framework.</p>
`,
  },
  {
    id: 'theming',
    title: 'Theming Without Lock-in',
    excerpt:
      'One token engine, four outputs: CSS variables, SCSS, Tailwind, and JSON. Swap the entire look at runtime with zero rebuilds.',
    tag: 'Theming',
    tagColor: '#10b981',
    date: new Date(Date.now() - 9 * 86400000),
    readTime: '12 min read',
    author: 'Sachin',
    content: `
<p>Theming is the most opinionated part of any design system. Get it wrong, and you're either locked into someone else's aesthetic or spending weeks wiring up CSS variables. NGXSMK takes a different approach: a token engine that generates outputs for every major CSS methodology.</p>

<h2>The Token Architecture</h2>
<p>At the heart of NGXSMK's theming system is a simple idea: define your design tokens as HSL coordinates, and let the engine handle the rest. One <code>applyTheme()</code> call generates:</p>

<pre><code>/* The engine outputs these automatically */
--ngxsmk-color-primary: oklch(0.55 0.2 270);
--ngxsmk-color-on-primary: oklch(1 0 0);
--ngxsmk-radius-md: 0.5rem;
--ngxsmk-space-4: 1rem;
/* ... 150+ tokens */</code></pre>

<h2>Dark Mode</h2>
<p>Dark mode isn't a separate theme — it's a modifier. Add the <code>.dark</code> class to <code>&lt;html&gt;</code> and every token automatically resolves to its dark variant. No JavaScript re-renders, no theme provider overhead.</p>

<h2>Tailwind Integration</h2>
<p>NGXSMK ships a Tailwind v3 preset and a v4 CSS theme. Import the preset, and your Tailwind config automatically maps to NGXSMK tokens:</p>

<pre><code>// tailwind.config.js
const ngxsmkPreset = require('@ngxsmk/theme/tailwind-preset');

module.exports = {
  presets: [ngxsmkPreset],
  // All NGXSMK tokens are now Tailwind utilities
};</code></pre>

<h2>Runtime Switching</h2>
<p>Because themes are CSS custom properties, switching them is instant. No build step, no page reload. Call <code>themeService.applyTheme(presets['emerald'])</code> and watch every component re-skin in under 16ms.</p>
`,
  },
  {
    id: 'ai-components',
    title: 'Building AI Components',
    excerpt:
      'A deep-dive into the chat window, streaming text, tool-call viewer, and reasoning timeline primitives that power agent-ready UIs.',
    tag: 'AI',
    tagColor: '#7c3aed',
    date: new Date(Date.now() - 21 * 86400000),
    readTime: '15 min read',
    author: 'Sachin',
    content: `
<p>The AI interface space is evolving faster than any UI category we've seen. Six months ago, a chat window was just a message list. Today, it needs streaming text rendering, tool-call visualization, reasoning timelines, citation viewers, and voice input — all within a cohesive design system.</p>

<h2>Chat Window Architecture</h2>
<p>NGXSMK's <code>NgxsmkChatWindow</code> is more than a scrollable list. It's a layout primitive that handles:</p>
<ul>
  <li>Auto-scrolling with user-scroll detection</li>
  <li>Virtual scrolling for long conversations</li>
  <li>Message grouping by role (user, assistant, system)</li>
  <li>Responsive layout with collapsible sidebar</li>
</ul>

<h2>Streaming Text</h2>
<p>The <code>NgxsmkStreamingText</code> component renders text as it arrives from an LLM stream. It handles token-by-token animation, markdown parsing in real-time, and code block detection — all without blocking the main thread.</p>

<pre><code>&lt;ngxsmk-streaming-text
  [tokens]="streamTokens()"
  [isComplete]="streamDone()" /&gt;</code></pre>

<h2>Tool Call Viewer</h2>
<p>When an AI agent calls external tools, the <code>NgxsmkToolCallViewer</code> renders each call as an expandable card showing the tool name, parameters, and results. It supports nested tool calls and error states.</p>

<h2>Reasoning Timeline</h2>
<p>For chain-of-thought AI, the <code>NgxsmkReasoningTimeline</code> visualizes the reasoning steps as an expandable, collapsible timeline. Each step shows the thought, the action taken, and the observation received.</p>
`,
  },
  {
    id: 'enterprise',
    title: 'Enterprise Widgets, Free',
    excerpt:
      'Kanban, spreadsheet, pivot table, and diagram editors — all MIT-licensed and fully customizable with the token engine.',
    tag: 'Enterprise',
    tagColor: '#ef4444',
    date: new Date(Date.now() - 40 * 86400000),
    readTime: '10 min read',
    author: 'Sachin',
    content: `
<p>Enterprise components are typically the most expensive part of a UI kit. Kanban boards, Gantt charts, spreadsheets, and diagram builders — these complex widgets often cost hundreds of dollars per developer seat. NGXSMK ships all of them under MIT.</p>

<h2>Kanban Board</h2>
<p>The <code>NgxsmkKanbanBoard</code> supports drag-and-drop between columns, WIP limits, swimlanes, and custom card templates. It's built on Angular CDK's drag-drop module with signal-based state management.</p>

<h2>Spreadsheet</h2>
<p>A lightweight spreadsheet component with cell editing, formula support, column resizing, and keyboard navigation. It handles 10,000+ rows via virtual scrolling without breaking a sweat.</p>

<h2>Scheduler</h2>
<p>Calendar-based scheduling with drag-to-create, overlap detection, and resource grouping. Works with Luxon for timezone-aware date handling.</p>

<h2>Why MIT?</h2>
<p>We believe enterprise-grade UI components shouldn't be paywalled. The value of NGXSMK isn't in gating features — it's in the ecosystem: the token engine, the AI tooling, the CLI, and the community. Free components drive adoption, and adoption drives the ecosystem.</p>
`,
  },
  {
    id: 'zoneless',
    title: 'Zoneless Angular in Practice',
    excerpt:
      'How NGXSMK eliminates Zone.js dependency and what it means for bundle size, SSR performance, and runtime efficiency.',
    tag: 'Announcement',
    tagColor: '#6366f1',
    date: new Date(Date.now() - 55 * 86400000),
    readTime: '7 min read',
    author: 'Sachin',
    content: `
<p>Zone.js has been Angular's change detection mechanism since Angular 2. It's powerful, but it comes with costs: bundle size overhead, unpredictable timing, and complexity in SSR scenarios. NGXSMK eliminates Zone.js entirely.</p>

<h2>How It Works</h2>
<p>Instead of patching async APIs to trigger change detection, NGXSMK components use Angular signals. When a signal's value changes, only the effects and computed values that depend on it re-run. No zone overhead, no unnecessary re-renders.</p>

<h2>Bundle Size Impact</h2>
<p>Removing Zone.js saves approximately 13KB gzipped from the production bundle. For applications that already use <code>zoneless</code> Bootstrap, this is a no-op. For applications that haven't migrated yet, NGXSMK components work alongside Zone.js without conflicts.</p>

<h2>SSR Benefits</h2>
<p>Server-side rendering without Zone.js is simpler. There's no need to stabilize zoneless promises or wait for <code>onStable</strong>. The server renders, serializes, and sends — deterministic from start to finish.</p>
`,
  },
  {
    id: 'motion',
    title: 'Motion.dev Integration',
    excerpt:
      'Optional motion.dev integration with graceful degradation. Every animation parameter exposed as a signal input.',
    tag: 'Theming',
    tagColor: '#10b981',
    date: new Date(Date.now() - 70 * 86400000),
    readTime: '9 min read',
    author: 'Sachin',
    content: `
<p>Animations make UIs feel alive, but they're often the first thing cut when bundle size matters. NGXSMK's motion.dev integration is optional — install it for rich spring/physics animations, or skip it and get CSS fallbacks for free.</p>

<h2>The Architecture</h2>
<p>Motion.dev is loaded via dynamic <code>import()</code> at runtime. If the package isn't installed, directives no-op or fall back to CSS transitions. This means:</p>
<ul>
  <li>Zero bundle impact when motion isn't installed</li>
  <li>Full spring/inertia/tween animations when it is</li>
  <li>Signal-based control over every parameter</li>
</ul>

<h2>Signal Inputs</h2>
<p>Every animation parameter is exposed as a signal input:</p>

<pre><code>&lt;div
  ngxsmkAnimate
  [initial]="{ opacity: 0, y: 20 }"
  [animate]="{ opacity: 1, y: 0 }"
  [transition]="{ type: 'spring', stiffness: 300 }"&gt;
  Content
&lt;/div&gt;</code></pre>

<h2>Gesture Directives</h2>
<p>NGXSMK ships four gesture directives: <code>[ngxsmkHover]</code>, <code>[ngxsmkPress]</code>, <code>[ngxsmkScrollLinked]</code>, and <code>[ngxsmkDrag]</code>. Each works with or without motion.dev, degrading gracefully to CSS transforms.</p>

<h2>Reduced Motion</h2>
<p>All motion respects <code>prefers-reduced-motion</code> automatically. Users who prefer reduced motion see instant state changes instead of animations — no configuration needed.</p>
`,
  },
];

export function getBlogPost(id: string): BlogPost | undefined {
  return blogPosts.find((p) => p.id === id);
}
