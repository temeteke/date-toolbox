/**
 * 日付比較結果
 */
export interface DateCompareResult {
  dates: Date[];
  sortedDates: Date[];
  earliestDate: Date | null;
  latestDate: Date | null;
  duplicates: Date[];
  isValid: boolean;
}
