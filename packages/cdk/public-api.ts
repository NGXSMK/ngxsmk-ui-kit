/*
 * Public API Surface of @ngxsmk/cdk
 */

export * from '@ngxsmk/cdk/click-outside';
export * from '@ngxsmk/cdk/focusable';
export * from '@ngxsmk/cdk/focus-trap';
export * from '@ngxsmk/cdk/live-announcer';
export * from '@ngxsmk/cdk/media-query';
export * from '@ngxsmk/cdk/scroll-lock';
export * from '@ngxsmk/cdk/visually-hidden';
export * from '@ngxsmk/cdk/intersection-observer';
export * from '@ngxsmk/cdk/resize-observer';
export * from '@ngxsmk/cdk/autofocus';

// NOTE: '@ngxsmk/cdk/testing' is intentionally NOT re-exported here. It pulls in
// axe-core (a CommonJS dependency) which would otherwise leak into every runtime
// bundle that imports the main '@ngxsmk/cdk' barrel. Import test helpers directly
// from the dedicated entry point instead: `import { ... } from '@ngxsmk/cdk/testing'`.
