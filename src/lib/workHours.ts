import type { WorkRecord, WorkHoursResult, WorkSummary } from '../types/workHours';

/**
 * 勤務時間を計算
 * @param startTime 開始時刻 (HH:mm format)
 * @param endTime 終了時刻 (HH:mm format)
 * @param breakMinutes 休憩時間（分）
 * @param standardWorkMinutes 標準労働時間（分）デフォルト480分（8時間）
 * @returns 計算結果
 */
export function calculateWorkHours(
  startTime: string,
  endTime: string,
  breakMinutes: number = 0,
  standardWorkMinutes: number = 480
): WorkHoursResult | null {
  try {
    // 時刻をパース
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    if (
      isNaN(startHour) || isNaN(startMin) ||
      isNaN(endHour) || isNaN(endMin) ||
      startHour < 0 || startHour > 23 ||
      endHour < 0 || endHour > 23 ||
      startMin < 0 || startMin > 59 ||
      endMin < 0 || endMin > 59
    ) {
      return null;
    }

    // 分単位に変換
    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;

    // 終了時刻が開始時刻より前の場合、翌日とみなす
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }

    const totalMinutes = endMinutes - startMinutes;
    const workMinutes = Math.max(0, totalMinutes - breakMinutes);

    const hours = Math.floor(workMinutes / 60);
    const minutes = workMinutes % 60;

    const formatted = `${hours}時間${minutes > 0 ? `${minutes}分` : ''}`;

    // 残業時間を計算
    const overtimeMinutes = Math.max(0, workMinutes - standardWorkMinutes);
    const overtimeHours = Math.floor(overtimeMinutes / 60);
    const overtimeMins = overtimeMinutes % 60;
    const overtimeFormatted = overtimeMinutes > 0
      ? `${overtimeHours}時間${overtimeMins > 0 ? `${overtimeMins}分` : ''}`
      : 'なし';

    return {
      totalMinutes,
      workMinutes,
      breakMinutes,
      hours,
      minutes,
      formatted,
      overtimeMinutes,
      overtimeFormatted,
    };
  } catch (error) {
    console.error('Work hours calculation failed:', error);
    return null;
  }
}

/**
 * 複数の勤務記録を集計
 * @param records 勤務記録の配列
 * @param standardWorkMinutes 標準労働時間（分）
 * @returns 集計結果
 */
export function summarizeWorkRecords(
  records: WorkRecord[],
  standardWorkMinutes: number = 480
): WorkSummary | null {
  try {
    if (records.length === 0) {
      return {
        records: [],
        totalWorkMinutes: 0,
        totalBreakMinutes: 0,
        totalDays: 0,
        averageWorkMinutes: 0,
        totalFormatted: '0時間',
        averageFormatted: '0時間',
        overtimeMinutes: 0,
        overtimeFormatted: '0時間',
      };
    }

    let totalWorkMinutes = 0;
    let totalBreakMinutes = 0;

    for (const record of records) {
      const result = calculateWorkHours(
        record.startTime,
        record.endTime,
        record.breakMinutes,
        standardWorkMinutes
      );

      if (result) {
        totalWorkMinutes += result.workMinutes;
        totalBreakMinutes += record.breakMinutes;
      }
    }

    const totalDays = records.length;
    const averageWorkMinutes = Math.floor(totalWorkMinutes / totalDays);

    // 総労働時間のフォーマット
    const totalHours = Math.floor(totalWorkMinutes / 60);
    const totalMins = totalWorkMinutes % 60;
    const totalFormatted = `${totalHours}時間${totalMins > 0 ? `${totalMins}分` : ''}`;

    // 平均労働時間のフォーマット
    const avgHours = Math.floor(averageWorkMinutes / 60);
    const avgMins = averageWorkMinutes % 60;
    const averageFormatted = `${avgHours}時間${avgMins > 0 ? `${avgMins}分` : ''}`;

    // 総残業時間
    const totalStandardMinutes = standardWorkMinutes * totalDays;
    const overtimeMinutes = Math.max(0, totalWorkMinutes - totalStandardMinutes);
    const overtimeHours = Math.floor(overtimeMinutes / 60);
    const overtimeMins = overtimeMinutes % 60;
    const overtimeFormatted = `${overtimeHours}時間${overtimeMins > 0 ? `${overtimeMins}分` : ''}`;

    return {
      records,
      totalWorkMinutes,
      totalBreakMinutes,
      totalDays,
      averageWorkMinutes,
      totalFormatted,
      averageFormatted,
      overtimeMinutes,
      overtimeFormatted,
    };
  } catch (error) {
    console.error('Work summary calculation failed:', error);
    return null;
  }
}

/**
 * 時刻文字列を分に変換
 * @param time 時刻 (HH:mm format)
 * @returns 0時からの経過分
 */
export function timeToMinutes(time: string): number {
  const [hour, min] = time.split(':').map(Number);
  return hour * 60 + min;
}

/**
 * 分を時刻文字列に変換
 * @param minutes 分
 * @returns 時刻 (HH:mm format)
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}
