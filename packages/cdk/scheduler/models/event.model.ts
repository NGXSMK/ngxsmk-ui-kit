export interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  textColor?: string;
  icon?: string;
  badge?: string;
  className?: string;
  style?: Record<string, string>;
  draggable?: boolean;
  resizable?: boolean;
  editable?: boolean;
  resourceId?: string;
  recurrence?: RecurrenceRule;
  meta?: Record<string, unknown>;
}

export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number;
  count?: number;
  until?: Date;
  byDay?: string[];
  byMonth?: number[];
  byMonthDay?: number[];
  exceptions?: Date[];
}

export interface SchedulerMove {
  event: SchedulerEvent;
  from: Date;
  to: Date;
  newStart: Date;
  newEnd: Date;
  resourceId?: string;
}

export interface SchedulerCreate {
  event: SchedulerEvent;
  day: Date;
  start: Date;
  end: Date;
  resourceId?: string;
}

export interface SchedulerResize {
  event: SchedulerEvent;
  oldEnd: Date;
  newEnd: Date;
}
