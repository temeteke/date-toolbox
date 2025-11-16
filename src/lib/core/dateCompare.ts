import { isSameDay } from 'date-fns';
import type { DateCompareResult } from '../../types/core/dateCompare';

/**
 * 複数の日付を比較・ソート
 * @param dates 日付の配列
 * @returns 比較結果
 */
export function compareDates(dates: Date[]): DateCompareResult | null {
  try {
    if (!dates || dates.length === 0) {
      return {
        dates: [],
        sortedDates: [],
        earliestDate: null,
        latestDate: null,
        duplicates: [],
        isValid: false,
      };
    }

    // 無効な日付を除外
    const validDates = dates.filter(date => date && !isNaN(date.getTime()));

    if (validDates.length === 0) {
      return {
        dates: [],
        sortedDates: [],
        earliestDate: null,
        latestDate: null,
        duplicates: [],
        isValid: false,
      };
    }

    // 日付をソート（昇順）
    const sortedDates = [...validDates].sort((a, b) => a.getTime() - b.getTime());

    // 最早日と最晩日
    const earliestDate = sortedDates[0];
    const latestDate = sortedDates[sortedDates.length - 1];

    // 重複する日付を検出
    const duplicates: Date[] = [];
    for (let i = 0; i < sortedDates.length - 1; i++) {
      if (isSameDay(sortedDates[i], sortedDates[i + 1])) {
        if (!duplicates.some(d => isSameDay(d, sortedDates[i]))) {
          duplicates.push(sortedDates[i]);
        }
      }
    }

    return {
      dates: validDates,
      sortedDates,
      earliestDate,
      latestDate,
      duplicates,
      isValid: true,
    };
  } catch (error) {
    console.error('Date comparison failed:', error);
    return null;
  }
}

/**
 * 日付文字列の配列をパースして比較
 * @param dateStrings 日付文字列の配列
 * @returns 比較結果
 */
export function compareDateStrings(dateStrings: string[]): DateCompareResult | null {
  const dates = dateStrings.map(str => {
    const date = new Date(str);
    return isNaN(date.getTime()) ? null : date;
  }).filter((date): date is Date => date !== null);

  return compareDates(dates);
}

/**
 * 日付をソート（降順）
 * @param dates 日付の配列
 * @returns ソートされた日付の配列
 */
export function sortDatesDescending(dates: Date[]): Date[] {
  return [...dates].sort((a, b) => b.getTime() - a.getTime());
}

/**
 * 日付をソート（昇順）
 * @param dates 日付の配列
 * @returns ソートされた日付の配列
 */
export function sortDatesAscending(dates: Date[]): Date[] {
  return [...dates].sort((a, b) => a.getTime() - b.getTime());
}
