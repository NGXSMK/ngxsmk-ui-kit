import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkTreeView, NgxsmkTreeNode } from './tree-view';

@Component({
  standalone: true,
  imports: [NgxsmkTreeView],
  template: `
    <ngxsmk-tree-view
      [nodes]="nodes()"
      [selectable]="selectable()"
      (nodeSelected)="selectedNode.set($event)"
    />
  `,
})
class HostComponent {
  readonly nodes = signal<NgxsmkTreeNode[]>([
    {
      id: 1,
      label: 'Root',
      children: [
        { id: 2, label: 'Child 1' },
        { id: 3, label: 'Child 2' },
      ],
    },
  ]);
  readonly selectable = signal<'none' | 'single' | 'multi'>('single');
  readonly selectedNode = signal<NgxsmkTreeNode | null>(null);
}

describe('NgxsmkTreeView', () => {
  it('renders root nodes correctly', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const rootLabel = fixture.nativeElement.querySelector('.ngxsmk-tree-node__label');
    expect(rootLabel).toBeTruthy();
    expect(rootLabel.textContent.trim()).toBe('Root');
  });

  it('toggles expand/collapse when toggle button is clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    let children = fixture.nativeElement.querySelectorAll('ngxsmk-tree-node');
    expect(children.length).toBe(1);

    const toggleBtn = fixture.nativeElement.querySelector('.ngxsmk-tree-node__toggle') as HTMLButtonElement;
    expect(toggleBtn).toBeTruthy();

    toggleBtn.click();
    fixture.detectChanges();

    children = fixture.nativeElement.querySelectorAll('ngxsmk-tree-node');
    expect(children.length).toBe(3);
  });
});
