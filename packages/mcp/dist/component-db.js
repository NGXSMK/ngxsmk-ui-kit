"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPONENT_DATABASE = void 0;
exports.COMPONENT_DATABASE = [
    {
        "entryPoint": "@ngxsmk/core/accordion",
        "name": "NgxsmkAccordion",
        "kind": "Component",
        "selector": "ngxsmk-accordion",
        "description": "Expandable section container.",
        "inputs": [
            {
                "name": "multiple",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/accordion",
        "name": "NgxsmkAccordionItem",
        "kind": "Component",
        "selector": "ngxsmk-accordion-item",
        "description": "",
        "inputs": [
            {
                "name": "label",
                "type": "string",
                "required": true
            },
            {
                "name": "value",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/agent-card",
        "name": "NgxsmkAgentCard",
        "kind": "Component",
        "selector": "ngxsmk-agent-card",
        "description": "",
        "inputs": [
            {
                "name": "agent",
                "type": "AgentInfo",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/ai-chat",
        "name": "NgxsmkAiChat",
        "kind": "Component",
        "selector": "ngxsmk-ai-chat",
        "description": "",
        "inputs": [
            {
                "name": "messages",
                "type": "NgxsmkAiMessage[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "models",
                "type": "string[]",
                "required": false,
                "default": "['gemini-2.5-flash', 'gemini-2.5-pro', 'claude-3.5-sonnet']"
            },
            {
                "name": "selectedModel",
                "type": "string",
                "required": false,
                "default": "'gemini-2.5-flash'"
            },
            {
                "name": "suggestions",
                "type": "string[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "isTyping",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "tokenCount",
                "type": "number",
                "required": false,
                "default": "0"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "'Ask me anything...'"
            }
        ],
        "outputs": [
            {
                "name": "sendMessage",
                "type": "string"
            },
            {
                "name": "modelChanged",
                "type": "string"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/alert",
        "name": "NgxsmkAlert",
        "kind": "Component",
        "selector": "ngxsmk-alert",
        "description": "Inline notification.",
        "inputs": [
            {
                "name": "variant",
                "type": "NgxsmkAlertVariant",
                "required": false,
                "default": "'info'"
            },
            {
                "name": "title",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "dismissible",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "dismissed",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/alert-dialog",
        "name": "NgxsmkAlertDialog",
        "kind": "Component",
        "selector": "ngxsmk-alert-dialog",
        "description": "",
        "inputs": [
            {
                "name": "open",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "title",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "message",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "confirmLabel",
                "type": "string",
                "required": false,
                "default": "'Confirm'"
            },
            {
                "name": "cancelLabel",
                "type": "string",
                "required": false,
                "default": "'Cancel'"
            },
            {
                "name": "variant",
                "type": "NgxsmkAlertDialogVariant",
                "required": false,
                "default": "'info'"
            }
        ],
        "outputs": [
            {
                "name": "confirmed",
                "type": "void"
            },
            {
                "name": "cancelled",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/animation",
        "name": "NgxsmkAnimate",
        "kind": "Directive",
        "selector": "[ngxsmkAnimate]",
        "description": "Plays an enter animation on the host element once it is rendered. The motion state is supplied via the `ngxsmkAnimate` input.",
        "inputs": [
            {
                "name": "ngxsmkAnimate",
                "type": "NgxsmkMotionState",
                "required": false
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/animation",
        "name": "NgxsmkPresence",
        "kind": "Directive",
        "selector": "[ngxsmkPresence]",
        "description": "Structural directive that mounts its template and plays an enter animation, then plays an exit animation before detaching when the `show` input flips to `false`. Mirrors the host's presence so leave animations can complete.",
        "inputs": [
            {
                "name": "show",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "motion",
                "type": "NgxsmkMotionState",
                "required": false
            }
        ],
        "outputs": [
            {
                "name": "afterLeave",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/app-shell",
        "name": "NgxsmkAppShell",
        "kind": "Component",
        "selector": "ngxsmk-app-shell",
        "description": "",
        "inputs": [
            {
                "name": "sidebar",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "topbar",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "footer",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/aspect-ratio",
        "name": "NgxsmkAspectRatio",
        "kind": "Component",
        "selector": "ngxsmk-aspect-ratio",
        "description": "",
        "inputs": [
            {
                "name": "ratio",
                "type": "string",
                "required": false,
                "default": "'16/9'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/audio-player",
        "name": "NgxsmkAudioPlayer",
        "kind": "Component",
        "selector": "ngxsmk-audio-player",
        "description": "",
        "inputs": [
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "'Audio'"
            },
            {
                "name": "progress",
                "type": "number",
                "required": false,
                "default": "0"
            },
            {
                "name": "currentTime",
                "type": "string",
                "required": false,
                "default": "'0:00'"
            },
            {
                "name": "duration",
                "type": "string",
                "required": false,
                "default": "'0:00'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/autocomplete",
        "name": "NgxsmkAutocomplete",
        "kind": "Component",
        "selector": "ngxsmk-autocomplete",
        "description": "",
        "inputs": [
            {
                "name": "options",
                "type": "{ value: string; label: string }[]",
                "required": true
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/avatar",
        "name": "NgxsmkAvatar",
        "kind": "Component",
        "selector": "ngxsmk-avatar",
        "description": "User avatar with automatic initials fallback when no image is available or the image fails to load.",
        "inputs": [
            {
                "name": "src",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "name",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "size",
                "type": "NgxsmkAvatarSize",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "shape",
                "type": "'circle' | 'square'",
                "required": false,
                "default": "'circle'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/avatar-group-overflow",
        "name": "NgxsmkAvatarGroupOverflow",
        "kind": "Component",
        "selector": "ngxsmk-avatar-group-overflow",
        "description": "",
        "inputs": [
            {
                "name": "count",
                "type": "number",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/avatar-status-dot",
        "name": "NgxsmkAvatarStatusDot",
        "kind": "Component",
        "selector": "ngxsmk-avatar-status-dot",
        "description": "",
        "inputs": [
            {
                "name": "variant",
                "type": "NgxsmkAvatarStatusDotVariant",
                "required": false,
                "default": "'online'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/badge",
        "name": "NgxsmkBadge",
        "kind": "Component",
        "selector": "ngxsmk-badge",
        "description": "Small status descriptor for counts and labels.",
        "inputs": [
            {
                "name": "variant",
                "type": "NgxsmkBadgeVariant",
                "required": false,
                "default": "'primary'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/banner",
        "name": "NgxsmkBanner",
        "kind": "Component",
        "selector": "ngxsmk-banner",
        "description": "",
        "inputs": [
            {
                "name": "variant",
                "type": "NgxsmkBannerVariant",
                "required": false,
                "default": "'info'"
            },
            {
                "name": "dismissible",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "dismissed",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/blockquote",
        "name": "NgxsmkBlockquote",
        "kind": "Component",
        "selector": "ngxsmk-blockquote",
        "description": "",
        "inputs": [
            {
                "name": "cite",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/breadcrumb-item",
        "name": "NgxsmkBreadcrumbItem",
        "kind": "Component",
        "selector": "ngxsmk-breadcrumb-item",
        "description": "",
        "inputs": [
            {
                "name": "href",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "separator",
                "type": "string",
                "required": false,
                "default": "'/'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/button",
        "name": "NgxsmkButton",
        "kind": "Directive",
        "selector": "button[ngxsmk-button], a[ngxsmk-button]",
        "description": "Button applied to native `<button>`/`<a>` elements so browser semantics, forms integration, and keyboard behavior come for free.",
        "inputs": [
            {
                "name": "variant",
                "type": "NgxsmkButtonVariant",
                "required": false,
                "default": "'primary'"
            },
            {
                "name": "size",
                "type": "NgxsmkButtonSize",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "iconOnly",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "loading",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/button-group",
        "name": "NgxsmkButtonGroup",
        "kind": "Component",
        "selector": "ngxsmk-button-group, [ngxsmkButtonGroup]",
        "description": "",
        "inputs": [
            {
                "name": "direction",
                "type": "'horizontal' | 'vertical'",
                "required": false,
                "default": "'horizontal'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/calendar-heatmap",
        "name": "NgxsmkCalendarHeatmap",
        "kind": "Component",
        "selector": "ngxsmk-calendar-heatmap",
        "description": "GitHub-style contribution calendar heatmap component for visualizing daily metrics.",
        "inputs": [
            {
                "name": "values",
                "type": "HeatmapValue[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "startDate",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": [
            {
                "name": "cellClick",
                "type": "HeatmapValue"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/card",
        "name": "NgxsmkCard",
        "kind": "Component",
        "selector": "ngxsmk-card",
        "description": "Content container with optional structural directives:",
        "inputs": [
            {
                "name": "interactive",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/card",
        "name": "NgxsmkCardHeader",
        "kind": "Directive",
        "selector": "[ngxsmkCardHeader]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/card",
        "name": "NgxsmkCardTitle",
        "kind": "Directive",
        "selector": "[ngxsmkCardTitle]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/card",
        "name": "NgxsmkCardDescription",
        "kind": "Directive",
        "selector": "[ngxsmkCardDescription]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/card",
        "name": "NgxsmkCardContent",
        "kind": "Directive",
        "selector": "[ngxsmkCardContent]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/card",
        "name": "NgxsmkCardFooter",
        "kind": "Directive",
        "selector": "[ngxsmkCardFooter]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/carousel",
        "name": "NgxsmkCarouselSlide",
        "kind": "Component",
        "selector": "ngxsmk-carousel-slide",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/carousel",
        "name": "NgxsmkCarousel",
        "kind": "Component",
        "selector": "ngxsmk-carousel",
        "description": "",
        "inputs": [
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "'Image gallery'"
            },
            {
                "name": "autoplay",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "interval",
                "type": "number",
                "required": false,
                "default": "3000"
            },
            {
                "name": "loop",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "showControls",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "showIndicators",
                "type": "boolean",
                "required": false,
                "default": "true"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/center",
        "name": "NgxsmkCenter",
        "kind": "Component",
        "selector": "ngxsmk-center",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chart-area",
        "name": "NgxsmkAreaChart",
        "kind": "Component",
        "selector": "ngxsmk-chart-area",
        "description": "",
        "inputs": [
            {
                "name": "data",
                "type": "NgxsmkAreaChartDataPoint[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "color",
                "type": "string",
                "required": false,
                "default": "'var(--ngxsmk-color-primary)'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chart-bar",
        "name": "NgxsmkBarChart",
        "kind": "Component",
        "selector": "ngxsmk-chart-bar",
        "description": "",
        "inputs": [
            {
                "name": "data",
                "type": "NgxsmkBarChartDataPoint[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "color",
                "type": "string",
                "required": false,
                "default": "'var(--ngxsmk-color-primary)'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chart-candlestick",
        "name": "NgxsmkCandlestickChart",
        "kind": "Component",
        "selector": "ngxsmk-chart-candlestick",
        "description": "",
        "inputs": [
            {
                "name": "data",
                "type": "NgxsmkCandlestickDataPoint[]",
                "required": false,
                "default": "[]"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chart-dashboard",
        "name": "NgxsmkChartDashboard",
        "kind": "Component",
        "selector": "ngxsmk-chart-dashboard",
        "description": "",
        "inputs": [
            {
                "name": "charts",
                "type": "NgxsmkChartConfig[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "columns",
                "type": "number",
                "required": false,
                "default": "2"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chart-heatmap",
        "name": "NgxsmkHeatmapChart",
        "kind": "Component",
        "selector": "ngxsmk-chart-heatmap",
        "description": "",
        "inputs": [
            {
                "name": "data",
                "type": "number[][]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "labels",
                "type": "NgxsmkHeatmapLabels",
                "required": false,
                "default": "{ x: [], y: [] }"
            },
            {
                "name": "color",
                "type": "string",
                "required": false,
                "default": "'var(--ngxsmk-color-primary)'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chart-line",
        "name": "NgxsmkLineChart",
        "kind": "Component",
        "selector": "ngxsmk-chart-line",
        "description": "",
        "inputs": [
            {
                "name": "data",
                "type": "NgxsmkChartDataPoint[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "color",
                "type": "string",
                "required": false,
                "default": "'var(--ngxsmk-color-primary)'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chart-pie",
        "name": "NgxsmkPieChart",
        "kind": "Component",
        "selector": "ngxsmk-chart-pie",
        "description": "",
        "inputs": [
            {
                "name": "data",
                "type": "NgxsmkPieChartDataPoint[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "size",
                "type": "number",
                "required": false,
                "default": "200"
            },
            {
                "name": "donut",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "responsive",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chart-scatter",
        "name": "NgxsmkScatterChart",
        "kind": "Component",
        "selector": "ngxsmk-chart-scatter",
        "description": "",
        "inputs": [
            {
                "name": "data",
                "type": "NgxsmkScatterDataPoint[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "color",
                "type": "string",
                "required": false,
                "default": "'var(--ngxsmk-color-primary)'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chat-composer-drawer",
        "name": "NgxsmkChatComposerDrawer",
        "kind": "Component",
        "selector": "ngxsmk-chat-composer-drawer",
        "description": "",
        "inputs": [
            {
                "name": "open",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "closed",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/chat-composer-token-element",
        "name": "NgxsmkChatComposerTokenElement",
        "kind": "Component",
        "selector": "ngxsmk-chat-composer-token-element",
        "description": "",
        "inputs": [
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "variant",
                "type": "'entity' | 'tool' | 'file'",
                "required": false,
                "default": "'entity'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chat-dictation-button",
        "name": "NgxsmkChatDictationButton",
        "kind": "Component",
        "selector": "ngxsmk-chat-dictation-button",
        "description": "",
        "inputs": [
            {
                "name": "listening",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "toggled",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/chat-input",
        "name": "NgxsmkChatInput",
        "kind": "Component",
        "selector": "ngxsmk-chat-input",
        "description": "",
        "inputs": [
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "'Type a message...'"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "submitted",
                "type": "string"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/chat-layout",
        "name": "NgxsmkChatLayout",
        "kind": "Component",
        "selector": "ngxsmk-chat-layout",
        "description": "",
        "inputs": [
            {
                "name": "sidebar",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chat-layout-scroll-button",
        "name": "NgxsmkChatLayoutScrollButton",
        "kind": "Component",
        "selector": "ngxsmk-chat-layout-scroll-button",
        "description": "",
        "inputs": [],
        "outputs": [
            {
                "name": "scrolled",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/chat-message",
        "name": "NgxsmkChatMessage",
        "kind": "Component",
        "selector": "ngxsmk-chat-message",
        "description": "",
        "inputs": [
            {
                "name": "message",
                "type": "ChatMessageData",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chat-message-bubble",
        "name": "NgxsmkChatMessageBubble",
        "kind": "Component",
        "selector": "ngxsmk-chat-message-bubble",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chat-message-metadata",
        "name": "NgxsmkChatMessageMetadata",
        "kind": "Component",
        "selector": "ngxsmk-chat-message-metadata",
        "description": "",
        "inputs": [
            {
                "name": "timestamp",
                "type": "Date",
                "required": false,
                "default": "new Date()"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chat-send-button",
        "name": "NgxsmkChatSendButton",
        "kind": "Component",
        "selector": "ngxsmk-chat-send-button",
        "description": "",
        "inputs": [
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "'Send'"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "clicked",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/chat-system-message",
        "name": "NgxsmkChatSystemMessage",
        "kind": "Component",
        "selector": "ngxsmk-chat-system-message",
        "description": "",
        "inputs": [
            {
                "name": "message",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chat-tokenized-text",
        "name": "NgxsmkChatTokenizedText",
        "kind": "Component",
        "selector": "ngxsmk-chat-tokenized-text",
        "description": "",
        "inputs": [
            {
                "name": "text",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "tokens",
                "type": "{ value: string; label: string }[]",
                "required": false,
                "default": "[]"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/chat-window",
        "name": "NgxsmkChatWindow",
        "kind": "Component",
        "selector": "ngxsmk-chat-window",
        "description": "",
        "inputs": [
            {
                "name": "messages",
                "type": "{\n      id: string;\n      role: 'user' | 'assistant' | 'system';\n      content: string;\n      timestamp: Date;\n      tokens?: number;\n    }[]",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/checkbox",
        "name": "NgxsmkCheckbox",
        "kind": "Component",
        "selector": "ngxsmk-checkbox",
        "description": "Checkbox built on a visually hidden native input, so forms integration and assistive tech behavior stay native.",
        "inputs": [
            {
                "name": "checked",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "indeterminate",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "boolean"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/checkbox-list",
        "name": "NgxsmkCheckboxList",
        "kind": "Component",
        "selector": "ngxsmk-checkbox-list",
        "description": "",
        "inputs": [
            {
                "name": "items",
                "type": "CheckboxListItem[]",
                "required": true
            },
            {
                "name": "selected",
                "type": "string[]",
                "required": false,
                "twoWay": true,
                "default": "[]"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "string[]"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/checkbox-list-item",
        "name": "NgxsmkCheckboxListItem",
        "kind": "Directive",
        "selector": "[ngxsmkCheckboxListItem]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/checkbox-list-item",
        "name": "NgxsmkCheckboxListItemComponent",
        "kind": "Component",
        "selector": "ngxsmk-checkbox-list-item, [ngxsmkCheckboxListItem]",
        "description": "",
        "inputs": [
            {
                "name": "checked",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "description",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "boolean"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/citation",
        "name": "NgxsmkCitation",
        "kind": "Component",
        "selector": "ngxsmk-citation",
        "description": "",
        "inputs": [
            {
                "name": "index",
                "type": "number",
                "required": true
            },
            {
                "name": "url",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/citation-viewer",
        "name": "NgxsmkCitationViewer",
        "kind": "Component",
        "selector": "ngxsmk-citation-viewer",
        "description": "",
        "inputs": [
            {
                "name": "title",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "author",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "snippet",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/click-outside",
        "name": "NgxsmkClickOutside",
        "kind": "Directive",
        "selector": "[ngxsmkClickOutside]",
        "description": "",
        "inputs": [],
        "outputs": [
            {
                "name": "ngxsmkClickOutside",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/code",
        "name": "NgxsmkCode",
        "kind": "Component",
        "selector": "code[ngxsmk-code]",
        "description": "",
        "inputs": [
            {
                "name": "size",
                "type": "'sm' | 'lg'",
                "required": false,
                "default": "'sm'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/code-block",
        "name": "NgxsmkCodeBlock",
        "kind": "Component",
        "selector": "ngxsmk-code-block",
        "description": "",
        "inputs": [
            {
                "name": "language",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/collapsible",
        "name": "NgxsmkCollapsible",
        "kind": "Component",
        "selector": "ngxsmk-collapsible",
        "description": "",
        "inputs": [
            {
                "name": "open",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "title",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/color-picker",
        "name": "NgxsmkColorPicker",
        "kind": "Component",
        "selector": "ngxsmk-color-picker",
        "description": "Signal-native interactive color picker component with hue slider, presets, and HEX input.",
        "inputs": [
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "'#7c3aed'"
            },
            {
                "name": "presets",
                "type": "string[]",
                "required": false,
                "default": "[\n    '#ef4444',\n    '#f97316',\n    '#f59e0b',\n    '#10b981',\n    '#06b6d4',\n    '#3b82f6',\n    '#6366f1',\n    '#7c3aed',\n    '#ec4899',\n    '#09090b',\n    '#64748b',\n    '#ffffff',\n  ]"
            },
            {
                "name": "showPresets",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "ariaLabel",
                "type": "string",
                "required": false,
                "default": "'Color picker'"
            },
            {
                "name": "id",
                "type": "unknown",
                "required": false,
                "default": "ngxsmkUniqueId('ngxsmk-color-picker')"
            },
            {
                "name": "ariaInvalid",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "ariaDescribedby",
                "type": "string | null",
                "required": false,
                "twoWay": true,
                "default": "null"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "string"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/combobox",
        "name": "NgxsmkCombobox",
        "kind": "Component",
        "selector": "ngxsmk-combobox",
        "description": "",
        "inputs": [
            {
                "name": "options",
                "type": "{ value: string; label: string }[]",
                "required": true
            },
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/command-palette",
        "name": "NgxsmkCommandPalette",
        "kind": "Component",
        "selector": "ngxsmk-command-palette",
        "description": "",
        "inputs": [
            {
                "name": "commands",
                "type": "CommandItem[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "triggerKey",
                "type": "string",
                "required": false,
                "default": "'k'"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "'Type a command or search...'"
            }
        ],
        "outputs": [
            {
                "name": "selected",
                "type": "CommandItem"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/container",
        "name": "NgxsmkContainer",
        "kind": "Component",
        "selector": "ngxsmk-container",
        "description": "",
        "inputs": [
            {
                "name": "size",
                "type": "NgxsmkContainerSize",
                "required": false,
                "default": "'lg'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/context-menu",
        "name": "NgxsmkContextMenu",
        "kind": "Component",
        "selector": "ngxsmk-context-menu",
        "description": "",
        "inputs": [
            {
                "name": "items",
                "type": "NgxsmkContextMenuItem[]",
                "required": true
            },
            {
                "name": "triggerRef",
                "type": "HTMLElement",
                "required": false
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/conversation-list",
        "name": "NgxsmkConversationList",
        "kind": "Component",
        "selector": "ngxsmk-conversation-list",
        "description": "",
        "inputs": [
            {
                "name": "conversations",
                "type": "Conversation[]",
                "required": true
            },
            {
                "name": "activeId",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/copy-to-clipboard",
        "name": "NgxsmkCopyToClipboard",
        "kind": "Directive",
        "selector": "[ngxsmkCopyToClipboard]",
        "description": "",
        "inputs": [
            {
                "name": "ngxsmkCopyToClipboard",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": [
            {
                "name": "copied",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/data-table",
        "name": "NgxsmkDataTable",
        "kind": "Component",
        "selector": "ngxsmk-data-table",
        "description": "",
        "inputs": [
            {
                "name": "columns",
                "type": "NgxsmkTableColumn[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "rows",
                "type": "any[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "pageSize",
                "type": "number",
                "required": false,
                "default": "10"
            },
            {
                "name": "sortable",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "striped",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/date-picker",
        "name": "NgxsmkDatePicker",
        "kind": "Component",
        "selector": "ngxsmk-date-picker",
        "description": "",
        "inputs": [
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            },
            {
                "name": "min",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "max",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "id",
                "type": "unknown",
                "required": false,
                "default": "ngxsmkUniqueId('ngxsmk-date-picker')"
            },
            {
                "name": "ariaInvalid",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "ariaDescribedby",
                "type": "string | null",
                "required": false,
                "twoWay": true,
                "default": "null"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "string"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/date-range-picker",
        "name": "NgxsmkDateRangePicker",
        "kind": "Component",
        "selector": "ngxsmk-date-range-picker",
        "description": "Signal-native date range picker with dual inputs, quick preset range buttons, and calendar grid.",
        "inputs": [
            {
                "name": "range",
                "type": "DateRange",
                "required": false,
                "twoWay": true,
                "default": "{ start: '', end: '' }"
            },
            {
                "name": "showPresets",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "ariaLabel",
                "type": "string",
                "required": false,
                "default": "'Date range picker'"
            },
            {
                "name": "id",
                "type": "unknown",
                "required": false,
                "default": "ngxsmkUniqueId('ngxsmk-date-range-picker')"
            },
            {
                "name": "ariaInvalid",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "ariaDescribedby",
                "type": "string | null",
                "required": false,
                "twoWay": true,
                "default": "null"
            }
        ],
        "outputs": [
            {
                "name": "rangeChange",
                "type": "DateRange"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/diagram-builder",
        "name": "NgxsmkDiagramBuilder",
        "kind": "Component",
        "selector": "ngxsmk-diagram-builder",
        "description": "",
        "inputs": [
            {
                "name": "nodes",
                "type": "DiagramNode[]",
                "required": true
            },
            {
                "name": "edges",
                "type": "DiagramEdge[]",
                "required": true
            }
        ],
        "outputs": [
            {
                "name": "selected",
                "type": "string"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/dialog",
        "name": "NgxsmkDialogFooter",
        "kind": "Directive",
        "selector": "[ngxsmkDialogFooter]",
        "description": "Marks content projected into the dialog's footer action row.",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/dialog",
        "name": "NgxsmkDialog",
        "kind": "Component",
        "selector": "ngxsmk-dialog",
        "description": "",
        "inputs": [
            {
                "name": "open",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "title",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "dismissible",
                "type": "boolean",
                "required": false,
                "default": "true"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/diff-viewer",
        "name": "NgxsmkDiffViewer",
        "kind": "Component",
        "selector": "ngxsmk-diff-viewer",
        "description": "",
        "inputs": [
            {
                "name": "source",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/divider",
        "name": "NgxsmkDivider",
        "kind": "Component",
        "selector": "ngxsmk-divider",
        "description": "Visual separator.",
        "inputs": [
            {
                "name": "orientation",
                "type": "'horizontal' | 'vertical'",
                "required": false,
                "default": "'horizontal'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/dock",
        "name": "NgxsmkDock",
        "kind": "Component",
        "selector": "ngxsmk-dock",
        "description": "Floating macOS-style application dock with icon tooltips and magnification hover effects.",
        "inputs": [
            {
                "name": "items",
                "type": "DockItem[]",
                "required": true
            },
            {
                "name": "position",
                "type": "DockPosition",
                "required": false,
                "default": "'bottom'"
            }
        ],
        "outputs": [
            {
                "name": "itemClick",
                "type": "DockItem"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/dropdown-menu",
        "name": "NgxsmkDropdownMenu",
        "kind": "Component",
        "selector": "ngxsmk-dropdown-menu",
        "description": "",
        "inputs": [
            {
                "name": "items",
                "type": "NgxsmkDropdownMenuItem[]",
                "required": true
            },
            {
                "name": "open",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/empty-state",
        "name": "NgxsmkEmptyState",
        "kind": "Component",
        "selector": "ngxsmk-empty-state",
        "description": "",
        "inputs": [
            {
                "name": "icon",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "title",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "description",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/fab",
        "name": "NgxsmkFab",
        "kind": "Directive",
        "selector": "button[ngxsmkFab], a[ngxsmkFab]",
        "description": "",
        "inputs": [
            {
                "name": "size",
                "type": "'sm' | 'md' | 'lg'",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "variant",
                "type": "'primary' | 'secondary'",
                "required": false,
                "default": "'primary'"
            },
            {
                "name": "extended",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "position",
                "type": "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'none'",
                "required": false,
                "default": "'none'"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/field",
        "name": "NgxsmkField",
        "kind": "Component",
        "selector": "ngxsmk-field",
        "description": "",
        "inputs": [
            {
                "name": "hint",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "direction",
                "type": "'vertical' | 'horizontal'",
                "required": false,
                "default": "'vertical'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/field-label",
        "name": "NgxsmkFieldLabel",
        "kind": "Component",
        "selector": "ngxsmk-field-label, [ngxsmkFieldLabel], label[ngxsmkFieldLabel]",
        "description": "",
        "inputs": [
            {
                "name": "required",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/field-status",
        "name": "NgxsmkFieldStatus",
        "kind": "Component",
        "selector": "ngxsmk-field-status, [ngxsmkFieldStatus]",
        "description": "",
        "inputs": [
            {
                "name": "message",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "variant",
                "type": "NgxsmkFieldStatusVariant",
                "required": false,
                "default": "'info'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/file-upload",
        "name": "NgxsmkFileUpload",
        "kind": "Component",
        "selector": "ngxsmk-file-upload",
        "description": "Signal-native drag-and-drop file upload component with format filter, size validation, and file list queue.",
        "inputs": [
            {
                "name": "accept",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "maxSizeMb",
                "type": "number",
                "required": false,
                "default": "10"
            },
            {
                "name": "multiple",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "ariaLabel",
                "type": "string",
                "required": false,
                "default": "'File upload dropzone'"
            },
            {
                "name": "id",
                "type": "unknown",
                "required": false,
                "default": "ngxsmkUniqueId('ngxsmk-file-upload')"
            },
            {
                "name": "ariaInvalid",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "ariaDescribedby",
                "type": "string | null",
                "required": false,
                "twoWay": true,
                "default": "null"
            }
        ],
        "outputs": [
            {
                "name": "filesSelected",
                "type": "File[]"
            },
            {
                "name": "fileRemoved",
                "type": "File"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/flex",
        "name": "NgxsmkFlex",
        "kind": "Component",
        "selector": "ngxsmk-flex",
        "description": "",
        "inputs": [
            {
                "name": "direction",
                "type": "NgxsmkFlexDirection",
                "required": false,
                "default": "'row'"
            },
            {
                "name": "align",
                "type": "NgxsmkFlexAlign",
                "required": false,
                "default": "'stretch'"
            },
            {
                "name": "justify",
                "type": "NgxsmkFlexJustify",
                "required": false,
                "default": "'start'"
            },
            {
                "name": "gap",
                "type": "string",
                "required": false,
                "default": "'var(--ngxsmk-space-4)'"
            },
            {
                "name": "wrap",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/flow-editor",
        "name": "NgxsmkFlowEditor",
        "kind": "Component",
        "selector": "ngxsmk-flow-editor",
        "description": "",
        "inputs": [
            {
                "name": "title",
                "type": "string",
                "required": false,
                "default": "'Flow Editor'"
            },
            {
                "name": "nodes",
                "type": "{ id: string; label: string }[]",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/focus-trap",
        "name": "NgxsmkFocusTrap",
        "kind": "Directive",
        "selector": "[ngxsmkFocusTrap]",
        "description": "",
        "inputs": [
            {
                "name": "ngxsmkFocusTrap",
                "type": "boolean",
                "required": false,
                "default": "true"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/form-field",
        "name": "NgxsmkFormField",
        "kind": "Component",
        "selector": "ngxsmk-form-field",
        "description": "Wraps a form control with label, hint, and error messaging, wiring `for`/`aria-describedby`/`aria-invalid` automatically when the projected control implements `NgxsmkFormFieldControl`.",
        "inputs": [
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "hint",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "error",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "required",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/form-layout",
        "name": "NgxsmkFormLayout",
        "kind": "Component",
        "selector": "ngxsmk-form-layout",
        "description": "",
        "inputs": [
            {
                "name": "columns",
                "type": "NgxsmkFormLayoutColumns",
                "required": false,
                "default": "1"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/grid",
        "name": "NgxsmkGrid",
        "kind": "Component",
        "selector": "ngxsmk-grid",
        "description": "",
        "inputs": [
            {
                "name": "cols",
                "type": "number | undefined",
                "required": false,
                "default": "undefined"
            },
            {
                "name": "gap",
                "type": "string",
                "required": false,
                "default": "'var(--ngxsmk-space-4)'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/h-stack",
        "name": "NgxsmkStackItem",
        "kind": "Directive",
        "selector": "[ngxsmkStackItem]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/h-stack",
        "name": "NgxsmkHStack",
        "kind": "Component",
        "selector": "ngxsmk-h-stack",
        "description": "",
        "inputs": [
            {
                "name": "gap",
                "type": "string",
                "required": false,
                "default": "'var(--ngxsmk-space-4)'"
            },
            {
                "name": "align",
                "type": "string",
                "required": false,
                "default": "'center'"
            },
            {
                "name": "justify",
                "type": "string",
                "required": false,
                "default": "'flex-start'"
            },
            {
                "name": "wrap",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/h-stack",
        "name": "NgxsmkVStack",
        "kind": "Component",
        "selector": "ngxsmk-v-stack",
        "description": "",
        "inputs": [
            {
                "name": "gap",
                "type": "string",
                "required": false,
                "default": "'var(--ngxsmk-space-4)'"
            },
            {
                "name": "align",
                "type": "string",
                "required": false,
                "default": "'stretch'"
            },
            {
                "name": "justify",
                "type": "string",
                "required": false,
                "default": "'flex-start'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/heading",
        "name": "NgxsmkHeading",
        "kind": "Component",
        "selector": "ngxsmk-heading",
        "description": "",
        "inputs": [
            {
                "name": "level",
                "type": "NgxsmkHeadingLevel",
                "required": false,
                "default": "'h2'"
            },
            {
                "name": "size",
                "type": "'inherit' | 'level'",
                "required": false,
                "default": "'level'"
            },
            {
                "name": "weight",
                "type": "'light' | 'regular' | 'medium' | 'semibold' | 'bold'",
                "required": false,
                "default": "'semibold'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/hover-card",
        "name": "NgxsmkHoverCard",
        "kind": "Component",
        "selector": "ngxsmk-hover-card",
        "description": "",
        "inputs": [
            {
                "name": "openDelay",
                "type": "number",
                "required": false,
                "default": "300"
            },
            {
                "name": "closeDelay",
                "type": "number",
                "required": false,
                "default": "150"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/image-viewer",
        "name": "NgxsmkImageViewer",
        "kind": "Component",
        "selector": "ngxsmk-image-viewer",
        "description": "",
        "inputs": [
            {
                "name": "src",
                "type": "string",
                "required": true
            },
            {
                "name": "alt",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/input",
        "name": "NgxsmkInputDirective",
        "kind": "Directive",
        "selector": "input[ngxsmkInput], textarea[ngxsmkInput]",
        "description": "Directive applied to native text inputs and textareas to style them and integrate them with `ngxsmk-form-field`.",
        "inputs": [
            {
                "name": "id",
                "type": "unknown",
                "required": false,
                "default": "ngxsmkUniqueId('ngxsmk-input')"
            },
            {
                "name": "ariaInvalid",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "ariaDescribedby",
                "type": "string | null",
                "required": false,
                "twoWay": true,
                "default": "null"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/input-group",
        "name": "NgxsmkInputGroup",
        "kind": "Component",
        "selector": "ngxsmk-input-group",
        "description": "",
        "inputs": [
            {
                "name": "type",
                "type": "InputGroupInputType",
                "required": false,
                "default": "'text'"
            },
            {
                "name": "variant",
                "type": "InputGroupVariant",
                "required": false,
                "default": "'outlined'"
            },
            {
                "name": "size",
                "type": "InputGroupSize",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "radius",
                "type": "InputGroupRadius",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "density",
                "type": "InputGroupDensity",
                "required": false,
                "default": "'comfortable'"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "hint",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "required",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "readonly",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "maxLength",
                "type": "number | undefined",
                "required": false,
                "default": "undefined"
            },
            {
                "name": "minLength",
                "type": "number | undefined",
                "required": false,
                "default": "undefined"
            },
            {
                "name": "showClear",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "showCounter",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "fullWidth",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "loading",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "floatingLabel",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "addons",
                "type": "InputGroupAddon[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "inputType",
                "type": "InputGroupInputType | 'password'",
                "required": false,
                "default": "'text'"
            },
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            },
            {
                "name": "id",
                "type": "unknown",
                "required": false,
                "default": "ngxsmkUniqueId('ngxsmk-input-group')"
            },
            {
                "name": "ariaInvalid",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "ariaDescribedby",
                "type": "string | null",
                "required": false,
                "twoWay": true,
                "default": "null"
            }
        ],
        "outputs": [
            {
                "name": "focused",
                "type": "void"
            },
            {
                "name": "blurred",
                "type": "void"
            },
            {
                "name": "cleared",
                "type": "void"
            },
            {
                "name": "valueChanged",
                "type": "string"
            },
            {
                "name": "validationChanged",
                "type": "{ status: ValidationStatus; message: string }"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/input-group-text",
        "name": "NgxsmkInputGroupText",
        "kind": "Directive",
        "selector": "[ngxsmkInputGroupText], ngxsmk-input-group-text",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/intersection-observer",
        "name": "NgxsmkIntersectionObserver",
        "kind": "Directive",
        "selector": "[ngxsmkIntersectionObserver]",
        "description": "",
        "inputs": [],
        "outputs": [
            {
                "name": "intersected",
                "type": "boolean"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/json-viewer",
        "name": "NgxsmkJsonViewer",
        "kind": "Component",
        "selector": "ngxsmk-json-viewer",
        "description": "",
        "inputs": [
            {
                "name": "data",
                "type": "unknown",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/kanban-board",
        "name": "NgxsmkKanbanBoard",
        "kind": "Component",
        "selector": "ngxsmk-kanban-board",
        "description": "",
        "inputs": [
            {
                "name": "columns",
                "type": "KanbanColumn[]",
                "required": true,
                "twoWay": true
            }
        ],
        "outputs": [
            {
                "name": "itemMoved",
                "type": "KanbanMove"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/kbd",
        "name": "NgxsmkKbd",
        "kind": "Component",
        "selector": "kbd[ngxsmk-kbd], ngxsmk-kbd",
        "description": "",
        "inputs": [
            {
                "name": "size",
                "type": "'sm' | 'lg'",
                "required": false,
                "default": "'sm'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/keyboard-shortcut",
        "name": "NgxsmkKeyboardShortcut",
        "kind": "Directive",
        "selector": "[ngxsmkKeyboardShortcut]",
        "description": "",
        "inputs": [
            {
                "name": "ngxsmkKeyboardShortcut",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": [
            {
                "name": "shortcutPressed",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/layout",
        "name": "NgxsmkLayout",
        "kind": "Component",
        "selector": "ngxsmk-layout",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/layout",
        "name": "NgxsmkLayoutHeader",
        "kind": "Directive",
        "selector": "ngxsmk-layout-header, [ngxsmkLayoutHeader]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/layout",
        "name": "NgxsmkLayoutContent",
        "kind": "Directive",
        "selector": "ngxsmk-layout-content, [ngxsmkLayoutContent]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/layout",
        "name": "NgxsmkLayoutFooter",
        "kind": "Directive",
        "selector": "ngxsmk-layout-footer, [ngxsmkLayoutFooter]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/layout",
        "name": "NgxsmkLayoutPanel",
        "kind": "Directive",
        "selector": "ngxsmk-layout-panel, [ngxsmkLayoutPanel]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/lazy-load",
        "name": "NgxsmkLazyLoad",
        "kind": "Component",
        "selector": "ngxsmk-lazy-load",
        "description": "",
        "inputs": [
            {
                "name": "rootMargin",
                "type": "string",
                "required": false,
                "default": "'200px'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/let",
        "name": "NgxsmkLet",
        "kind": "Directive",
        "selector": "[ngxsmkLet]",
        "description": "",
        "inputs": [
            {
                "name": "ngxsmkLet",
                "type": "T",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/let",
        "name": "NgxsmkRxLet",
        "kind": "Directive",
        "selector": "[ngxsmkRxLet]",
        "description": "",
        "inputs": [
            {
                "name": "ngxsmkRxLet",
                "type": "Observable<T>",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/lightbox",
        "name": "NgxsmkLightbox",
        "kind": "Component",
        "selector": "ngxsmk-lightbox",
        "description": "",
        "inputs": [
            {
                "name": "images",
                "type": "NgxsmkLightboxImage[]",
                "required": true
            },
            {
                "name": "index",
                "type": "number",
                "required": false,
                "twoWay": true,
                "default": "0"
            },
            {
                "name": "open",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/link",
        "name": "NgxsmkLink",
        "kind": "Component",
        "selector": "a[ngxsmk-link]",
        "description": "",
        "inputs": [
            {
                "name": "variant",
                "type": "'default' | 'muted'",
                "required": false,
                "default": "'default'"
            },
            {
                "name": "underline",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "external",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/link-provider",
        "name": "NgxsmkLinkProvider",
        "kind": "Directive",
        "selector": "[ngxsmkLinkProvider]",
        "description": "",
        "inputs": [
            {
                "name": "ngxsmkLinkProvider",
                "type": "TemplateRef<NgxsmkLinkContext>",
                "required": false
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/list",
        "name": "NgxsmkList",
        "kind": "Component",
        "selector": "ngxsmk-list",
        "description": "",
        "inputs": [
            {
                "name": "divided",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/list-item",
        "name": "NgxsmkListItem",
        "kind": "Component",
        "selector": "ngxsmk-list-item, [ngxsmkListItem]",
        "description": "",
        "inputs": [
            {
                "name": "href",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "variant",
                "type": "NgxsmkListItemVariant",
                "required": false,
                "default": "'default'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/markdown",
        "name": "NgxsmkMarkdown",
        "kind": "Component",
        "selector": "ngxsmk-markdown",
        "description": "",
        "inputs": [
            {
                "name": "content",
                "type": "string",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/markdown-viewer",
        "name": "NgxsmkMarkdownViewer",
        "kind": "Component",
        "selector": "ngxsmk-markdown-viewer",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/media-query",
        "name": "NgxsmkMediaQuery",
        "kind": "Directive",
        "selector": "[ngxsmkMediaQuery]",
        "description": "",
        "inputs": [
            {
                "name": "ngxsmkMediaQuery",
                "type": "string",
                "required": false,
                "default": "'(min-width: 768px)'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/media-theme",
        "name": "NgxsmkMediaTheme",
        "kind": "Directive",
        "selector": "[ngxsmkMediaTheme]",
        "description": "",
        "inputs": [
            {
                "name": "query",
                "type": "string",
                "required": false,
                "default": "'(prefers-color-scheme: dark)'"
            },
            {
                "name": "theme",
                "type": "string",
                "required": false,
                "default": "'dark'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/memory-viewer",
        "name": "NgxsmkMemoryViewer",
        "kind": "Component",
        "selector": "ngxsmk-memory-viewer",
        "description": "",
        "inputs": [
            {
                "name": "entries",
                "type": "{ key: string; value: string }[]",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/metadata-list",
        "name": "NgxsmkMetadataListItem",
        "kind": "Directive",
        "selector": "ngxsmk-metadata-list-item, [ngxsmkMetadataListItem]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/metadata-list",
        "name": "NgxsmkMetadataList",
        "kind": "Component",
        "selector": "ngxsmk-metadata-list",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/meter",
        "name": "NgxsmkMeter",
        "kind": "Component",
        "selector": "ngxsmk-meter",
        "description": "Semantic meter for a scalar measurement within a known range (disk usage, score, capacity) — distinct from `progress`, which reports task completion. Colour follows the `low`/`high`/`optimum` thresholds like the native `<meter>` element. Pure `computed` output; no effects, SSR-safe.",
        "inputs": [
            {
                "name": "value",
                "type": "number",
                "required": false,
                "default": "0"
            },
            {
                "name": "min",
                "type": "number",
                "required": false,
                "default": "0"
            },
            {
                "name": "max",
                "type": "number",
                "required": false,
                "default": "100"
            },
            {
                "name": "low",
                "type": "number | null",
                "required": false,
                "default": "null"
            },
            {
                "name": "high",
                "type": "number | null",
                "required": false,
                "default": "null"
            },
            {
                "name": "optimum",
                "type": "number | null",
                "required": false,
                "default": "null"
            },
            {
                "name": "size",
                "type": "NgxsmkMeterSize",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "ariaLabel",
                "type": "string",
                "required": false,
                "default": "'Meter'"
            },
            {
                "name": "showValue",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "format",
                "type": "(value: number, max: number) => string",
                "required": false
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/mobile-nav",
        "name": "NgxsmkMobileNav",
        "kind": "Component",
        "selector": "ngxsmk-mobile-nav",
        "description": "",
        "inputs": [
            {
                "name": "open",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "'Navigation'"
            }
        ],
        "outputs": [
            {
                "name": "openedChange",
                "type": "boolean"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/mobile-nav",
        "name": "NgxsmkMobileNavToggle",
        "kind": "Component",
        "selector": "ngxsmk-mobile-nav-toggle",
        "description": "",
        "inputs": [],
        "outputs": [
            {
                "name": "toggled",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/multi-select",
        "name": "NgxsmkMultiSelect",
        "kind": "Component",
        "selector": "ngxsmk-multi-select",
        "description": "",
        "inputs": [
            {
                "name": "options",
                "type": "{ value: string; label: string }[]",
                "required": true
            },
            {
                "name": "value",
                "type": "string[]",
                "required": false,
                "twoWay": true,
                "default": "[]"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "string[]"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/multi-selector",
        "name": "NgxsmkMultiSelector",
        "kind": "Component",
        "selector": "ngxsmk-multi-selector",
        "description": "",
        "inputs": [
            {
                "name": "options",
                "type": "{ value: string; label: string }[]",
                "required": true
            },
            {
                "name": "value",
                "type": "string[]",
                "required": false,
                "twoWay": true,
                "default": "[]"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "'Select...'"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "string[]"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/nav-heading-menu",
        "name": "NgxsmkNavHeadingMenu",
        "kind": "Component",
        "selector": "ngxsmk-nav-heading-menu",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/nav-icon",
        "name": "NgxsmkNavIcon",
        "kind": "Component",
        "selector": "ngxsmk-nav-icon",
        "description": "",
        "inputs": [
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "active",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "size",
                "type": "NgxsmkNavIconSize",
                "required": false,
                "default": "'md'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/number-input",
        "name": "NgxsmkNumberInput",
        "kind": "Component",
        "selector": "ngxsmk-number-input",
        "description": "Numeric field with − / + steppers and min/max/step constraints.",
        "inputs": [
            {
                "name": "value",
                "type": "number",
                "required": false,
                "twoWay": true,
                "default": "0"
            },
            {
                "name": "min",
                "type": "number",
                "required": false,
                "default": "0"
            },
            {
                "name": "max",
                "type": "number",
                "required": false,
                "default": "100"
            },
            {
                "name": "step",
                "type": "number",
                "required": false,
                "default": "1"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "id",
                "type": "unknown",
                "required": false,
                "default": "ngxsmkUniqueId('ngxsmk-number-input')"
            },
            {
                "name": "ariaInvalid",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "ariaDescribedby",
                "type": "string | null",
                "required": false,
                "twoWay": true,
                "default": "null"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "number"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/org-chart",
        "name": "NgxsmkOrgChart",
        "kind": "Component",
        "selector": "ngxsmk-org-chart",
        "description": "",
        "inputs": [
            {
                "name": "nodes",
                "type": "OrgNode[]",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/outline",
        "name": "NgxsmkOutline",
        "kind": "Component",
        "selector": "ngxsmk-outline",
        "description": "",
        "inputs": [
            {
                "name": "items",
                "type": "OutlineItem[]",
                "required": true
            },
            {
                "name": "activeId",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/overflow-list",
        "name": "NgxsmkOverflowList",
        "kind": "Component",
        "selector": "ngxsmk-overflow-list",
        "description": "",
        "inputs": [
            {
                "name": "max",
                "type": "number",
                "required": false,
                "default": "3"
            },
            {
                "name": "total",
                "type": "number",
                "required": false,
                "default": "0"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/pagination",
        "name": "NgxsmkPagination",
        "kind": "Component",
        "selector": "ngxsmk-pagination",
        "description": "Pagination control with first/prev/next/last and an ellipsis-collapsed page range. Pure `computed` output — no effects, no DOM measurement — so it is SSR-safe and re-renders only the changed buttons.",
        "inputs": [
            {
                "name": "page",
                "type": "number",
                "required": false,
                "twoWay": true,
                "default": "1"
            },
            {
                "name": "total",
                "type": "number",
                "required": false,
                "default": "0"
            },
            {
                "name": "pageSize",
                "type": "number",
                "required": false,
                "default": "10"
            },
            {
                "name": "pageCount",
                "type": "number",
                "required": false,
                "default": "0"
            },
            {
                "name": "siblingCount",
                "type": "number",
                "required": false,
                "default": "1"
            },
            {
                "name": "boundaryCount",
                "type": "number",
                "required": false,
                "default": "1"
            },
            {
                "name": "showFirstLast",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "showPrevNext",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "size",
                "type": "NgxsmkPaginationSize",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "'Pagination'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/pin-input",
        "name": "NgxsmkPinInput",
        "kind": "Component",
        "selector": "ngxsmk-pin-input",
        "description": "One-time-code / PIN entry: a row of single-character fields with paste distribution, arrow/backspace navigation, and masking. Integrates with `ngModel` / reactive forms as a single string value.",
        "inputs": [
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            },
            {
                "name": "length",
                "type": "number",
                "required": false,
                "default": "6"
            },
            {
                "name": "type",
                "type": "NgxsmkPinInputType",
                "required": false,
                "default": "'numeric'"
            },
            {
                "name": "mask",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "size",
                "type": "NgxsmkPinInputSize",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "'Verification code'"
            },
            {
                "name": "otpAutocomplete",
                "type": "'one-time-code' | 'off'",
                "required": false,
                "default": "'one-time-code'"
            }
        ],
        "outputs": [
            {
                "name": "completed",
                "type": "string"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/pivot-table",
        "name": "NgxsmkPivotTable",
        "kind": "Component",
        "selector": "ngxsmk-pivot-table",
        "description": "",
        "inputs": [
            {
                "name": "rows",
                "type": "PivotRow[]",
                "required": true
            },
            {
                "name": "columns",
                "type": "string[]",
                "required": true
            },
            {
                "name": "rowLabel",
                "type": "string",
                "required": false,
                "default": "'Category'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/playground",
        "name": "NgxsmkPlayground",
        "kind": "Component",
        "selector": "ngxsmk-playground",
        "description": "",
        "inputs": [
            {
                "name": "initialDark",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/popover",
        "name": "NgxsmkPopover",
        "kind": "Component",
        "selector": "ngxsmk-popover",
        "description": "Click-triggered popover anchored to its trigger. Positioning is done entirely in CSS from `data-placement`/`data-align` — there are **no** `getBoundingClientRect` reads, scroll listeners, or portals — so it never thrashes layout and renders identically under SSR. Outside-click and Escape close it; focus is trapped and restored to the trigger.",
        "inputs": [
            {
                "name": "open",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "placement",
                "type": "NgxsmkPopoverPlacement",
                "required": false,
                "default": "'bottom'"
            },
            {
                "name": "align",
                "type": "NgxsmkPopoverAlign",
                "required": false,
                "default": "'center'"
            },
            {
                "name": "offset",
                "type": "number",
                "required": false,
                "default": "8"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "closeOnOutsideClick",
                "type": "boolean",
                "required": false,
                "default": "true"
            }
        ],
        "outputs": [
            {
                "name": "opened",
                "type": "void"
            },
            {
                "name": "closed",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/power-search",
        "name": "NgxsmkPowerSearch",
        "kind": "Component",
        "selector": "ngxsmk-power-search",
        "description": "",
        "inputs": [
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "'Search...'"
            },
            {
                "name": "filters",
                "type": "PowerSearchFilter[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "query",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            },
            {
                "name": "filterValues",
                "type": "Record<string, string>",
                "required": false,
                "twoWay": true,
                "default": "{}"
            }
        ],
        "outputs": [
            {
                "name": "searched",
                "type": "string"
            },
            {
                "name": "filtered",
                "type": "Record<string, string>"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/progress",
        "name": "NgxsmkProgress",
        "kind": "Component",
        "selector": "ngxsmk-progress",
        "description": "Progress bar. Omit `value` (or pass `null`) for indeterminate mode.",
        "inputs": [
            {
                "name": "value",
                "type": "number | null",
                "required": false,
                "default": "null"
            },
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "'Progress'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/progress-circle",
        "name": "NgxsmkProgressCircle",
        "kind": "Component",
        "selector": "ngxsmk-progress-circle",
        "description": "",
        "inputs": [
            {
                "name": "value",
                "type": "number",
                "required": false,
                "default": "0"
            },
            {
                "name": "max",
                "type": "number",
                "required": false,
                "default": "100"
            },
            {
                "name": "size",
                "type": "'sm' | 'md' | 'lg'",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "strokeWidth",
                "type": "number",
                "required": false,
                "default": "6"
            },
            {
                "name": "variant",
                "type": "'default' | 'primary' | 'success' | 'warning' | 'error'",
                "required": false,
                "default": "'default'"
            },
            {
                "name": "indeterminate",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "showValue",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/prompt-carousel",
        "name": "NgxsmkPromptCarousel",
        "kind": "Component",
        "selector": "ngxsmk-prompt-carousel",
        "description": "",
        "inputs": [
            {
                "name": "prompts",
                "type": "PromptItem[]",
                "required": false,
                "default": "[]"
            }
        ],
        "outputs": [
            {
                "name": "selected",
                "type": "PromptItem"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/qr-code",
        "name": "NgxsmkQrCode",
        "kind": "Component",
        "selector": "ngxsmk-qr-code",
        "description": "",
        "inputs": [
            {
                "name": "value",
                "type": "string",
                "required": true
            },
            {
                "name": "size",
                "type": "number",
                "required": false,
                "default": "128"
            },
            {
                "name": "level",
                "type": "'L' | 'M' | 'Q' | 'H'",
                "required": false,
                "default": "'M'"
            },
            {
                "name": "color",
                "type": "string",
                "required": false,
                "default": "'currentColor'"
            },
            {
                "name": "background",
                "type": "string",
                "required": false,
                "default": "'transparent'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/query-builder",
        "name": "NgxsmkQueryBuilder",
        "kind": "Component",
        "selector": "ngxsmk-query-builder",
        "description": "",
        "inputs": [
            {
                "name": "fields",
                "type": "QueryField[]",
                "required": true
            },
            {
                "name": "conditions",
                "type": "QueryCondition[]",
                "required": false,
                "twoWay": true,
                "default": "[]"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "'Value'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/radio",
        "name": "NgxsmkRadioGroup",
        "kind": "Component",
        "selector": "ngxsmk-radio-group",
        "description": "Groups `ngxsmk-radio` children and holds the selected value.",
        "inputs": [
            {
                "name": "value",
                "type": "unknown",
                "required": false,
                "twoWay": true,
                "default": "null"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "orientation",
                "type": "'horizontal' | 'vertical'",
                "required": false,
                "default": "'vertical'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/radio",
        "name": "NgxsmkRadio",
        "kind": "Component",
        "selector": "ngxsmk-radio",
        "description": "Single option inside an `ngxsmk-radio-group`.",
        "inputs": [
            {
                "name": "value",
                "type": "unknown",
                "required": true
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/rating",
        "name": "NgxsmkRating",
        "kind": "Component",
        "selector": "ngxsmk-rating",
        "description": "Star rating built as a single `role=\"slider\"` widget, so half-step values and full keyboard control come for free and assistive tech announces the value.",
        "inputs": [
            {
                "name": "value",
                "type": "number",
                "required": false,
                "twoWay": true,
                "default": "0"
            },
            {
                "name": "max",
                "type": "number",
                "required": false,
                "default": "5"
            },
            {
                "name": "allowHalf",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "readonly",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "size",
                "type": "NgxsmkRatingSize",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "'Rating'"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "number"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/reasoning-timeline",
        "name": "NgxsmkReasoningTimeline",
        "kind": "Component",
        "selector": "ngxsmk-reasoning-timeline",
        "description": "",
        "inputs": [
            {
                "name": "steps",
                "type": "ReasoningStep[]",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/resizable",
        "name": "NgxsmkResizable",
        "kind": "Component",
        "selector": "ngxsmk-resizable",
        "description": "",
        "inputs": [
            {
                "name": "initialWidth",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "initialHeight",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "orientation",
                "type": "'horizontal' | 'vertical'",
                "required": false,
                "default": "'horizontal'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/resize-handle",
        "name": "NgxsmkResizeHandle",
        "kind": "Component",
        "selector": "ngxsmk-resize-handle",
        "description": "",
        "inputs": [
            {
                "name": "orientation",
                "type": "'horizontal' | 'vertical'",
                "required": false,
                "default": "'horizontal'"
            }
        ],
        "outputs": [
            {
                "name": "resizing",
                "type": "MouseEvent"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/resize-observer",
        "name": "NgxsmkResizeObserver",
        "kind": "Directive",
        "selector": "[ngxsmkResizeObserver]",
        "description": "",
        "inputs": [],
        "outputs": [
            {
                "name": "sizeChanged",
                "type": "NgxsmkResizeObserverSize"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/rule-builder",
        "name": "NgxsmkRuleBuilder",
        "kind": "Component",
        "selector": "ngxsmk-rule-builder",
        "description": "",
        "inputs": [
            {
                "name": "group",
                "type": "RuleGroup",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/scheduler",
        "name": "NgxsmkScheduler",
        "kind": "Component",
        "selector": "ngxsmk-scheduler",
        "description": "",
        "inputs": [
            {
                "name": "events",
                "type": "SchedulerEvent[]",
                "required": true,
                "twoWay": true
            },
            {
                "name": "view",
                "type": "ViewType",
                "required": false,
                "default": "'timeGridWeek'"
            },
            {
                "name": "date",
                "type": "Date",
                "required": false,
                "default": "new Date()"
            },
            {
                "name": "resources",
                "type": "SchedulerResource[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "slotDuration",
                "type": "number",
                "required": false,
                "default": "30"
            },
            {
                "name": "snapDuration",
                "type": "number",
                "required": false,
                "default": "15"
            },
            {
                "name": "visibleHours",
                "type": "[number, number]",
                "required": false,
                "default": "[0, 24]"
            },
            {
                "name": "firstDayOfWeek",
                "type": "number",
                "required": false,
                "default": "1"
            },
            {
                "name": "locale",
                "type": "string",
                "required": false,
                "default": "'en-US'"
            },
            {
                "name": "rtl",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "density",
                "type": "Density",
                "required": false,
                "default": "'comfortable'"
            },
            {
                "name": "showAllDay",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "showWeekends",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "showCurrentTime",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "editable",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "selectable",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "draggable",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "resizable",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "plugins",
                "type": "SchedulerPlugin[]",
                "required": false,
                "default": "[]"
            }
        ],
        "outputs": [
            {
                "name": "eventClick",
                "type": "SchedulerEvent"
            },
            {
                "name": "eventDoubleClick",
                "type": "SchedulerEvent"
            },
            {
                "name": "eventContextMenu",
                "type": "{\n    event: SchedulerEvent;\n    position: { x: number; y: number };\n  }"
            },
            {
                "name": "eventDrop",
                "type": "SchedulerMove"
            },
            {
                "name": "eventResize",
                "type": "SchedulerResize"
            },
            {
                "name": "eventCreate",
                "type": "SchedulerCreate"
            },
            {
                "name": "viewChange",
                "type": "{ view: ViewType; start: Date; end: Date }"
            },
            {
                "name": "dateChange",
                "type": "Date"
            },
            {
                "name": "prevWeek",
                "type": "void"
            },
            {
                "name": "nextWeek",
                "type": "void"
            },
            {
                "name": "todayClick",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/scroll-lock",
        "name": "NgxsmkScrollLock",
        "kind": "Directive",
        "selector": "[ngxsmkScrollLock]",
        "description": "",
        "inputs": [
            {
                "name": "ngxsmkScrollLock",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/section",
        "name": "NgxsmkSection",
        "kind": "Component",
        "selector": "ngxsmk-section",
        "description": "",
        "inputs": [
            {
                "name": "title",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/segmented-control",
        "name": "NgxsmkSegmentedControl",
        "kind": "Component",
        "selector": "ngxsmk-segmented-control",
        "description": "",
        "inputs": [
            {
                "name": "options",
                "type": "SegmentedOption[]",
                "required": true
            },
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "string"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/select",
        "name": "NgxsmkSelect",
        "kind": "Component",
        "selector": "ngxsmk-select",
        "description": "Themed single-select dropdown. A custom trigger + popup listbox (not a native `<select>`), so it themes consistently across browsers like the rest of the control family and matches `ngxsmk-input`'s visual language exactly. Pairs with `ngxsmk-form-field` for label, hint, and error wiring via the same `id` / `ariaInvalid` / `ariaDescribedby` hooks `ngxsmk-input` exposes.",
        "inputs": [
            {
                "name": "options",
                "type": "NgxsmkSelectOption[]",
                "required": true
            },
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "emptyLabel",
                "type": "string",
                "required": false,
                "default": "'No options'"
            },
            {
                "name": "id",
                "type": "unknown",
                "required": false,
                "default": "ngxsmkUniqueId('ngxsmk-select')"
            },
            {
                "name": "ariaLabelledby",
                "type": "string | null",
                "required": false,
                "default": "null"
            },
            {
                "name": "ariaInvalid",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "ariaDescribedby",
                "type": "string | null",
                "required": false,
                "twoWay": true,
                "default": "null"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "string"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/selector",
        "name": "NgxsmkSelector",
        "kind": "Component",
        "selector": "ngxsmk-selector",
        "description": "",
        "inputs": [
            {
                "name": "options",
                "type": "SelectorOption[]",
                "required": true
            },
            {
                "name": "selected",
                "type": "string[]",
                "required": false,
                "twoWay": true,
                "default": "[]"
            },
            {
                "name": "multiple",
                "type": "boolean",
                "required": false,
                "default": "true"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "string[]"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/sheet",
        "name": "NgxsmkSheet",
        "kind": "Component",
        "selector": "ngxsmk-sheet",
        "description": "",
        "inputs": [
            {
                "name": "open",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "side",
                "type": "NgxsmkSheetSide",
                "required": false,
                "default": "'right'"
            },
            {
                "name": "title",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/side-nav",
        "name": "NgxsmkSideNav",
        "kind": "Component",
        "selector": "ngxsmk-side-nav",
        "description": "",
        "inputs": [],
        "outputs": [
            {
                "name": "collapsedChange",
                "type": "boolean"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/side-nav",
        "name": "NgxsmkSideNavHeading",
        "kind": "Component",
        "selector": "ngxsmk-side-nav-heading",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/side-nav",
        "name": "NgxsmkSideNavItem",
        "kind": "Component",
        "selector": "ngxsmk-side-nav-item",
        "description": "",
        "inputs": [
            {
                "name": "href",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "active",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "external",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "badge",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": [
            {
                "name": "clicked",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/side-nav",
        "name": "NgxsmkSideNavSection",
        "kind": "Component",
        "selector": "ngxsmk-side-nav-section",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/side-nav",
        "name": "NgxsmkSideNavCollapseButton",
        "kind": "Component",
        "selector": "ngxsmk-side-nav-collapse-button",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/signature-pad",
        "name": "NgxsmkSignaturePad",
        "kind": "Component",
        "selector": "ngxsmk-signature-pad",
        "description": "Digital signature canvas component with smooth stroke rendering and export capabilities.",
        "inputs": [
            {
                "name": "width",
                "type": "number",
                "required": false,
                "default": "400"
            },
            {
                "name": "height",
                "type": "number",
                "required": false,
                "default": "180"
            },
            {
                "name": "penColor",
                "type": "string",
                "required": false,
                "default": "'#09090b'"
            },
            {
                "name": "penWidth",
                "type": "number",
                "required": false,
                "default": "2"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "ariaLabel",
                "type": "string",
                "required": false,
                "default": "'Digital signature pad canvas'"
            },
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            },
            {
                "name": "id",
                "type": "unknown",
                "required": false,
                "default": "ngxsmkUniqueId('ngxsmk-signature-pad')"
            },
            {
                "name": "ariaInvalid",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "ariaDescribedby",
                "type": "string | null",
                "required": false,
                "twoWay": true,
                "default": "null"
            }
        ],
        "outputs": [
            {
                "name": "cleared",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/skeleton",
        "name": "NgxsmkSkeleton",
        "kind": "Component",
        "selector": "ngxsmk-skeleton",
        "description": "Loading placeholder that mirrors the shape of upcoming content.",
        "inputs": [
            {
                "name": "width",
                "type": "string",
                "required": false,
                "default": "'100%'"
            },
            {
                "name": "height",
                "type": "string",
                "required": false,
                "default": "'1rem'"
            },
            {
                "name": "shape",
                "type": "'rounded' | 'circle' | 'rect'",
                "required": false,
                "default": "'rounded'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/slider",
        "name": "NgxsmkSlider",
        "kind": "Component",
        "selector": "ngxsmk-slider",
        "description": "",
        "inputs": [
            {
                "name": "min",
                "type": "number",
                "required": false,
                "default": "0"
            },
            {
                "name": "max",
                "type": "number",
                "required": false,
                "default": "100"
            },
            {
                "name": "step",
                "type": "number",
                "required": false,
                "default": "1"
            },
            {
                "name": "value",
                "type": "number",
                "required": false,
                "twoWay": true,
                "default": "0"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "ariaLabel",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "ariaValueText",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "number"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/spacer",
        "name": "NgxsmkSpacer",
        "kind": "Component",
        "selector": "ngxsmk-spacer",
        "description": "",
        "inputs": [
            {
                "name": "size",
                "type": "string",
                "required": false,
                "default": "'var(--ngxsmk-space-4)'"
            },
            {
                "name": "orientation",
                "type": "'horizontal' | 'vertical'",
                "required": false,
                "default": "'horizontal'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/spinner",
        "name": "NgxsmkSpinner",
        "kind": "Component",
        "selector": "ngxsmk-spinner",
        "description": "Indeterminate loading indicator.",
        "inputs": [
            {
                "name": "size",
                "type": "NgxsmkSpinnerSize",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "'Loading'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/split-button",
        "name": "NgxsmkSplitButton",
        "kind": "Component",
        "selector": "ngxsmk-split-button",
        "description": "",
        "inputs": [
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "variant",
                "type": "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'",
                "required": false,
                "default": "'primary'"
            },
            {
                "name": "size",
                "type": "'sm' | 'md' | 'lg'",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "loading",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "action",
                "type": "MouseEvent"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/spreadsheet",
        "name": "NgxsmkSpreadsheet",
        "kind": "Component",
        "selector": "ngxsmk-spreadsheet",
        "description": "",
        "inputs": [
            {
                "name": "columns",
                "type": "ColumnDef[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "rows",
                "type": "RowDef[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "density",
                "type": "SpreadsheetDensity",
                "required": false,
                "default": "'comfortable'"
            },
            {
                "name": "editable",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "multiSort",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "selectedCells",
                "type": "CellRange | null",
                "required": false,
                "twoWay": true,
                "default": "null"
            }
        ],
        "outputs": [
            {
                "name": "cellClick",
                "type": "{ row: number; col: number; value: CellValue }"
            },
            {
                "name": "cellDoubleClick",
                "type": "{ row: number; col: number; value: CellValue }"
            },
            {
                "name": "cellEdit",
                "type": "{\n    row: number;\n    col: string;\n    oldValue: CellValue;\n    newValue: CellValue;\n  }"
            },
            {
                "name": "selectionChange",
                "type": "CellRange | null"
            },
            {
                "name": "sortChange",
                "type": "SortCriterion[]"
            },
            {
                "name": "filterChange",
                "type": "FilterCriterion[]"
            },
            {
                "name": "rowInsert",
                "type": "{ count: number; index: number }"
            },
            {
                "name": "rowDelete",
                "type": "{ indices: number[]; rows: RowDef[] }"
            },
            {
                "name": "scrolled",
                "type": "{ scrollTop: number; scrollLeft: number }"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/stack",
        "name": "NgxsmkStack",
        "kind": "Component",
        "selector": "ngxsmk-stack",
        "description": "",
        "inputs": [
            {
                "name": "direction",
                "type": "NgxsmkStackDirection",
                "required": false,
                "default": "'vertical'"
            },
            {
                "name": "gap",
                "type": "string",
                "required": false,
                "default": "'var(--ngxsmk-space-4)'"
            },
            {
                "name": "align",
                "type": "NgxsmkStackAlign",
                "required": false,
                "default": "'stretch'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/stat",
        "name": "NgxsmkStat",
        "kind": "Component",
        "selector": "ngxsmk-stat",
        "description": "",
        "inputs": [
            {
                "name": "value",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "trend",
                "type": "NgxsmkStatTrend",
                "required": false,
                "default": "'flat'"
            },
            {
                "name": "icon",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/status-dot",
        "name": "NgxsmkStatusDot",
        "kind": "Component",
        "selector": "ngxsmk-status-dot",
        "description": "",
        "inputs": [
            {
                "name": "variant",
                "type": "NgxsmkStatusDotVariant",
                "required": false,
                "default": "'online'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/stepper",
        "name": "NgxsmkStepper",
        "kind": "Component",
        "selector": "ngxsmk-stepper",
        "description": "Stepper header that renders progress through a sequence of steps. Pair the emitted/`[(activeIndex)]` value with your own content to swap panels.",
        "inputs": [
            {
                "name": "steps",
                "type": "readonly NgxsmkStep[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "activeIndex",
                "type": "number",
                "required": false,
                "twoWay": true,
                "default": "0"
            },
            {
                "name": "orientation",
                "type": "NgxsmkStepperOrientation",
                "required": false,
                "default": "'horizontal'"
            },
            {
                "name": "linear",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "label",
                "type": "string",
                "required": false,
                "default": "'Progress'"
            }
        ],
        "outputs": [
            {
                "name": "stepChange",
                "type": "number"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/streaming-text",
        "name": "NgxsmkStreamingText",
        "kind": "Component",
        "selector": "ngxsmk-streaming-text",
        "description": "",
        "inputs": [
            {
                "name": "text",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "speed",
                "type": "number",
                "required": false,
                "default": "30"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/switch",
        "name": "NgxsmkSwitch",
        "kind": "Component",
        "selector": "ngxsmk-switch",
        "description": "Toggle switch for immediate on/off settings.",
        "inputs": [
            {
                "name": "checked",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "boolean"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/tab-menu",
        "name": "NgxsmkTabMenu",
        "kind": "Component",
        "selector": "ngxsmk-tab-menu",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/table",
        "name": "NgxsmkCellDef",
        "kind": "Directive",
        "selector": "[ngxsmkCell]",
        "description": "",
        "inputs": [
            {
                "name": "columnKey",
                "type": "string",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/table",
        "name": "NgxsmkTable",
        "kind": "Component",
        "selector": "ngxsmk-table",
        "description": "",
        "inputs": [
            {
                "name": "columns",
                "type": "NgxsmkTableColumn[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "rows",
                "type": "any[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "striped",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "sortable",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "sortField",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "sortDir",
                "type": "'asc' | 'desc'",
                "required": false,
                "default": "'asc'"
            }
        ],
        "outputs": [
            {
                "name": "sortChange",
                "type": "string"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/table-cell",
        "name": "NgxsmkTableCell",
        "kind": "Directive",
        "selector": "td[ngxsmkTableCell], ngxsmk-table-cell",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/table-cell",
        "name": "NgxsmkTableHeaderCell",
        "kind": "Directive",
        "selector": "th[ngxsmkTableHeaderCell], ngxsmk-table-header-cell",
        "description": "",
        "inputs": [
            {
                "name": "sortable",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "sortDirection",
                "type": "'asc' | 'desc' | ''",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": [
            {
                "name": "sorted",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/table-cell",
        "name": "NgxsmkTableRow",
        "kind": "Directive",
        "selector": "tr[ngxsmkTableRow], ngxsmk-table-row",
        "description": "",
        "inputs": [
            {
                "name": "selected",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/tabs",
        "name": "NgxsmkTab",
        "kind": "Component",
        "selector": "ngxsmk-tab",
        "description": "Single tab. Declares its trigger label and holds its lazily rendered content; `ngxsmk-tabs` renders the active panel.",
        "inputs": [
            {
                "name": "value",
                "type": "string",
                "required": true
            },
            {
                "name": "label",
                "type": "string",
                "required": true
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/tabs",
        "name": "NgxsmkTabs",
        "kind": "Component",
        "selector": "ngxsmk-tabs",
        "description": "Tabbed interface with WAI-ARIA roving tabindex keyboard support.",
        "inputs": [
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/tag",
        "name": "NgxsmkTag",
        "kind": "Component",
        "selector": "ngxsmk-tag",
        "description": "Label for categorizing content.",
        "inputs": [
            {
                "name": "variant",
                "type": "NgxsmkTagVariant",
                "required": false,
                "default": "'neutral'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/tag",
        "name": "NgxsmkChip",
        "kind": "Component",
        "selector": "ngxsmk-chip",
        "description": "Removable tag. Emits `removed` when the close affordance is activated.",
        "inputs": [
            {
                "name": "removable",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "removed",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/terminal",
        "name": "NgxsmkTerminal",
        "kind": "Component",
        "selector": "ngxsmk-terminal",
        "description": "",
        "inputs": [
            {
                "name": "title",
                "type": "string",
                "required": false,
                "default": "'Terminal'"
            },
            {
                "name": "lines",
                "type": "{ text: string; isInput?: boolean }[]",
                "required": true
            },
            {
                "name": "prompt",
                "type": "string",
                "required": false,
                "default": "'$'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/text",
        "name": "NgxsmkText",
        "kind": "Component",
        "selector": "ngxsmk-text",
        "description": "",
        "inputs": [
            {
                "name": "variant",
                "type": "NgxsmkTextVariant",
                "required": false,
                "default": "'body'"
            },
            {
                "name": "color",
                "type": "NgxsmkTextColor",
                "required": false,
                "default": "'default'"
            },
            {
                "name": "as",
                "type": "'p' | 'span' | 'div'",
                "required": false,
                "default": "'p'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/theme-builder",
        "name": "NgxsmkThemeBuilder",
        "kind": "Component",
        "selector": "ngxsmk-theme-builder",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/thumbnail",
        "name": "NgxsmkThumbnail",
        "kind": "Component",
        "selector": "ngxsmk-thumbnail",
        "description": "",
        "inputs": [
            {
                "name": "src",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "alt",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "size",
                "type": "'sm' | 'md' | 'lg' | 'xl'",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "shape",
                "type": "'square' | 'circle'",
                "required": false,
                "default": "'square'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/timeline-gantt",
        "name": "NgxsmkTimelineGantt",
        "kind": "Component",
        "selector": "ngxsmk-timeline-gantt",
        "description": "",
        "inputs": [
            {
                "name": "items",
                "type": "GanttItem[]",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/timestamp",
        "name": "NgxsmkTimestamp",
        "kind": "Component",
        "selector": "ngxsmk-timestamp",
        "description": "",
        "inputs": [
            {
                "name": "date",
                "type": "Date | string | number",
                "required": true
            },
            {
                "name": "format",
                "type": "'relative' | 'absolute' | 'smart'",
                "required": false,
                "default": "'smart'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/toast",
        "name": "NgxsmkToaster",
        "kind": "Component",
        "selector": "ngxsmk-toaster",
        "description": "Toast outlet. Place once in the root template: `<ngxsmk-toaster />`.",
        "inputs": [
            {
                "name": "position",
                "type": "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'",
                "required": false,
                "default": "'bottom-right'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/toggle-button",
        "name": "NgxsmkToggleButton",
        "kind": "Component",
        "selector": "button[ngxsmkToggleButton]",
        "description": "",
        "inputs": [
            {
                "name": "pressed",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "toggled",
                "type": "boolean"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/toggle-button-group",
        "name": "NgxsmkToggleButtonGroup",
        "kind": "Component",
        "selector": "ngxsmk-toggle-button-group",
        "description": "",
        "inputs": [
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "string"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/token",
        "name": "NgxsmkToken",
        "kind": "Component",
        "selector": "ngxsmk-token",
        "description": "",
        "inputs": [
            {
                "name": "variant",
                "type": "NgxsmkTokenVariant",
                "required": false,
                "default": "'default'"
            },
            {
                "name": "removable",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/tokenizer",
        "name": "NgxsmkTokenizer",
        "kind": "Component",
        "selector": "ngxsmk-tokenizer",
        "description": "",
        "inputs": [
            {
                "name": "tokens",
                "type": "string[]",
                "required": false,
                "twoWay": true,
                "default": "[]"
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "'Type and press Enter...'"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "changed",
                "type": "string[]"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/tool-call-viewer",
        "name": "NgxsmkToolCallViewer",
        "kind": "Component",
        "selector": "ngxsmk-tool-call-viewer",
        "description": "",
        "inputs": [
            {
                "name": "calls",
                "type": "ToolCall[]",
                "required": true
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/tooltip",
        "name": "NgxsmkTooltip",
        "kind": "Directive",
        "selector": "[ngxsmkTooltip]",
        "description": "Text tooltip on hover/focus.",
        "inputs": [
            {
                "name": "ngxsmkTooltip",
                "type": "string",
                "required": true
            },
            {
                "name": "tooltipPosition",
                "type": "NgxsmkTooltipPosition",
                "required": false,
                "default": "'top'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/top-nav",
        "name": "NgxsmkTopNav",
        "kind": "Component",
        "selector": "ngxsmk-top-nav",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/top-nav",
        "name": "NgxsmkTopNavHeading",
        "kind": "Component",
        "selector": "ngxsmk-top-nav-heading",
        "description": "",
        "inputs": [
            {
                "name": "href",
                "type": "string",
                "required": false,
                "default": "'/'"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/top-nav",
        "name": "NgxsmkTopNavItem",
        "kind": "Component",
        "selector": "ngxsmk-top-nav-item",
        "description": "",
        "inputs": [
            {
                "name": "href",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "active",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": [
            {
                "name": "clicked",
                "type": "void"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/top-nav",
        "name": "NgxsmkTopNavMenu",
        "kind": "Component",
        "selector": "ngxsmk-top-nav-menu",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/top-nav",
        "name": "NgxsmkTopNavMegaMenu",
        "kind": "Component",
        "selector": "ngxsmk-top-nav-mega-menu",
        "description": "",
        "inputs": [
            {
                "name": "featured",
                "type": "boolean",
                "required": false,
                "default": "false"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/top-nav",
        "name": "NgxsmkTopNavMegaMenuItem",
        "kind": "Component",
        "selector": "ngxsmk-top-nav-mega-menu-item",
        "description": "",
        "inputs": [
            {
                "name": "title",
                "type": "string",
                "required": true
            },
            {
                "name": "href",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "description",
                "type": "string",
                "required": false,
                "default": "''"
            },
            {
                "name": "icon",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/top-nav",
        "name": "NgxsmkTopNavMegaMenuFeaturedCard",
        "kind": "Component",
        "selector": "ngxsmk-top-nav-mega-menu-featured-card",
        "description": "",
        "inputs": [
            {
                "name": "href",
                "type": "string",
                "required": false,
                "default": "''"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/transfer",
        "name": "NgxsmkTransfer",
        "kind": "Component",
        "selector": "ngxsmk-transfer",
        "description": "Dual listbox component for moving items between two container columns.",
        "inputs": [
            {
                "name": "dataSource",
                "type": "TransferItem[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "titles",
                "type": "[string, string]",
                "required": false,
                "default": "['Source', 'Target']"
            },
            {
                "name": "showSearch",
                "type": "boolean",
                "required": false,
                "default": "true"
            },
            {
                "name": "searchPlaceholder",
                "type": "string",
                "required": false,
                "default": "'Search...'"
            },
            {
                "name": "disabled",
                "type": "boolean",
                "required": false,
                "default": "false"
            },
            {
                "name": "size",
                "type": "'sm' | 'md' | 'lg'",
                "required": false,
                "default": "'md'"
            },
            {
                "name": "targetKeys",
                "type": "string[]",
                "required": false,
                "twoWay": true,
                "default": "[]"
            },
            {
                "name": "id",
                "type": "unknown",
                "required": false,
                "default": "ngxsmkUniqueId('ngxsmk-transfer')"
            },
            {
                "name": "ariaInvalid",
                "type": "boolean",
                "required": false,
                "twoWay": true,
                "default": "false"
            },
            {
                "name": "ariaDescribedby",
                "type": "string | null",
                "required": false,
                "twoWay": true,
                "default": "null"
            }
        ],
        "outputs": [
            {
                "name": "transferChange",
                "type": "{\n    targetKeys: string[];\n    direction: TransferDirection;\n    moveKeys: string[];\n  }"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/tree-view",
        "name": "NgxsmkTreeNodeComponent",
        "kind": "Component",
        "selector": "ngxsmk-tree-node",
        "description": "",
        "inputs": [
            {
                "name": "node",
                "type": "NgxsmkTreeNode",
                "required": true
            },
            {
                "name": "level",
                "type": "number",
                "required": false,
                "default": "0"
            },
            {
                "name": "selectable",
                "type": "'none' | 'single' | 'multi'",
                "required": false,
                "default": "'none'"
            }
        ],
        "outputs": [
            {
                "name": "nodeSelected",
                "type": "NgxsmkTreeNode"
            },
            {
                "name": "nodeExpanded",
                "type": "NgxsmkTreeNode"
            },
            {
                "name": "nodeCollapsed",
                "type": "NgxsmkTreeNode"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/tree-view",
        "name": "NgxsmkTreeView",
        "kind": "Component",
        "selector": "ngxsmk-tree-view",
        "description": "",
        "inputs": [
            {
                "name": "nodes",
                "type": "NgxsmkTreeNode[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "selectable",
                "type": "'none' | 'single' | 'multi'",
                "required": false,
                "default": "'none'"
            }
        ],
        "outputs": [
            {
                "name": "nodeSelected",
                "type": "NgxsmkTreeNode"
            },
            {
                "name": "nodeExpanded",
                "type": "NgxsmkTreeNode"
            },
            {
                "name": "nodeCollapsed",
                "type": "NgxsmkTreeNode"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/typeahead",
        "name": "NgxsmkTypeaheadItem",
        "kind": "Directive",
        "selector": "[ngxsmkTypeaheadItem]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/typeahead",
        "name": "NgxsmkTypeahead",
        "kind": "Component",
        "selector": "ngxsmk-typeahead",
        "description": "",
        "inputs": [
            {
                "name": "options",
                "type": "string[]",
                "required": true
            },
            {
                "name": "placeholder",
                "type": "string",
                "required": false,
                "default": "'Type to search...'"
            },
            {
                "name": "value",
                "type": "string",
                "required": false,
                "twoWay": true,
                "default": "''"
            },
            {
                "name": "filtered",
                "type": "string[]",
                "required": false,
                "twoWay": true,
                "default": "[]"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/virtual-scroll",
        "name": "NgxsmkVirtualScroll",
        "kind": "Component",
        "selector": "ngxsmk-virtual-scroll",
        "description": "Signals-native virtual scroll container for rendering massive datasets with 60 FPS performance.",
        "inputs": [
            {
                "name": "items",
                "type": "T[]",
                "required": false,
                "default": "[]"
            },
            {
                "name": "itemHeight",
                "type": "number",
                "required": false,
                "default": "40"
            },
            {
                "name": "buffer",
                "type": "number",
                "required": false,
                "default": "5"
            }
        ],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/visually-hidden",
        "name": "NgxsmkVisuallyHidden",
        "kind": "Directive",
        "selector": "[ngxsmkVisuallyHidden]",
        "description": "",
        "inputs": [],
        "outputs": []
    },
    {
        "entryPoint": "@ngxsmk/core/voice-input",
        "name": "NgxsmkVoiceInput",
        "kind": "Component",
        "selector": "ngxsmk-voice-input",
        "description": "",
        "inputs": [],
        "outputs": [
            {
                "name": "toggled",
                "type": "boolean"
            },
            {
                "name": "result",
                "type": "string"
            }
        ]
    },
    {
        "entryPoint": "@ngxsmk/core/workflow-builder",
        "name": "NgxsmkWorkflowBuilder",
        "kind": "Component",
        "selector": "ngxsmk-workflow-builder",
        "description": "",
        "inputs": [
            {
                "name": "nodes",
                "type": "WorkflowNode[]",
                "required": true
            },
            {
                "name": "edges",
                "type": "WorkflowEdge[]",
                "required": false,
                "default": "[]"
            }
        ],
        "outputs": []
    }
];
