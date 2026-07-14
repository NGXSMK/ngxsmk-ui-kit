import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkList } from './list';
import { NgxsmkListItem } from '@ngxsmk/core/list-item';

@Component({
  standalone: true,
  imports: [NgxsmkList, NgxsmkListItem],
  template: `
    <ngxsmk-list [divided]="true">
      <ngxsmk-list-item variant="active">Inbox</ngxsmk-list-item>
      <ngxsmk-list-item href="/starred">Starred</ngxsmk-list-item>
    </ngxsmk-list>
  `,
})
class HostComponent {}

describe('NgxsmkList', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('ngxsmk-list');
    const items = fixture.nativeElement.querySelectorAll('ngxsmk-list-item');
    return { fixture, list, items };
  }

  it('renders all list items and assigns classes and attributes', () => {
    const { list, items } = setup();
    expect(list).toBeTruthy();
    expect(list.getAttribute('data-divided')).toBe('');
    expect(items.length).toBe(2);

    expect(items[0].getAttribute('data-variant')).toBe('active');
    expect(items[1].querySelector('a').getAttribute('href')).toBe('/starred');
  });
});
