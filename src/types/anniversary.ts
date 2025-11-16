/**
 * 記念日情報
 */
export interface Anniversary {
  date: Date;
  daysFromStart: number;
  description: string;
  isSpecial: boolean; // 特別な記念日（100日、1000日、周年など）
}

/**
 * 記念日計算結果
 */
export interface AnniversaryResult {
  startDate: Date;
  targetDate: Date;
  daysSinceStart: number;
  upcomingAnniversaries: Anniversary[];
  pastAnniversaries: Anniversary[];
  nextMilestone: Anniversary | null;
}
