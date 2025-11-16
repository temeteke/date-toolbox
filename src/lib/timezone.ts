import type { TimezoneInfo, TimezoneConversionResult, MultiTimezoneDisplay } from '../types/timezone';

/**
 * 主要なタイムゾーンのリスト
 */
export const MAJOR_TIMEZONES: TimezoneInfo[] = [
  { name: '日本標準時 (JST)', identifier: 'Asia/Tokyo', offset: 'UTC+9', abbreviation: 'JST' },
  { name: 'ハワイ標準時 (HST)', identifier: 'Pacific/Honolulu', offset: 'UTC-10', abbreviation: 'HST' },
  { name: 'アラスカ標準時 (AKST)', identifier: 'America/Anchorage', offset: 'UTC-9', abbreviation: 'AKST' },
  { name: '太平洋標準時 (PST)', identifier: 'America/Los_Angeles', offset: 'UTC-8', abbreviation: 'PST' },
  { name: '山岳部標準時 (MST)', identifier: 'America/Denver', offset: 'UTC-7', abbreviation: 'MST' },
  { name: '中部標準時 (CST)', identifier: 'America/Chicago', offset: 'UTC-6', abbreviation: 'CST' },
  { name: '東部標準時 (EST)', identifier: 'America/New_York', offset: 'UTC-5', abbreviation: 'EST' },
  { name: '協定世界時 (UTC)', identifier: 'UTC', offset: 'UTC+0', abbreviation: 'UTC' },
  { name: 'グリニッジ標準時 (GMT)', identifier: 'Europe/London', offset: 'UTC+0', abbreviation: 'GMT' },
  { name: '中央ヨーロッパ時間 (CET)', identifier: 'Europe/Paris', offset: 'UTC+1', abbreviation: 'CET' },
  { name: '東ヨーロッパ時間 (EET)', identifier: 'Europe/Athens', offset: 'UTC+2', abbreviation: 'EET' },
  { name: 'モスクワ標準時 (MSK)', identifier: 'Europe/Moscow', offset: 'UTC+3', abbreviation: 'MSK' },
  { name: 'ドバイ標準時 (GST)', identifier: 'Asia/Dubai', offset: 'UTC+4', abbreviation: 'GST' },
  { name: 'インド標準時 (IST)', identifier: 'Asia/Kolkata', offset: 'UTC+5:30', abbreviation: 'IST' },
  { name: '中国標準時 (CST)', identifier: 'Asia/Shanghai', offset: 'UTC+8', abbreviation: 'CST' },
  { name: '韓国標準時 (KST)', identifier: 'Asia/Seoul', offset: 'UTC+9', abbreviation: 'KST' },
  { name: 'オーストラリア東部標準時 (AEST)', identifier: 'Australia/Sydney', offset: 'UTC+10', abbreviation: 'AEST' },
  { name: 'ニュージーランド標準時 (NZST)', identifier: 'Pacific/Auckland', offset: 'UTC+12', abbreviation: 'NZST' },
];

/**
 * タイムゾーン間で時刻を変換
 * @param date 基準日時
 * @param sourceTimezone 変換元タイムゾーン
 * @param targetTimezone 変換先タイムゾーン
 * @returns 変換結果
 */
export function convertTimezone(
  date: Date,
  sourceTimezone: string,
  targetTimezone: string
): TimezoneConversionResult | null {
  try {
    // ソースタイムゾーンでの時刻を取得
    const sourceTime = new Date(date);

    // ターゲットタイムゾーンでの時刻を計算
    const sourceFormatter = new Intl.DateTimeFormat('ja-JP', {
      timeZone: sourceTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const targetFormatter = new Intl.DateTimeFormat('ja-JP', {
      timeZone: targetTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const sourceFormatted = sourceFormatter.format(sourceTime);
    const targetFormatted = targetFormatter.format(sourceTime);

    // タイムゾーンのオフセット差を計算
    const sourceOffset = getTimezoneOffset(sourceTime, sourceTimezone);
    const targetOffset = getTimezoneOffset(sourceTime, targetTimezone);
    const diffMinutes = targetOffset - sourceOffset;
    const diffHours = Math.floor(Math.abs(diffMinutes) / 60);
    const diffMins = Math.abs(diffMinutes) % 60;

    return {
      sourceTime,
      targetTime: sourceTime,
      formatted: {
        source: sourceFormatted,
        target: targetFormatted,
        sourceISO: sourceTime.toISOString(),
        targetISO: sourceTime.toISOString(),
      },
      timeDifference: {
        hours: diffMinutes >= 0 ? diffHours : -diffHours,
        minutes: diffMins,
      },
    };
  } catch (error) {
    console.error('Timezone conversion failed:', error);
    return null;
  }
}

/**
 * 指定したタイムゾーンのUTCオフセットを分単位で取得
 * @param date 日付
 * @param timezone タイムゾーン
 * @returns UTCオフセット（分）
 */
function getTimezoneOffset(date: Date, timezone: string): number {
  try {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
  } catch {
    return 0;
  }
}

/**
 * 複数のタイムゾーンで現在時刻を表示
 * @param baseDate 基準日時
 * @param timezones タイムゾーンのリスト
 * @returns 各タイムゾーンの表示情報
 */
export function getMultiTimezoneDisplay(
  baseDate: Date,
  timezones: string[]
): MultiTimezoneDisplay[] {
  return timezones.map(timezone => {
    try {
      const formatter = new Intl.DateTimeFormat('ja-JP', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const formatted = formatter.format(baseDate);
      const offset = getTimezoneOffset(baseDate, timezone);
      const offsetHours = Math.floor(Math.abs(offset) / 60);
      const offsetMinutes = Math.abs(offset) % 60;
      const offsetSign = offset >= 0 ? '+' : '-';
      const offsetStr = `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

      return {
        timezone,
        time: baseDate,
        formatted,
        offset: offsetStr,
      };
    } catch (error) {
      console.error(`Failed to format timezone ${timezone}:`, error);
      return {
        timezone,
        time: baseDate,
        formatted: 'エラー',
        offset: 'N/A',
      };
    }
  });
}

/**
 * タイムゾーン名から表示名を取得
 * @param identifier タイムゾーン識別子
 * @returns 表示名
 */
export function getTimezoneName(identifier: string): string {
  const found = MAJOR_TIMEZONES.find(tz => tz.identifier === identifier);
  return found ? found.name : identifier;
}

/**
 * タイムゾーンの現在のオフセット文字列を取得
 * @param timezone タイムゾーン
 * @param date 日付（省略時は現在）
 * @returns オフセット文字列（例: "UTC+9:00"）
 */
export function getCurrentOffset(timezone: string, date: Date = new Date()): string {
  const offset = getTimezoneOffset(date, timezone);
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
