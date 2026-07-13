import { NgxsmkChatWindow } from '@ngxsmk/core/chat-window';
import { NgxsmkChatInput } from '@ngxsmk/core/chat-input';
import { NgxsmkChatLayout } from '@ngxsmk/core/chat-layout';
import { NgxsmkChatLayoutScrollButton } from '@ngxsmk/core/chat-layout-scroll-button';
import { NgxsmkChatMessage, type ChatMessageData } from '@ngxsmk/core/chat-message';
import { NgxsmkChatMessageBubble } from '@ngxsmk/core/chat-message-bubble';
import { NgxsmkChatMessageMetadata } from '@ngxsmk/core/chat-message-metadata';
import { NgxsmkChatSystemMessage } from '@ngxsmk/core/chat-system-message';
import { NgxsmkChatSendButton } from '@ngxsmk/core/chat-send-button';
import { NgxsmkChatDictationButton } from '@ngxsmk/core/chat-dictation-button';
import { NgxsmkChatTokenizedText } from '@ngxsmk/core/chat-tokenized-text';
import { NgxsmkChatComposerTokenElement } from '@ngxsmk/core/chat-composer-token-element';
import { NgxsmkChatComposerDrawer } from '@ngxsmk/core/chat-composer-drawer';
import { NgxsmkConversationList } from '@ngxsmk/core/conversation-list';
import { NgxsmkStreamingText } from '@ngxsmk/core/streaming-text';
import { NgxsmkMarkdownViewer } from '@ngxsmk/core/markdown-viewer';
import { NgxsmkCodeBlock } from '@ngxsmk/core/code-block';
import { NgxsmkDiffViewer } from '@ngxsmk/core/diff-viewer';
import { NgxsmkCitationViewer } from '@ngxsmk/core/citation-viewer';
import { NgxsmkToolCallViewer } from '@ngxsmk/core/tool-call-viewer';
import { NgxsmkReasoningTimeline } from '@ngxsmk/core/reasoning-timeline';
import { NgxsmkMemoryViewer } from '@ngxsmk/core/memory-viewer';
import { NgxsmkVoiceInput } from '@ngxsmk/core/voice-input';
import { NgxsmkAudioPlayer } from '@ngxsmk/core/audio-player';
import { NgxsmkImageViewer } from '@ngxsmk/core/image-viewer';
import { NgxsmkAgentCard } from '@ngxsmk/core/agent-card';
import { Component, signal } from '@angular/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

