export interface DateDiffOptions {
  includeStartDate: boolean;  // 開始日を含めるか（デフォルト: true）
  includeEndDate: boolean;    // 終了日を含めるか（デフォルト: true）
  excludeWeekends: boolean;   // 土日を除くか（デフォルト: false）
}

export interface DateDiffResult {
  // 単純な日数差
  totalDays: number;

  // 週数＋余り日数
  weeks: number;
  remainingDays: number;

  // 年月日差（暦としての差）
  years: number;
  months: number;
  days: number;

  // 営業日数（excludeWeekendsがtrueの場合のみ）
  businessDays?: number;
}
