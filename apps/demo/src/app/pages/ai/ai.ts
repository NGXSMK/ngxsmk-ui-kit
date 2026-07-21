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
import { NgxsmkPromptCarousel, PromptItem } from '@ngxsmk/core/prompt-carousel';
import { NgxsmkAiChat, NgxsmkAiMessage } from '@ngxsmk/core/ai-chat';
import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
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
    NgxsmkPromptCarousel,
    NgxsmkAiChat,
    TranslatePipe,
  ],
  template: `
    <h2 class="ngxsmk-page-title">{{ 'category.ai' | translate }}</h2>
    <p class="ngxsmk-page-desc">
      {{ 'ai.pageDesc' | translate }}
    </p>

    <showcase-example
      title="Agent Card"
      [description]="'ai.agentCardDesc' | translate"
      [code]="codeAgentCard"
      [component]="NgxsmkAgentCard"
      [customize]="customizeNgxsmkAgentCard"
    >
      <ngxsmk-agent-card [agent]="agent" />
      <ngxsmk-agent-card [agent]="agentIdle" />
    </showcase-example>

    <showcase-example
      title="Interactive AI Chat Assistant"
      [description]="'ai.aiChatDesc' | translate"
      [code]="codeAiChat"
      [component]="NgxsmkAiChat"
    >
      <div style="height: 500px; width: 100%; max-width: 600px;">
        <ngxsmk-ai-chat
          [messages]="aiChatMessages()"
          [suggestions]="aiChatSuggestions()"
          [isTyping]="aiChatIsTyping()"
          [tokenCount]="aiChatTokenCount()"
          (sendMessage)="handleSendMessage($event)"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Chat Window"
      [description]="'ai.chatWindowDesc' | translate"
      [code]="codeChatWindow"
      [component]="NgxsmkChatWindow"
      [customize]="customizeNgxsmkChatWindow"
    >
      <div class="ngxsmk-sc-surface" style="height:360px;width:100%;max-width:440px">
        <ngxsmk-chat-window [messages]="chatMessages" />
      </div>
    </showcase-example>

    <showcase-example
      title="Chat Input"
      [description]="'ai.chatInputDesc' | translate"
      [code]="codeChatInput"
      [component]="NgxsmkChatInput"
      [customize]="customizeNgxsmkChatInput"
    >
      <div class="ngxsmk-demo-stack" style="width:100%;max-width:440px">
        @if (sentLog().length) {
          <div class="ngxsmk-sc-surface" style="padding:0.5rem 0.75rem;font-size:var(--ngxsmk-text-body-sm-size)">
            <strong>{{ 'ai.sent' | translate }}</strong> {{ sentLog() }}
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
      [description]="'ai.chatLayoutDesc' | translate"
      [code]="codeChatLayout"
      [component]="NgxsmkChatLayout"
      [customize]="customizeNgxsmkChatLayout"
    >
      <div class="ngxsmk-sc-surface" style="height:360px;width:100%;max-width:560px">
        <ngxsmk-chat-layout style="height:100%">
          <div sidebar class="ngxsmk-sc-surface" style="padding:0.75rem;width:140px">
            <strong>{{ 'ai.threads' | translate }}</strong>
            <div
              style="margin-top:0.5rem;font-size:var(--ngxsmk-text-body-sm-size);color:var(--ngxsmk-color-on-surface-variant)"
            >
              Onboarding<br />Billing<br />Roadmap
            </div>
          </div>
          <div
            header
            style="padding:0.5rem 0.75rem;border-bottom:1px solid var(--ngxsmk-color-outline-variant)"
          >
            <strong>{{ 'ai.assistant' | translate }}</strong>
          </div>
          <div style="padding:0.75rem;font-size:var(--ngxsmk-text-body-md-size)">
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
      [description]="'ai.composerButtonsDesc' | translate"
      [code]="codeComposerButtons"
      [component]="NgxsmkChatSendButton"
      [customize]="customizeNgxsmkChatSendButton"
    >
      <div class="ngxsmk-demo-row">
        <ngxsmk-chat-send-button (clicked)="onSendClick()" />
        <ngxsmk-chat-send-button [disabled]="true" />
        <ngxsmk-chat-dictation-button
          [listening]="dictating()"
          (toggled)="dictating.set(!dictating())"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Chat Tokenized Text"
      [description]="'ai.tokenizedTextDesc' | translate"
      [code]="codeTokens"
      [component]="NgxsmkChatComposerTokenElement"
      [customize]="customizeNgxsmkChatComposerTokenElement"
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
      [description]="'ai.conversationListDesc' | translate"
      [code]="codeConversations"
      [component]="NgxsmkConversationList"
      [customize]="customizeNgxsmkConversationList"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:320px">
        <ngxsmk-conversation-list
          [conversations]="conversations"
          [(activeId)]="activeConversation"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Composer Drawer"
      [description]="'ai.composerDrawerDesc' | translate"
      [code]="codeDrawer"
      [component]="NgxsmkChatComposerDrawer"
      [customize]="customizeNgxsmkChatComposerDrawer"
    >
      <div style="position:relative;padding-top:2.5rem;width:100%;max-width:520px">
        <button type="button" class="ngxsmk-demo-toggle" (click)="drawerOpen.set(!drawerOpen())">
          {{ drawerOpen() ? ('ai.closeComposer' | translate) : ('ai.openComposer' | translate) }}
        </button>
        <ngxsmk-chat-composer-drawer [open]="drawerOpen()" (closed)="drawerOpen.set(false)">
          <div class="ngxsmk-demo-stack" style="gap:0.5rem">
            <strong>{{ 'ai.composerTools' | translate }}</strong>
            <div class="ngxsmk-demo-row">
              <ngxsmk-chat-composer-token-element label="@team" variant="entity" />
              <ngxsmk-chat-composer-token-element label="query()" variant="tool" />
              <ngxsmk-chat-composer-token-element label="data.csv" variant="file" />
            </div>
            <p style="margin:0;font-size:var(--ngxsmk-text-body-sm-size);color:var(--ngxsmk-color-on-surface-variant)">
              Attach files, pick a prompt, or summon a tool - then send.
            </p>
          </div>
        </ngxsmk-chat-composer-drawer>
      </div>
    </showcase-example>

    <showcase-example
      title="Streaming Text"
      [description]="'ai.streamingTextDesc' | translate"
      [code]="codeStreaming"
      [component]="NgxsmkStreamingText"
      [customize]="customizeNgxsmkStreamingText"
    >
      <div
        class="ngxsmk-sc-surface"
        style="padding:0.75rem;width:100%;max-width:520px;font-size:var(--ngxsmk-text-body-md-size)"
      >
        <ngxsmk-streaming-text [text]="streamingText" [speed]="18" />
      </div>
    </showcase-example>

    <showcase-example
      title="Markdown Viewer"
      [description]="'ai.markdownViewerDesc' | translate"
      [code]="codeMarkdown"
      [component]="NgxsmkMarkdownViewer"
      [customize]="customizeNgxsmkMarkdownViewer"
    >
      <div class="ngxsmk-sc-surface" style="padding:0.75rem;width:100%;max-width:520px">
        <ngxsmk-markdown-viewer>{{ markdownSample }}</ngxsmk-markdown-viewer>
      </div>
    </showcase-example>

    <showcase-example
      title="Code Block"
      [description]="'ai.codeBlockDesc' | translate"
      [code]="codeCodeBlock"
      [component]="NgxsmkCodeBlock"
      [customize]="customizeNgxsmkCodeBlock"
    >
      <div style="width:100%;max-width:520px">
        <ngxsmk-code-block language="typescript">{{ codeBlockSample }}</ngxsmk-code-block>
      </div>
    </showcase-example>

    <showcase-example
      title="Diff Viewer"
      [description]="'ai.diffViewerDesc' | translate"
      [code]="codeDiff"
      [component]="NgxsmkDiffViewer"
      [customize]="customizeNgxsmkDiffViewer"
    >
      <div style="width:100%;max-width:520px">
        <ngxsmk-diff-viewer [source]="diffSource" />
      </div>
    </showcase-example>

    <showcase-example
      title="Citation Viewer"
      [description]="'ai.citationViewerDesc' | translate"
      [code]="codeCitation"
      [component]="NgxsmkCitationViewer"
      [customize]="customizeNgxsmkCitationViewer"
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
      [description]="'ai.toolCallViewerDesc' | translate"
      [code]="codeToolCall"
      [component]="NgxsmkToolCallViewer"
      [customize]="customizeNgxsmkToolCallViewer"
    >
      <div style="width:100%;max-width:480px">
        <ngxsmk-tool-call-viewer [calls]="toolCalls" />
      </div>
    </showcase-example>

    <showcase-example
      title="Reasoning Timeline"
      [description]="'ai.reasoningTimelineDesc' | translate"
      [code]="codeReasoning"
      [component]="NgxsmkReasoningTimeline"
      [customize]="customizeNgxsmkReasoningTimeline"
    >
      <div class="ngxsmk-sc-surface" style="padding:0.75rem;width:100%;max-width:480px">
        <ngxsmk-reasoning-timeline [steps]="reasoningSteps" />
      </div>
    </showcase-example>

    <showcase-example
      title="Memory Viewer"
      [description]="'ai.memoryViewerDesc' | translate"
      [code]="codeMemory"
      [component]="NgxsmkMemoryViewer"
      [customize]="customizeNgxsmkMemoryViewer"
    >
      <div style="width:100%;max-width:420px">
        <ngxsmk-memory-viewer [entries]="memoryEntries" />
      </div>
    </showcase-example>

    <showcase-example
      title="Voice Input"
      [description]="'ai.voiceInputDesc' | translate"
      [code]="codeVoice"
      [component]="NgxsmkVoiceInput"
      [customize]="customizeNgxsmkVoiceInput"
    >
      <div class="ngxsmk-demo-row">
        <ngxsmk-voice-input />
      </div>
    </showcase-example>

    <showcase-example
      title="Audio Player"
      [description]="'ai.audioPlayerDesc' | translate"
      [code]="codeAudio"
      [component]="NgxsmkAudioPlayer"
      [customize]="customizeNgxsmkAudioPlayer"
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
      [description]="'ai.imageViewerDesc' | translate"
      [code]="codeImage"
      [component]="NgxsmkImageViewer"
      [customize]="customizeNgxsmkImageViewer"
    >
      <div style="width:100%;max-width:360px">
        <ngxsmk-image-viewer
          src="https://picsum.photos/seed/ngxsmk/600/400"
          alt="Sample generated image"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Chat Message"
      [description]="'ai.chatMessageDesc' | translate"
      [code]="codeChatMessage"
      [component]="NgxsmkChatMessage"
      [customize]="customizeNgxsmkChatMessage"
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
      [description]="'ai.chatMessageBubbleDesc' | translate"
      [code]="codeChatMessageBubble"
      [component]="NgxsmkChatMessage"
      [customize]="customizeNgxsmkChatMessage"
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
      [description]="'ai.chatMessageMetadataDesc' | translate"
      [code]="codeChatMessageMetadata"
      [component]="NgxsmkChatMessageMetadata"
      [customize]="customizeNgxsmkChatMessageMetadata"
    >
      <div class="ngxsmk-demo-stack" style="width:100%;max-width:360px">
        <ngxsmk-chat-message-metadata [timestamp]="msgUser.timestamp" />
        <ngxsmk-chat-message-metadata [timestamp]="msgAssistant.timestamp" />
      </div>
    </showcase-example>

    <showcase-example
      title="Chat System Message"
      [description]="'ai.chatSystemMessageDesc' | translate"
      [code]="codeChatSystemMessage"
      [component]="NgxsmkChatSystemMessage"
      [customize]="customizeNgxsmkChatSystemMessage"
    >
      <ngxsmk-chat-system-message [message]="systemNotice" />
    </showcase-example>

    <showcase-example
      title="Prompt Carousel (New)"
      [description]="'ai.promptCarouselDesc' | translate"
      [code]="codePromptCarousel"
      [component]="NgxsmkPromptCarousel"
      [customize]="customizeNgxsmkPromptCarousel"
    >
      <ngxsmk-prompt-carousel [prompts]="promptItemsList" (selected)="onPromptSelected($event)" />

      @if (selectedPromptText()) {
        <p class="ngxsmk-demo-hint" style="margin-top: 1rem;">
          {{ 'ai.activeSelection' | translate }} <strong>"{{ selectedPromptText() }}"</strong>
        </p>
      }
    </showcase-example>
  `,
  styles: `
    :host {
      display: block;
    }
    .ngxsmk-demo-row {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .ngxsmk-demo-stack {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      align-items: stretch;
    }
    .ngxsmk-demo-toggle {
      padding: 0.5rem 1rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      cursor: pointer;
    }
    .ngxsmk-demo-toggle:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
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
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
    }
    .ngxsmk-msg-body {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0;
    }
  `,
})
export class AiPage {
  protected readonly NgxsmkAgentCard = NgxsmkAgentCard;
  protected readonly customizeNgxsmkAgentCard = `/* Theme <ngxsmk-agent-card> via design tokens */
ngxsmk-agent-card {
  --ngxsmk-color-error: ;
  --ngxsmk-color-on-primary-container: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-color-success: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-warning: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkChatWindow = NgxsmkChatWindow;
  protected readonly customizeNgxsmkChatWindow = `/* Theme <ngxsmk-chat-window> via design tokens */
ngxsmk-chat-window {
  --ngxsmk-font-sans: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkChatInput = NgxsmkChatInput;
  protected readonly customizeNgxsmkChatInput = `/* Theme <ngxsmk-chat-input> via design tokens */
ngxsmk-chat-input {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-container: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkChatLayout = NgxsmkChatLayout;
  protected readonly customizeNgxsmkChatLayout = `/* Theme <ngxsmk-chat-layout> via design tokens */
ngxsmk-chat-layout {
  --ngxsmk-color-surface: ;
  --ngxsmk-font-sans: ;
}`;
  protected readonly NgxsmkChatSendButton = NgxsmkChatSendButton;
  protected readonly customizeNgxsmkChatSendButton = `/* Theme <ngxsmk-chat-send-button> via design tokens */
ngxsmk-chat-send-button {
  --ngxsmk-color-on-primary: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkChatComposerTokenElement = NgxsmkChatComposerTokenElement;
  protected readonly customizeNgxsmkChatComposerTokenElement = `/* Theme <ngxsmk-chat-composer-token-element> via design tokens */
ngxsmk-chat-composer-token-element {
  --ngxsmk-color-on-primary-container: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-on-tertiary-container: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-color-tertiary-container: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-0-5: ;
  --ngxsmk-space-2: ;
}`;
  protected readonly NgxsmkConversationList = NgxsmkConversationList;
  protected readonly customizeNgxsmkConversationList = `/* Theme <ngxsmk-conversation-list> via design tokens */
ngxsmk-conversation-list {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkChatComposerDrawer = NgxsmkChatComposerDrawer;
  protected readonly customizeNgxsmkChatComposerDrawer = `/* Theme <ngxsmk-chat-composer-drawer> via design tokens */
ngxsmk-chat-composer-drawer {
  --ngxsmk-color-backdrop: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-composer-drawer-height: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-shadow-xl: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-6: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
  --ngxsmk-z-modal: ;
}`;
  protected readonly NgxsmkStreamingText = NgxsmkStreamingText;
  protected readonly customizeNgxsmkStreamingText = `/* Theme <ngxsmk-streaming-text> via design tokens */
ngxsmk-streaming-text {
  --ngxsmk-color-primary: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-space-1: ;
}`;
  protected readonly NgxsmkMarkdownViewer = NgxsmkMarkdownViewer;
  protected readonly customizeNgxsmkMarkdownViewer = `/* Theme <ngxsmk-markdown-viewer> via design tokens */
ngxsmk-markdown-viewer {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface-container: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-mono: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkCodeBlock = NgxsmkCodeBlock;
  protected readonly customizeNgxsmkCodeBlock = `/* Theme <ngxsmk-code-block> via design tokens */
ngxsmk-code-block {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-mono: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkDiffViewer = NgxsmkDiffViewer;
  protected readonly customizeNgxsmkDiffViewer = `/* Theme <ngxsmk-diff-viewer> via design tokens */
ngxsmk-diff-viewer {
  --ngxsmk-color-error: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-success: ;
  --ngxsmk-font-mono: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-0-5: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkCitationViewer = NgxsmkCitationViewer;
  protected readonly customizeNgxsmkCitationViewer = `/* Theme <ngxsmk-citation-viewer> via design tokens */
ngxsmk-citation-viewer {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface-container: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkToolCallViewer = NgxsmkToolCallViewer;
  protected readonly customizeNgxsmkToolCallViewer = `/* Theme <ngxsmk-tool-call-viewer> via design tokens */
ngxsmk-tool-call-viewer {
  --ngxsmk-color-error: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-success: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-mono: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkReasoningTimeline = NgxsmkReasoningTimeline;
  protected readonly customizeNgxsmkReasoningTimeline = `/* Theme <ngxsmk-reasoning-timeline> via design tokens */
ngxsmk-reasoning-timeline {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-1-5: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkMemoryViewer = NgxsmkMemoryViewer;
  protected readonly customizeNgxsmkMemoryViewer = `/* Theme <ngxsmk-memory-viewer> via design tokens */
ngxsmk-memory-viewer {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkVoiceInput = NgxsmkVoiceInput;
  protected readonly customizeNgxsmkVoiceInput = `/* Theme <ngxsmk-voice-input> via design tokens */
ngxsmk-voice-input {
  --ngxsmk-color-error-container: ;
  --ngxsmk-color-on-error-container: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-space-2: ;
}`;
  protected readonly NgxsmkAudioPlayer = NgxsmkAudioPlayer;
  protected readonly customizeNgxsmkAudioPlayer = `/* Theme <ngxsmk-audio-player> via design tokens */
ngxsmk-audio-player {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkImageViewer = NgxsmkImageViewer;
  protected readonly customizeNgxsmkImageViewer = `/* Theme <ngxsmk-image-viewer> via design tokens */
ngxsmk-image-viewer {
  --ngxsmk-duration-fast: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-z-modal: ;
}`;
  protected readonly NgxsmkChatMessage = NgxsmkChatMessage;
  protected readonly customizeNgxsmkChatMessage = `/* Theme <ngxsmk-chat-message> via design tokens */
ngxsmk-chat-message {
  --ngxsmk-font-sans: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkChatMessageMetadata = NgxsmkChatMessageMetadata;
  protected readonly customizeNgxsmkChatMessageMetadata = `/* Theme <ngxsmk-chat-message-metadata> via design tokens */
ngxsmk-chat-message-metadata {
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-space-1: ;
  --ngxsmk-text-body-xs-size: ;
}`;
  protected readonly NgxsmkChatSystemMessage = NgxsmkChatSystemMessage;
  protected readonly customizeNgxsmkChatSystemMessage = `/* Theme <ngxsmk-chat-system-message> via design tokens */
ngxsmk-chat-system-message {
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkPromptCarousel = NgxsmkPromptCarousel;
  protected readonly customizeNgxsmkPromptCarousel = `/* Theme <ngxsmk-prompt-carousel> via design tokens */
ngxsmk-prompt-carousel {
  --ngxsmk-color-background: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-primary-hover: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-shadow-md: ;
  --ngxsmk-shadow-sm: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-12: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-4: ;
  --ngxsmk-space-6: ;
}`;

  protected readonly draft = signal('');
  protected readonly sentLog = signal('');
  protected readonly dictating = signal(false);
  protected readonly drawerOpen = signal(false);
  protected readonly activeConversation = signal('1');
  protected readonly selectedPromptText = signal('');

  protected readonly promptItemsList: PromptItem[] = [
    {
      id: '1',
      category: 'Coding',
      title: 'Refactor Code',
      prompt: 'Refactor this Angular component to use Signals and remove Zone.js.',
      icon: '⚡',
      colorPreset: 'violet',
    },
    {
      id: '2',
      category: 'Writing',
      title: 'Email Drafter',
      prompt: 'Write a polite follow-up email about the project status.',
      icon: '✉️',
      colorPreset: 'blue',
    },
    {
      id: '3',
      category: 'Productivity',
      title: 'Summarize Meeting',
      prompt: 'Summarize these transcripts into 5 key action points.',
      icon: '📋',
      colorPreset: 'emerald',
    },
    {
      id: '4',
      category: 'Creativity',
      title: 'Brainstorm Ideas',
      prompt: 'Brainstorm 5 naming ideas for a signal-native UI toolkit.',
      icon: '💡',
      colorPreset: 'amber',
    },
    {
      id: '5',
      category: 'Reviewing',
      title: 'Find Bugs',
      prompt: 'Perform a security audit and find edge cases in this code.',
      icon: '🔍',
      colorPreset: 'rose',
    },
  ];

  protected onPromptSelected(item: PromptItem): void {
    this.selectedPromptText.set(item.prompt);
  }

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
    {
      id: '1',
      role: 'user' as const,
      content: 'How do I reset my API key?',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: 'Open Settings → API Keys and choose "Rotate". I can do it for you if you like.',
      timestamp: new Date(),
    },
    { id: '3', role: 'user' as const, content: 'Please do.', timestamp: new Date() },
    {
      id: '4',
      role: 'assistant' as const,
      content: 'Done - a new key is now active.',
      timestamp: new Date(),
    },
  ];

  protected readonly conversations = [
    {
      id: '1',
      title: 'Onboarding help',
      lastMessage: 'Thanks, that worked!',
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Billing question',
      lastMessage: 'Invoice #1042 attached',
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Feature request',
      lastMessage: 'Could we add dark mode?',
      updatedAt: new Date(),
    },
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
    content: 'Open Settings → API Keys and choose "Rotate" - I can do it for you.',
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
    {
      id: '1',
      name: 'search',
      args: { q: 'weather' },
      status: 'completed' as const,
      result: 'Sunny, 24°C',
    },
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
  protected readonly codePromptCarousel = `<ngxsmk-prompt-carousel\n  [prompts]="promptsList"\n  (selected)="onPromptSelected($event)"\n/>`;

  protected readonly NgxsmkAiChat = NgxsmkAiChat;

  protected readonly codeAiChat = `<ngxsmk-ai-chat
  [messages]="messages()"
  [suggestions]="suggestions()"
  [isTyping]="isTyping()"
  [tokenCount]="tokenCount()"
  (sendMessage)="handleSendMessage($event)"
/>`;

  protected readonly aiChatMessages = signal<NgxsmkAiMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Welcome to the ngxsmk assistant. Ask me anything about configuring color scales, applying design tokens, or scaffolding new layout blocks.',
      reasoning: 'Initializing workspace context. Loaded theme tokens and component list.',
    },
  ]);
  protected readonly aiChatSuggestions = signal<string[]>([
    'Explain Angular Signals',
    'How does Zoneless work?',
    'Show a basic component structure',
  ]);
  protected readonly aiChatIsTyping = signal(false);
  protected readonly aiChatTokenCount = signal(12);

  protected handleSendMessage(text: string): void {
    const userMsg: NgxsmkAiMessage = {
      id: String(Date.now()),
      role: 'user',
      content: text,
    };
    this.aiChatMessages.update((msgs) => [...msgs, userMsg]);
    this.aiChatIsTyping.set(true);
    this.aiChatTokenCount.update((c) => c + 15);

    setTimeout(() => {
      const assistantMsg: NgxsmkAiMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: `Here is how we implement **${text}** in ngxsmk-ui-kit:

1. **Signal State**: Component states are tracked with Angular Signals (e.g. \`signal(false)\`), providing optimal reactive updates.
2. **Zoneless Detection**: Change detection is triggered automatically via native browser APIs and Signal modifications without ZoneJS runtime overhead.
3. **Dynamic Tokens**: Run-time appearance adjustments are bound directly to standard design variables like \`var(--ngxsmk-color-primary)\`.

Would you like me to generate a concrete layout snippet or template structure for this?`,
        reasoning: `User query: "${text}". Generated structured explanation showing how signal states, zoneless architecture, and design tokens work in tandem.`,
        citations: ['Angular Docs: Signals', 'ngxsmk-ui-kit architecture'],
      };
      this.aiChatMessages.update((msgs) => [...msgs, assistantMsg]);
      this.aiChatIsTyping.set(false);
      this.aiChatTokenCount.update((c) => c + 40);
    }, 1500);
  }
}
