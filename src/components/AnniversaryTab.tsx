import { useState, useMemo } from 'react';
import DateInput from './common/DateInput';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import { calculateAnniversaries } from '../lib/analysis/anniversary';
import { format, differenceInDays } from 'date-fns';

export default function AnniversaryTab() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [eventName, setEventName] = useState<string>('記念日');

  const anniversaryResult = useMemo(() => {
    if (!startDate) {
      return { result: null, error: '開始日を入力してください。' };
    }

    const result = calculateAnniversaries(startDate, new Date(), 10);

    if (!result) {
      return { result: null, error: '計算に失敗しました。' };
    }

    return { result, error: '' };
  }, [startDate]);

  return (
    <div className="anniversary-tab">
      <h2>記念日計算</h2>
      <p>特別な日からの記念日を計算します。</p>

      <div className="input-section">
        <label>
          イベント名
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="例: 交際記念日、結婚記念日"
          />
        </label>

        <DateInput
          label="開始日"
          value={startDate}
          onChange={setStartDate}
          required
        />
      </div>

      <ErrorMessage message={anniversaryResult.error} />

      {anniversaryResult.result && !anniversaryResult.error && (
        <div className="results-section">
          <ResultCard title={`${eventName}からの経過`}>
            <div className="result-item">
              <span className="result-label">開始日:</span>
              <span className="result-value">
                {format(anniversaryResult.result.startDate, 'yyyy年M月d日 (E)')}
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">今日まで:</span>
              <span className="result-value">{anniversaryResult.result.daysSinceStart}日</span>
            </div>
            {anniversaryResult.result.nextMilestone && (
              <>
                <div className="result-item">
                  <span className="result-label">次の記念日:</span>
                  <span className="result-value">
                    {anniversaryResult.result.nextMilestone.description}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">記念日の日付:</span>
                  <span className="result-value">
                    {format(anniversaryResult.result.nextMilestone.date, 'yyyy年M月d日 (E)')}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">あと何日:</span>
                  <span className="result-value">
                    {differenceInDays(
                      anniversaryResult.result.nextMilestone.date,
                      anniversaryResult.result.targetDate
                    )}日
                  </span>
                </div>
              </>
            )}
          </ResultCard>

          {anniversaryResult.result.pastAnniversaries.length > 0 && (
            <ResultCard title="過去の記念日">
              {anniversaryResult.result.pastAnniversaries.map((anniversary, index) => (
                <div key={index} className="result-item">
                  <span className="result-label">{anniversary.description}:</span>
                  <span className="result-value">
                    {format(anniversary.date, 'yyyy年M月d日 (E)')}
                  </span>
                </div>
              ))}
            </ResultCard>
          )}

          <ResultCard title="今後の記念日">
            {anniversaryResult.result.upcomingAnniversaries.map((anniversary, index) => (
              <div key={index} className="result-item">
                <span className="result-label">
                  {anniversary.description}
                  {anniversary.isSpecial && ' ⭐'}:
                </span>
                <span className="result-value">
                  {format(anniversary.date, 'yyyy年M月d日 (E)')}
                  {' '}
                  （あと{differenceInDays(anniversary.date, anniversaryResult.result!.targetDate)}日）
                </span>
              </div>
            ))}
          </ResultCard>
        </div>
      )}
    </div>
  );
}
