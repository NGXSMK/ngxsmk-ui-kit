export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfWeek(date: Date, firstDayOfWeek: number): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = (day - firstDayOfWeek + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

export function endOfWeek(date: Date, firstDayOfWeek: number): Date {
  const start = startOfWeek(date, firstDayOfWeek);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  end.setMilliseconds(-1);
  return end;
}

export function startOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function diffMinutes(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / 60_000;
}

export function diffDays(start: Date, end: Date): number {
  const s = startOfDay(start);
  const e = startOfDay(end);
  return Math.round((e.getTime() - s.getTime()) / 86_400_000);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameWeek(a: Date, b: Date, firstDayOfWeek: number): boolean {
  return isSameDay(startOfWeek(a, firstDayOfWeek), startOfWeek(b, firstDayOfWeek));
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

export function dateRangeOverlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart.getTime() < bEnd.getTime() && aEnd.getTime() > bStart.getTime();
}

export function clampDate(date: Date, min: Date, max: Date): Date {
  const t = date.getTime();
  if (t < min.getTime()) return new Date(min);
  if (t > max.getTime()) return new Date(max);
  return new Date(date);
}

export function getHoursInRange(start: Date, end: Date): number[] {
  const hours: number[] = [];
  const d = new Date(start);
  while (d < end) {
    hours.push(d.getHours());
    d.setHours(d.getHours() + 1, 0, 0, 0);
  }
  return hours;
}

export function formatHour(h: number, locale = 'en-US'): string {
  const d = new Date();
  d.setHours(h, 0, 0, 0);
  return d.toLocaleTimeString(locale, { hour: 'numeric', minute: undefined });
}

export function formatDateRange(start: Date, end: Date, locale = 'en-US'): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const yearOpts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const sameYear = start.getFullYear() === end.getFullYear();
  const fmt = new Intl.DateTimeFormat(locale, sameYear ? opts : yearOpts);
  return `${fmt.format(start)} – ${fmt.format(end)}${sameYear ? `, ${start.getFullYear()}` : ''}`;
}

export function getWeekDates(date: Date, firstDayOfWeek: number): Date[] {
  const start = startOfWeek(date, firstDayOfWeek);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function getWorkWeekDates(date: Date, firstDayOfWeek: number): Date[] {
  const weekDates = getWeekDates(date, firstDayOfWeek);
  return weekDates.filter((d) => !isWeekend(d));
}

export function getMonthGrid(date: Date, firstDayOfWeek: number): Date[][] {
  const monthStart = startOfMonth(date);
  const gridStart = startOfWeek(monthStart, firstDayOfWeek);
  const gridEnd = addDays(gridStart, 42);
  const weeks: Date[][] = [];
  let current = new Date(gridStart);
  while (current < gridEnd) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(current, i)));
    current = addDays(current, 7);
  }
  return weeks;
}

export function getDayNames(
  locale = 'en-US',
  format: 'long' | 'short' | 'narrow' = 'short',
): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 0, 4 + i);
    return d.toLocaleDateString(locale, { weekday: format });
  });
}

export function getMonthNames(locale = 'en-US', format: 'long' | 'short' = 'long'): string[] {
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(2026, i, 1);
    return d.toLocaleDateString(locale, { month: format });
  });
}
