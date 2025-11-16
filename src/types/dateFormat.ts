/**
 * 日付フォーマット種別
 */
export type DateFormatType =
  | 'iso8601'
  | 'rfc2822'
  | 'unix'
  | 'japanese'
  | 'american'
  | 'european'
  | 'custom';

/**
 * フォーマット変換結果
 */
export interface DateFormatResult {
  iso8601: string;
  rfc2822: string;
  unix: number;
  unixMillis: number;
  japanese: string;
  american: string;
  european: string;
  custom?: string;
}
