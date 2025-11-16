import { useState, useMemo } from 'react';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import { compareDateStrings, sortDatesDescending } from '../lib/core/dateCompare';
import { format } from 'date-fns';

export default function DateCompareTab() {
  const [dateInput, setDateInput] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const compareResult = useMemo(() => {
    const dateStrings = dateInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (dateStrings.length === 0) {
      return { result: null, error: '' };
    }

    const result = compareDateStrings(dateStrings);

    if (!result || !result.isValid) {
      return { result: null, error: '有効な日付を入力してください。' };
    }

    return { result, error: '' };
  }, [dateInput]);

  const displayDates = useMemo(() => {
    if (!compareResult.result) {
      return [];
    }

    return sortOrder === 'asc'
      ? compareResult.result.sortedDates
      : sortDatesDescending(compareResult.result.sortedDates);
  }, [compareResult.result, sortOrder]);

  return (
    <div className="date-compare-tab">
      <h2>日付の比較・ソート</h2>
      <p>複数の日付を比較して並び替えます。</p>

      <div className="input-section">
        <label>
          日付リスト（1行に1つずつ入力）
          <textarea
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder={'2025-01-15\n2024-12-31\n2025-03-20\n...'}
            rows={10}
          />
        </label>

        <div className="sort-order-selector">
          <label>
            並び順:
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
              <option value="asc">昇順（古い順）</option>
              <option value="desc">降順（新しい順）</option>
            </select>
          </label>
        </div>
      </div>

      <ErrorMessage message={compareResult.error} />

      {compareResult.result && !compareResult.error && (
        <div className="results-section">
          <ResultCard title="比較結果">
            <div className="result-item">
              <span className="result-label">入力された日付数:</span>
              <span className="result-value">{compareResult.result.dates.length}件</span>
            </div>
            {compareResult.result.earliestDate && (
              <div className="result-item">
                <span className="result-label">最も古い日付:</span>
                <span className="result-value">
                  {format(compareResult.result.earliestDate, 'yyyy年M月d日 (E)')}
                </span>
              </div>
            )}
            {compareResult.result.latestDate && (
              <div className="result-item">
                <span className="result-label">最も新しい日付:</span>
                <span className="result-value">
                  {format(compareResult.result.latestDate, 'yyyy年M月d日 (E)')}
                </span>
              </div>
            )}
            {compareResult.result.duplicates.length > 0 && (
              <div className="result-item">
                <span className="result-label">重複する日付:</span>
                <span className="result-value">{compareResult.result.duplicates.length}件</span>
              </div>
            )}
          </ResultCard>

          <ResultCard title="ソート済み日付リスト">
            <div className="date-list">
              {displayDates.map((date, index) => (
                <div key={index} className="result-item">
                  <span className="result-label">{index + 1}.</span>
                  <span className="result-value">
                    {format(date, 'yyyy年M月d日 (E)')}
                    {' '}
                    [{format(date, 'yyyy-MM-dd')}]
                  </span>
                </div>
              ))}
            </div>
          </ResultCard>

          {compareResult.result.duplicates.length > 0 && (
            <ResultCard title="重複している日付">
              {compareResult.result.duplicates.map((date, index) => (
                <div key={index} className="result-item">
                  <span className="result-label">重複:</span>
                  <span className="result-value">
                    {format(date, 'yyyy年M月d日 (E)')}
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
