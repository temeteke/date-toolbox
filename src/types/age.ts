export interface AgeInput {
  birthDate: Date;               // 生年月日
  referenceDate?: Date;          // 基準日（デフォルト: 今日）
}

export interface AgeResult {
  years: number;                 // 年齢（年）
  months: number;                // 月数（年を除いた残り）
  days: number;                  // 日数（年月を除いた残り）
  totalDays: number;             // 総日数
  totalMonths: number;           // 総月数（概算）
  nextBirthday: Date;            // 次の誕生日
  daysUntilNextBirthday: number; // 次の誕生日までの日数
}

export interface MilestoneAge {
  age: number;                   // 節目の年齢
  date: Date;                    // その年齢になる日
  isPast: boolean;               // 既に過ぎたか
}
