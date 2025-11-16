export interface BusinessDaysOptions {
  excludedWeekdays: number[];  // 除外する曜日（0=日曜, 6=土曜）
  holidays: Date[];            // 休日リスト
}

export interface BusinessDaysResult {
  businessDays: number;        // 営業日数
  businessDateList: Date[];    // 営業日の一覧
  excludedWeekends: number;    // 除外された週末の日数
  excludedHolidays: number;    // 除外された祝日の日数
}
