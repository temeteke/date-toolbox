/**
 * 月齢・月相計算ライブラリ
 *
 * 簡易計算式を使用しています。
 * より正確な計算には天文計算ライブラリの使用を推奨します。
 */

import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { MoonPhaseInfo, MoonPhaseCalendar, NextMoonPhaseInfo, MoonPhaseName } from '../../types/analysis/moonPhase';

// 朔望月の平均周期（日）
const SYNODIC_MONTH = 29.530588;

// 既知の新月の日（2000年1月6日18:14 UTC）をユリウス日で表現
const KNOWN_NEW_MOON_JD = 2451550.26;

/**
 * 日付をユリウス日に変換
 * @param date 日付
 * @returns ユリウス日
 */
function dateToJulianDay(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  jd = jd + (hour - 12) / 24 + minute / 1440 + second / 86400;

  return jd;
}

/**
 * 月齢を計算
 * @param date 日付
 * @returns 月齢（0-29.53）
 */
export function getMoonAge(date: Date): number {
  const jd = dateToJulianDay(date);
  const daysSinceNewMoon = jd - KNOWN_NEW_MOON_JD;
  const age = daysSinceNewMoon % SYNODIC_MONTH;

  return age < 0 ? age + SYNODIC_MONTH : age;
}

/**
 * 輝面比を計算
 * @param age 月齢
 * @returns 輝面比（0-100%）
 */
export function getIllumination(age: number): number {
  // 月齢から輝面比を計算
  const phase = (age / SYNODIC_MONTH) * 2 * Math.PI;
  const illumination = (1 - Math.cos(phase)) / 2;
  return illumination * 100;
}

/**
 * 月相名を取得
 * @param age 月齢
 * @returns 月相名
 */
export function getMoonPhaseName(age: number): MoonPhaseName {
  if (age < 1.84) return '新月';
  if (age < 5.53) return '三日月';
  if (age < 9.23) return '上弦';
  if (age < 12.92) return '十三夜';
  if (age < 16.61) return '満月';
  if (age < 20.31) return '十六夜';
  if (age < 24.00) return '下弦';
  if (age < 27.69) return '二十六夜';
  return '新月';
}

/**
 * 月相の絵文字を取得
 * @param phaseName 月相名
 * @returns 絵文字
 */
export function getMoonPhaseEmoji(phaseName: MoonPhaseName): string {
  const emojiMap: Record<MoonPhaseName, string> = {
    '新月': '🌑',
    '三日月': '🌒',
    '上弦': '🌓',
    '十三夜': '🌔',
    '満月': '🌕',
    '十六夜': '🌖',
    '下弦': '🌗',
    '二十六夜': '🌘',
  };
  return emojiMap[phaseName];
}

/**
 * 月相の説明を取得
 * @param phaseName 月相名
 * @returns 説明
 */
export function getMoonPhaseDescription(phaseName: MoonPhaseName): string {
  const descriptionMap: Record<MoonPhaseName, string> = {
    '新月': '月と太陽が同じ方向にあり、月が見えません',
    '三日月': '細い月が西の空に見えます',
    '上弦': '月の右半分が光って見えます',
    '十三夜': '満月に近づき、月が丸く見えます',
    '満月': '月が完全に丸く光って見えます',
    '十六夜': '満月を過ぎ、少し欠け始めます',
    '下弦': '月の左半分が光って見えます',
    '二十六夜': '細い月が東の空に見えます',
  };
  return descriptionMap[phaseName];
}

/**
 * 月相情報を取得
 * @param date 日付
 * @returns 月相情報
 */
export function getMoonPhaseInfo(date: Date): MoonPhaseInfo {
  const age = getMoonAge(date);
  const illumination = getIllumination(age);
  const phase = getMoonPhaseName(age);
  const emoji = getMoonPhaseEmoji(phase);
  const description = getMoonPhaseDescription(phase);

  return {
    date,
    age,
    illumination,
    phase,
    phaseEmoji: emoji,
    description,
  };
}

/**
 * 指定月の月相カレンダーを取得
 * @param year 年
 * @param month 月（1-12）
 * @returns 月相カレンダー
 */
export function getMoonPhaseCalendar(year: number, month: number): MoonPhaseCalendar {
  const date = new Date(year, month - 1, 1);
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const phases = new Map<string, MoonPhaseInfo>();

  for (const day of days) {
    const info = getMoonPhaseInfo(day);
    const key = format(day, 'yyyy-MM-dd');
    phases.set(key, info);
  }

  return {
    year,
    month,
    phases,
  };
}

/**
 * 次の特定月相の日付を取得
 * @param currentDate 現在の日付
 * @param targetPhase 目標月齢（0:新月, 7.38:上弦, 14.77:満月, 22.15:下弦）
 * @returns 次の月相の日付
 */
function getNextPhaseDate(currentDate: Date, targetPhase: number): Date {
  const currentAge = getMoonAge(currentDate);
  let daysToAdd: number;

  if (currentAge <= targetPhase) {
    daysToAdd = targetPhase - currentAge;
  } else {
    daysToAdd = SYNODIC_MONTH - currentAge + targetPhase;
  }

  return addDays(currentDate, Math.round(daysToAdd));
}

/**
 * 次の主要な月相情報を取得
 * @param currentDate 現在の日付
 * @returns 次の月相情報
 */
export function getNextMoonPhaseInfo(currentDate: Date = new Date()): NextMoonPhaseInfo {
  const currentPhase = getMoonPhaseName(getMoonAge(currentDate));

  const nextNewMoon = getNextPhaseDate(currentDate, 0);
  const nextFirstQuarter = getNextPhaseDate(currentDate, 7.38);
  const nextFullMoon = getNextPhaseDate(currentDate, 14.77);
  const nextLastQuarter = getNextPhaseDate(currentDate, 22.15);

  return {
    currentPhase,
    nextNewMoon,
    nextFirstQuarter,
    nextFullMoon,
    nextLastQuarter,
  };
}

/**
 * 指定範囲内の満月の日付を取得
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns 満月の日付リスト
 */
export function getFullMoonDates(startDate: Date, endDate: Date): Date[] {
  const fullMoons: Date[] = [];
  let currentDate = getNextPhaseDate(startDate, 14.77);

  while (currentDate <= endDate) {
    fullMoons.push(currentDate);
    currentDate = addDays(currentDate, SYNODIC_MONTH);
  }

  return fullMoons;
}

/**
 * 指定範囲内の新月の日付を取得
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns 新月の日付リスト
 */
export function getNewMoonDates(startDate: Date, endDate: Date): Date[] {
  const newMoons: Date[] = [];
  let currentDate = getNextPhaseDate(startDate, 0);

  while (currentDate <= endDate) {
    newMoons.push(currentDate);
    currentDate = addDays(currentDate, SYNODIC_MONTH);
  }

  return newMoons;
}
