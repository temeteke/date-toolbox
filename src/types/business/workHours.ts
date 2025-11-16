/**
 * 勤務記録
 */
export interface WorkRecord {
  date: Date;
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
  breakMinutes: number;
}

/**
 * 勤務時間計算結果
 */
export interface WorkHoursResult {
  totalMinutes: number;
  workMinutes: number;
  breakMinutes: number;
  hours: number;
  minutes: number;
  formatted: string;
  overtimeMinutes?: number;
  overtimeFormatted?: string;
}

/**
 * 週間・月間集計
 */
export interface WorkSummary {
  records: WorkRecord[];
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  totalDays: number;
  averageWorkMinutes: number;
  totalFormatted: string;
  averageFormatted: string;
  overtimeMinutes: number;
  overtimeFormatted: string;
}
