import { isBefore, isAfter, isEqual } from 'date-fns';
import type { WarekiEra, WarekiDate, WarekiConversionResult } from '../../types/japanese/wareki';
import { isValidDate } from '../utils';

/**
 * 元号データ（明治以降）
 */
const ERAS: WarekiEra[] = [
  {
    name: '明治',
    nameEn: 'Meiji',
    symbol: 'M',
    startDate: new Date(1868, 0, 25),  // 1868年1月25日
    endDate: new Date(1912, 6, 29),    // 1912年7月29日
  },
  {
    name: '大正',
    nameEn: 'Taisho',
    symbol: 'T',
    startDate: new Date(1912, 6, 30),  // 1912年7月30日
    endDate: new Date(1926, 11, 24),   // 1926年12月24日
  },
  {
    name: '昭和',
    nameEn: 'Showa',
    symbol: 'S',
    startDate: new Date(1926, 11, 25), // 1926年12月25日
    endDate: new Date(1989, 0, 7),     // 1989年1月7日
  },
  {
    name: '平成',
    nameEn: 'Heisei',
    symbol: 'H',
    startDate: new Date(1989, 0, 8),   // 1989年1月8日
    endDate: new Date(2019, 4, 30),    // 2019年4月30日
  },
  {
    name: '令和',
    nameEn: 'Reiwa',
    symbol: 'R',
    startDate: new Date(2019, 4, 1),   // 2019年5月1日
    endDate: null,                      // 現在の元号
  },
];

/**
 * 西暦日付から元号を取得
 * @param date 西暦日付
 * @returns 元号データ（該当なしの場合はnull）
 */
export function getEraForDate(date: Date): WarekiEra | null {
  if (!isValidDate(date)) {
    return null;
  }

  for (const era of ERAS) {
    const afterStart = isAfter(date, era.startDate) || isEqual(date, era.startDate);
    const beforeEnd = era.endDate === null || isBefore(date, era.endDate) || isEqual(date, era.endDate);

    if (afterStart && beforeEnd) {
      return era;
    }
  }

  return null;
}

/**
 * 西暦を和暦に変換
 * @param date 西暦日付
 * @returns 和暦変換結果（変換できない場合はnull）
 */
export function convertToWareki(date: Date): WarekiConversionResult | null {
  if (!isValidDate(date)) {
    return null;
  }

  const era = getEraForDate(date);
  if (!era) {
    return null;
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 元号の年を計算
  const eraYear = year - era.startDate.getFullYear() + 1;

  const wareki: WarekiDate = {
    era: era.name,
    eraSymbol: era.symbol,
    year: eraYear,
    month,
    day,
    westernYear: year,
  };

  return {
    wareki,
    formatted: {
      full: `${era.name}${eraYear === 1 ? '元' : eraYear}年${month}月${day}日`,
      short: `${era.symbol}${eraYear}.${month}.${day}`,
      standard: `${era.name}${eraYear === 1 ? '元' : eraYear}年${String(month).padStart(2, '0')}月${String(day).padStart(2, '0')}日`,
    },
  };
}

/**
 * 和暦を西暦に変換
 * @param eraName 元号名または記号
 * @param year 年（元号の年）
 * @param month 月
 * @param day 日
 * @returns 西暦日付（変換できない場合はnull）
 */
export function convertToSeireki(
  eraName: string,
  year: number,
  month: number,
  day: number
): Date | null {
  // 元号を検索（名前または記号で）
  const era = ERAS.find((e) => e.name === eraName || e.symbol === eraName);
  if (!era) {
    return null;
  }

  // 西暦年を計算
  const westernYear = era.startDate.getFullYear() + year - 1;

  // 日付を作成
  const date = new Date(westernYear, month - 1, day);

  // 有効な日付かチェック
  if (!isValidDate(date)) {
    return null;
  }

  // 元号の範囲内かチェック
  const afterStart = isAfter(date, era.startDate) || isEqual(date, era.startDate);
  const beforeEnd = era.endDate === null || isBefore(date, era.endDate) || isEqual(date, era.endDate);

  if (!afterStart || !beforeEnd) {
    return null;
  }

  return date;
}

/**
 * 全ての元号リストを取得
 * @returns 元号リスト
 */
export function getAllEras(): WarekiEra[] {
  return [...ERAS];
}

/**
 * 現在の元号を取得
 * @returns 現在の元号
 */
export function getCurrentEra(): WarekiEra {
  return ERAS[ERAS.length - 1];
}
