export type RecurrenceType =
  | 'weekly'           // 毎週○曜日
  | 'monthly-date'     // 毎月○日
  | 'monthly-weekday'; // 毎月第N○曜日

// 毎週○曜日
export interface WeeklyRecurrence {
  type: 'weekly';
  weekday: number;  // 0=日曜, 6=土曜
}

// 毎月○日
export interface MonthlyDateRecurrence {
  type: 'monthly-date';
  date: number;  // 1-31
}

// 毎月第N○曜日
export interface MonthlyWeekdayRecurrence {
  type: 'monthly-weekday';
  weekday: number;     // 0=日曜, 6=土曜
  weekNumber: number;  // 1=第1, 2=第2, ..., 5=第5（最終）
}

export type RecurrencePattern =
  | WeeklyRecurrence
  | MonthlyDateRecurrence
  | MonthlyWeekdayRecurrence;

export interface RecurrenceInput {
  startDate: Date;
  endDate: Date;
  pattern: RecurrencePattern;
}

export interface RecurrenceResult {
  dates: Date[];
  count: number;
}
