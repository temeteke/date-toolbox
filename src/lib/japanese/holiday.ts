import { isSameDay, getDay, addDays, getYear } from 'date-fns';
import type { Holiday, HolidayCheckResult } from '../../types/japanese/holiday';
import { isValidDate } from '../utils';

/**
 * 春分の日を計算（簡易版）
 * @param year 年
 * @returns 春分の日
 */
function calculateVernalEquinox(year: number): number {
  if (year >= 2000 && year <= 2099) {
    return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  } else if (year >= 1980 && year <= 1999) {
    return Math.floor(20.8357 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  }
  return 20; // デフォルト
}

/**
 * 秋分の日を計算（簡易版）
 * @param year 年
 * @returns 秋分の日
 */
function calculateAutumnalEquinox(year: number): number {
  if (year >= 2000 && year <= 2099) {
    return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  } else if (year >= 1980 && year <= 1999) {
    return Math.floor(23.2588 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  }
  return 23; // デフォルト
}

/**
 * ハッピーマンデー（第N月曜日）を計算
 * @param year 年
 * @param month 月（1-12）
 * @param weekNumber 第何週（1-5）
 * @returns 日付
 */
function getNthMonday(year: number, month: number, weekNumber: number): Date {
  const firstDay = new Date(year, month - 1, 1);
  const firstDayOfWeek = getDay(firstDay);

  // 最初の月曜日を見つける
  const firstMonday = firstDayOfWeek === 0 ? 2 : firstDayOfWeek === 1 ? 1 : 9 - firstDayOfWeek;

  // 第N月曜日を計算
  const targetDay = firstMonday + (weekNumber - 1) * 7;

  return new Date(year, month - 1, targetDay);
}

/**
 * 指定年の全ての祝日を取得
 * @param year 年
 * @returns 祝日のリスト
 */
export function getHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = [];

  // 固定祝日
  const fixedHolidays = [
    { month: 1, day: 1, name: '元日' },
    { month: 2, day: 11, name: '建国記念の日' },
    { month: 2, day: 23, name: '天皇誕生日' }, // 2020年から
    { month: 4, day: 29, name: '昭和の日' },
    { month: 5, day: 3, name: '憲法記念日' },
    { month: 5, day: 4, name: 'みどりの日' },
    { month: 5, day: 5, name: 'こどもの日' },
    { month: 8, day: 11, name: '山の日' }, // 2016年から
    { month: 11, day: 3, name: '文化の日' },
    { month: 11, day: 23, name: '勤労感謝の日' },
  ];

  for (const h of fixedHolidays) {
    // 天皇誕生日は2020年から
    if (h.name === '天皇誕生日' && year < 2020) continue;
    // 山の日は2016年から
    if (h.name === '山の日' && year < 2016) continue;

    holidays.push({
      date: new Date(year, h.month - 1, h.day),
      name: h.name,
      type: 'fixed',
    });
  }

  // ハッピーマンデー
  if (year >= 2000) {
    holidays.push({
      date: getNthMonday(year, 1, 2),
      name: '成人の日',
      type: 'variable',
    });
  }

  if (year >= 2003) {
    holidays.push({
      date: getNthMonday(year, 7, 3),
      name: '海の日',
      type: 'variable',
    });
  }

  if (year >= 2003) {
    holidays.push({
      date: getNthMonday(year, 9, 3),
      name: '敬老の日',
      type: 'variable',
    });
  }

  if (year >= 2000) {
    holidays.push({
      date: getNthMonday(year, 10, 2),
      name: 'スポーツの日',
      type: 'variable',
    });
  }

  // 春分の日
  holidays.push({
    date: new Date(year, 2, calculateVernalEquinox(year)),
    name: '春分の日',
    type: 'variable',
  });

  // 秋分の日
  holidays.push({
    date: new Date(year, 8, calculateAutumnalEquinox(year)),
    name: '秋分の日',
    type: 'variable',
  });

  // 振替休日の計算
  const substituteHolidays = calculateSubstituteHolidays(holidays, year);
  holidays.push(...substituteHolidays);

  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * 振替休日を計算
 * @param holidays 既存の祝日リスト
 * @param year 年
 * @returns 振替休日のリスト
 */
function calculateSubstituteHolidays(holidays: Holiday[], year: number): Holiday[] {
  const substitutes: Holiday[] = [];

  for (const holiday of holidays) {
    // 日曜日の祝日
    if (getDay(holiday.date) === 0) {
      let nextDay = addDays(holiday.date, 1);

      // 既に祝日でない最初の日を探す
      while (holidays.some(h => isSameDay(h.date, nextDay))) {
        nextDay = addDays(nextDay, 1);
      }

      // 同じ年内のみ
      if (getYear(nextDay) === year) {
        substitutes.push({
          date: nextDay,
          name: '振替休日',
          type: 'substitue',
        });
      }
    }
  }

  return substitutes;
}

/**
 * 指定日付が祝日かどうかをチェック
 * @param date 日付
 * @returns 祝日チェック結果
 */
export function isHoliday(date: Date): HolidayCheckResult {
  if (!isValidDate(date)) {
    return { isHoliday: false };
  }

  const year = getYear(date);
  const holidays = getHolidays(year);

  const holiday = holidays.find(h => isSameDay(h.date, date));

  if (holiday) {
    return { isHoliday: true, holiday };
  }

  return { isHoliday: false };
}

/**
 * 指定期間内の祝日を取得
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns 祝日のリスト
 */
export function getHolidaysInRange(startDate: Date, endDate: Date): Holiday[] {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return [];
  }

  const startYear = getYear(startDate);
  const endYear = getYear(endDate);

  const allHolidays: Holiday[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const holidays = getHolidays(year);
    allHolidays.push(...holidays);
  }

  return allHolidays.filter(
    h => h.date >= startDate && h.date <= endDate
  );
}

/**
 * 指定日付が営業日（平日かつ祝日でない）かどうかをチェック
 * @param date 日付
 * @returns true: 営業日, false: 非営業日
 */
export function isBusinessDay(date: Date): boolean {
  if (!isValidDate(date)) {
    return false;
  }

  const dayOfWeek = getDay(date);

  // 土日は非営業日
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  // 祝日は非営業日
  const holidayCheck = isHoliday(date);
  if (holidayCheck.isHoliday) {
    return false;
  }

  return true;
}
