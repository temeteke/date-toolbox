import {
  eachMonthOfInterval,
  setDay,
  isBefore,
  isAfter,
  isEqual,
  addWeeks,
  startOfMonth,
  endOfMonth,
  setDate,
  isValid,
} from 'date-fns';
import type { RecurrenceInput, RecurrenceResult } from '../../types/analysis/recurrence';
import { sortDates } from '../utils';

/**
 * 繰り返し日付を生成
 * @param input 入力パラメータ
 * @returns 生成された日付リスト
 */
export function generateRecurringDates(input: RecurrenceInput): RecurrenceResult {
  const { startDate, endDate, pattern } = input;

  let dates: Date[] = [];

  switch (pattern.type) {
    case 'weekly':
      dates = generateWeeklyDates(startDate, endDate, pattern.weekday);
      break;
    case 'monthly-date':
      dates = generateMonthlyDates(startDate, endDate, pattern.date);
      break;
    case 'monthly-weekday':
      dates = generateMonthlyWeekdayDates(
        startDate,
        endDate,
        pattern.weekday,
        pattern.weekNumber
      );
      break;
  }

  return {
    dates: sortDates(dates),
    count: dates.length,
  };
}

/**
 * 毎週○曜日の日付を生成
 * @param startDate 開始日
 * @param endDate 終了日
 * @param weekday 曜日（0=日曜, 6=土曜）
 * @returns 日付配列
 */
export function generateWeeklyDates(
  startDate: Date,
  endDate: Date,
  weekday: number
): Date[] {
  const dates: Date[] = [];

  // 開始日以降の最初の該当曜日を見つける
  let currentDate = setDay(startDate, weekday, { weekStartsOn: 0 });

  // もし currentDate が startDate より前の場合は1週間進める
  if (isBefore(currentDate, startDate)) {
    currentDate = addWeeks(currentDate, 1);
  }

  // 終了日まで繰り返す
  while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
    dates.push(new Date(currentDate));
    currentDate = addWeeks(currentDate, 1);
  }

  return dates;
}

/**
 * 毎月○日の日付を生成
 * @param startDate 開始日
 * @param endDate 終了日
 * @param date 日（1-31）
 * @returns 日付配列
 * @note 存在しない日（例: 2月31日）はスキップ
 */
export function generateMonthlyDates(
  startDate: Date,
  endDate: Date,
  date: number
): Date[] {
  const dates: Date[] = [];

  // 期間内のすべての月を取得
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  for (const month of months) {
    try {
      // その月の指定日を作成
      const targetDate = setDate(month, date);

      // 有効な日付かチェック（例: 2月31日は無効）
      if (isValid(targetDate) && targetDate.getDate() === date) {
        // 期間内かチェック
        if (
          (isAfter(targetDate, startDate) || isEqual(targetDate, startDate)) &&
          (isBefore(targetDate, endDate) || isEqual(targetDate, endDate))
        ) {
          dates.push(targetDate);
        }
      }
    } catch {
      // 無効な日付はスキップ
      continue;
    }
  }

  return dates;
}

/**
 * 毎月第N○曜日の日付を生成
 * @param startDate 開始日
 * @param endDate 終了日
 * @param weekday 曜日（0=日曜, 6=土曜）
 * @param weekNumber 第N週（1-5）
 * @returns 日付配列
 * @note 存在しない週（例: 第5月曜がない月）はスキップ
 */
export function generateMonthlyWeekdayDates(
  startDate: Date,
  endDate: Date,
  weekday: number,
  weekNumber: number
): Date[] {
  const dates: Date[] = [];

  // 期間内のすべての月を取得
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  for (const month of months) {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const targetDate = getNthWeekdayOfMonth(year, monthIndex, weekday, weekNumber);

    if (targetDate) {
      // 期間内かチェック
      if (
        (isAfter(targetDate, startDate) || isEqual(targetDate, startDate)) &&
        (isBefore(targetDate, endDate) || isEqual(targetDate, endDate))
      ) {
        dates.push(targetDate);
      }
    }
  }

  return dates;
}

/**
 * 指定月の第N○曜日を取得
 * @param year 年
 * @param month 月（0-11）
 * @param weekday 曜日（0=日曜, 6=土曜）
 * @param weekNumber 第N週（1-5）
 * @returns 日付（存在しない場合はnull）
 */
export function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  weekNumber: number
): Date | null {
  // 月の最初の日
  const firstDay = startOfMonth(new Date(year, month, 1));
  const lastDay = endOfMonth(new Date(year, month, 1));

  // 月の最初の該当曜日を見つける
  let currentDate = setDay(firstDay, weekday, { weekStartsOn: 0 });

  // もし currentDate が月の開始より前の場合は1週間進める
  if (isBefore(currentDate, firstDay)) {
    currentDate = addWeeks(currentDate, 1);
  }

  // N週目まで進める
  for (let i = 1; i < weekNumber; i++) {
    currentDate = addWeeks(currentDate, 1);
  }

  // 月内に収まっているかチェック
  if (isAfter(currentDate, lastDay)) {
    return null;
  }

  return currentDate;
}
