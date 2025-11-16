import {
  eachDayOfInterval,
  getDay,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  differenceInDays,
} from 'date-fns';
import { isHoliday } from './holiday';
import type { DateRangeStats } from '../types/dateStats';

/**
 * 期間の統計情報を計算
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns 統計情報
 */
export function calculateDateRangeStats(
  startDate: Date,
  endDate: Date
): DateRangeStats | null {
  try {
    if (!startDate || !endDate || startDate > endDate) {
      return null;
    }

    // 期間内の全日付を取得
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });
    const totalDays = allDates.length;

    // 曜日別カウント
    const dayOfWeekCounts: Record<string, number> = {
      '日': 0,
      '月': 0,
      '火': 0,
      '水': 0,
      '木': 0,
      '金': 0,
      '土': 0,
    };

    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    let weekdays = 0; // 平日（月〜金）
    let weekends = 0; // 週末（土日）
    let holidays = 0; // 祝日
    let businessDays = 0; // 営業日

    let firstBusinessDay: Date | null = null;
    let lastBusinessDay: Date | null = null;

    for (const date of allDates) {
      const dayOfWeek = getDay(date);
      const dayName = dayNames[dayOfWeek];
      dayOfWeekCounts[dayName]++;

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const holidayCheck = isHoliday(date);

      if (isWeekend) {
        weekends++;
      } else {
        weekdays++;
      }

      if (holidayCheck.isHoliday) {
        holidays++;
      }

      // 営業日判定（平日 かつ 祝日でない）
      if (!isWeekend && !holidayCheck.isHoliday) {
        businessDays++;
        if (!firstBusinessDay) {
          firstBusinessDay = date;
        }
        lastBusinessDay = date;
      }
    }

    // 月別日数カウント
    const monthCounts: Record<string, number> = {};
    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    for (const month of months) {
      const monthKey = `${month.getFullYear()}年${month.getMonth() + 1}月`;
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      // 期間内での月の開始日と終了日
      const actualStart = monthStart < startDate ? startDate : monthStart;
      const actualEnd = monthEnd > endDate ? endDate : monthEnd;

      const daysInMonth = differenceInDays(actualEnd, actualStart) + 1;
      monthCounts[monthKey] = daysInMonth;
    }

    // 月末日と月初日のリスト
    const monthEndDates: Date[] = [];
    const monthStartDates: Date[] = [];

    for (const month of months) {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      if (monthStart >= startDate && monthStart <= endDate) {
        monthStartDates.push(monthStart);
      }

      if (monthEnd >= startDate && monthEnd <= endDate) {
        monthEndDates.push(monthEnd);
      }
    }

    return {
      startDate,
      endDate,
      totalDays,
      weekdays,
      weekends,
      holidays,
      businessDays,
      dayOfWeekCounts,
      monthCounts,
      firstBusinessDay,
      lastBusinessDay,
      monthEndDates,
      monthStartDates,
    };
  } catch (error) {
    console.error('Date range stats calculation failed:', error);
    return null;
  }
}

/**
 * 指定期間内の特定の曜日の日数を取得
 * @param startDate 開始日
 * @param endDate 終了日
 * @param dayOfWeek 曜日（0: 日曜 〜 6: 土曜）
 * @returns 日数
 */
export function countDayOfWeek(
  startDate: Date,
  endDate: Date,
  dayOfWeek: number
): number {
  const allDates = eachDayOfInterval({ start: startDate, end: endDate });
  return allDates.filter(date => getDay(date) === dayOfWeek).length;
}
