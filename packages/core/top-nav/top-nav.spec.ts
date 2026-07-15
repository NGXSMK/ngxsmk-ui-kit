import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  NgxsmkTopNav,
  NgxsmkTopNavMegaMenu,
  NgxsmkTopNavMegaMenuItem,
  NgxsmkTopNavMegaMenuFeaturedCard,
} from './top-nav';

@Component({
  standalone: true,
  imports: [
    NgxsmkTopNav,
    NgxsmkTopNavMegaMenu,
    NgxsmkTopNavMegaMenuItem,
    NgxsmkTopNavMegaMenuFeaturedCard,
  ],
  template: `
    <ngxsmk-top-nav>
      <ngxsmk-top-nav-mega-menu [featured]="true">
        Products Trigger
        <div mega-column id="col1">
          <ngxsmk-top-nav-mega-menu-item title="Item 1" description="Desc 1" href="/item1" />
        </div>
        <ngxsmk-top-nav-mega-menu-featured-card mega-featured href="/feat" id="featCard">
          Featured Card Content
        </ngxsmk-top-nav-mega-menu-featured-card>
      </ngxsmk-top-nav-mega-menu>
    </ngxsmk-top-nav>
  `,
})
class HostComponent {}

describe('NgxsmkTopNavMegaMenu', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const megaMenu = fixture.nativeElement.querySelector('ngxsmk-top-nav-mega-menu');
    const dropdown = fixture.nativeElement.querySelector('.ngxsmk-top-nav-mega-menu__dropdown');
    const colElement = fixture.nativeElement.querySelector('#col1');
    const featElement = fixture.nativeElement.querySelector('#featCard');
    return { fixture, megaMenu, dropdown, colElement, featElement };
  }

  it('renders trigger text directly inside mega-menu host', () => {
    const { megaMenu } = setup();
    expect(megaMenu.textContent).toContain('Products Trigger');
  });

  it('projects columns and featured cards correctly inside the dropdown', () => {
    const { dropdown, colElement, featElement } = setup();
    expect(dropdown).toBeTruthy();

    // Check if column is projected inside the grid container
    const grid = dropdown.querySelector('.ngxsmk-top-nav-mega-menu__grid');
    expect(grid).toBeTruthy();
    expect(grid.contains(colElement)).toBe(true);

    // Check if featured card is projected inside the featured container
    const featured = dropdown.querySelector('.ngxsmk-top-nav-mega-menu__featured');
    expect(featured).toBeTruthy();
    expect(featured.contains(featElement)).toBe(true);
  });
});
