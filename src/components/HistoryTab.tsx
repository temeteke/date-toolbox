import { useState, useEffect } from 'react';
import { getHistory, removeHistoryItem, clearHistory } from '../lib/history';
import type { HistoryItem } from '../types/history';
import ResultCard from './common/ResultCard';
import { format } from 'date-fns';

export default function HistoryTab() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const items = getHistory();
    setHistory(items);
  };

  const handleRemove = (id: string) => {
    removeHistoryItem(id);
    loadHistory();
  };

  const handleClear = () => {
    if (window.confirm('全ての履歴を削除しますか？')) {
      clearHistory();
      loadHistory();
    }
  };

  const filteredHistory = filterType === 'all'
    ? history
    : history.filter(item => item.type === filterType);

  const typeLabels: Record<string, string> = {
    'date-diff': '期間計算',
    'add-subtract': '加算/減算',
    'age': '年齢計算',
    'business-days': '営業日',
    'recurrence': '繰り返し',
    'wareki': '和暦変換',
    'time-calc': '時刻計算',
    'countdown': 'カウントダウン',
    'timezone': 'タイムゾーン',
    'work-hours': '勤務時間',
    'date-format': '日付フォーマット',
  };

  return (
    <div className="history-tab">
      <h2>計算履歴</h2>
      <p>過去の計算履歴を表示します。</p>

      <div className="input-section">
        <div className="filter-section">
          <label>
            フィルター:
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">全て</option>
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {history.length > 0 && (
            <button onClick={handleClear} className="clear-button">
              全ての履歴をクリア
            </button>
          )}
        </div>
      </div>

      <div className="results-section">
        {filteredHistory.length === 0 ? (
          <ResultCard title="履歴なし">
            <p>まだ計算履歴がありません。</p>
          </ResultCard>
        ) : (
          <div className="history-list">
            {filteredHistory.map((item) => (
              <ResultCard
                key={item.id}
                title={typeLabels[item.type] || item.type}
              >
                <div className="history-item">
                  <div className="history-header">
                    <span className="history-timestamp">
                      {format(new Date(item.timestamp), 'yyyy/MM/dd HH:mm:ss')}
                    </span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="remove-button"
                    >
                      削除
                    </button>
                  </div>
                  <div className="history-description">
                    {item.description}
                  </div>
                  {item.data && typeof item.data === 'object' && (
                    <div className="history-data">
                      <pre>{JSON.stringify(item.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </ResultCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
