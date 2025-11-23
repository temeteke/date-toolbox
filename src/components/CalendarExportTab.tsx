import { useState, useMemo } from 'react';
import { exportToICalendar, exportToCSV } from '../lib/data/export';
import { getHolidays } from '../lib/japanese/holiday';
import { getSekki } from '../lib/japanese/sekki';
import { getFullMoonDates, getNewMoonDates } from '../lib/analysis/moonPhase';
import NumberInput from './common/NumberInput';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';

type ExportType = 'holidays' | 'sekki' | 'moonPhase';
type ExportFormat = 'ics' | 'csv';

export default function CalendarExportTab() {
  const [exportType, setExportType] = useState<ExportType>('holidays');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('ics');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [error, setError] = useState<string>('');

  const previewData = useMemo(() => {
    try {
      switch (exportType) {
        case 'holidays': {
          const holidays = getHolidays(year);
          return {
            count: holidays.length,
            items: holidays.slice(0, 5).map(h => `${h.date.toLocaleDateString('ja-JP')} - ${h.name}`),
          };
        }
        case 'sekki': {
          const sekkiList = getSekki(year);
          return {
            count: sekkiList.length,
            items: sekkiList.slice(0, 5).map(s => `${s.date.toLocaleDateString('ja-JP')} - ${s.name}`),
          };
        }
        case 'moonPhase': {
          const fullMoons = getFullMoonDates(new Date(year, 0, 1), new Date(year, 11, 31));
          const newMoons = getNewMoonDates(new Date(year, 0, 1), new Date(year, 11, 31));
          const total = fullMoons.length + newMoons.length;
          return {
            count: total,
            items: [
              ...fullMoons.slice(0, 2).map(d => `${d.toLocaleDateString('ja-JP')} - 満月`),
              ...newMoons.slice(0, 2).map(d => `${d.toLocaleDateString('ja-JP')} - 新月`),
            ],
          };
        }
        default:
          return { count: 0, items: [] };
      }
    } catch (err) {
      return { count: 0, items: [], error: err instanceof Error ? err.message : 'エラー' };
    }
  }, [exportType, year]);

  const handleExport = () => {
    setError('');

    try {
      let dates: Date[] = [];
      let title = '';
      let description = '';

      switch (exportType) {
        case 'holidays': {
          const holidays = getHolidays(year);
          if (exportFormat === 'ics') {
            dates = holidays.map(h => h.date);
            title = '日本の祝日';
            description = `${year}年の日本の祝日`;
          } else {
            const csvContent = '日付,祝日名\n' +
              holidays.map(h => `${h.date.toLocaleDateString('ja-JP')},${h.name}`).join('\n');
            downloadCSV(csvContent, `holidays_${year}.csv`);
            return;
          }
          break;
        }
        case 'sekki': {
          const sekkiList = getSekki(year);
          dates = sekkiList.map(s => s.date);
          if (exportFormat === 'ics') {
            title = '二十四節気';
            description = `${year}年の二十四節気`;
          } else {
            const csvContent = '日付,節気名,説明\n' +
              sekkiList.map(s => `${s.date.toLocaleDateString('ja-JP')},${s.name},${s.description}`).join('\n');
            downloadCSV(csvContent, `sekki_${year}.csv`);
            return;
          }
          break;
        }
        case 'moonPhase': {
          const fullMoons = getFullMoonDates(new Date(year, 0, 1), new Date(year, 11, 31));
          const newMoons = getNewMoonDates(new Date(year, 0, 1), new Date(year, 11, 31));

          if (exportFormat === 'ics') {
            exportToICalendar(fullMoons, '満月', `${year}年の満月`, `moon_full_${year}.ics`);
            exportToICalendar(newMoons, '新月', `${year}年の新月`, `moon_new_${year}.ics`);
            return;
          } else {
            const csvContent = '日付,月相\n' +
              [...fullMoons.map(d => `${d.toLocaleDateString('ja-JP')},満月`),
               ...newMoons.map(d => `${d.toLocaleDateString('ja-JP')},新月`)].join('\n');
            downloadCSV(csvContent, `moon_phase_${year}.csv`);
            return;
          }
        }
      }

      if (exportFormat === 'ics') {
        exportToICalendar(dates, title, description, `calendar_export_${Date.now()}.ics`);
      } else {
        exportToCSV(dates, ['日付', '曜日'], `calendar_export_${Date.now()}.csv`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エクスポートに失敗しました');
    }
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="calendar-export-tab">
      <h2>カレンダーエクスポート</h2>
      <p>日付データをiCalendar形式やCSV形式でエクスポートします。</p>

      <section className="export-type-section">
        <h3>エクスポートするデータ</h3>
        <div className="export-type-buttons">
          <button
            className={exportType === 'holidays' ? 'active' : ''}
            onClick={() => setExportType('holidays')}
          >
            日本の祝日
          </button>
          <button
            className={exportType === 'sekki' ? 'active' : ''}
            onClick={() => setExportType('sekki')}
          >
            二十四節気
          </button>
          <button
            className={exportType === 'moonPhase' ? 'active' : ''}
            onClick={() => setExportType('moonPhase')}
          >
            月相（満月・新月）
          </button>
        </div>
      </section>

      <section className="format-section">
        <h3>エクスポート形式</h3>
        <div className="format-buttons">
          <button
            className={exportFormat === 'ics' ? 'active' : ''}
            onClick={() => setExportFormat('ics')}
          >
            iCalendar (.ics)
          </button>
          <button
            className={exportFormat === 'csv' ? 'active' : ''}
            onClick={() => setExportFormat('csv')}
          >
            CSV (.csv)
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h3>設定</h3>
        <div className="setting-item">
          <NumberInput
            label="年"
            value={year}
            onChange={setYear}
            min={1900}
            max={2100}
          />
        </div>
      </section>

      <section className="preview-section">
        <ResultCard title="プレビュー">
          {previewData.error ? (
            <ErrorMessage message={previewData.error} />
          ) : (
            <>
              <div className="preview-summary">
                <p>エクスポートされる項目: <strong>{previewData.count}件</strong></p>
              </div>
              <div className="preview-list">
                <h4>最初の数件:</h4>
                <ul>
                  {previewData.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                {previewData.count > 5 && (
                  <p className="preview-more">...他 {previewData.count - 5}件</p>
                )}
              </div>
            </>
          )}
        </ResultCard>
      </section>

      {error && <ErrorMessage message={error} />}

      <section className="action-section">
        <button onClick={handleExport} className="export-button" disabled={previewData.count === 0}>
          エクスポート
        </button>
      </section>

      <section className="info-section">
        <ResultCard title="使い方">
          <div className="usage-info">
            <h4>iCalendar形式 (.ics)</h4>
            <p>
              Googleカレンダー、Apple カレンダー、Microsoft Outlook などのカレンダーアプリにインポートできます。
            </p>

            <h4>CSV形式 (.csv)</h4>
            <p>
              Excel、Googleスプレッドシートなどで開いて編集できます。
            </p>

            <h4>エクスポートできるデータ</h4>
            <ul>
              <li><strong>日本の祝日:</strong> 指定年の日本の国民の祝日</li>
              <li><strong>二十四節気:</strong> 立春、春分、夏至、秋分、冬至など24の節気</li>
              <li><strong>月相:</strong> 満月と新月の日付</li>
            </ul>
          </div>
        </ResultCard>
      </section>
    </div>
  );
}
