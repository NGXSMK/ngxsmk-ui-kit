import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import {
  NgxsmkCard,
  NgxsmkCardHeader,
  NgxsmkCardTitle,
  NgxsmkCardContent,
} from '@ngxsmk/core/card';
import { NgxsmkAvatar } from '@ngxsmk/core/avatar';
import { NgxsmkAlert } from '@ngxsmk/core/alert';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkSelect } from '@ngxsmk/core/select';
import { NgxsmkSlider } from '@ngxsmk/core/slider';
import { NgxsmkProgress } from '@ngxsmk/core/progress';
import { NgxsmkSpinner } from '@ngxsmk/core/spinner';
import { NgxsmkSkeleton } from '@ngxsmk/core/skeleton';
import { NgxsmkStat } from '@ngxsmk/core/stat';
import { NgxsmkTag } from '@ngxsmk/core/tag';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkText } from '@ngxsmk/core/text';
import { NgxsmkDivider } from '@ngxsmk/core/divider';
import { NgxsmkKbd } from '@ngxsmk/core/kbd';
import { NgxsmkCode } from '@ngxsmk/core/code';
import { NgxsmkBlockquote } from '@ngxsmk/core/blockquote';
import { NgxsmkLink } from '@ngxsmk/core/link';
import { NgxsmkStatusDot } from '@ngxsmk/core/status-dot';
import { NgxsmkRating } from '@ngxsmk/core/rating';
import { NgxsmkEmptyState } from '@ngxsmk/core/empty-state';
import { NgxsmkProgressCircle } from '@ngxsmk/core/progress-circle';
import { NgxsmkThumbnail } from '@ngxsmk/core/thumbnail';
import { NgxsmkHStack, NgxsmkVStack } from '@ngxsmk/core/h-stack';
import { NgxsmkCenter } from '@ngxsmk/core/center';
import { NgxsmkContainer } from '@ngxsmk/core/container';
import { NgxsmkGrid } from '@ngxsmk/core/grid';
import { NgxsmkFlex } from '@ngxsmk/core/flex';
import { NgxsmkRadio, NgxsmkRadioGroup } from '@ngxsmk/core/radio';

export const CURATED_COMPONENTS = [
  NgxsmkButton,
  NgxsmkBadge,
  NgxsmkCard,
  NgxsmkCardHeader,
  NgxsmkCardTitle,
  NgxsmkCardContent,
  NgxsmkAvatar,
  NgxsmkAlert,
  NgxsmkSwitch,
  NgxsmkCheckbox,
  NgxsmkInputDirective,
  NgxsmkSelect,
  NgxsmkSlider,
  NgxsmkProgress,
  NgxsmkSpinner,
  NgxsmkSkeleton,
  NgxsmkStat,
  NgxsmkTag,
  NgxsmkHeading,
  NgxsmkText,
  NgxsmkDivider,
  NgxsmkKbd,
  NgxsmkCode,
  NgxsmkBlockquote,
  NgxsmkLink,
  NgxsmkStatusDot,
  NgxsmkRating,
  NgxsmkEmptyState,
  NgxsmkProgressCircle,
  NgxsmkThumbnail,
  NgxsmkHStack,
  NgxsmkVStack,
  NgxsmkCenter,
  NgxsmkContainer,
  NgxsmkGrid,
  NgxsmkFlex,
  NgxsmkRadio,
  NgxsmkRadioGroup,
];

const SELECT_OPTIONS = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
];