@Component({
  selector: 'ai-page',
  standalone: true,
  imports: [
    ShowcaseExample,
    NgxsmkAgentCard,
    NgxsmkChatWindow,
    NgxsmkChatInput,
    NgxsmkChatLayout,
    NgxsmkChatLayoutScrollButton,
    NgxsmkChatMessage,
    NgxsmkChatMessageBubble,
    NgxsmkChatMessageMetadata,
    NgxsmkChatSystemMessage,
    NgxsmkChatSendButton,
    NgxsmkChatDictationButton,
    NgxsmkChatTokenizedText,
    NgxsmkChatComposerTokenElement,
    NgxsmkChatComposerDrawer,
    NgxsmkConversationList,
    NgxsmkStreamingText,
    NgxsmkMarkdownViewer,
    NgxsmkCodeBlock,
    NgxsmkDiffViewer,
    NgxsmkCitationViewer,
    NgxsmkToolCallViewer,
    NgxsmkReasoningTimeline,
    NgxsmkMemoryViewer,
    NgxsmkVoiceInput,
    NgxsmkAudioPlayer,
    NgxsmkImageViewer,
  ],
  template: `
    <h2 class="ngxsmk-page-title">AI</h2>
    <p class="ngxsmk-page-desc">
      Building blocks for conversational and agentic interfaces — from chat
      windows and streaming text to tool calls, reasoning traces, and memory.
    </p>

    <showcase-example
      title="Agent Card"
      description="Compact identity card for an AI agent: name, model, status, and description."
      [code]="codeAgentCard"
    >
      <ngxsmk-agent-card [agent]="agent" />
      <ngxsmk-agent-card [agent]="agentIdle" />
    </showcase-example>

    <showcase-example
      title="Chat Window"
      description="Scrollable message list that renders user, assistant, and system turns."
      [code]="codeChatWindow"
    >
      <div class="ngxsmk-sc-surface" style="height:360px;width:100%;max-width:440px">
        <ngxsmk-chat-window [messages]="chatMessages" />
      </div>
    </showcase-example>

    <showcase-example
      title="Chat Input"
      description="Auto-growing composer with a submit output. Project action buttons via the [actions] slot."
      [code]="codeChatInput"
    >
      <div class="ngxsmk-demo-stack" style="width:100%;max-width:440px">
        @if (sentLog().length) {
          <div class="ngxsmk-sc-surface" style="padding:0.5rem 0.75rem;font-size:0.8125rem">
            <strong>Sent:</strong> {{ sentLog() }}
          </div>
        }
        <ngxsmk-chat-input
          placeholder="Message the assistant…"
          [(value)]="draft"
          (submitted)="onSend($event)"
        >
          <ngxsmk-chat-send-button actions />
        </ngxsmk-chat-input>
      </div>
    </showcase-example>

    <showcase-example
      title="Chat Layout"
      description="Full chat shell with sidebar, header, scrolling body, and a pinned input region."
      [code]="codeChatLayout"
    >
      <div class="ngxsmk-sc-surface" style="height:360px;width:100%;max-width:560px">
        <ngxsmk-chat-layout style="height:100%">
          <div sidebar class="ngxsmk-sc-surface" style="padding:0.75rem;width:140px">
            <strong>Threads</strong>
            <div style="margin-top:0.5rem;font-size:0.8125rem;color:var(--ngxsmk-color-on-surface-variant)">
              Onboarding<br />Billing<br />Roadmap
            </div>
          </div>
          <div header style="padding:0.5rem 0.75rem;border-bottom:1px solid var(--ngxsmk-color-outline-variant)">
            <strong>Assistant</strong>
          </div>
          <div style="padding:0.75rem;font-size:0.875rem">
            Ask me anything about your account.
            <ngxsmk-chat-layout-scroll-button />
          </div>
          <div input style="padding:0.5rem;background:var(--ngxsmk-color-surface-container)">
            <ngxsmk-chat-input placeholder="Reply…" />
          </div>
        </ngxsmk-chat-layout>
      </div>
    </showcase-example>

    <showcase-example
      title="Chat Send Button &amp; Dictation Button"
      description="Composer controls: a disabled-aware send button and a dictation toggle."
      [code]="codeComposerButtons"
    >
      <div class="ngxsmk-demo-row">
        <ngxsmk-chat-send-button (clicked)="onSendClick()" />
        <ngxsmk-chat-send-button [disabled]="true" />
        <ngxsmk-chat-dictation-button [listening]="dictating()" (toggled)="dictating.set(!dictating())" />
      </div>
    </showcase-example>

    <showcase-example
      title="Chat Tokenized Text"
      description="Renders text with highlighted mentions, tools, and file tokens."
      [code]="codeTokens"
    >
      <div class="ngxsmk-demo-stack" style="width:100%;max-width:520px">
        <div class="ngxsmk-demo-row">
          <ngxsmk-chat-composer-token-element label="@alice" variant="entity" />
          <ngxsmk-chat-composer-token-element label="search()" variant="tool" />
          <ngxsmk-chat-composer-token-element label="report.pdf" variant="file" />
        </div>
        <ngxsmk-chat-tokenized-text
          [text]="tokenText"
          [tokens]="tokenTokens"
          style="display:block"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Conversation List"
      description="Selectable list of past conversations with title and last-message preview."
      [code]="codeConversations"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:320px">
        <ngxsmk-conversation-list [conversations]="conversations" [(activeId)]="activeConversation" />
      </div>
    </showcase-example>

    <showcase-example
      title="Composer Drawer"
      description="Slide-up panel for attachments, prompts, and tools. Toggle it open below."
      [code]="codeDrawer"
    >
      <div style="position:relative;padding-top:2.5rem;width:100%;max-width:520px">
        <button type="button" class="ngxsmk-demo-toggle" (click)="drawerOpen.set(!drawerOpen())">
          {{ drawerOpen() ? 'Close composer' : 'Open composer' }}
        </button>
        <ngxsmk-chat-composer-drawer [open]="drawerOpen()" (closed)="drawerOpen.set(false)">
          <div class="ngxsmk-demo-stack" style="gap:0.5rem">
            <strong>Composer tools</strong>
            <div class="ngxsmk-demo-row">
              <ngxsmk-chat-composer-token-element label="@team" variant="entity" />
              <ngxsmk-chat-composer-token-element label="query()" variant="tool" />
              <ngxsmk-chat-composer-token-element label="data.csv" variant="file" />
            </div>
            <p style="margin:0;font-size:0.8125rem;color:var(--ngxsmk-color-on-surface-variant)">
              Attach files, pick a prompt, or summon a tool — then send.
            </p>
          </div>
        </ngxsmk-chat-composer-drawer>
      </div>
    </showcase-example>

    <showcase-example
      title="Streaming Text"
      description="Types out a string character-by-character with a blinking cursor."
      [code]="codeStreaming"
    >
      <div class="ngxsmk-sc-surface" style="padding:0.75rem;width:100%;max-width:520px;font-size:0.875rem">
        <ngxsmk-streaming-text [text]="streamingText" [speed]="18" />
      </div>
    </showcase-example>

    <showcase-example
      title="Markdown Viewer"
      description="Renders Markdown content into theme-aware styled HTML."
      [code]="codeMarkdown"
    >
      <div class="ngxsmk-sc-surface" style="padding:0.75rem;width:100%;max-width:520px">
        <ngxsmk-markdown-viewer>{{ markdownSample }}</ngxsmk-markdown-viewer>
      </div>
    </showcase-example>

    <showcase-example
      title="Code Block"
      description="Monospaced, scrollable code surface with a language hint."
      [code]="codeCodeBlock"
    >
      <div style="width:100%;max-width:520px">
        <ngxsmk-code-block language="typescript">{{ codeBlockSample }}</ngxsmk-code-block>
      </div>
    </showcase-example>

    <showcase-example
      title="Diff Viewer"
      description="Line-by-line diff with add/remove highlighting parsed from a unified source."
      [code]="codeDiff"
    >
      <div style="width:100%;max-width:520px">
        <ngxsmk-diff-viewer [source]="diffSource" />
      </div>
    </showcase-example>

    <showcase-example
      title="Citation Viewer"
      description="Source card showing the title, author, and a quoted snippet."
      [code]="codeCitation"
    >
      <div style="width:100%;max-width:420px">
        <ngxsmk-citation-viewer
          title="Attention Is All You Need"
          author="Vaswani et al."
          snippet="The Transformer allows for significantly more parallelization than recurrent models."
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Tool Call Viewer"
      description="Shows agent tool invocations, arguments, status, and results."
      [code]="codeToolCall"
    >
      <div style="width:100%;max-width:480px">
        <ngxsmk-tool-call-viewer [calls]="toolCalls" />
      </div>
    </showcase-example>

    <showcase-example
      title="Reasoning Timeline"
      description="Step-by-step trace of the agent's reasoning with optional durations."
      [code]="codeReasoning"
    >
      <div class="ngxsmk-sc-surface" style="padding:0.75rem;width:100%;max-width:480px">
        <ngxsmk-reasoning-timeline [steps]="reasoningSteps" />
      </div>
    </showcase-example>

    <showcase-example
      title="Memory Viewer"
      description="Key/value store of what the agent remembers across the session."
      [code]="codeMemory"
    >
      <div style="width:100%;max-width:420px">
        <ngxsmk-memory-viewer [entries]="memoryEntries" />
      </div>
    </showcase-example>

    <showcase-example
      title="Voice Input"
      description="Microphone control that toggles recording and surfaces a transcript."
      [code]="codeVoice"
    >
      <div class="ngxsmk-demo-row">
        <ngxsmk-voice-input />
      </div>
    </showcase-example>

    <showcase-example
      title="Audio Player"
      description="Compact progress bar for voice replies and podcast-style playback."
      [code]="codeAudio"
    >
      <div style="width:100%;max-width:420px">
        <ngxsmk-audio-player
          label="Voice reply"
          [progress]="62"
          currentTime="1:58"
          duration="3:12"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Image Viewer"
      description="Image preview that expands to a fullscreen lightbox on click."
      [code]="codeImage"
    >
      <div style="width:100%;max-width:360px">
        <ngxsmk-image-viewer src="https://picsum.photos/seed/ngxsmk/600/400" alt="Sample generated image" />
      </div>
    </showcase-example>

    <showcase-example
      title="Chat Message"
      description="Container that lays out a single turn by role (user / assistant / system), aligning the avatar and body accordingly."
      [code]="codeChatMessage"
    >
      <div style="width:100%;max-width:480px" class="ngxsmk-sc-surface">
        <ngxsmk-chat-message [message]="msgUser">
          <div class="ngxsmk-msg-avatar" aria-hidden="true">JS</div>
          <div class="ngxsmk-msg-body">
            <ngxsmk-chat-message-bubble>{{ msgUser.content }}</ngxsmk-chat-message-bubble>
            <ngxsmk-chat-message-metadata [timestamp]="msgUser.timestamp" />
          </div>
        </ngxsmk-chat-message>
        <ngxsmk-chat-message [message]="msgAssistant">
          <div class="ngxsmk-msg-avatar" aria-hidden="true">AI</div>
          <div class="ngxsmk-msg-body">
            <ngxsmk-chat-message-bubble>{{ msgAssistant.content }}</ngxsmk-chat-message-bubble>
            <ngxsmk-chat-message-metadata [timestamp]="msgAssistant.timestamp" />
          </div>
        </ngxsmk-chat-message>
      </div>
    </showcase-example>

    <showcase-example
      title="Chat Message Bubble"
      description="The speech bubble that wraps message content. User bubbles are emphasized via the ancestor role."
      [code]="codeChatMessageBubble"
    >
      <div style="width:100%;max-width:480px" class="ngxsmk-sc-col">
        <ngxsmk-chat-message [message]="msgUser">
          <ngxsmk-chat-message-bubble>{{ msgUser.content }}</ngxsmk-chat-message-bubble>
        </ngxsmk-chat-message>
        <ngxsmk-chat-message [message]="msgAssistant">
          <ngxsmk-chat-message-bubble>{{ msgAssistant.content }}</ngxsmk-chat-message-bubble>
        </ngxsmk-chat-message>
      </div>
    </showcase-example>

    <showcase-example
      title="Chat Message Metadata"
      description="Renders a compact timestamp (and any status) beneath a message bubble."
      [code]="codeChatMessageMetadata"
    >
      <div class="ngxsmk-demo-stack" style="width:100%;max-width:360px">
        <ngxsmk-chat-message-metadata [timestamp]="msgUser.timestamp" />
        <ngxsmk-chat-message-metadata [timestamp]="msgAssistant.timestamp" />
      </div>
    </showcase-example>

    <showcase-example
      title="Chat System Message"
      description="Centered, low-emphasis pill for system notices like connection state or mode changes."
      [code]="codeChatSystemMessage"
    >
      <ngxsmk-chat-system-message [message]="systemNotice" />
    </showcase-example>
  `,
  styles: `
    :host { display: block; }
    .ngxsmk-demo-row { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
    .ngxsmk-demo-stack { display: flex; flex-direction: column; gap: 0.75rem; align-items: stretch; }
    .ngxsmk-demo-toggle {
      padding: 0.5rem 1rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font: inherit;
      font-size: 0.8125rem;
      cursor: pointer;
    }
    .ngxsmk-demo-toggle:hover { background: var(--ngxsmk-color-surface-hover); }
    .ngxsmk-msg-avatar {
      flex: 0 0 auto;
      width: 2rem;
      height: 2rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface-container-high, #e7e7ea);
      color: var(--ngxsmk-color-on-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .ngxsmk-msg-body { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
  `,
})
export class AiPage {
  protected readonly draft = signal('');
  protected readonly sentLog = signal('');
  protected readonly dictating = signal(false);
  protected readonly drawerOpen = signal(false);
  protected readonly activeConversation = signal('1');

