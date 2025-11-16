import { eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import type { BusinessDaysOptions, BusinessDaysResult } from '../types/businessDays';
import { parseDate } from './utils';

/**
 * 営業日数を計算
 * @param startDate 開始日
 * @param endDate 終了日
 * @param options 除外設定
 * @returns 営業日数と営業日リスト
 */
export function calculateBusinessDays(
  startDate: Date,
  endDate: Date,
  options: BusinessDaysOptions
): BusinessDaysResult {
  // 期間内のすべての日付を取得
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  let excludedWeekends = 0;
  let excludedHolidays = 0;
  const businessDateList: Date[] = [];

  for (const day of allDays) {
    const isBusiness = isBusinessDay(day, options);

    if (isBusiness) {
      businessDateList.push(day);
    } else {
      // 除外理由を判定
      const dayOfWeek = getDay(day);
      const isExcludedWeekday = options.excludedWeekdays.includes(dayOfWeek);
      const isHoliday = options.holidays.some(holiday => isSameDay(holiday, day));

      if (isExcludedWeekday) {
        excludedWeekends++;
      }
      if (isHoliday) {
        excludedHolidays++;
      }
    }
  }

  return {
    businessDays: businessDateList.length,
    businessDateList,
    excludedWeekends,
    excludedHolidays,
  };
}

/**
 * 指定日が営業日かどうかを判定
 * @param date 対象日
 * @param options 除外設定
 * @returns true: 営業日, false: 非営業日
 */
export function isBusinessDay(
  date: Date,
  options: BusinessDaysOptions
): boolean {
  const dayOfWeek = getDay(date);

  // 除外曜日に含まれている場合は非営業日
  if (options.excludedWeekdays.includes(dayOfWeek)) {
    return false;
  }

  // 休日リストに含まれている場合は非営業日
  if (options.holidays.some(holiday => isSameDay(holiday, date))) {
    return false;
  }

  return true;
}

/**
 * テキストから休日リストをパース
 * @param text テキスト（改行区切りまたはカンマ区切り）
 * @returns 日付配列
 * @example "2025-01-01\n2025-01-13" → [Date, Date]
 */
export function parseHolidaysFromText(text: string): Date[] {
  if (!text.trim()) {
    return [];
  }

  // 改行またはカンマで分割
  const lines = text
    .split(/[\n,]/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const holidays: Date[] = [];

  for (const line of lines) {
    const date = parseDate(line);
    if (date) {
      holidays.push(date);
    }
  }

  return holidays;
}

/**
 * 休日リストを日付文字列の配列に変換
 * @param dates 日付配列
 * @returns 文字列配列（YYYY-MM-DD形式）
 */
export function formatHolidaysList(dates: Date[]): string[] {
  return dates.map(date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
}
