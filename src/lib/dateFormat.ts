import { format } from 'date-fns';
import type { DateFormatResult } from '../types/dateFormat';

/**
 * 日付を様々なフォーマットに変換
 * @param date 日付
 * @param customFormat カスタムフォーマット（date-fns形式）
 * @returns 変換結果
 */
export function convertDateFormats(
  date: Date,
  customFormat?: string
): DateFormatResult | null {
  try {
    if (!date || isNaN(date.getTime())) {
      return null;
    }

    // ISO 8601形式
    const iso8601 = date.toISOString();

    // RFC 2822形式
    const rfc2822 = date.toString();

    // Unix時間（秒）
    const unix = Math.floor(date.getTime() / 1000);

    // Unix時間（ミリ秒）
    const unixMillis = date.getTime();

    // 日本形式
    const japanese = format(date, 'yyyy年M月d日 H:mm:ss');

    // アメリカ形式
    const american = format(date, 'MM/dd/yyyy HH:mm:ss');

    // ヨーロッパ形式
    const european = format(date, 'dd/MM/yyyy HH:mm:ss');

    // カスタムフォーマット
    let custom: string | undefined;
    if (customFormat) {
      try {
        custom = format(date, customFormat);
      } catch {
        custom = 'フォーマットエラー';
      }
    }

    return {
      iso8601,
      rfc2822,
      unix,
      unixMillis,
      japanese,
      american,
      european,
      custom,
    };
  } catch (error) {
    console.error('Date format conversion failed:', error);
    return null;
  }
}

/**
 * Unix時間（秒）から日付を生成
 * @param unixTimestamp Unix時間（秒）
 * @returns 日付
 */
export function fromUnixTimestamp(unixTimestamp: number): Date | null {
  try {
    const date = new Date(unixTimestamp * 1000);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
}

/**
 * Unix時間（ミリ秒）から日付を生成
 * @param unixMillis Unix時間（ミリ秒）
 * @returns 日付
 */
export function fromUnixMillis(unixMillis: number): Date | null {
  try {
    const date = new Date(unixMillis);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
}

/**
 * ISO 8601形式の文字列から日付を生成
 * @param isoString ISO 8601形式の文字列
 * @returns 日付
 */
export function fromISOString(isoString: string): Date | null {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
}

/**
 * よく使うカスタムフォーマットのプリセット
 */
export const FORMAT_PRESETS = [
  { label: 'YYYY-MM-DD', value: 'yyyy-MM-dd' },
  { label: 'YYYY/MM/DD', value: 'yyyy/MM/dd' },
  { label: 'YYYY年MM月DD日', value: 'yyyy年MM月dd日' },
  { label: 'MM/DD/YYYY', value: 'MM/dd/yyyy' },
  { label: 'DD/MM/YYYY', value: 'dd/MM/yyyy' },
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss' },
  { label: 'YYYY/MM/DD HH:mm:ss', value: 'yyyy/MM/dd HH:mm:ss' },
  { label: 'HH:mm:ss', value: 'HH:mm:ss' },
  { label: 'HH:mm', value: 'HH:mm' },
  { label: 'YYYY-MM-DD\'T\'HH:mm:ss', value: "yyyy-MM-dd'T'HH:mm:ss" },
  { label: 'EEEE, MMMM d, yyyy', value: 'EEEE, MMMM d, yyyy' },
  { label: 'yyyy年M月d日(E)', value: 'yyyy年M月d日(E)' },
];
