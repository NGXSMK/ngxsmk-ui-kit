export interface SchedulerResource {
  id: string;
  title: string;
  color?: string;
  icon?: string;
  parentId?: string;
  workingHours?: WorkingHours;
  capacity?: number;
  meta?: Record<string, unknown>;
}

export interface WorkingHours {
  days: number[];
  ranges: [number, number][];
}

export const DEFAULT_WORKING_HOURS: WorkingHours = {
  days: [1, 2, 3, 4, 5],
  ranges: [[480, 1020]],
};
