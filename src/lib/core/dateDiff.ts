import {
  differenceInCalendarDays,
  differenceInMonths,
  eachDayOfInterval,
  isWeekend,
  addDays,
} from 'date-fns';
import type { DateDiffOptions, DateDiffResult } from '../../types/core/dateDiff';

/**
 * 2つの日付の差を計算
 * @param startDate 開始日
 * @param endDate 終了日
 * @param options オプション
 * @returns 計算結果
 */
export function calculateDateDiff(
  startDate: Date,
  endDate: Date,
  options: DateDiffOptions = {
    includeStartDate: true,
    includeEndDate: true,
    excludeWeekends: false,
  }
): DateDiffResult {
  // 日数計算の調整
  let adjustedStartDate = startDate;
  let adjustedEndDate = endDate;

  if (!options.includeStartDate) {
    adjustedStartDate = addDays(startDate, 1);
  }
  if (!options.includeEndDate) {
    adjustedEndDate = addDays(endDate, -1);
  }

  // 総日数を計算
  const totalDays = Math.abs(differenceInCalendarDays(adjustedEndDate, adjustedStartDate)) + 1;

  // 週数と余り日数
  const { weeks, days: remainingDays } = convertToWeeksAndDays(totalDays);

  // 年月日差
  const { years, months, days } = calculateYearsMonthsDays(adjustedStartDate, adjustedEndDate);

  const result: DateDiffResult = {
    totalDays,
    weeks,
    remainingDays,
    years,
    months,
    days,
  };

  // 営業日数の計算（オプション）
  if (options.excludeWeekends) {
    result.businessDays = calculateBusinessDaysSimple(
      adjustedStartDate,
      adjustedEndDate,
      true,
      true
    );
  }

  return result;
}

/**
 * 日数を週数＋余り日数に変換
 * @param totalDays 総日数
 * @returns {weeks: 週数, days: 余り日数}
 */
export function convertToWeeksAndDays(totalDays: number): {
  weeks: number;
  days: number;
} {
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  return { weeks, days };
}

/**
 * 2つの日付の年月日差を計算
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns {years: 年差, months: 月差, days: 日差}
 */
export function calculateYearsMonthsDays(
  startDate: Date,
  endDate: Date
): { years: number; months: number; days: number } {
  // 総月数から年と月を計算
  const totalMonths = Math.abs(differenceInMonths(endDate, startDate));
  const yearsCalc = Math.floor(totalMonths / 12);
  const monthsCalc = totalMonths % 12;

  // 日差の計算
  const intermediateDate = new Date(startDate);
  intermediateDate.setFullYear(startDate.getFullYear() + yearsCalc);
  intermediateDate.setMonth(startDate.getMonth() + monthsCalc);

  const daysCalc = Math.abs(differenceInCalendarDays(endDate, intermediateDate));

  return {
    years: yearsCalc,
    months: monthsCalc,
    days: daysCalc,
  };
}

/**
 * 期間内の営業日数を計算（土日を除く）
 * @param startDate 開始日
 * @param endDate 終了日
 * @param includeStartDate 開始日を含めるか
 * @param includeEndDate 終了日を含めるか
 * @returns 営業日数
 */
export function calculateBusinessDaysSimple(
  startDate: Date,
  endDate: Date,
  includeStartDate: boolean,
  includeEndDate: boolean
): number {
  let adjustedStartDate = startDate;
  let adjustedEndDate = endDate;

  if (!includeStartDate) {
    adjustedStartDate = addDays(startDate, 1);
  }
  if (!includeEndDate) {
    adjustedEndDate = addDays(endDate, -1);
  }

  const allDays = eachDayOfInterval({ start: adjustedStartDate, end: adjustedEndDate });
  const businessDays = allDays.filter(day => !isWeekend(day));

  return businessDays.length;
}
