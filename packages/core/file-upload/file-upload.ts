import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CvaBase } from '@ngxsmk/cdk/cva-base';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  sizeFormatted: string;
}

/**
 * Signal-native drag-and-drop file upload component with format filter, size validation, and file list queue.
 *
 * ```html
 * <ngxsmk-file-upload accept="image/*" [maxSizeMb]="5" (filesSelected)="onUpload($event)" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-file-upload',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkFileUpload),
      multi: true,
    },
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkFileUpload),
    },
  ],
  host: {
    class: 'ngxsmk-file-upload',
    '[class.ngxsmk-file-upload--disabled]': 'disabled()',
    '[class.ngxsmk-file-upload--dragging]': 'isDragging()',
  },
  template: `
    <div class="ngxsmk-file-upload__container">
      <!-- Dropzone Area -->
      <div
        class="ngxsmk-file-upload__dropzone"
        role="button"
        tabindex="0"
        [attr.aria-label]="ariaLabel()"
        (click)="triggerFileInput()"
        (keydown.enter)="triggerFileInput()"
        (keydown.space)="triggerFileInput()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <input
          #fileInput
          type="file"
          class="ngxsmk-file-upload__hidden-input"
          [accept]="accept()"
          [multiple]="multiple()"
          [disabled]="disabled()"
          (change)="onFileInputChange($event)"
        />

        <div class="ngxsmk-file-upload__icon" aria-hidden="true">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>

        <div class="ngxsmk-file-upload__text">
          <span class="ngxsmk-file-upload__primary-text">
            <strong class="ngxsmk-file-upload__link">Click to upload</strong> or drag and drop
          </span>
          <span class="ngxsmk-file-upload__sub-text">
            {{ accept() ? accept() : 'Any file' }} (max {{ maxSizeMb() }}MB)
          </span>
        </div>
      </div>

      <!-- File Queue List -->
      @if (fileList().length > 0) {
        <div class="ngxsmk-file-upload__queue" role="list" aria-label="Uploaded files">
          @for (item of fileList(); track item.id) {
            <div class="ngxsmk-file-upload__item" role="listitem">
              <div class="ngxsmk-file-upload__item-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                  ></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div class="ngxsmk-file-upload__item-info">
                <span class="ngxsmk-file-upload__item-name">{{ item.name }}</span>
                <span class="ngxsmk-file-upload__item-size">{{ item.sizeFormatted }}</span>
              </div>
              <button
                type="button"
                class="ngxsmk-file-upload__remove-btn"
                [attr.aria-label]="'Remove ' + item.name"
                [disabled]="disabled()"
                (click)="removeFile(item, $event)"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans, system-ui, sans-serif);
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
    }

    .ngxsmk-file-upload__container {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-3, 0.75rem);
      width: 100%;
    }

    .ngxsmk-file-upload__dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--ngxsmk-space-3, 0.75rem);
      padding: var(--ngxsmk-space-8, 2rem) var(--ngxsmk-space-6, 1.5rem);
      border: 2px dashed var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl, 0.75rem);
      background: var(--ngxsmk-color-surface);
      cursor: pointer;
      text-align: center;
      transition:
        border-color var(--ngxsmk-duration-normal, 200ms) ease,
        background-color var(--ngxsmk-duration-normal, 200ms) ease;
    }

    .ngxsmk-file-upload__dropzone:hover,
    :host(.ngxsmk-file-upload--dragging) .ngxsmk-file-upload__dropzone {
      border-color: var(--ngxsmk-color-primary);
      background: color-mix(
        in srgb,
        var(--ngxsmk-color-primary) 4%,
        var(--ngxsmk-color-surface)
      );
    }

    .ngxsmk-file-upload__dropzone:focus-visible {
      outline: 2px solid var(--ngxsmk-color-primary);
      outline-offset: 2px;
    }

    .ngxsmk-file-upload__hidden-input {
      display: none;
    }

    .ngxsmk-file-upload__icon {
      color: var(--ngxsmk-color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ngxsmk-file-upload__text {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .ngxsmk-file-upload__primary-text {
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-file-upload__link {
      color: var(--ngxsmk-color-primary);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
    }

    .ngxsmk-file-upload__sub-text {
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-file-upload__queue {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2, 0.5rem);
    }

    .ngxsmk-file-upload__item {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3, 0.75rem);
      padding: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface);
    }

    .ngxsmk-file-upload__item-icon {
      color: var(--ngxsmk-color-on-surface-variant);
      flex-shrink: 0;
    }

    .ngxsmk-file-upload__item-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .ngxsmk-file-upload__item-name {
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      color: var(--ngxsmk-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ngxsmk-file-upload__item-size {
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-file-upload__remove-btn {
      background: none;
      border: none;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        color 0.15s ease,
        background-color 0.15s ease;
    }

    .ngxsmk-file-upload__remove-btn:hover {
      color: var(--ngxsmk-color-error);
      background: color-mix(in srgb, var(--ngxsmk-color-error) 10%, transparent);
    }

    :host(.ngxsmk-file-upload--disabled) {
      opacity: 0.5;
      pointer-events: none;
    }
  `,
})
export class NgxsmkFileUpload extends CvaBase<File[]> implements NgxsmkFormFieldControl {
  readonly accept = input<string>('');
  readonly maxSizeMb = input<number>(10);
  readonly multiple = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('File upload dropzone');

  readonly filesSelected = output<File[]>();
  readonly fileRemoved = output<File>();

  readonly id = input(ngxsmkUniqueId('ngxsmk-file-upload'));
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  protected readonly isDragging = signal(false);
  protected readonly fileList = signal<UploadedFileItem[]>([]);

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  writeValue(value: unknown): void {
    if (Array.isArray(value)) {
      const items: UploadedFileItem[] = value.map((f: File) => ({
        id: ngxsmkUniqueId('file-'),
        file: f,
        name: f.name,
        sizeFormatted: this.formatBytes(f.size),
      }));
      this.fileList.set(items);
    }
  }

  protected triggerFileInput(): void {
    if (this.disabled()) return;
    const inputEl = document.querySelector<HTMLInputElement>(`#${this.id()} input[type="file"]`);
    inputEl?.click();
  }

  protected onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(Array.from(input.files));
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled()) {
      this.isDragging.set(true);
    }
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    if (this.disabled()) return;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  protected removeFile(item: UploadedFileItem, event: Event): void {
    event.stopPropagation();
    const updated = this.fileList().filter((f) => f.id !== item.id);
    this.fileList.set(updated);
    const rawFiles = updated.map((f) => f.file);
    this.emitChange(rawFiles);
    this.emitTouched();
    this.fileRemoved.emit(item.file);
  }

  private handleFiles(files: File[]): void {
    const maxBytes = this.maxSizeMb() * 1024 * 1024;
    const validFiles = files.filter((f) => f.size <= maxBytes);

    const newItems: UploadedFileItem[] = validFiles.map((f) => ({
      id: ngxsmkUniqueId('file-'),
      file: f,
      name: f.name,
      sizeFormatted: this.formatBytes(f.size),
    }));

    const current = this.multiple() ? [...this.fileList(), ...newItems] : newItems;
    this.fileList.set(current);

    const rawFiles = current.map((f) => f.file);
    this.emitChange(rawFiles);
    this.emitTouched();
    this.filesSelected.emit(rawFiles);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
