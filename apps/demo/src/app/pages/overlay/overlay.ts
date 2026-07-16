import { NgxsmkDialog, NgxsmkDialogFooter } from '@ngxsmk/core/dialog';
import { NgxsmkAlertDialog } from '@ngxsmk/core/alert-dialog';
import { NgxsmkTooltip } from '@ngxsmk/core/tooltip';
import { NgxsmkHoverCard } from '@ngxsmk/core/hover-card';
import { NgxsmkSheet, NgxsmkSheetSide } from '@ngxsmk/core/sheet';
import { NgxsmkDropdownMenu, NgxsmkDropdownMenuItem } from '@ngxsmk/core/dropdown-menu';
import { NgxsmkContextMenu, NgxsmkContextMenuItem } from '@ngxsmk/core/context-menu';
import { NgxsmkLightbox, NgxsmkLightboxImage } from '@ngxsmk/core/lightbox';
import { NgxsmkThumbnail } from '@ngxsmk/core/thumbnail';
import {
  NgxsmkImperativeDialog,
  NgxsmkImperativeAlertDialog,
} from '@ngxsmk/core/imperative-dialog';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkCommandPalette, CommandItem } from '@ngxsmk/core/command-palette';
import { NgxsmkThemeService } from '@ngxsmk/theme';
import { Component, signal, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

@Component({
  selector: 'overlay-page',
  standalone: true,
  imports: [
    ShowcaseExample,
    NgxsmkButton,
    NgxsmkDialog,
    NgxsmkDialogFooter,
    NgxsmkAlertDialog,
    NgxsmkTooltip,
    NgxsmkHoverCard,
    NgxsmkSheet,
    NgxsmkDropdownMenu,
    NgxsmkContextMenu,
    NgxsmkLightbox,
    NgxsmkThumbnail,
    NgxsmkCommandPalette,
    TranslatePipe,
  ],
  template: `
    <h2 class="ngxsmk-page-title">{{ 'category.overlay' | translate }}</h2>
    <p class="ngxsmk-page-desc">
      {{ 'overlay.desc' | translate }}
    </p>

    <showcase-example
      [title]="'overlay.dialog' | translate"
      [description]="'overlay.dialogDesc' | translate"
      [code]="codeDialog"
      [component]="NgxsmkButton"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button (click)="dialogOpen.set(true)">
          {{ 'overlay.openDialog' | translate }}
        </button>
      </div>

      <ngxsmk-dialog [(open)]="dialogOpen" [title]="'overlay.deleteFile' | translate">
        {{ 'overlay.deleteFileBody' | translate }}
        <div ngxsmkDialogFooter>
          <button ngxsmk-button variant="outline" (click)="dialogOpen.set(false)">
            {{ 'overlay.cancel' | translate }}
          </button>
          <button ngxsmk-button variant="destructive" (click)="onDeleted()">
            {{ 'overlay.delete' | translate }}
          </button>
        </div>
      </ngxsmk-dialog>
    </showcase-example>

    <showcase-example
      [title]="'overlay.alertDialog' | translate"
      [description]="'overlay.alertDialogDesc' | translate"
      [code]="codeAlertDialog"
      [component]="NgxsmkButton"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button variant="outline" (click)="infoAlertOpen.set(true)">
          {{ 'overlay.infoAlert' | translate }}
        </button>
        <button ngxsmk-button variant="destructive" (click)="destructiveAlertOpen.set(true)">
          {{ 'overlay.destructiveAlert' | translate }}
        </button>
      </div>

      <ngxsmk-alert-dialog
        [(open)]="infoAlertOpen"
        [title]="'overlay.saveChanges' | translate"
        [message]="'overlay.saveChangesMsg' | translate"
        [confirmLabel]="'overlay.save' | translate"
        variant="info"
        (confirmed)="setAction('Alert confirmed')"
        (cancelled)="setAction('Alert cancelled')"
      />

      <ngxsmk-alert-dialog
        [(open)]="destructiveAlertOpen"
        [title]="'overlay.deleteProject' | translate"
        [message]="'overlay.deleteProjectMsg' | translate"
        [confirmLabel]="'overlay.delete' | translate"
        variant="destructive"
        (confirmed)="setAction('Project deleted')"
        (cancelled)="setAction('Delete cancelled')"
      />

      @if (lastAction()) {
        <p class="ngxsmk-demo-hint">
          {{ 'overlay.lastAction' | translate: { action: lastAction() } }}
        </p>
      }
    </showcase-example>

    <showcase-example
      [title]="'overlay.tooltip' | translate"
      [description]="'overlay.tooltipDesc' | translate"
      [code]="codeTooltip"
      [component]="NgxsmkButton"
    >
      <div class="ngxsmk-demo-row">
        <button
          ngxsmk-button
          variant="outline"
          [ngxsmkTooltip]="'overlay.appearsAbove' | translate"
          tooltipPosition="top"
        >
          {{ 'overlay.top' | translate }}
        </button>
        <button
          ngxsmk-button
          variant="outline"
          [ngxsmkTooltip]="'overlay.appearsBelow' | translate"
          tooltipPosition="bottom"
        >
          {{ 'overlay.bottom' | translate }}
        </button>
        <button
          ngxsmk-button
          variant="outline"
          [ngxsmkTooltip]="'overlay.appearsLeft' | translate"
          tooltipPosition="left"
        >
          {{ 'overlay.left' | translate }}
        </button>
        <button
          ngxsmk-button
          variant="outline"
          [ngxsmkTooltip]="'overlay.appearsRight' | translate"
          tooltipPosition="right"
        >
          {{ 'overlay.right' | translate }}
        </button>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'overlay.hoverCard' | translate"
      [description]="'overlay.hoverCardDesc' | translate"
      [code]="codeHoverCard"
      [component]="NgxsmkHoverCard"
      [customize]="customizeNgxsmkHoverCard"
    >
      <ngxsmk-hover-card>
        <button ngxsmkHoverCardTrigger ngxsmk-button variant="ghost">&#64;ada_lovelace</button>
        <div class="ngxsmk-demo-stack">
          <strong>Ada Lovelace</strong>
          <span class="ngxsmk-demo-hint">{{ 'overlay.adaDesc' | translate }}</span>
        </div>
      </ngxsmk-hover-card>
    </showcase-example>

    <showcase-example
      [title]="'overlay.sheet' | translate"
      [description]="'overlay.sheetDesc' | translate"
      [code]="codeSheet"
      [component]="NgxsmkButton"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button variant="outline" (click)="openSheet('left')">
          {{ 'overlay.openLeft' | translate }}
        </button>
        <button ngxsmk-button variant="outline" (click)="openSheet('right')">
          {{ 'overlay.openRight' | translate }}
        </button>
        <button ngxsmk-button variant="outline" (click)="openSheet('bottom')">
          {{ 'overlay.openBottom' | translate }}
        </button>
      </div>

      <ngxsmk-sheet
        [(open)]="sheetOpen"
        [side]="sheetSide()"
        [title]="'overlay.settings' | translate"
      >
        <div class="ngxsmk-demo-stack">
          <p>
            {{ 'overlay.sheetBody' | translate: { side: sheetSide() } }}
          </p>
          <p class="ngxsmk-demo-hint">{{ 'overlay.dismissHint' | translate }}</p>
          <button ngxsmk-button (click)="sheetOpen.set(false)">
            {{ 'overlay.done' | translate }}
          </button>
        </div>
      </ngxsmk-sheet>
    </showcase-example>

    <showcase-example
      [title]="'overlay.dropdownMenu' | translate"
      [description]="'overlay.dropdownMenuDesc' | translate"
      [code]="codeDropdown"
      [component]="NgxsmkDropdownMenu"
      [customize]="customizeNgxsmkDropdownMenu"
    >
      <ngxsmk-dropdown-menu [items]="menuItems">
        <button ngxsmkDropdownTrigger ngxsmk-button variant="outline">
          {{ 'overlay.actions' | translate }} &#9662;
        </button>
      </ngxsmk-dropdown-menu>

      @if (lastAction()) {
        <p class="ngxsmk-demo-hint">
          {{ 'overlay.lastAction' | translate: { action: lastAction() } }}
        </p>
      }
    </showcase-example>

    <showcase-example
      [title]="'overlay.contextMenu' | translate"
      [description]="'overlay.contextMenuDesc' | translate"
      [code]="codeContextMenu"
      [component]="NgxsmkContextMenu"
      [customize]="customizeNgxsmkContextMenu"
    >
      <div
        class="ngxsmk-sc-surface"
        style="width:100%;padding:2rem;text-align:center;cursor:context-menu"
        (contextmenu)="onContextMenu($event, cm)"
      >
        {{ 'overlay.rightClick' | translate }}
        <ngxsmk-context-menu #cm [items]="menuItems" />
      </div>
    </showcase-example>

    <showcase-example
      [title]="'overlay.lightbox' | translate"
      [description]="'overlay.lightboxDesc' | translate"
      [code]="codeLightbox"
      [component]="NgxsmkLightbox"
      [customize]="customizeNgxsmkLightbox"
    >
      <ngxsmk-lightbox [images]="galleryImages" [(open)]="lightboxOpen">
        <div class="ngxsmk-demo-row">
          @for (image of galleryImages; track image.src) {
            <ngxsmk-thumbnail [src]="image.src" [alt]="image.alt ?? ''" size="lg" shape="square" />
          }
        </div>
      </ngxsmk-lightbox>

      <div class="ngxsmk-demo-row">
        <button ngxsmk-button variant="outline" (click)="lightboxOpen.set(true)">
          {{ 'overlay.openGallery' | translate }}
        </button>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'overlay.imperativeDialog' | translate"
      description="An injectable service that opens a native <dialog> programmatically - no template binding required."
      [code]="codeImperativeDialog"
      [component]="NgxsmkButton"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button (click)="openImperative()">
          {{ 'overlay.openImperatively' | translate }}
        </button>
      </div>

      @if (imperativeStatus()) {
        <p class="ngxsmk-demo-hint">{{ imperativeStatus() }}</p>
      }
    </showcase-example>

    <showcase-example
      [title]="'overlay.imperativeAlertDialog' | translate"
      [description]="'overlay.imperativeAlertDialogDesc' | translate"
      [code]="codeImperativeAlertDialog"
      [component]="NgxsmkButton"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button variant="destructive" (click)="openImperativeAlert()">
          {{ 'overlay.confirmImperatively' | translate }}
        </button>
      </div>

      @if (alertStatus()) {
        <p class="ngxsmk-demo-hint">{{ alertStatus() }}</p>
      }
    </showcase-example>

    <showcase-example
      [title]="'overlay.commandPalette' | translate"
      [description]="'overlay.commandPaletteDesc' | translate"
      [code]="codeCommandPalette"
      [component]="NgxsmkButton"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button (click)="palette.open()">
          {{ 'overlay.openPalette' | translate }}
        </button>
      </div>

      <ngxsmk-command-palette
        #palette
        [commands]="commandsList"
        (selected)="onCommandSelected($event)"
      />

      @if (lastCommand()) {
        <p class="ngxsmk-demo-hint">
          {{ 'overlay.executed' | translate: { command: lastCommand() } }}
        </p>
      }
    </showcase-example>
  `,
  styles: `
    .ngxsmk-demo-hint {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }
  `,
})
export class OverlayPage {
  protected readonly NgxsmkButton = NgxsmkButton;
  protected readonly NgxsmkHoverCard = NgxsmkHoverCard;
  protected readonly customizeNgxsmkHoverCard = `/* Theme <ngxsmk-hover-card> via design tokens */
ngxsmk-hover-card {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-shadow-lg: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-body-sm-line: ;
  --ngxsmk-text-body-sm-size: ;
  --ngxsmk-z-popover: ;
}`;
  protected readonly NgxsmkDropdownMenu = NgxsmkDropdownMenu;
  protected readonly customizeNgxsmkDropdownMenu = `/* Theme <ngxsmk-dropdown-menu> via design tokens */
ngxsmk-dropdown-menu {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-shadow-lg: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-1-5: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-sm-line: ;
  --ngxsmk-text-body-sm-size: ;
  --ngxsmk-z-dropdown: ;
}`;
  protected readonly NgxsmkContextMenu = NgxsmkContextMenu;
  protected readonly customizeNgxsmkContextMenu = `/* Theme <ngxsmk-context-menu> via design tokens */
ngxsmk-context-menu {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-shadow-lg: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-1-5: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-sm-line: ;
  --ngxsmk-text-body-sm-size: ;
  --ngxsmk-z-popover: ;
}`;
  protected readonly NgxsmkLightbox = NgxsmkLightbox;
  protected readonly customizeNgxsmkLightbox = `/* Theme <ngxsmk-lightbox> via design tokens */
ngxsmk-lightbox {
  --ngxsmk-color-lightbox-backdrop: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-2: ;
  --ngxsmk-text-body-sm-size: ;
  --ngxsmk-z-modal: ;
}`;

  private readonly imperativeDialog = inject(NgxsmkImperativeDialog);
  private readonly imperativeAlert = inject(NgxsmkImperativeAlertDialog);
  private readonly themeService = inject(NgxsmkThemeService);

  protected readonly lastCommand = signal('');
  protected readonly commandsList: CommandItem[] = [
    { id: 'home', label: 'Go to Home Page', category: 'Navigation', shortcut: 'G H', icon: '🏠' },
    {
      id: 'docs',
      label: 'Go to Documentation',
      category: 'Navigation',
      shortcut: 'G D',
      icon: '📖',
    },
    { id: 'theme-light', label: 'Set Theme: Light Mode', category: 'Appearance', icon: '☀️' },
    { id: 'theme-dark', label: 'Set Theme: Dark Mode', category: 'Appearance', icon: '🌙' },
    {
      id: 'copy-npm',
      label: 'Copy npm Install Command',
      category: 'Actions',
      shortcut: '⌥ C',
      icon: '📋',
    },
    { id: 'reset', label: 'Reset Demo Settings', category: 'Actions', icon: '🔄' },
  ];

  protected onCommandSelected(cmd: CommandItem): void {
    this.lastCommand.set(cmd.label);
    if (cmd.id === 'theme-light') {
      this.themeService.setMode('light');
    } else if (cmd.id === 'theme-dark') {
      this.themeService.setMode('dark');
    } else if (cmd.id === 'copy-npm') {
      navigator.clipboard.writeText('npm install @ngxsmk/core @ngxsmk/theme');
    }
  }

  protected readonly dialogOpen = signal(false);
  protected readonly infoAlertOpen = signal(false);
  protected readonly destructiveAlertOpen = signal(false);
  protected readonly sheetOpen = signal(false);
  protected readonly sheetSide = signal<NgxsmkSheetSide>('right');
  protected readonly lightboxOpen = signal(false);
  protected readonly lastAction = signal('');
  protected readonly imperativeStatus = signal('');
  protected readonly alertStatus = signal('');

  protected readonly menuItems: NgxsmkDropdownMenuItem[] = [
    { label: 'Edit', action: () => this.setAction('Edit') },
    { label: 'Duplicate', action: () => this.setAction('Duplicate') },
    { label: 'Archive', action: () => this.setAction('Archive'), divider: true },
    { label: 'Delete', action: () => this.setAction('Delete') },
  ] satisfies NgxsmkContextMenuItem[];

  protected readonly galleryImages: NgxsmkLightboxImage[] = [
    { src: 'https://picsum.photos/id/1015/1200/800', alt: 'River between mountains' },
    { src: 'https://picsum.photos/id/1025/1200/800', alt: 'Pug in a blanket' },
    { src: 'https://picsum.photos/id/1039/1200/800', alt: 'Waterfall valley' },
  ];

  protected openSheet(side: NgxsmkSheetSide): void {
    this.sheetSide.set(side);
    this.sheetOpen.set(true);
  }

  protected onContextMenu(event: MouseEvent, menu: NgxsmkContextMenu): void {
    event.preventDefault();
    menu.show(event.clientX, event.clientY);
  }

  protected onDeleted(): void {
    this.dialogOpen.set(false);
    this.setAction('File deleted');
  }

  protected setAction(action: string): void {
    this.lastAction.set(action);
  }

  protected openImperative(): void {
    this.imperativeDialog.open(
      'Imperative dialog',
      'This dialog was opened through the NgxsmkImperativeDialog service.',
    );
    this.imperativeStatus.set('Dialog opened imperatively');
  }

  protected async openImperativeAlert(): Promise<void> {
    const confirmed = await this.imperativeAlert.confirm('Discard your unsaved changes?');
    this.alertStatus.set(confirmed ? 'Confirmed: changes discarded' : 'Cancelled: kept changes');
  }

  protected readonly codeDialog = `<button ngxsmk-button (click)="open.set(true)">Open dialog</button>

<ngxsmk-dialog [(open)]="open" title="Delete file?">
  This action cannot be undone.
  <div ngxsmkDialogFooter>
    <button ngxsmk-button variant="outline" (click)="open.set(false)">Cancel</button>
    <button ngxsmk-button variant="destructive" (click)="delete()">Delete</button>
  </div>
</ngxsmk-dialog>`;

  protected readonly codeAlertDialog = `<button ngxsmk-button (click)="open.set(true)">Delete</button>

<ngxsmk-alert-dialog
  [(open)]="open"
  title="Delete project?"
  message="This cannot be undone."
  confirmLabel="Delete"
  variant="destructive"
  (confirmed)="onConfirm()"
  (cancelled)="onCancel()"
/>`;

  protected readonly codeTooltip = `<button ngxsmk-button [ngxsmkTooltip]="'Delete permanently'" tooltipPosition="top">
  Delete
</button>`;

  protected readonly codeHoverCard = `<ngxsmk-hover-card>
  <button ngxsmkHoverCardTrigger ngxsmk-button variant="ghost">@ada_lovelace</button>
  <div>
    <strong>Ada Lovelace</strong>
    <span>First computer programmer.</span>
  </div>
</ngxsmk-hover-card>`;

  protected readonly codeSheet = `<button ngxsmk-button (click)="open.set(true)">Open</button>

<ngxsmk-sheet [(open)]="open" side="right" title="Settings">
  Panel content goes here.
</ngxsmk-sheet>`;

  protected readonly codeDropdown = `<ngxsmk-dropdown-menu [items]="items">
  <button ngxsmkDropdownTrigger ngxsmk-button variant="outline">Actions &#9662;</button>
</ngxsmk-dropdown-menu>

items = [
  { label: 'Edit', action: () => edit() },
  { label: 'Delete', action: () => remove() },
];`;

  protected readonly codeContextMenu = `<div (contextmenu)="onContextMenu($event, cm)">
  Right-click here
  <ngxsmk-context-menu #cm [items]="items" />
</div>

onContextMenu(e: MouseEvent, cm: NgxsmkContextMenu) {
  e.preventDefault();
  cm.show(e.clientX, e.clientY);
}`;

  protected readonly codeLightbox = `<ngxsmk-lightbox [images]="images" [(open)]="open">
  <ngxsmk-thumbnail [src]="images[0].src" alt="Preview" size="lg" />
</ngxsmk-lightbox>`;

  protected readonly codeImperativeDialog = `import { inject } from '@angular/core';

dialog = inject(NgxsmkImperativeDialog);

open() {
  this.dialog.open('Title', 'Body content');
}`;

  protected readonly codeImperativeAlertDialog = `import { inject } from '@angular/core';

alert = inject(NgxsmkImperativeAlertDialog);

async confirm() {
  const ok = await this.alert.confirm('Discard changes?');
  // ok is a boolean
}`;

  protected readonly codeCommandPalette = `<button ngxsmk-button (click)="palette.open()">Open Palette</button>

<ngxsmk-command-palette
  #palette
  [commands]="commandsList"
  (selected)="onCommandSelected($event)"
/>`;
}
