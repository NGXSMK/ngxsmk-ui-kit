export function snapToSlot(value: number, snapDuration: number): number {
  return Math.round(value / snapDuration) * snapDuration;
}

export function snapDateToSlot(date: Date, snapDuration: number): Date {
  const ms = date.getTime();
  const snapMs = snapDuration * 60_000;
  return new Date(Math.round(ms / snapMs) * snapMs);
}

export function minutesToPixels(minutes: number, hourHeight: number): number {
  return (minutes / 60) * hourHeight;
}

export function pixelsToMinutes(pixels: number, hourHeight: number): number {
  return (pixels / hourHeight) * 60;
}

export function timeToMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function minutesToTime(baseDate: Date, minutes: number): Date {
  const d = new Date(baseDate);
  d.setHours(0, 0, 0, 0);
  d.setMinutes(minutes);
  return d;
}
