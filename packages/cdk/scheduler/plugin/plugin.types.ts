import type { SchedulerEngine } from '../scheduler-engine';

export interface SchedulerPlugin {
  name: string;
  priority?: number;
  onInit?(engine: SchedulerEngine): void;
  onDestroy?(): void;
  onRender?(): void;
}
