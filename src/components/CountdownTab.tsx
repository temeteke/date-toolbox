import { useState, useEffect } from 'react';
import DateInput from './common/DateInput';
import ResultCard from './common/ResultCard';
import { calculateTimeDifference } from '../lib/format/timeCalc';

type CountMode = 'countdown' | 'countup';

export default function CountdownTab() {
  const [mode, setMode] = useState<CountMode>('countdown');
  const [targetDate, setTargetDate] = useState<Date | null>(new Date());
  const [title, setTitle] = useState<string>('イベント');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // 1秒ごとに現在時刻を更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeDiff = targetDate
    ? calculateTimeDifference(mode === 'countdown' ? currentTime : targetDate, mode === 'countdown' ? targetDate : currentTime)
    : null;

  const isPast = targetDate && currentTime > targetDate;

  return (
    <div className="countdown-tab">
      <h2>カウントダウン/カウントアップ</h2>
      <p>目標日時までの残り時間、または経過時間をリアルタイムで表示します。</p>

      <div className="input-section">
        <div className="mode-selector">
          <label>
            <input
              type="radio"
              name="mode"
              value="countdown"
              checked={mode === 'countdown'}
              onChange={() => setMode('countdown')}
            />
            カウントダウン（残り時間）
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="countup"
              checked={mode === 'countup'}
              onChange={() => setMode('countup')}
            />
            カウントアップ（経過時間）
          </label>
        </div>

        <label>
          タイトル
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="イベント名を入力"
          />
        </label>

        <DateInput
          label={mode === 'countdown' ? '目標日' : '開始日'}
          value={targetDate}
          onChange={setTargetDate}
          required
        />
      </div>

      {targetDate && timeDiff && (
        <div className="results-section">
          <ResultCard title={title || 'イベント'}>
            {mode === 'countdown' && isPast && (
              <div className="result-item warning">
                <span className="result-value">このイベントは既に終了しました</span>
              </div>
            )}

            <div className="countdown-display">
              <div className="countdown-unit">
                <div className="countdown-value">{timeDiff.days}</div>
                <div className="countdown-label">日</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-unit">
                <div className="countdown-value">{String(timeDiff.hours).padStart(2, '0')}</div>
                <div className="countdown-label">時間</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-unit">
                <div className="countdown-value">{String(timeDiff.minutes).padStart(2, '0')}</div>
                <div className="countdown-label">分</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-unit">
                <div className="countdown-value">{String(timeDiff.seconds).padStart(2, '0')}</div>
                <div className="countdown-label">秒</div>
              </div>
            </div>

            <div className="result-details">
              <div className="result-item">
                <span className="result-label">合計時間:</span>
                <span className="result-value">{timeDiff.totalHours.toLocaleString()}時間</span>
              </div>
              <div className="result-item">
                <span className="result-label">合計分:</span>
                <span className="result-value">{timeDiff.totalMinutes.toLocaleString()}分</span>
              </div>
              <div className="result-item">
                <span className="result-label">合計秒:</span>
                <span className="result-value">{timeDiff.totalSeconds.toLocaleString()}秒</span>
              </div>
            </div>
          </ResultCard>
        </div>
      )}
    </div>
  );
}
