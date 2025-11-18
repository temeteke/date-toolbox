import { useMemo } from 'react';
import DateInput from './common/DateInput';
import NumberInput from './common/NumberInput';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import { addSubtractDate } from '../lib/core/addSubtract';
import { formatDateWithWeekdayJa } from '../lib/utils';
import { useQueryParamDate, useQueryParamNumber, useQueryParamState } from '../hooks/useQueryParams';
import type { TimeUnit } from '../types/core/addSubtract';

export default function AddSubtractTab() {
  const [baseDate, setBaseDate] = useQueryParamDate('baseDate', new Date());
  const [amount, setAmount] = useQueryParamNumber('amount', 0);
  const [unit, setUnit] = useQueryParamState<TimeUnit>('unit', 'days');

  const { result, error } = useMemo(() => {
    if (!baseDate) {
      return { result: null, error: '基準日を入力してください。' };
    }

    return { result: addSubtractDate({ baseDate, amount, unit }), error: '' };
  }, [baseDate, amount, unit]);

  const getDirectionText = () => {
    if (!result) return '';
    if (result.isToday) return '今日';
    if (result.isFuture) {
      return `${Math.abs(result.daysFromToday)}日後`;
    }
    return `${Math.abs(result.daysFromToday)}日前`;
  };

  return (
    <div className="add-subtract-tab">
      <h2>加算／減算</h2>
      <p>基準日に対して日数・週・月・年を加算または減算します。</p>

      <div className="input-section">
        <DateInput
          label="基準日"
          value={baseDate}
          onChange={setBaseDate}
          required
        />

        <NumberInput
          label="数値"
          value={amount}
          onChange={setAmount}
        />

        <div className="unit-select">
          <label>単位</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value as TimeUnit)}>
            <option value="days">日</option>
            <option value="weeks">週</option>
            <option value="months">月</option>
            <option value="years">年</option>
          </select>
        </div>
      </div>

      <ErrorMessage message={error} />

      {result && !error && (
        <div className="results-section">
          <ResultCard title="計算結果">
            <div className="result-item">
              <span className="result-label">結果の日付:</span>
              <span className="result-value">
                {formatDateWithWeekdayJa(result.resultDate)}
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">曜日:</span>
              <span className="result-value">{result.dayOfWeek}</span>
            </div>
            <div className="result-item">
              <span className="result-label">今日から:</span>
              <span className="result-value">{getDirectionText()}</span>
            </div>
          </ResultCard>
        </div>
      )}
    </div>
  );
}
