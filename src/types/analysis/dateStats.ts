/**
 * 期間統計結果
 */
export interface DateRangeStats {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  weekdays: number; // 平日（月〜金）
  weekends: number; // 週末（土日）
  holidays: number; // 祝日
  businessDays: number; // 営業日（平日 - 祝日）
  dayOfWeekCounts: Record<string, number>; // 各曜日の出現回数
  monthCounts: Record<string, number>; // 各月の日数
  firstBusinessDay: Date | null; // 期間内の最初の営業日
  lastBusinessDay: Date | null; // 期間内の最後の営業日
  monthEndDates: Date[]; // 月末日のリスト
  monthStartDates: Date[]; // 月初日のリスト
}
