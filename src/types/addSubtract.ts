export type TimeUnit = 'days' | 'weeks' | 'months' | 'years';

export interface AddSubtractInput {
  baseDate: Date;        // 基準日
  amount: number;        // 数量（正: 加算, 負: 減算）
  unit: TimeUnit;        // 単位
}

export interface AddSubtractResult {
  resultDate: Date;          // 計算結果の日付
  dayOfWeek: string;         // 曜日（例: "月曜日"）
  dayOfWeekShort: string;    // 曜日（短縮形、例: "月"）
  daysFromToday: number;     // 今日からの日数（正: 未来, 負: 過去）
  isPast: boolean;           // 過去の日付か
  isFuture: boolean;         // 未来の日付か
  isToday: boolean;          // 今日か
}
