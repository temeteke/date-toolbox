/**
 * うるう年関連の型定義
 */

export interface LeapYearInfo {
  year: number;
  isLeapYear: boolean;
  daysInYear: number;
  februaryDays: number;
  reason: string;
}

export interface LeapYearHistory {
  year: number;
  isLeapYear: boolean;
}

export interface NextLeapYearInfo {
  currentYear: number;
  nextLeapYear: number;
  yearsUntilNext: number;
  daysUntilNext: number;
}