  protected onSend(text: string): void {
    this.sentLog.set(text);
    this.draft.set('');
  }

  protected onSendClick(): void {
    this.sentLog.set('Send clicked');
  }

  protected readonly agent = {
    name: 'Atlas Assistant',
    description: 'A helpful agent for onboarding and support.',
    status: 'active' as const,
    model: 'gpt-4o',
  };

  protected readonly agentIdle = {
    name: 'Nightly Indexer',
    description: 'Runs background data sync jobs.',
    status: 'idle' as const,
    model: 'gpt-4o-mini',
  };

  protected readonly chatMessages = [
    { id: '1', role: 'user' as const, content: 'How do I reset my API key?', timestamp: new Date() },
    {
      id: '2',
      role: 'assistant' as const,
      content: 'Open Settings → API Keys and choose "Rotate". I can do it for you if you like.',
      timestamp: new Date(),
    },
    { id: '3', role: 'user' as const, content: 'Please do.', timestamp: new Date() },
    { id: '4', role: 'assistant' as const, content: 'Done — a new key is now active.', timestamp: new Date() },
  ];

  protected readonly conversations = [
    { id: '1', title: 'Onboarding help', lastMessage: 'Thanks, that worked!', updatedAt: new Date() },
    { id: '2', title: 'Billing question', lastMessage: 'Invoice #1042 attached', updatedAt: new Date() },
    { id: '3', title: 'Feature request', lastMessage: 'Could we add dark mode?', updatedAt: new Date() },
  ];

