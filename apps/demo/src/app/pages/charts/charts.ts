import { NgxsmkBarChart } from '@ngxsmk/core/chart-bar';
import { NgxsmkPieChart } from '@ngxsmk/core/chart-pie';
import { NgxsmkAreaChart } from '@ngxsmk/core/chart-area';
import { NgxsmkScatterChart } from '@ngxsmk/core/chart-scatter';
import { NgxsmkCandlestickChart } from '@ngxsmk/core/chart-candlestick';
import { NgxsmkHeatmapChart } from '@ngxsmk/core/chart-heatmap';
import { NgxsmkChartDashboard } from '@ngxsmk/core/chart-dashboard';
import { NgxsmkLineChart } from '@ngxsmk/core/chart-line';
import { Component } from '@angular/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

@Component({
  selector: 'charts-page',
  standalone: true,
  imports: [
    ShowcaseExample,
    NgxsmkLineChart,
    NgxsmkBarChart,
    NgxsmkPieChart,
    NgxsmkAreaChart,
    NgxsmkScatterChart,
    NgxsmkCandlestickChart,
    NgxsmkHeatmapChart,
    NgxsmkChartDashboard,
  ],
  template: `
    <h2 class="ngxsmk-page-title">Charts</h2>
    <p class="ngxsmk-page-desc">
      A lightweight set of data-visualization primitives drawn with inline SVG.
      Every chart is theme-aware, responsive to its inputs, and drops straight
      into any layout without a charting dependency.
    </p>

    <showcase-example
      title="Line Chart"
      description="A continuous series rendered as a polyline. Great for trends over time."
      [code]="codeLine"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:260px;">
        <ngxsmk-chart-line [data]="revenue" [width]="480" [height]="240" color="var(--ngxsmk-color-primary)" />
      </div>
    </showcase-example>

    <showcase-example
      title="Bar Chart"
      description="Discrete values as columns. Useful for comparing categories at a glance."
      [code]="codeBar"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:260px;">
        <ngxsmk-chart-bar [data]="quarters" [width]="480" [height]="240" color="var(--ngxsmk-color-secondary)" />
      </div>
    </showcase-example>

    <showcase-example
      title="Pie Chart"
      description="Proportional slices of a single total, with an optional donut mode."
      [code]="codePie"
    >
      <div class="ngxsmk-sc-col ngxsmk-sc-wrap">
        <div class="ngxsmk-sc-surface" style="height:240px;">
          <ngxsmk-chart-pie [data]="traffic" [size]="200" />
        </div>
        <div class="ngxsmk-sc-surface" style="height:240px;">
          <ngxsmk-chart-pie [data]="traffic" [size]="200" [donut]="true" />
        </div>
      </div>
    </showcase-example>

    <showcase-example
      title="Area Chart"
      description="A line chart with a gradient fill under the curve to emphasize volume."
      [code]="codeArea"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:260px;">
        <ngxsmk-chart-area [data]="activeUsers" [width]="480" [height]="240" color="var(--ngxsmk-color-tertiary)" />
      </div>
    </showcase-example>

    <showcase-example
      title="Scatter Chart"
      description="Plot pairs of values to reveal correlation across two axes."
      [code]="codeScatter"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:260px;">
        <ngxsmk-chart-scatter [data]="correlation" [width]="480" [height]="240" />
      </div>
    </showcase-example>

    <showcase-example
      title="Candlestick Chart"
      description="Open/high/low/close candles for financial time series. Bullish candles are green, bearish red."
      [code]="codeCandle"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:260px;">
        <ngxsmk-chart-candlestick [data]="ohlc" [width]="480" [height]="240" />
      </div>
    </showcase-example>

    <showcase-example
      title="Heatmap"
      description="A matrix of cells colored by magnitude, with optional axis labels."
      [code]="codeHeat"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:300px;">
        <ngxsmk-chart-heatmap
          [data]="matrix"
          [labels]="heatLabels"
          [width]="480"
          [height]="280"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Dashboard"
      description="A responsive grid wrapper that arranges multiple charts into a panel."
      [code]="codeDashboard"
    >
      <ngxsmk-chart-dashboard [columns]="3" style="width:100%;">
        <div class="ngxsmk-sc-surface" style="height:200px;">
          <ngxsmk-chart-line [data]="revenue" [width]="300" [height]="180" />
        </div>
        <div class="ngxsmk-sc-surface" style="height:200px;">
          <ngxsmk-chart-bar [data]="quarters" [width]="300" [height]="180" />
        </div>
        <div class="ngxsmk-sc-surface" style="height:200px;">
          <ngxsmk-chart-pie [data]="traffic" [size]="180" />
        </div>
        <div class="ngxsmk-sc-surface" style="height:200px;">
          <ngxsmk-chart-area [data]="activeUsers" [width]="300" [height]="180" />
        </div>
        <div class="ngxsmk-sc-surface" style="height:200px;">
          <ngxsmk-chart-scatter [data]="correlation" [width]="300" [height]="180" />
        </div>
        <div class="ngxsmk-sc-surface" style="height:200px;">
          <ngxsmk-chart-candlestick [data]="ohlc" [width]="300" [height]="180" />
        </div>
      </ngxsmk-chart-dashboard>
    </showcase-example>
  `,
  styles: `
    :host { display: block; }
  `,
})
export class ChartsPage {
  protected readonly revenue = [
    { label: 'Jan', value: 42 },
    { label: 'Feb', value: 55 },
    { label: 'Mar', value: 48 },
    { label: 'Apr', value: 67 },
    { label: 'May', value: 73 },
    { label: 'Jun', value: 61 },
  ];

