import { NgxsmkDialog, NgxsmkDialogFooter } from '@ngxsmk/core/dialog';
import { NgxsmkAlertDialog } from '@ngxsmk/core/alert-dialog';
import { NgxsmkTooltip } from '@ngxsmk/core/tooltip';
import { NgxsmkHoverCard } from '@ngxsmk/core/hover-card';
import { NgxsmkSheet, NgxsmkSheetSide } from '@ngxsmk/core/sheet';
import { NgxsmkDropdownMenu, NgxsmkDropdownMenuItem } from '@ngxsmk/core/dropdown-menu';
import { NgxsmkContextMenu, NgxsmkContextMenuItem } from '@ngxsmk/core/context-menu';
import { NgxsmkLightbox, NgxsmkLightboxImage } from '@ngxsmk/core/lightbox';
import { NgxsmkThumbnail } from '@ngxsmk/core/thumbnail';
import { NgxsmkImperativeDialog, NgxsmkImperativeAlertDialog } from '@ngxsmk/core/imperative-dialog';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkCommandPalette, CommandItem } from '@ngxsmk/core/command-palette';
import { NgxsmkThemeService } from '@ngxsmk/theme';
import { Component, signal, inject } from '@angular/core';
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
  ],
  template: `
    <h2 class="ngxsmk-page-title">Overlay</h2>
    <p class="ngxsmk-page-desc">
      Dialogs, tooltips, menus, and floating panels. Overlays render above the
      page, trap focus where appropriate, and respect Escape and backdrop
      dismissal — all wired through signals for predictable open state.
    </p>

    <showcase-example
      title="Dialog"
      description="Modal dialog on the native <dialog> element with a title, body, and footer actions. Two-way bound open state."
      [code]="codeDialog"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button (click)="dialogOpen.set(true)">Open dialog</button>
      </div>

      <ngxsmk-dialog [(open)]="dialogOpen" title="Delete file?">
        This action cannot be undone. The file will be permanently removed from
        your workspace.
        <div ngxsmkDialogFooter>
          <button ngxsmk-button variant="outline" (click)="dialogOpen.set(false)">Cancel</button>
          <button ngxsmk-button variant="destructive" (click)="onDeleted()">Delete</button>
        </div>
      </ngxsmk-dialog>
    </showcase-example>

    <showcase-example
      title="Alert Dialog"
      description="A focused confirmation prompt with confirm/cancel actions and info or destructive variants."
      [code]="codeAlertDialog"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button variant="outline" (click)="infoAlertOpen.set(true)">Info alert</button>
        <button ngxsmk-button variant="destructive" (click)="destructiveAlertOpen.set(true)">Destructive alert</button>
      </div>

      <ngxsmk-alert-dialog
        [(open)]="infoAlertOpen"
        title="Save changes?"
        message="Your edits will be applied to the shared document."
        confirmLabel="Save"
        variant="info"
        (confirmed)="setAction('Alert confirmed')"
        (cancelled)="setAction('Alert cancelled')"
      />

      <ngxsmk-alert-dialog
        [(open)]="destructiveAlertOpen"
        title="Delete project?"
        message="This will permanently remove the project and all of its data."
        confirmLabel="Delete"
        variant="destructive"
        (confirmed)="setAction('Project deleted')"
        (cancelled)="setAction('Delete cancelled')"
      />

      @if (lastAction()) {
        <p class="ngxsmk-demo-hint">Last action: {{ lastAction() }}</p>
      }
    </showcase-example>

    <showcase-example
      title="Tooltip"
      description="A directive that shows a short hint on hover or focus. Position it on any side of the trigger."
      [code]="codeTooltip"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button variant="outline" [ngxsmkTooltip]="'Appears above'" tooltipPosition="top">Top</button>
        <button ngxsmk-button variant="outline" [ngxsmkTooltip]="'Appears below'" tooltipPosition="bottom">Bottom</button>
        <button ngxsmk-button variant="outline" [ngxsmkTooltip]="'Appears to the left'" tooltipPosition="left">Left</button>
        <button ngxsmk-button variant="outline" [ngxsmkTooltip]="'Appears to the right'" tooltipPosition="right">Right</button>
      </div>
    </showcase-example>

    <showcase-example
      title="Hover Card"
      description="A rich popover that opens on hover or focus of its trigger — ideal for profile and link previews."
      [code]="codeHoverCard"
    >
      <ngxsmk-hover-card>
        <button ngxsmkHoverCardTrigger ngxsmk-button variant="ghost">&#64;ada_lovelace</button>
        <div class="ngxsmk-demo-stack">
          <strong>Ada Lovelace</strong>
          <span class="ngxsmk-demo-hint">First computer programmer. Writes about analytical engines and algorithms.</span>
        </div>
      </ngxsmk-hover-card>
    </showcase-example>

    <showcase-example
      title="Sheet"
      description="A panel that slides in from the left, right, or bottom edge. Great for filters, details, and navigation."
      [code]="codeSheet"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button variant="outline" (click)="openSheet('left')">Open left</button>
        <button ngxsmk-button variant="outline" (click)="openSheet('right')">Open right</button>
        <button ngxsmk-button variant="outline" (click)="openSheet('bottom')">Open bottom</button>
      </div>

      <ngxsmk-sheet [(open)]="sheetOpen" [side]="sheetSide()" title="Settings">
        <div class="ngxsmk-demo-stack">
          <p>This panel slides in from the <strong>{{ sheetSide() }}</strong> edge.</p>
          <p class="ngxsmk-demo-hint">Click the backdrop or the close button to dismiss.</p>
          <button ngxsmk-button (click)="sheetOpen.set(false)">Done</button>
        </div>
      </ngxsmk-sheet>
    </showcase-example>

    <showcase-example
      title="Dropdown Menu"
      description="An actions menu anchored to a trigger button. Closes on selection, outside click, or Escape."
      [code]="codeDropdown"
    >
      <ngxsmk-dropdown-menu [items]="menuItems">
        <button ngxsmkDropdownTrigger ngxsmk-button variant="outline">Actions &#9662;</button>
      </ngxsmk-dropdown-menu>

      @if (lastAction()) {
        <p class="ngxsmk-demo-hint">Last action: {{ lastAction() }}</p>
      }
    </showcase-example>

    <showcase-example
      title="Context Menu"
      description="A menu that opens at the pointer on right-click. Wire it to any surface via its show() method."
      [code]="codeContextMenu"
    >
      <div
        class="ngxsmk-sc-surface"
        style="width:100%;padding:2rem;text-align:center;cursor:context-menu"
        (contextmenu)="onContextMenu($event, cm)"
      >
        Right-click anywhere in this area
        <ngxsmk-context-menu #cm [items]="menuItems" />
      </div>
    </showcase-example>

    <showcase-example
      title="Lightbox"
      description="A full-screen image viewer with keyboard navigation. Click a thumbnail to open, or drive it via open state."
      [code]="codeLightbox"
    >
      <ngxsmk-lightbox [images]="galleryImages" [(open)]="lightboxOpen">
        <div class="ngxsmk-demo-row">
          @for (image of galleryImages; track image.src) {
            <ngxsmk-thumbnail [src]="image.src" [alt]="image.alt ?? ''" size="lg" shape="square" />
          }
        </div>
      </ngxsmk-lightbox>

      <div class="ngxsmk-demo-row">
        <button ngxsmk-button variant="outline" (click)="lightboxOpen.set(true)">Open gallery</button>
      </div>
    </showcase-example>

    <showcase-example
      title="Imperative Dialog"
      description="An injectable service that opens a native <dialog> programmatically — no template binding required."
      [code]="codeImperativeDialog"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button (click)="openImperative()">Open imperatively</button>
      </div>

      @if (imperativeStatus()) {
        <p class="ngxsmk-demo-hint">{{ imperativeStatus() }}</p>
      }
    </showcase-example>

    <showcase-example
      title="Imperative Alert Dialog"
      description="An injectable service that resolves a Promise<boolean> from a confirm prompt — great for quick inline confirmations."
      [code]="codeImperativeAlertDialog"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button variant="destructive" (click)="openImperativeAlert()">Confirm imperatively</button>
      </div>

      @if (alertStatus()) {
        <p class="ngxsmk-demo-hint">{{ alertStatus() }}</p>
      }
    </showcase-example>

    <showcase-example
      title="Spotlight Command Palette (New)"
      description="A premium, keyboard-accessible command menu. Open it by clicking the button below or pressing Ctrl + K (or Cmd + K)."
      [code]="codeCommandPalette"
    >
      <div class="ngxsmk-demo-row">
        <button ngxsmk-button (click)="palette.open()">Open Palette (Ctrl + K)</button>
      </div>

      <ngxsmk-command-palette
        #palette
        [commands]="commandsList"
        (selected)="onCommandSelected($event)"
      />

      @if (lastCommand()) {
        <p class="ngxsmk-demo-hint">Executed: <strong>{{ lastCommand() }}</strong></p>
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
  private readonly imperativeDialog = inject(NgxsmkImperativeDialog);
  private readonly imperativeAlert = inject(NgxsmkImperativeAlertDialog);
  private readonly themeService = inject(NgxsmkThemeService);

  protected readonly lastCommand = signal('');
  protected readonly commandsList: CommandItem[] = [
    { id: 'home', label: 'Go to Home Page', category: 'Navigation', shortcut: 'G H', icon: '🏠' },
    { id: 'docs', label: 'Go to Documentation', category: 'Navigation', shortcut: 'G D', icon: '📖' },
    { id: 'theme-light', label: 'Set Theme: Light Mode', category: 'Appearance', icon: '☀️' },
    { id: 'theme-dark', label: 'Set Theme: Dark Mode', category: 'Appearance', icon: '🌙' },
    { id: 'copy-npm', label: 'Copy npm Install Command', category: 'Actions', shortcut: '⌥ C', icon: '📋' },
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
      'This dialog was opened through the NgxsmkImperativeDialog service.'
    );
    this.imperativeStatus.set('Dialog opened imperatively');
  }

  protected async openImperativeAlert(): Promise<void> {
    const confirmed = await this.imperativeAlert.confirm(
      'Discard your unsaved changes?'
    );
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
