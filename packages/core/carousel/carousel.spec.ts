import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkCarousel, NgxsmkCarouselSlide } from './carousel';

@Component({
  standalone: true,
  imports: [NgxsmkCarousel, NgxsmkCarouselSlide],
  template: `
    <ngxsmk-carousel
      [autoplay]="autoplay()"
      [loop]="loop()"
      [showControls]="showControls()"
      [showIndicators]="showIndicators()"
    >
      <ngxsmk-carousel-slide>Slide 1</ngxsmk-carousel-slide>
      <ngxsmk-carousel-slide>Slide 2</ngxsmk-carousel-slide>
    </ngxsmk-carousel>
  `,
})
class HostComponent {
  readonly autoplay = signal(false);
  readonly loop = signal(true);
  readonly showControls = signal(true);
  readonly showIndicators = signal(true);
}

describe('NgxsmkCarousel', () => {
  it('renders viewport, slides, indicators and controls', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const track = fixture.nativeElement.querySelector('.ngxsmk-carousel__track');
    expect(track).toBeTruthy();

    const slides = fixture.nativeElement.querySelectorAll('ngxsmk-carousel-slide');
    expect(slides.length).toBe(2);

    const prevBtn = fixture.nativeElement.querySelector('.ngxsmk-carousel__btn--prev');
    const nextBtn = fixture.nativeElement.querySelector('.ngxsmk-carousel__btn--next');
    expect(prevBtn).toBeTruthy();
    expect(nextBtn).toBeTruthy();

    const indicators = fixture.nativeElement.querySelectorAll(
      '.ngxsmk-carousel__indicators button',
    );
    expect(indicators.length).toBe(2);
  });

  it('cycles slides on next/prev click', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const nextBtn = fixture.nativeElement.querySelector(
      '.ngxsmk-carousel__btn--next',
    ) as HTMLButtonElement;
    const prevBtn = fixture.nativeElement.querySelector(
      '.ngxsmk-carousel__btn--prev',
    ) as HTMLButtonElement;

    const componentInstance = fixture.debugElement.query(
      (el) => el.componentInstance instanceof NgxsmkCarousel,
    ).componentInstance as NgxsmkCarousel;

    expect(componentInstance.activeIndex()).toBe(0);

    nextBtn.click();
    fixture.detectChanges();
    expect(componentInstance.activeIndex()).toBe(1);

    prevBtn.click();
    fixture.detectChanges();
    expect(componentInstance.activeIndex()).toBe(0);
  });
});
