import { InjectionToken, TemplateRef } from '@angular/core';
import {
  InputGroupEngine,
  type InputGroupConfig,
  type InputGroupAddon,
  type ValidationStatus,
} from '@ngxsmk/cdk/input-group';

export interface InputGroupLabelContext {
  $implicit: string;
  label: string;
  required: boolean;
  disabled: boolean;
}

export interface InputGroupHintContext {
  $implicit: string;
  hint: string;
}

export interface InputGroupErrorContext {
  $implicit: string;
  message: string;
  status: ValidationStatus;
}

export interface InputGroupCounterContext {
  $implicit: number;
  count: number;
  maxLength?: number;
}

export interface InputGroupLoadingContext {
  $implicit: boolean;
  loading: boolean;
}

export interface InputGroupAddonContext {
  $implicit: InputGroupAddon;
  addon: InputGroupAddon;
  disabled: boolean;
}

export interface InputGroupClearContext {
  $implicit: () => void;
  clear: () => void;
  disabled: boolean;
  visible: boolean;
}

export const INPUT_GROUP_LABEL_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupLabelContext> | null>('INPUT_GROUP_LABEL_TEMPLATE');
export const INPUT_GROUP_HINT_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupHintContext> | null>('INPUT_GROUP_HINT_TEMPLATE');
export const INPUT_GROUP_ERROR_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupErrorContext> | null>('INPUT_GROUP_ERROR_TEMPLATE');
export const INPUT_GROUP_COUNTER_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupCounterContext> | null>('INPUT_GROUP_COUNTER_TEMPLATE');
export const INPUT_GROUP_LOADING_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupLoadingContext> | null>('INPUT_GROUP_LOADING_TEMPLATE');
export const INPUT_GROUP_ADDON_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupAddonContext> | null>('INPUT_GROUP_ADDON_TEMPLATE');
export const INPUT_GROUP_CLEAR_TEMPLATE =
  new InjectionToken<TemplateRef<InputGroupClearContext> | null>('INPUT_GROUP_CLEAR_TEMPLATE');

export const INPUT_GROUP_ENGINE = new InjectionToken<InputGroupEngine>('INPUT_GROUP_ENGINE');

export function provideInputGroup(
  config: Partial<InputGroupConfig> = {},
): { provider: InjectionToken<unknown>; useValue: unknown }[] {
  const engine = new InputGroupEngine(config);
  return [{ provider: INPUT_GROUP_ENGINE, useValue: engine }];
}