  protected readonly quarters = [
    { label: 'Q1', value: 145 },
    { label: 'Q2', value: 201 },
    { label: 'Q3', value: 178 },
    { label: 'Q4', value: 232 },
  ];

  protected readonly traffic = [
    { label: 'Organic', value: 420 },
    { label: 'Direct', value: 260 },
    { label: 'Referral', value: 180 },
    { label: 'Social', value: 140 },
  ];

  protected readonly activeUsers = [
    { label: 'Mon', value: 1200 },
    { label: 'Tue', value: 1580 },
    { label: 'Wed', value: 1340 },
    { label: 'Thu', value: 1820 },
    { label: 'Fri', value: 2100 },
    { label: 'Sat', value: 1760 },
    { label: 'Sun', value: 1490 },
  ];

  protected readonly correlation = [
    { x: 12, y: 18, label: 'A' },
    { x: 24, y: 31, label: 'B' },
    { x: 33, y: 28, label: 'C' },
    { x: 41, y: 45, label: 'D' },
    { x: 52, y: 49, label: 'E' },
    { x: 61, y: 66, label: 'F' },
    { x: 70, y: 72, label: 'G' },
    { x: 80, y: 81, label: 'H' },
  ];

  protected readonly ohlc = [
    { date: '2024-01-01', open: 120, high: 132, low: 116, close: 128 },
    { date: '2024-01-02', open: 128, high: 135, low: 124, close: 122 },
    { date: '2024-01-03', open: 122, high: 129, low: 118, close: 127 },
    { date: '2024-01-04', open: 127, high: 140, low: 125, close: 138 },
    { date: '2024-01-05', open: 138, high: 142, low: 130, close: 133 },
    { date: '2024-01-06', open: 133, high: 136, low: 119, close: 121 },
  ];

  protected readonly matrix = [
    [0.2, 0.5, 0.4, 0.8, 0.3, 0.6, 0.1],
    [0.6, 0.3, 0.9, 0.2, 0.7, 0.4, 0.5],
    [0.4, 0.8, 0.1, 0.5, 0.6, 0.9, 0.2],
    [0.7, 0.2, 0.6, 0.3, 0.4, 0.1, 0.8],
    [0.3, 0.9, 0.5, 0.7, 0.2, 0.6, 0.4],
  ];

  protected readonly heatLabels = {
    x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    y: ['W1', 'W2', 'W3', 'W4', 'W5'],
  };

  protected readonly codeLine = `<ngxsmk-chart-line [data]="revenue" [width]="480" [height]="240" />`;
  protected readonly codeBar = `<ngxsmk-chart-bar [data]="quarters" [width]="480" [height]="240" />`;
  protected readonly codePie = `<ngxsmk-chart-pie [data]="traffic" [size]="200" />\n<ngxsmk-chart-pie [data]="traffic" [size]="200" [donut]="true" />`;
  protected readonly codeArea = `<ngxsmk-chart-area [data]="activeUsers" [width]="480" [height]="240" />`;
  protected readonly codeScatter = `<ngxsmk-chart-scatter [data]="correlation" [width]="480" [height]="240" />`;
  protected readonly codeCandle = `<ngxsmk-chart-candlestick [data]="ohlc" [width]="480" [height]="240" />`;
  protected readonly codeHeat = `<ngxsmk-chart-heatmap [data]="matrix" [labels]="heatLabels" [width]="480" [height]="280" />`;
  protected readonly codeDashboard = `<ngxsmk-chart-dashboard [columns]="3">\n  <ngxsmk-chart-line [data]="revenue" [width]="300" [height]="180" />\n  <ngxsmk-chart-pie [data]="traffic" [size]="180" />\n</ngxsmk-chart-dashboard>`;
}