@Component({
  selector: 'playground-demo-host',
  standalone: true,
  imports: [...CURATED_COMPONENTS, TranslatePipe],
  template: `
    <div class="pg-demo-stage">
      @switch (demoId()) {
        @case ('NgxsmkButton') {
          <button
            ngxsmk-button
            [variant]="str('variant')"
            [size]="str('size')"
            [loading]="bool('loading')"
            [disabled]="bool('disabled')"
            [iconOnly]="bool('iconOnly')"
          >
            {{ str('label') || ('iplayground.demo.button' | translate) }}
          </button>
        }
        @case ('NgxsmkBadge') {
          <ngxsmk-badge [variant]="str('variant')">{{
            str('label') || ('iplayground.demo.badge' | translate)
          }}</ngxsmk-badge>
        }
        @case ('NgxsmkCard') {
          <ngxsmk-card
            [attr.data-interactive]="bool('interactive') ? '' : null"
            style="max-width: 320px;"
          >
            <div ngxsmkCardHeader>
              <h3 ngxsmkCardTitle>{{ 'iplayground.demo.cardTitle' | translate }}</h3>
            </div>
            <div ngxsmkCardContent>
              <ngxsmk-text variant="body">{{
                'iplayground.demo.cardDesc' | translate
              }}</ngxsmk-text>
            </div>
          </ngxsmk-card>
        }
        @case ('NgxsmkAvatar') {
          <ngxsmk-avatar
            [name]="str('name')"
            [src]="str('src')"
            [size]="str('size')"
            [shape]="str('shape')"
          ></ngxsmk-avatar>
        }
        @case ('NgxsmkAlert') {
          <ngxsmk-alert
            [variant]="str('variant')"
            [title]="str('title')"
            style="max-width: 420px;"
            >{{ str('label') || ('iplayground.demo.alertMsg' | translate) }}</ngxsmk-alert
          >
        }
        @case ('NgxsmkSwitch') {
          <ngxsmk-switch [checked]="bool('checked')" [disabled]="bool('disabled')">{{
            str('label') || ('iplayground.demo.enableNotifications' | translate)
          }}</ngxsmk-switch>
        }
        @case ('NgxsmkCheckbox') {
          <ngxsmk-checkbox
            [checked]="bool('checked')"
            [disabled]="bool('disabled')"
            [indeterminate]="bool('indeterminate')"
            >{{ str('label') || ('iplayground.demo.acceptTerms' | translate) }}</ngxsmk-checkbox
          >
        }
        @case ('NgxsmkInput') {
          <input
            ngxsmkInput
            style="max-width: 280px;"
            [type]="str('type')"
            [value]="str('value')"
            [placeholder]="str('placeholder')"
            [disabled]="bool('disabled')"
          />
        }
        @case ('NgxsmkSelect') {
          <ngxsmk-select
            style="max-width: 280px;"
            [options]="selectOptions"
            [value]="str('value')"
            [placeholder]="str('placeholder')"
            [disabled]="bool('disabled')"
          ></ngxsmk-select>
        }
        @case ('NgxsmkSlider') {
          <div style="width: 280px;">
            <ngxsmk-slider
              [value]="num('value')"
              [min]="num('min')"
              [max]="num('max')"
              [step]="num('step')"
              [disabled]="bool('disabled')"
            ></ngxsmk-slider>
          </div>
        }
        @case ('NgxsmkProgress') {
          <div style="width: 100%; max-width: 320px;">
            <ngxsmk-progress [value]="num('value')" [label]="str('label')"></ngxsmk-progress>
          </div>
        }
        @case ('NgxsmkSpinner') {
          <ngxsmk-spinner [size]="str('size')" [label]="str('label')"></ngxsmk-spinner>
        }
        @case ('NgxsmkSkeleton') {
          <ngxsmk-skeleton
            [shape]="str('shape')"
            [width]="str('width')"
            [height]="str('height')"
          ></ngxsmk-skeleton>
        }
        @case ('NgxsmkStat') {
          <ngxsmk-stat
            [value]="str('value')"
            [label]="str('label')"
            [trend]="str('trend')"
            [icon]="str('icon')"
          ></ngxsmk-stat>
        }
        @case ('NgxsmkTag') {
          <ngxsmk-tag [variant]="str('variant')">{{
            str('label') || ('iplayground.demo.tag' | translate)
          }}</ngxsmk-tag>
        }
        @case ('NgxsmkHeading') {
          <ngxsmk-heading [level]="str('level')" [weight]="str('weight')">{{
            str('label') || ('iplayground.demo.heading' | translate)
          }}</ngxsmk-heading>
        }
        @case ('NgxsmkText') {
          <ngxsmk-text [variant]="str('variant')" [color]="str('color')">{{
            str('label') || ('iplayground.demo.lorem' | translate)
          }}</ngxsmk-text>
        }
        @case ('NgxsmkDivider') {
          <div style="width: 100%; max-width: 320px;">
            @if (str('orientation') === 'vertical') {
              <div style="height: 80px;">
                <ngxsmk-divider [orientation]="str('orientation')"></ngxsmk-divider>
              </div>
            } @else {
              <ngxsmk-divider [orientation]="str('orientation')"></ngxsmk-divider>
            }
          </div>
        }
        @case ('NgxsmkKbd') {
          <ngxsmk-kbd>{{ str('label') || 'Ctrl K' }}</ngxsmk-kbd>
        }
        @case ('NgxsmkCode') {
          <code ngxsmk-code>{{ str('label') || 'npm install @ngxsmk/core' }}</code>
        }
        @case ('NgxsmkBlockquote') {
          <ngxsmk-blockquote [cite]="str('cite')">{{
            str('label') || ('iplayground.demo.blockquote' | translate)
          }}</ngxsmk-blockquote>
        }
        @case ('NgxsmkLink') {
          <a ngxsmk-link [variant]="str('variant')" [underline]="bool('underline')">{{
            str('label') || ('iplayground.demo.linkText' | translate)
          }}</a>
        }
        @case ('NgxsmkStatusDot') {
          <ngxsmk-status-dot [variant]="str('variant')"></ngxsmk-status-dot>
        }
        @case ('NgxsmkRating') {
          <ngxsmk-rating
            [value]="num('value')"
            [max]="num('max')"
            [readonly]="bool('readonly')"
            [size]="str('size')"
            [allowHalf]="bool('allowHalf')"
          ></ngxsmk-rating>
        }
        @case ('NgxsmkEmptyState') {
          <ngxsmk-empty-state
            [title]="str('title')"
            [description]="str('description')"
            [icon]="str('icon')"
          ></ngxsmk-empty-state>
        }
        @case ('NgxsmkProgressCircle') {
          <ngxsmk-progress-circle
            [value]="num('value')"
            [max]="num('max')"
            [size]="str('size')"
            [variant]="str('variant')"
            [showValue]="bool('showValue')"
          ></ngxsmk-progress-circle>
        }
        @case ('NgxsmkThumbnail') {
          <ngxsmk-thumbnail
            [src]="str('src')"
            [alt]="str('alt')"
            [size]="str('size')"
            [shape]="str('shape')"
          ></ngxsmk-thumbnail>
        }
        @case ('NgxsmkHStack') {
          <ngxsmk-h-stack [justify]="str('justify')" [align]="str('align')" [gap]="str('gap')">
            <button ngxsmk-button variant="primary">
              {{ 'iplayground.demo.save' | translate }}
            </button>
            <button ngxsmk-button variant="outline">
              {{ 'iplayground.demo.cancel' | translate }}
            </button>
            <button ngxsmk-button variant="ghost">{{ 'iplayground.demo.more' | translate }}</button>
          </ngxsmk-h-stack>
        }
        @case ('NgxsmkVStack') {
          <ngxsmk-v-stack [justify]="str('justify')" [align]="str('align')" [gap]="str('gap')">
            <button ngxsmk-button variant="primary">
              {{ 'iplayground.demo.save' | translate }}
            </button>
            <button ngxsmk-button variant="outline">
              {{ 'iplayground.demo.cancel' | translate }}
            </button>
            <button ngxsmk-button variant="ghost">{{ 'iplayground.demo.more' | translate }}</button>
          </ngxsmk-v-stack>
        }
        @case ('NgxsmkCenter') {
          <ngxsmk-center
            style="min-height: 120px; border: 1px dashed var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-md);"
          >
            <ngxsmk-badge variant="primary">{{
              'iplayground.demo.centered' | translate
            }}</ngxsmk-badge>
          </ngxsmk-center>
        }
        @case ('NgxsmkContainer') {
          <ngxsmk-container>
            <ngxsmk-text variant="body">{{
              'iplayground.demo.containerDesc' | translate
            }}</ngxsmk-text>
          </ngxsmk-container>
        }
        @case ('NgxsmkGrid') {
          <ngxsmk-grid [cols]="num('cols')" [gap]="str('gap')">
            <ngxsmk-card
              ><div ngxsmkCardContent>
                <ngxsmk-text variant="caption">{{
                  'iplayground.demo.item' | translate: { n: 1 }
                }}</ngxsmk-text>
              </div></ngxsmk-card
            >
            <ngxsmk-card
              ><div ngxsmkCardContent>
                <ngxsmk-text variant="caption">{{
                  'iplayground.demo.item' | translate: { n: 2 }
                }}</ngxsmk-text>
              </div></ngxsmk-card
            >
            <ngxsmk-card
              ><div ngxsmkCardContent>
                <ngxsmk-text variant="caption">{{
                  'iplayground.demo.item' | translate: { n: 3 }
                }}</ngxsmk-text>
              </div></ngxsmk-card
            >
          </ngxsmk-grid>
        }
        @case ('NgxsmkFlex') {
          <ngxsmk-flex [direction]="str('direction')" [gap]="str('gap')">
            <ngxsmk-badge>{{ 'iplayground.demo.one' | translate }}</ngxsmk-badge>
            <ngxsmk-badge>{{ 'iplayground.demo.two' | translate }}</ngxsmk-badge>
            <ngxsmk-badge>{{ 'iplayground.demo.three' | translate }}</ngxsmk-badge>
          </ngxsmk-flex>
        }
        @case ('NgxsmkRadio') {
          <ngxsmk-radio-group [value]="str('value')">
            <ngxsmk-radio [value]="str('value')" [disabled]="bool('disabled')">{{
              str('label') || ('iplayground.demo.option' | translate)
            }}</ngxsmk-radio>
          </ngxsmk-radio-group>
        }
        @default {
          <div class="pg-demo-unavailable">
            <span class="pg-demo-unavailable-icon">◈</span>
            <p>{{ 'iplayground.demo.unavailable' | translate }}</p>
            <p class="pg-demo-unavailable-hint">
              {{ 'iplayground.demo.unavailableHint' | translate }}
            </p>
          </div>
        }
      }
    </div>
  `,
  styles: `
    .pg-demo-stage {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      padding: 2rem;
    }
    .pg-demo-unavailable {
      text-align: center;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }
    .pg-demo-unavailable-icon {
      font-size: var(--ngxsmk-text-headline-lg-size);
      opacity: 0.3;
      display: block;
      margin-bottom: 0.5rem;
    }
    .pg-demo-unavailable-hint {
      font-size: var(--ngxsmk-text-body-sm-size);
      opacity: 0.8;
    }
  `,
})
export class PlaygroundDemoHost {
  readonly demoId = input.required<string>();
  readonly props = input<Record<string, unknown>>({});
  protected readonly selectOptions = SELECT_OPTIONS;

  protected str(name: string): any {
    return (this.props()[name] as string) ?? '';
  }

  protected bool(name: string): boolean {
    return !!this.props()[name];
  }

  protected num(name: string): number {
    const v = Number(this.props()[name]);
    return Number.isNaN(v) ? 0 : v;
  }
}
