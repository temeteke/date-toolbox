import { useState, useMemo } from 'react';
import DateInput from './common/DateInput';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import { calculateDateDiff } from '../lib/dateDiff';
import { isValidDateRange } from '../lib/utils';
import type { DateDiffOptions } from '../types/dateDiff';

export default function DateDiffTab() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [includeStartDate, setIncludeStartDate] = useState(true);
  const [includeEndDate, setIncludeEndDate] = useState(true);
  const [excludeWeekends, setExcludeWeekends] = useState(false);

  const { result, error } = useMemo(() => {
    if (!startDate || !endDate) {
      return { result: null, error: '開始日と終了日を入力してください。' };
    }

    if (!isValidDateRange(startDate, endDate)) {
      return { result: null, error: '開始日は終了日以前の日付を指定してください。' };
    }

    const options: DateDiffOptions = {
      includeStartDate,
      includeEndDate,
      excludeWeekends,
    };

    return { result: calculateDateDiff(startDate, endDate, options), error: '' };
  }, [startDate, endDate, includeStartDate, includeEndDate, excludeWeekends]);

  return (
    <div className="date-diff-tab">
      <h2>期間計算</h2>
      <p>2つの日付の差を計算します。</p>

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

        <div className="options">
          <h3>オプション</h3>
          <label>
            <input
              type="checkbox"
              checked={includeStartDate}
              onChange={(e) => setIncludeStartDate(e.target.checked)}
            />
            開始日を含める
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeEndDate}
              onChange={(e) => setIncludeEndDate(e.target.checked)}
            />
            終了日を含める
          </label>
          <label>
            <input
              type="checkbox"
              checked={excludeWeekends}
              onChange={(e) => setExcludeWeekends(e.target.checked)}
            />
            土日を除く
          </label>
        </div>
      </div>

      <ErrorMessage message={error} />

      {result && !error && (
        <div className="results-section">
          <ResultCard title="計算結果">
            <div className="result-item">
              <span className="result-label">日数差:</span>
              <span className="result-value">{result.totalDays}日</span>
            </div>
            <div className="result-item">
              <span className="result-label">週数表示:</span>
              <span className="result-value">
                {result.weeks}週と{result.remainingDays}日
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">年月日差:</span>
              <span className="result-value">
                {result.years}年{result.months}か月{result.days}日
              </span>
            </div>
            {result.businessDays !== undefined && (
              <div className="result-item">
                <span className="result-label">営業日数:</span>
                <span className="result-value">{result.businessDays}営業日</span>
              </div>
            )}
          </ResultCard>
        </div>
      )}
    </div>
  );
}
