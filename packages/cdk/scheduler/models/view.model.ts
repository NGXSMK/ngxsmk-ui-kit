export type ViewType =
  | 'dayGridDay'
  | 'dayGridWeek'
  | 'dayGridMonth'
  | 'timeGridDay'
  | 'timeGridWeek'
  | 'timeGridWorkWeek'
  | 'timeGrid3Day'
  | 'agenda'
  | 'timeline';

export type Density = 'compact' | 'comfortable' | 'dense';

export interface ViewState {
  type: ViewType;
  date: Date;
  rangeStart: Date;
  rangeEnd: Date;
  slotDuration: number;
  snapDuration: number;
  visibleHours: [number, number];
  firstDayOfWeek: number;
  locale: string;
  rtl: boolean;
  density: Density;
  showAllDay: boolean;
  showWeekends: boolean;
  showCurrentTime: boolean;
}

export function isTimeGridView(view: ViewType): boolean {
  return view.startsWith('timeGrid');
}

export function isDayGridView(view: ViewType): boolean {
  return view.startsWith('dayGrid');
}
