import type { DateRange } from './date-range';

export interface SelectionState {
  selectedEventIds: Set<string>;
  selectedRange: DateRange | null;
  multiSelect: boolean;
  focusedCell: { date: Date; resourceId?: string } | null;
}

export const DEFAULT_SELECTION: SelectionState = {
  selectedEventIds: new Set(),
  selectedRange: null,
  multiSelect: false,
  focusedCell: null,
};
