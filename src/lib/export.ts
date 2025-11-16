import { format } from 'date-fns';

/**
 * 日付配列をCSV形式でエクスポート
 * @param dates 日付配列
 * @param headers ヘッダー（オプション）
 * @param filename ファイル名
 */
export function exportToCSV(
  dates: Date[],
  headers: string[] = ['日付', '曜日'],
  filename: string = 'dates.csv'
): void {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  // CSVヘッダー
  let csvContent = headers.join(',') + '\n';

  // データ行
  for (const date of dates) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const weekday = weekdays[date.getDay()];
    csvContent += `${dateStr},${weekday}\n`;
  }

  // ダウンロード
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * カスタムデータをCSV形式でエクスポート
 * @param data データ配列
 * @param headers ヘッダー
 * @param filename ファイル名
 */
export function exportCustomToCSV(
  data: Record<string, any>[],
  headers: string[],
  filename: string = 'export.csv'
): void {
  // CSVヘッダー
  let csvContent = headers.join(',') + '\n';

  // データ行
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // カンマやダブルクォートを含む場合はエスケープ
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    });
    csvContent += values.join(',') + '\n';
  }

  // ダウンロード
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * 日付配列をiCalendar形式でエクスポート
 * @param dates 日付配列
 * @param title イベントタイトル
 * @param description イベント説明
 * @param filename ファイル名
 */
export function exportToICalendar(
  dates: Date[],
  title: string = 'イベント',
  description: string = '',
  filename: string = 'events.ics'
): void {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Date Toolbox//JP',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ].join('\r\n') + '\r\n';

  for (const date of dates) {
    const dateStr = formatDateForICS(date);
    const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@date-toolbox`;

    icsContent += [
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `DTSTAMP:${formatDateTimeForICS(new Date())}`,
      `UID:${uid}`,
      `SUMMARY:${escapeICSText(title)}`,
      description ? `DESCRIPTION:${escapeICSText(description)}` : '',
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
    ].filter(line => line).join('\r\n') + '\r\n';
  }

  icsContent += 'END:VCALENDAR\r\n';

  // ダウンロード
  downloadFile(icsContent, filename, 'text/calendar;charset=utf-8;');
}

/**
 * 単一イベントをiCalendar形式でエクスポート
 * @param startDate 開始日時
 * @param endDate 終了日時
 * @param title イベントタイトル
 * @param description イベント説明
 * @param filename ファイル名
 */
export function exportEventToICalendar(
  startDate: Date,
  endDate: Date,
  title: string,
  description: string = '',
  filename: string = 'event.ics'
): void {
  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@date-toolbox`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Date Toolbox//JP',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatDateTimeForICS(startDate)}`,
    `DTEND:${formatDateTimeForICS(endDate)}`,
    `DTSTAMP:${formatDateTimeForICS(new Date())}`,
    `UID:${uid}`,
    `SUMMARY:${escapeICSText(title)}`,
    description ? `DESCRIPTION:${escapeICSText(description)}` : '',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(line => line).join('\r\n') + '\r\n';

  // ダウンロード
  downloadFile(icsContent, filename, 'text/calendar;charset=utf-8;');
}

/**
 * 日付をICS形式（YYYYMMDDフォーマット）にフォーマット
 * @param date 日付
 * @returns フォーマット済み文字列
 */
function formatDateForICS(date: Date): string {
  return format(date, 'yyyyMMdd');
}

/**
 * 日時をICS形式（YYYYMMDDTHHmmssフォーマット）にフォーマット
 * @param date 日時
 * @returns フォーマット済み文字列
 */
function formatDateTimeForICS(date: Date): string {
  return format(date, "yyyyMMdd'T'HHmmss");
}

/**
 * ICSテキストをエスケープ
 * @param text テキスト
 * @returns エスケープ済みテキスト
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * ファイルをダウンロード
 * @param content ファイル内容
 * @param filename ファイル名
 * @param mimeType MIMEタイプ
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
