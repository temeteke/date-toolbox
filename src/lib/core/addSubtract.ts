import { add, sub, getDay, differenceInDays, isToday as isTodayFn, startOfDay } from 'date-fns';
import type { AddSubtractInput, AddSubtractResult } from '../../types/core/addSubtract';
import { getWeekdayNameJa } from '../utils';

/**
 * 日付の加算/減算を行う
 * @param input 入力パラメータ
 * @returns 計算結果
 */
export function addSubtractDate(input: AddSubtractInput): AddSubtractResult {
  const { baseDate, amount, unit } = input;

  // 加算または減算
  const resultDate =
    amount >= 0
      ? add(baseDate, { [unit]: amount })
      : sub(baseDate, { [unit]: Math.abs(amount) });

  // 曜日を取得
  const weekdayNumber = getDay(resultDate);
  const dayOfWeek = getWeekdayNameJa(weekdayNumber, false);
  const dayOfWeekShort = getWeekdayNameJa(weekdayNumber, true);

  // 今日からの日数を計算
  const daysFromToday = getDaysFromToday(resultDate);

  // 過去/未来/今日の判定
  const isToday = isTodayFn(resultDate);
  const isPast = daysFromToday < 0;
  const isFuture = daysFromToday > 0;

  return {
    resultDate,
    dayOfWeek,
    dayOfWeekShort,
    daysFromToday,
    isPast,
    isFuture,
    isToday,
  };
}

/**
 * 曜日を日本語で取得
 * @param date 日付
 * @param short 短縮形か（デフォルト: false）
 * @returns 曜日文字列
 */
export function getDayOfWeekJa(date: Date, short: boolean = false): string {
  const weekdayNumber = getDay(date);
  return getWeekdayNameJa(weekdayNumber, short);
}

/**
 * 今日からの日数を計算
 * @param date 対象日付
 * @returns 今日からの日数（正: 未来, 負: 過去）
 */
export function getDaysFromToday(date: Date): number {
  const today = startOfDay(new Date());
  const targetDate = startOfDay(date);
  return differenceInDays(targetDate, today);
}
