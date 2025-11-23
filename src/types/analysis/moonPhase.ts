/**
 * 月齢・月相関連の型定義
 */

export type MoonPhaseName = '新月' | '三日月' | '上弦' | '十三夜' | '満月' | '十六夜' | '下弦' | '二十六夜';

export interface MoonPhaseInfo {
  date: Date;
  age: number; // 月齢（0-29.53）
  illumination: number; // 輝面比（0-100%）
  phase: MoonPhaseName;
  phaseEmoji: string;
  description: string;
}

export interface MoonPhaseCalendar {
  year: number;
  month: number;
  phases: Map<string, MoonPhaseInfo>; // 日付文字列 -> 月相情報
}

export interface NextMoonPhaseInfo {
  currentPhase: MoonPhaseName;
  nextNewMoon: Date;
  nextFullMoon: Date;
  nextFirstQuarter: Date;
  nextLastQuarter: Date;
}
