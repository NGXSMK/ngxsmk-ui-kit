import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  effect,
  inject,
  input,
  viewChild,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartHover, ChartTheme, RGBA, easeOutCubic, resolveTheme, rgba } from './chart-engine';

export interface YTick {
  y: number;
  label?: string;
}
export interface XTick {
  x: number;
  label?: string;
}

@Directive({ standalone: true })
export abstract class AbstractCanvasChart implements AfterViewInit, OnDestroy {
  protected readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  protected readonly tooltipRef = viewChild.required<ElementRef<HTMLDivElement>>('tooltip');
  protected readonly hostRef = inject(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  readonly width = input(400);
  readonly height = input(200);
  readonly responsive = input(true);
  readonly ariaLabel = input('Data chart');

  protected get drawWidth(): number {
    return this.responsive() && this.measured.w ? this.measured.w : this.width();
  }
  protected get drawHeight(): number {
    return this.height();
  }

  protected ctx!: CanvasRenderingContext2D;
  protected theme!: ChartTheme;
  protected W = 0;
  protected H = 0;
  protected dpr = 1;
  protected plot = { x: 0, y: 0, w: 0, h: 0 };
  protected progress = 1;
  protected hover: ChartHover | null = null;
  protected mouse = { x: 0, y: 0 };
  protected measured = { w: 0, h: 0 };
  private ready = false;
  private rafId = 0;
  private destroyed = false;
  private ro?: ResizeObserver;
  private readonly padL = 44;
  private readonly padR = 16;
  private readonly padT = 14;
  private readonly padB = 30;

  constructor() {
    effect(() => {
      this.width();
      this.height();
      this.responsive();
      if (isPlatformBrowser(this.platformId) && this.ready) {
        this.resize();
        this.animate();
      }
    });
  }

  protected requestRender(animate = true): void {
    if (!this.ready) return;
    if (animate) this.animate();
    else this.paint(1);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.addEventListener('mousemove', this.onMove);
    canvas.addEventListener('mouseleave', this.onLeave);
    this.ready = true;
    if (this.responsive() && typeof ResizeObserver !== 'undefined') {
      (this.hostRef.nativeElement as HTMLElement).style.width = '100%';
      this.measure();
      this.ro = new ResizeObserver(() => this.onResize());
      this.ro.observe(this.hostRef.nativeElement as HTMLElement);
    }
    this.zone.runOutsideAngular(() => {
      this.resize();
      this.animate();
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    cancelAnimationFrame(this.rafId);
    this.ro?.disconnect();
    const canvas = this.canvasRef()?.nativeElement;
    canvas?.removeEventListener('mousemove', this.onMove);
    canvas?.removeEventListener('mouseleave', this.onLeave);
  }

  private measure(): void {
    const host = this.hostRef.nativeElement as HTMLElement;
    this.measured.w = Math.max(1, host.clientWidth || this.width());
  }

  private onResize(): void {
    this.measure();
    if (!this.ready) return;
    this.resize();
    this.paint(this.progress);
  }

  private resize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.canvasRef().nativeElement;
    this.dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    this.W = this.drawWidth;
    this.H = this.drawHeight;
    canvas.width = Math.max(1, Math.round(this.W * this.dpr));
    canvas.height = Math.max(1, Math.round(this.H * this.dpr));
    canvas.style.width = `${this.W}px`;
    canvas.style.height = `${this.H}px`;
    this.theme = resolveTheme(this.hostRef.nativeElement as HTMLElement);
    this.plot = {
      x: this.padL,
      y: this.padT,
      w: Math.max(1, this.W - this.padL - this.padR),
      h: Math.max(1, this.H - this.padT - this.padB),
    };
  }

  private animate(): void {
    cancelAnimationFrame(this.rafId);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduce) {
      this.paint(1);
      return;
    }
    const start = performance.now();
    const dur = 650;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      this.paint(easeOutCubic(t));
      if (t < 1 && !this.destroyed) this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  private paint(progress: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.W, this.H);
    this.progress = progress;
    this.draw(progress);
  }

  protected abstract draw(progress: number): void;
  protected abstract hitTest(x: number, y: number): ChartHover | null;

  protected get font(): string {
    return `11px ${this.theme.font}`;
  }

  protected line(x1: number, y1: number, x2: number, y2: number, color: string, width = 1): void {
    const ctx = this.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  protected drawCartesianGrid(yTicks: YTick[], xTicks: XTick[] = []): void {
    const ctx = this.ctx;
    const t = this.theme;
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(t.outline, 0.55);
    ctx.beginPath();
    for (const tk of yTicks) {
      ctx.moveTo(this.plot.x, Math.round(tk.y) + 0.5);
      ctx.lineTo(this.plot.x + this.plot.w, Math.round(tk.y) + 0.5);
    }
    for (const tk of xTicks) {
      ctx.moveTo(Math.round(tk.x) + 0.5, this.plot.y);
      ctx.lineTo(Math.round(tk.x) + 0.5, this.plot.y + this.plot.h);
    }
    ctx.stroke();

    ctx.fillStyle = rgba(t.onSurfaceVariant, 1);
    ctx.font = this.font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    for (const tk of yTicks) {
      if (tk.label != null) ctx.fillText(tk.label, this.plot.x - 8, tk.y);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (const tk of xTicks) {
      if (tk.label != null) ctx.fillText(tk.label, tk.x, this.plot.y + this.plot.h + 8);
    }
  }

  protected drawLegend(items: { color: string; label: string }[], y = this.plot.y - 2): void {
    const ctx = this.ctx;
    const t = this.theme;
    ctx.font = `12px ${t.font}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    let x = this.plot.x;
    const gap = 18;
    for (const it of items) {
      ctx.fillStyle = it.color;
      ctx.fillRect(x, y - 5, 10, 10);
      ctx.fillStyle = rgba(t.onSurfaceVariant, 1);
      ctx.fillText(it.label, x + 14, y);
      x += 14 + ctx.measureText(it.label).width + gap;
    }
  }

  protected colorVar(value: string, fallback: RGBA): RGBA {
    if (value.startsWith('var(')) {
      const name = value.slice(4, -1).trim();
      const raw = getComputedStyle(this.hostRef.nativeElement as HTMLElement)
        .getPropertyValue(name)
        .trim();
      return raw ? parse(raw) : fallback;
    }
    return parse(value);
  }

  private onMove = (e: MouseEvent): void => {
    const canvas = this.canvasRef().nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.mouse = { x, y };
    this.hover = this.hitTest(x, y);
    this.updateTooltip();
  };

  private onLeave = (): void => {
    this.hover = null;
    this.updateTooltip();
  };

  private updateTooltip(): void {
    const tip = this.tooltipRef()?.nativeElement as HTMLDivElement | undefined;
    if (!tip) return;
    if (!this.hover) {
      tip.style.opacity = '0';
      return;
    }
    tip.replaceChildren();
    if (this.hover.title) {
      const title = document.createElement('div');
      title.className = 'ngxsmk-chart-tip__title';
      if (this.hover.color) {
        const dot = document.createElement('span');
        dot.className = 'ngxsmk-chart-tip__dot';
        dot.style.background = this.hover.color;
        title.appendChild(dot);
      }
      const label = document.createElement('span');
      label.textContent = this.hover.title;
      title.appendChild(label);
      tip.appendChild(title);
    }
    for (const line of this.hover.lines) {
      const l = document.createElement('div');
      l.className = 'ngxsmk-chart-tip__line';
      l.textContent = line;
      tip.appendChild(l);
    }
    tip.style.opacity = '1';
    const pad = 12;
    let left = this.mouse.x + pad;
    let top = this.mouse.y + pad;
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    if (left + tw > this.W) left = this.mouse.x - pad - tw;
    if (top + th > this.H) top = this.mouse.y - pad - th;
    tip.style.transform = `translate(${left}px, ${top}px)`;
  }
}

function parse(input: string): RGBA {
  const s = (input || '').trim();
  if (s.startsWith('#')) {
    let hex = s.slice(1);
    if (hex.length === 3)
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    const num = parseInt(hex, 16);
    if (Number.isNaN(num)) return { r: 148, g: 163, b: 184, a: 1 };
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 1 };
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { r: p[0] || 0, g: p[1] || 0, b: p[2] || 0, a: p[3] ?? 1 };
  }
  return { r: 148, g: 163, b: 184, a: 1 };
}