  protected readonly msgUser: ChatMessageData = {
    id: 'u1',
    role: 'user',
    content: 'How do I reset my API key?',
    timestamp: new Date(),
  };

  protected readonly msgAssistant: ChatMessageData = {
    id: 'a1',
    role: 'assistant',
    content: 'Open Settings → API Keys and choose "Rotate" — I can do it for you.',
    timestamp: new Date(),
  };

  protected readonly systemNotice = 'Assistant is typing…';

  protected readonly tokenText = 'Mention @alice and call search() on report.pdf to summarize.';
  protected readonly tokenTokens = [
    { value: '@alice', label: 'Alice' },
    { value: 'search()', label: 'search' },
    { value: 'report.pdf', label: 'report' },
  ];

  protected readonly streamingText =
    'Sure! Here is a concise summary of the quarterly results, generated token by token.';

  protected readonly markdownSample = [
    '# Quarterly Summary',
    'Revenue grew **18%** versus last quarter, driven by:',
    '',
    '- New enterprise accounts',
    '- Expanded seat usage',
    '',
    '> Net retention stayed above 120%.',
    '',
    'See the `report.csv` for details.',
  ].join('\n');

  protected readonly codeBlockSample = [
    'export function greet(name: string): string {',
    '  return `Hello, ${name}!`;',
    '}',
  ].join('\n');

