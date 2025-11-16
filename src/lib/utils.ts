import { format, parse, isValid, isBefore, isEqual } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * 日付を文字列にフォーマット
 * @param date 日付
 * @param formatStr フォーマット（デフォルト: 'yyyy-MM-dd'）
 * @returns フォーマット済み文字列
 */
export function formatDate(date: Date, formatStr: string = 'yyyy-MM-dd'): string {
  return format(date, formatStr, { locale: ja });
}

/**
 * 文字列を日付にパース
 * @param dateString 日付文字列
 * @returns パースされた日付（無効な場合はnull）
 */
export function parseDate(dateString: string): Date | null {
  // まずISO形式（yyyy-MM-dd）で試す
  const parsed = parse(dateString, 'yyyy-MM-dd', new Date());
  if (isValidDate(parsed)) {
    return parsed;
  }

  // 次にyyyy/MM/dd形式で試す
  const parsed2 = parse(dateString, 'yyyy/MM/dd', new Date());
  if (isValidDate(parsed2)) {
    return parsed2;
  }

  // 直接Dateコンストラクタで試す
  const parsed3 = new Date(dateString);
  if (isValidDate(parsed3)) {
    return parsed3;
  }

  return null;
}

/**
 * 有効な日付かどうかを判定
 * @param date 日付
 * @returns true: 有効, false: 無効
 */
export function isValidDate(date: Date): boolean {
  return isValid(date) && !isNaN(date.getTime());
}

/**
 * 日付範囲が有効かどうかを判定
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns true: 有効（開始日 <= 終了日）, false: 無効
 */
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  return isValidDate(startDate) && isValidDate(endDate) &&
         (isBefore(startDate, endDate) || isEqual(startDate, endDate));
}

/**
 * 曜日番号から日本語曜日名を取得
 * @param weekday 曜日番号（0=日曜, 6=土曜）
 * @param short 短縮形か
 * @returns 曜日名
 */
export function getWeekdayNameJa(weekday: number, short: boolean = false): string {
  const weekdays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
  const weekdaysShort = ['日', '月', '火', '水', '木', '金', '土'];

  const index = weekday % 7;
  return short ? weekdaysShort[index] : weekdays[index];
}

/**
 * 日付配列をソート（昇順）
 * @param dates 日付配列
 * @returns ソート済み配列
 */
export function sortDates(dates: Date[]): Date[] {
  return [...dates].sort((a, b) => a.getTime() - b.getTime());
}

/**
 * 日付を「yyyy年MM月dd日」形式にフォーマット
 * @param date 日付
 * @returns フォーマット済み文字列
 */
export function formatDateJa(date: Date): string {
  return format(date, 'yyyy年MM月dd日', { locale: ja });
}

/**
 * 日付を「yyyy年MM月dd日（曜日）」形式にフォーマット
 * @param date 日付
 * @returns フォーマット済み文字列
 */
export function formatDateWithWeekdayJa(date: Date): string {
  return format(date, 'yyyy年MM月dd日（E）', { locale: ja });
}
