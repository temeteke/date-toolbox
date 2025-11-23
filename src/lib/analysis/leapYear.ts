/**
 * うるう年計算ライブラリ
 */

import { differenceInDays } from 'date-fns';
import type { LeapYearInfo, LeapYearHistory, NextLeapYearInfo } from '../../types/analysis/leapYear';

/**
 * うるう年かどうかを判定
 * @param year 年
 * @returns true: うるう年, false: 平年
 */
export function isLeapYear(year: number): boolean {
  // 400で割り切れる年はうるう年
  if (year % 400 === 0) {
    return true;
  }
  // 100で割り切れる年は平年
  if (year % 100 === 0) {
    return false;
  }
  // 4で割り切れる年はうるう年
  if (year % 4 === 0) {
    return true;
  }
  // それ以外は平年
  return false;
}

/**
 * うるう年の詳細情報を取得
 * @param year 年
 * @returns うるう年の詳細情報
 */
export function getLeapYearInfo(year: number): LeapYearInfo {
  const leap = isLeapYear(year);
  let reason = '';

  if (year % 400 === 0) {
    reason = `${year}は400で割り切れるため、うるう年です`;
  } else if (year % 100 === 0) {
    reason = `${year}は100で割り切れますが400で割り切れないため、平年です`;
  } else if (year % 4 === 0) {
    reason = `${year}は4で割り切れるため、うるう年です`;
  } else {
    reason = `${year}は4で割り切れないため、平年です`;
  }

  return {
    year,
    isLeapYear: leap,
    daysInYear: leap ? 366 : 365,
    februaryDays: leap ? 29 : 28,
    reason,
  };
}

/**
 * 次のうるう年を取得
 * @param year 基準年
 * @returns 次のうるう年
 */
export function getNextLeapYear(year: number): number {
  let nextYear = year + 1;
  while (!isLeapYear(nextYear)) {
    nextYear++;
  }
  return nextYear;
}

/**
 * 前のうるう年を取得
 * @param year 基準年
 * @returns 前のうるう年
 */
export function getPreviousLeapYear(year: number): number {
  let prevYear = year - 1;
  while (!isLeapYear(prevYear)) {
    prevYear--;
  }
  return prevYear;
}

/**
 * 次のうるう年までの情報を取得
 * @param currentDate 基準日
 * @returns 次のうるう年までの情報
 */
export function getNextLeapYearInfo(currentDate: Date = new Date()): NextLeapYearInfo {
  const currentYear = currentDate.getFullYear();
  const nextLeapYear = getNextLeapYear(currentYear);
  const yearsUntilNext = nextLeapYear - currentYear;

  // 次のうるう年の1月1日までの日数を計算
  const nextLeapYearDate = new Date(nextLeapYear, 0, 1);
  const daysUntilNext = differenceInDays(nextLeapYearDate, currentDate);

  return {
    currentYear,
    nextLeapYear,
    yearsUntilNext,
    daysUntilNext,
  };
}

/**
 * 指定範囲のうるう年リストを取得
 * @param startYear 開始年
 * @param endYear 終了年
 * @returns うるう年のリスト
 */
export function getLeapYearList(startYear: number, endYear: number): LeapYearHistory[] {
  const list: LeapYearHistory[] = [];

  for (let year = startYear; year <= endYear; year++) {
    list.push({
      year,
      isLeapYear: isLeapYear(year),
    });
  }

  return list;
}

/**
 * 指定範囲のうるう年のみを取得
 * @param startYear 開始年
 * @param endYear 終了年
 * @returns うるう年のリスト
 */
export function getLeapYearsOnly(startYear: number, endYear: number): number[] {
  const leapYears: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    if (isLeapYear(year)) {
      leapYears.push(year);
    }
  }

  return leapYears;
}

/**
 * うるう年のパターン統計を取得
 * @param startYear 開始年
 * @param endYear 終了年
 * @returns 統計情報
 */
export function getLeapYearStats(startYear: number, endYear: number) {
  const totalYears = endYear - startYear + 1;
  const leapYears = getLeapYearsOnly(startYear, endYear);
  const leapYearCount = leapYears.length;
  const regularYearCount = totalYears - leapYearCount;
  const leapYearRatio = (leapYearCount / totalYears) * 100;

  // 400年周期の詳細
  const cycles400 = Math.floor(totalYears / 400);
  const leapYearsPer400 = 97; // 400年間に97回のうるう年

  return {
    totalYears,
    leapYearCount,
    regularYearCount,
    leapYearRatio,
    leapYears,
    cycles400,
    leapYearsPer400,
    averageLeapYearInterval: totalYears / leapYearCount,
  };
}

/**
 * グレゴリオ暦とユリウス暦の違いを説明
 */
export function getCalendarInfo() {
  return {
    gregorian: {
      name: 'グレゴリオ暦',
      adoptedYear: 1582,
      rule: '400年に97回のうるう年',
      accuracy: '3300年に1日のずれ',
      leapYearRule: [
        '4で割り切れる年はうるう年',
        'ただし、100で割り切れる年は平年',
        'ただし、400で割り切れる年はうるう年',
      ],
    },
    julian: {
      name: 'ユリウス暦',
      adoptedYear: -45, // 紀元前45年
      rule: '4年に1回のうるう年',
      accuracy: '128年に1日のずれ',
      leapYearRule: [
        '4で割り切れる年はうるう年',
      ],
    },
    difference: 'グレゴリオ暦では100の倍数年を平年とすることで、ユリウス暦より精度が向上しました',
  };
}
