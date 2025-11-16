import { useState } from 'react';
import DateInput from './common/DateInput';
import ErrorMessage from './common/ErrorMessage';
import { generateRecurringDates } from '../lib/recurrence';
import { formatDateWithWeekdayJa, isValidDateRange } from '../lib/utils';
import type { RecurrenceType, RecurrencePattern } from '../types/recurrence';

const WEEKDAY_NAMES = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
const WEEK_NUMBERS = [
  { value: 1, label: '第1' },
  { value: 2, label: '第2' },
  { value: 3, label: '第3' },
  { value: 4, label: '第4' },
  { value: 5, label: '第5' },
];

export default function RecurrenceTab() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('weekly');
  const [weekday, setWeekday] = useState(1); // 月曜日
  const [monthDate, setMonthDate] = useState(1);
  const [weekNumber, setWeekNumber] = useState(1);
  const [error, setError] = useState('');

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

    let pattern: RecurrencePattern;

    switch (recurrenceType) {
      case 'weekly':
        pattern = { type: 'weekly', weekday };
        break;
      case 'monthly-date':
        pattern = { type: 'monthly-date', date: monthDate };
        break;
      case 'monthly-weekday':
        pattern = { type: 'monthly-weekday', weekday, weekNumber };
        break;
    }

    const result = generateRecurringDates({
      startDate,
      endDate,
      pattern,
    });

    if (result.count === 0) {
      setError('指定された条件に一致する日付が見つかりませんでした。');
      return null;
    }

    if (result.count > 1000) {
      setError('日付が1000件を超えました。期間を短くしてください。');
      return null;
    }

    return result;
  };

  const result = handleCalculate();

  return (
    <div className="recurrence-tab">
      <h2>繰り返し日付の生成</h2>
      <p>指定したパターンで繰り返す日付を生成します。</p>

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

        <div className="recurrence-pattern">
          <h3>繰り返しパターン</h3>

          <div className="pattern-option">
            <label>
              <input
                type="radio"
                name="recurrence-type"
                value="weekly"
                checked={recurrenceType === 'weekly'}
                onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
              />
              毎週○曜日
            </label>
            {recurrenceType === 'weekly' && (
              <div className="pattern-detail">
                <select
                  value={weekday}
                  onChange={(e) => setWeekday(parseInt(e.target.value))}
                >
                  {WEEKDAY_NAMES.map((name, index) => (
                    <option key={index} value={index}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pattern-option">
            <label>
              <input
                type="radio"
                name="recurrence-type"
                value="monthly-date"
                checked={recurrenceType === 'monthly-date'}
                onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
              />
              毎月○日
            </label>
            {recurrenceType === 'monthly-date' && (
              <div className="pattern-detail">
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={monthDate}
                  onChange={(e) => setMonthDate(parseInt(e.target.value))}
                />
                日
              </div>
            )}
          </div>

          <div className="pattern-option">
            <label>
              <input
                type="radio"
                name="recurrence-type"
                value="monthly-weekday"
                checked={recurrenceType === 'monthly-weekday'}
                onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
              />
              毎月第N○曜日
            </label>
            {recurrenceType === 'monthly-weekday' && (
              <div className="pattern-detail">
                <select
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(parseInt(e.target.value))}
                >
                  {WEEK_NUMBERS.map((wn) => (
                    <option key={wn.value} value={wn.value}>
                      {wn.label}
                    </option>
                  ))}
                </select>
                <select
                  value={weekday}
                  onChange={(e) => setWeekday(parseInt(e.target.value))}
                >
                  {WEEKDAY_NAMES.map((name, index) => (
                    <option key={index} value={index}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <ErrorMessage message={error} />

      {result && !error && (
        <div className="results-section">
          <div className="result-summary">
            <h3>該当日数: {result.count}件</h3>
          </div>

          <div className="recurrence-dates-list">
            <h3>日付一覧</h3>
            <div className="dates-scroll">
              {result.dates.map((date, index) => (
                <div key={index} className="date-item">
                  {formatDateWithWeekdayJa(date)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
