import { differenceInMilliseconds, addHours, addMinutes, addSeconds, format } from 'date-fns';
import type { TimeDifference, TimeAddSubtractResult } from '../../types/format/timeCalc';
import { isValidDate } from '../utils';

/**
 * 2つの日時の差を計算
 * @param startDateTime 開始日時
 * @param endDateTime 終了日時
 * @returns 時間差
 */
export function calculateTimeDifference(
  startDateTime: Date,
  endDateTime: Date
): TimeDifference | null {
  if (!isValidDate(startDateTime) || !isValidDate(endDateTime)) {
    return null;
  }

  const totalMilliseconds = Math.abs(differenceInMilliseconds(endDateTime, startDateTime));
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return {
    totalMilliseconds,
    totalSeconds,
    totalMinutes,
    totalHours,
    totalDays,
    days,
    hours,
    minutes,
    seconds,
  };
}

/**
 * 日時に時間を加算
 * @param baseDateTime 基準日時
 * @param hours 時間
 * @param minutes 分
 * @param seconds 秒
 * @returns 計算結果
 */
export function addTime(
  baseDateTime: Date,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0
): TimeAddSubtractResult | null {
  if (!isValidDate(baseDateTime)) {
    return null;
  }

  let result = baseDateTime;
  result = addHours(result, hours);
  result = addMinutes(result, minutes);
  result = addSeconds(result, seconds);

  return {
    resultDate: result,
    formatted: {
      date: format(result, 'yyyy-MM-dd'),
      time: format(result, 'HH:mm:ss'),
      dateTime: format(result, 'yyyy-MM-dd HH:mm:ss'),
      iso: result.toISOString(),
    },
  };
}

/**
 * 日時から時間を減算
 * @param baseDateTime 基準日時
 * @param hours 時間
 * @param minutes 分
 * @param seconds 秒
 * @returns 計算結果
 */
export function subtractTime(
  baseDateTime: Date,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0
): TimeAddSubtractResult | null {
  return addTime(baseDateTime, -hours, -minutes, -seconds);
}

/**
 * タイムゾーン情報を取得
 * @param date 日付
 * @returns タイムゾーン情報
 */
export function getTimezoneInfo(date: Date): {
  offset: number;
  offsetString: string;
  name: string;
} {
  const offset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';

  return {
    offset,
    offsetString: `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`,
    name: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
