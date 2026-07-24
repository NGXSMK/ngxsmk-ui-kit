import { NgxsmkBarChart } from '@ngxsmk/core/chart-bar';
import { NgxsmkPieChart } from '@ngxsmk/core/chart-pie';
import { NgxsmkAreaChart } from '@ngxsmk/core/chart-area';
import { NgxsmkScatterChart } from '@ngxsmk/core/chart-scatter';
import { NgxsmkCandlestickChart } from '@ngxsmk/core/chart-candlestick';
import { NgxsmkHeatmapChart } from '@ngxsmk/core/chart-heatmap';
import { NgxsmkChartDashboard } from '@ngxsmk/core/chart-dashboard';
import { NgxsmkLineChart } from '@ngxsmk/core/chart-line';
import { NgxsmkSparkline } from '@ngxsmk/core/sparkline';
import { NgxsmkGauge } from '@ngxsmk/core/gauge';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

@Component({
  selector: 'charts-page',
  standalone: true,
  imports: [
    TranslatePipe,
    ShowcaseExample,
    NgxsmkLineChart,
    NgxsmkBarChart,
    NgxsmkPieChart,
    NgxsmkAreaChart,
    NgxsmkScatterChart,
    NgxsmkCandlestickChart,
    NgxsmkHeatmapChart,
    NgxsmkChartDashboard,
    NgxsmkSparkline,
    NgxsmkGauge,
  ],
  template: `
    <h2 class="ngxsmk-page-title">{{ 'category.charts' | translate }}</h2>
    <p class="ngxsmk-page-desc">
      {{ 'charts.intro' | translate }}
    </p>

    <showcase-example
      title="Line Chart"
      [description]="'charts.lineChartDesc' | translate"
      [code]="codeLine"
      [component]="NgxsmkLineChart"
      [customize]="customizeNgxsmkLineChart"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:260px;">
        <ngxsmk-chart-line
          [data]="revenue"
          [width]="480"
          [height]="240"
          color="var(--ngxsmk-color-primary)"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Bar Chart"
      [description]="'charts.barChartDesc' | translate"
      [code]="codeBar"
      [component]="NgxsmkBarChart"
      [customize]="customizeNgxsmkBarChart"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:260px;">
        <ngxsmk-chart-bar
          [data]="quarters"
          [width]="480"
          [height]="240"
          color="var(--ngxsmk-color-secondary)"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Pie Chart"
      [description]="'charts.pieChartDesc' | translate"
      [code]="codePie"
      [component]="NgxsmkPieChart"
      [customize]="customizeNgxsmkPieChart"
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
      [description]="'charts.areaChartDesc' | translate"
      [code]="codeArea"
      [component]="NgxsmkAreaChart"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:260px;">
        <ngxsmk-chart-area
          [data]="activeUsers"
          [width]="480"
          [height]="240"
          color="var(--ngxsmk-color-tertiary)"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Scatter Chart"
      [description]="'charts.scatterChartDesc' | translate"
      [code]="codeScatter"
      [component]="NgxsmkScatterChart"
      [customize]="customizeNgxsmkScatterChart"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:260px;">
        <ngxsmk-chart-scatter [data]="correlation" [width]="480" [height]="240" />
      </div>
    </showcase-example>

    <showcase-example
      title="Candlestick Chart"
      [description]="'charts.candlestickChartDesc' | translate"
      [code]="codeCandle"
      [component]="NgxsmkCandlestickChart"
      [customize]="customizeNgxsmkCandlestickChart"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:260px;">
        <ngxsmk-chart-candlestick [data]="ohlc" [width]="480" [height]="240" />
      </div>
    </showcase-example>

    <showcase-example
      title="Heatmap"
      [description]="'charts.heatmapDesc' | translate"
      [code]="codeHeat"
      [component]="NgxsmkHeatmapChart"
      [customize]="customizeNgxsmkHeatmapChart"
    >
      <div class="ngxsmk-sc-surface" style="width:100%;max-width:520px;height:300px;">
        <ngxsmk-chart-heatmap [data]="matrix" [labels]="heatLabels" [width]="480" [height]="280" />
      </div>
    </showcase-example>

    <showcase-example
      title="Dashboard"
      [description]="'charts.dashboardDesc' | translate"
      [code]="codeDashboard"
      [component]="NgxsmkChartDashboard"
      [customize]="customizeNgxsmkChartDashboard"
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

    <showcase-example
      title="Sparkline"
      description="Inline SVG micro-charts for dashboard stat cards and compact metrics (line, area, bar variants)."
      [code]="codeSparkline"
      [component]="NgxsmkSparkline"
    >
      <div class="ngxsmk-sc-row ngxsmk-sc-wrap" style="gap:2rem;align-items:center;">
        <ngxsmk-sparkline [data]="[10, 25, 18, 40, 32, 55, 48, 65]" variant="line" />
        <ngxsmk-sparkline [data]="[10, 25, 18, 40, 32, 55, 48, 65]" variant="area" />
        <ngxsmk-sparkline [data]="[12, 5, 20, 15, 30, 25, 40]" variant="bar" />
      </div>
    </showcase-example>

    <showcase-example
      title="Gauge Meter"
      description="Circular speedometer and performance gauge arcs."
      [code]="codeGauge"
      [component]="NgxsmkGauge"
    >
      <div class="ngxsmk-sc-row ngxsmk-sc-wrap" style="gap:2rem;align-items:center;">
        <ngxsmk-gauge [value]="78" label="Performance" units="%" [size]="150" />
        <ngxsmk-gauge
          [value]="140"
          [min]="0"
          [max]="200"
          units="km/h"
          variant="half"
          [size]="150"
        />
      </div>
    </showcase-example>
  `,

  styles: `
    :host {
      display: block;
    }
  `,
})
export class ChartsPage {
  protected readonly NgxsmkSparkline = NgxsmkSparkline;
  protected readonly NgxsmkGauge = NgxsmkGauge;
  protected readonly NgxsmkLineChart = NgxsmkLineChart;
  protected readonly customizeNgxsmkLineChart = `/* Theme <ngxsmk-chart-line> via design tokens */
ngxsmk-chart-line {
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-text-label-sm-size: ;
}`;
  protected readonly NgxsmkBarChart = NgxsmkBarChart;
  protected readonly customizeNgxsmkBarChart = `/* Theme <ngxsmk-chart-bar> via design tokens */
ngxsmk-chart-bar {
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
}`;
  protected readonly NgxsmkPieChart = NgxsmkPieChart;
  protected readonly customizeNgxsmkPieChart = `/* Theme <ngxsmk-chart-pie> via design tokens */
ngxsmk-chart-pie {
  --ngxsmk-color-surface: ;
}`;
  protected readonly NgxsmkAreaChart = NgxsmkAreaChart;
  protected readonly NgxsmkScatterChart = NgxsmkScatterChart;
  protected readonly customizeNgxsmkScatterChart = `/* Theme <ngxsmk-chart-scatter> via design tokens */
ngxsmk-chart-scatter {
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-text-label-sm-size: ;
}`;
  protected readonly NgxsmkCandlestickChart = NgxsmkCandlestickChart;
  protected readonly customizeNgxsmkCandlestickChart = `/* Theme <ngxsmk-chart-candlestick> via design tokens */
ngxsmk-chart-candlestick {
  --ngxsmk-color-on-surface: ;
}`;
  protected readonly NgxsmkHeatmapChart = NgxsmkHeatmapChart;
  protected readonly customizeNgxsmkHeatmapChart = `/* Theme <ngxsmk-chart-heatmap> via design tokens */
ngxsmk-chart-heatmap {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-text-label-sm-size: ;
}`;
  protected readonly NgxsmkChartDashboard = NgxsmkChartDashboard;
  protected readonly customizeNgxsmkChartDashboard = `/* Theme <ngxsmk-chart-dashboard> via design tokens */
ngxsmk-chart-dashboard {
  --ngxsmk-space-4: ;
}`;

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
  protected readonly codeSparkline = `<ngxsmk-sparkline [data]="[10, 25, 18, 40, 32, 55, 48, 65]" variant="line" />\n<ngxsmk-sparkline [data]="[10, 25, 18, 40, 32, 55, 48, 65]" variant="area" />\n<ngxsmk-sparkline [data]="[12, 5, 20, 15, 30, 25, 40]" variant="bar" />`;
  protected readonly codeGauge = `<ngxsmk-gauge [value]="78" label="Performance" units="%" [size]="150" />\n<ngxsmk-gauge [value]="140" [min]="0" [max]="200" units="km/h" variant="half" [size]="150" opacity="1" />`;
  protected readonly codeDashboard = `<ngxsmk-chart-dashboard [columns]="3">\n  <ngxsmk-chart-line [data]="revenue" [width]="300" [height]="180" />\n  <ngxsmk-chart-pie [data]="traffic" [size]="180" />\n</ngxsmk-chart-dashboard>`;
}
