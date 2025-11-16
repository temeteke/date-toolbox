import { useState } from 'react';
import DateInput from './common/DateInput';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import { calculateBusinessDays, parseHolidaysFromText } from '../lib/businessDays';
import { formatDateWithWeekdayJa, isValidDateRange } from '../lib/utils';
import type { BusinessDaysOptions } from '../types/businessDays';

const WEEKDAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

export default function BusinessDaysTab() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [excludedWeekdays, setExcludedWeekdays] = useState<number[]>([0, 6]); // デフォルトで土日
  const [holidaysText, setHolidaysText] = useState('');
  const [error, setError] = useState('');

  const handleWeekdayToggle = (weekday: number) => {
    if (excludedWeekdays.includes(weekday)) {
      setExcludedWeekdays(excludedWeekdays.filter(w => w !== weekday));
    } else {
      setExcludedWeekdays([...excludedWeekdays, weekday]);
    }
  };

  const handleCalculate = () => {
    setError('');

    if (!startDate || !endDate) {
      setError('開始日と終了日を入力してください。');
      return null;
    }

    if (!isValidDateRange(startDate, endDate)) {
      setError('開始日は終了日以前の日付を指定してください。');
      return null;
    }

    // 休日リストをパース
    const holidays = parseHolidaysFromText(holidaysText);

    const options: BusinessDaysOptions = {
      excludedWeekdays,
      holidays,
    };

    return calculateBusinessDays(startDate, endDate, options);
  };

  const result = handleCalculate();

  return (
    <div className="business-days-tab">
      <h2>営業日／ビジネス日数計算</h2>
      <p>期間内の営業日数を計算します。</p>

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

        <div className="weekday-exclusion">
          <h3>除外する曜日</h3>
          <div className="weekday-checkboxes">
            {WEEKDAY_NAMES.map((name, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={excludedWeekdays.includes(index)}
                  onChange={() => handleWeekdayToggle(index)}
                />
                {name}
              </label>
            ))}
          </div>
        </div>

        <div className="holidays-input">
          <label>
            <h3>休日リスト（オプション）</h3>
            <p className="input-hint">
              日付を改行またはカンマ区切りで入力してください（例: 2025-01-01）
            </p>
            <textarea
              value={holidaysText}
              onChange={(e) => setHolidaysText(e.target.value)}
              placeholder="2025-01-01&#10;2025-01-13&#10;2025-02-11"
              rows={5}
            />
          </label>
        </div>
      </div>

      <ErrorMessage message={error} />

      {result && !error && (
        <div className="results-section">
          <ResultCard title="計算結果">
            <div className="result-item">
              <span className="result-label">営業日数:</span>
              <span className="result-value highlight">
                {result.businessDays}営業日
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">除外された週末:</span>
              <span className="result-value">{result.excludedWeekends}日</span>
            </div>
            <div className="result-item">
              <span className="result-label">除外された祝日:</span>
              <span className="result-value">{result.excludedHolidays}日</span>
            </div>
          </ResultCard>

          {result.businessDateList.length > 0 && (
            <div className="business-dates-list">
              <h3>営業日一覧 ({result.businessDateList.length}件)</h3>
              <div className="dates-scroll">
                {result.businessDateList.map((date, index) => (
                  <div key={index} className="date-item">
                    {formatDateWithWeekdayJa(date)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