  protected readonly diffSource = [
    'function add(a, b) {',
    '-  return a - b;',
    '+  return a + b;',
    '}',
  ].join('\n');

  protected readonly toolCalls = [
    { id: '1', name: 'search', args: { q: 'weather' }, status: 'completed' as const, result: 'Sunny, 24°C' },
    { id: '2', name: 'query_db', args: { table: 'orders' }, status: 'running' as const },
    {
      id: '3',
      name: 'send_email',
      args: { to: 'team@x.com', subject: 'Update' },
      status: 'error' as const,
      result: 'SMTP timeout',
    },
  ];

  protected readonly reasoningSteps = [
    { label: 'Parse request', content: 'Identified intent: reset API key.', durationMs: 120 },
    { label: 'Check permissions', content: 'User has admin scope.', durationMs: 240 },
    { label: 'Rotate key', content: 'Generated and stored new secret.', durationMs: 510 },
    { label: 'Confirm', content: 'Notified user via channel.', durationMs: 90 },
  ];

  protected readonly memoryEntries = [
    { key: 'Name', value: 'Jordan' },
    { key: 'Plan', value: 'Enterprise' },
    { key: 'Preference', value: 'Dark mode' },
    { key: 'Last topic', value: 'API keys' },
  ];

  protected readonly codeAgentCard = `<ngxsmk-agent-card [agent]="agent" />`;
  protected readonly codeChatWindow = `<ngxsmk-chat-window [messages]="messages" />`;
  protected readonly codeChatInput = `<ngxsmk-chat-input placeholder="Message…" (submitted)="onSend($event)">\n  <ngxsmk-chat-send-button actions />\n</ngxsmk-chat-input>`;
  protected readonly codeChatLayout = `<ngxsmk-chat-layout>\n  <div sidebar>Threads</div>\n  <div header>Assistant</div>\n  <div>Body</div>\n  <div input><ngxsmk-chat-input /></div>\n</ngxsmk-chat-layout>`;
  protected readonly codeComposerButtons = `<ngxsmk-chat-send-button (clicked)="send()" />\n<ngxsmk-chat-dictation-button [listening]="rec" (toggled)="rec = !rec" />`;
  protected readonly codeTokens = `<ngxsmk-chat-tokenized-text [text]="text" [tokens]="tokens" />\n<ngxsmk-chat-composer-token-element label="@alice" variant="entity" />`;
  protected readonly codeConversations = `<ngxsmk-conversation-list [conversations]="list" [activeId]="active" />`;
  protected readonly codeDrawer = `<ngxsmk-chat-composer-drawer [open]="open" (closed)="open = false">\n  <!-- attachments, prompts, tools -->\n</ngxsmk-chat-composer-drawer>`;
  protected readonly codeStreaming = `<ngxsmk-streaming-text [text]="text" [speed]="18" />`;
  protected readonly codeMarkdown = `<ngxsmk-markdown-viewer>{{ markdown }}</ngxsmk-markdown-viewer>`;
  protected readonly codeCodeBlock = `<ngxsmk-code-block language="typescript">\n  const x = 1;\n</ngxsmk-code-block>`;
  protected readonly codeDiff = `<ngxsmk-diff-viewer [source]="diffString" />`;
  protected readonly codeCitation = `<ngxsmk-citation-viewer title="Paper" author="Author" snippet="Key finding." />`;
  protected readonly codeToolCall = `<ngxsmk-tool-call-viewer [calls]="calls" />`;
  protected readonly codeReasoning = `<ngxsmk-reasoning-timeline [steps]="steps" />`;
  protected readonly codeMemory = `<ngxsmk-memory-viewer [entries]="entries" />`;
  protected readonly codeVoice = `<ngxsmk-voice-input />`;
  protected readonly codeAudio = `<ngxsmk-audio-player label="Voice reply" [progress]="62" currentTime="1:58" duration="3:12" />`;
  protected readonly codeImage = `<ngxsmk-image-viewer src="/img.png" alt="Generated image" />`;
  protected readonly codeChatMessage = `<ngxsmk-chat-message [message]="message">\n  <div class="ngxsmk-msg-avatar">JS</div>\n  <div class="ngxsmk-msg-body">\n    <ngxsmk-chat-message-bubble>{{ message.content }}</ngxsmk-chat-message-bubble>\n    <ngxsmk-chat-message-metadata [timestamp]="message.timestamp" />\n  </div>\n</ngxsmk-chat-message>`;
  protected readonly codeChatMessageBubble = `<ngxsmk-chat-message [message]="userMsg">\n  <ngxsmk-chat-message-bubble>{{ userMsg.content }}</ngxsmk-chat-message-bubble>\n</ngxsmk-chat-message>\n<ngxsmk-chat-message [message]="assistantMsg">\n  <ngxsmk-chat-message-bubble>{{ assistantMsg.content }}</ngxsmk-chat-message-bubble>\n</ngxsmk-chat-message>`;
  protected readonly codeChatMessageMetadata = `<ngxsmk-chat-message-metadata [timestamp]="message.timestamp" />`;
  protected readonly codeChatSystemMessage = `<ngxsmk-chat-system-message [message]="'Assistant is typing…'" />`;
}
