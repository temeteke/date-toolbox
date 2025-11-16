import { useState, useMemo } from 'react';
import DateInput from './common/DateInput';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import { calculateDateRangeStats } from '../lib/dateStats';
import { format } from 'date-fns';

export default function DateStatsTab() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );

  const statsResult = useMemo(() => {
    if (!startDate || !endDate) {
      return { result: null, error: '開始日と終了日を入力してください。' };
    }

    if (startDate > endDate) {
      return { result: null, error: '開始日は終了日より前である必要があります。' };
    }

    const result = calculateDateRangeStats(startDate, endDate);

    if (!result) {
      return { result: null, error: '統計の計算に失敗しました。' };
    }

    return { result, error: '' };
  }, [startDate, endDate]);

  return (
    <div className="date-stats-tab">
      <h2>期間統計</h2>
      <p>指定期間の統計情報を表示します。</p>

      <div className="input-section">
        <DateInput
          label="開始日"
          value={startDate}
          onChange={setStartDate}
          required
        />

        <DateInput
          label="終了日"
          value={endDate}
          onChange={setEndDate}
          required
        />
      </div>

      <ErrorMessage message={statsResult.error} />

      {statsResult.result && !statsResult.error && (
        <div className="results-section">
          <ResultCard title="基本情報">
            <div className="result-item">
              <span className="result-label">期間:</span>
              <span className="result-value">
                {format(statsResult.result.startDate, 'yyyy/MM/dd')} 〜{' '}
                {format(statsResult.result.endDate, 'yyyy/MM/dd')}
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">総日数:</span>
              <span className="result-value">{statsResult.result.totalDays}日</span>
            </div>
            <div className="result-item">
              <span className="result-label">平日:</span>
              <span className="result-value">{statsResult.result.weekdays}日</span>
            </div>
            <div className="result-item">
              <span className="result-label">週末:</span>
              <span className="result-value">{statsResult.result.weekends}日</span>
            </div>
            <div className="result-item">
              <span className="result-label">祝日:</span>
              <span className="result-value">{statsResult.result.holidays}日</span>
            </div>
            <div className="result-item">
              <span className="result-label">営業日:</span>
              <span className="result-value">{statsResult.result.businessDays}日</span>
            </div>
          </ResultCard>

          <ResultCard title="曜日別集計">
            {Object.entries(statsResult.result.dayOfWeekCounts).map(([day, count]) => (
              <div key={day} className="result-item">
                <span className="result-label">{day}曜日:</span>
                <span className="result-value">{count}日</span>
              </div>
            ))}
          </ResultCard>

          <ResultCard title="月別集計">
            {Object.entries(statsResult.result.monthCounts).map(([month, count]) => (
              <div key={month} className="result-item">
                <span className="result-label">{month}:</span>
                <span className="result-value">{count}日</span>
              </div>
            ))}
          </ResultCard>

          <ResultCard title="営業日情報">
            {statsResult.result.firstBusinessDay && (
              <div className="result-item">
                <span className="result-label">最初の営業日:</span>
                <span className="result-value">
                  {format(statsResult.result.firstBusinessDay, 'yyyy/MM/dd (E)')}
                </span>
              </div>
            )}
            {statsResult.result.lastBusinessDay && (
              <div className="result-item">
                <span className="result-label">最後の営業日:</span>
                <span className="result-value">
                  {format(statsResult.result.lastBusinessDay, 'yyyy/MM/dd (E)')}
                </span>
              </div>
            )}
          </ResultCard>

          {statsResult.result.monthEndDates.length > 0 && (
            <ResultCard title="月末日">
              {statsResult.result.monthEndDates.map((date, index) => (
                <div key={index} className="result-item">
                  <span className="result-label">月末:</span>
                  <span className="result-value">
                    {format(date, 'yyyy/MM/dd (E)')}
                  </span>
                </div>
              ))}
            </ResultCard>
          )}
        </div>
      )}
    </div>
  );
}
