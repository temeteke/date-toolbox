import { useState, useMemo, useEffect } from 'react';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import { MAJOR_TIMEZONES, convertTimezone, getMultiTimezoneDisplay, getTimezoneName, getCurrentOffset } from '../lib/timezone';

type ViewMode = 'convert' | 'multi';

export default function TimezoneTab() {
  const [mode, setMode] = useState<ViewMode>('convert');

  // 変換モード用
  const [dateTime, setDateTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [sourceTimezone, setSourceTimezone] = useState<string>('Asia/Tokyo');
  const [targetTimezone, setTargetTimezone] = useState<string>('America/New_York');

  // マルチタイムゾーン表示用
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([
    'Asia/Tokyo',
    'America/New_York',
    'Europe/London',
    'UTC',
  ]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // 1秒ごとに時刻を更新（マルチモード時のみ）
  useEffect(() => {
    if (mode === 'multi') {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  // タイムゾーン変換結果
  const conversionResult = useMemo(() => {
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) {
        return { result: null, error: '有効な日時を入力してください。' };
      }

      const result = convertTimezone(date, sourceTimezone, targetTimezone);
      if (!result) {
        return { result: null, error: '変換に失敗しました。' };
      }

      return { result, error: '' };
    } catch {
      return { result: null, error: '変換に失敗しました。' };
    }
  }, [dateTime, sourceTimezone, targetTimezone]);

  // マルチタイムゾーン表示
  const multiTimezoneDisplay = useMemo(() => {
    return getMultiTimezoneDisplay(currentTime, selectedTimezones);
  }, [currentTime, selectedTimezones]);

  const handleTimezoneToggle = (timezone: string) => {
    if (selectedTimezones.includes(timezone)) {
      setSelectedTimezones(selectedTimezones.filter(tz => tz !== timezone));
    } else {
      setSelectedTimezones([...selectedTimezones, timezone]);
    }
  };

  return (
    <div className="timezone-tab">
      <h2>タイムゾーン変換</h2>
      <p>世界各地のタイムゾーン間で時刻を変換します。</p>

      <div className="input-section">
        <div className="mode-selector">
          <label>
            <input
              type="radio"
              name="mode"
              value="convert"
              checked={mode === 'convert'}
              onChange={() => setMode('convert')}
            />
            タイムゾーン変換
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="multi"
              checked={mode === 'multi'}
              onChange={() => setMode('multi')}
            />
            複数タイムゾーン表示
          </label>
        </div>

        {mode === 'convert' ? (
          <div className="timezone-convert-inputs">
            <label>
              基準日時
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </label>

            <label>
              変換元タイムゾーン
              <select
                value={sourceTimezone}
                onChange={(e) => setSourceTimezone(e.target.value)}
              >
                {MAJOR_TIMEZONES.map(tz => (
                  <option key={tz.identifier} value={tz.identifier}>
                    {tz.name} ({tz.offset})
                  </option>
                ))}
              </select>
            </label>

            <label>
              変換先タイムゾーン
              <select
                value={targetTimezone}
                onChange={(e) => setTargetTimezone(e.target.value)}
              >
                {MAJOR_TIMEZONES.map(tz => (
                  <option key={tz.identifier} value={tz.identifier}>
                    {tz.name} ({tz.offset})
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div className="timezone-multi-inputs">
            <label>表示するタイムゾーン（複数選択可）</label>
            <div className="timezone-checkboxes">
              {MAJOR_TIMEZONES.map(tz => (
                <label key={tz.identifier} className="timezone-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedTimezones.includes(tz.identifier)}
                    onChange={() => handleTimezoneToggle(tz.identifier)}
                  />
                  {tz.name}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {mode === 'convert' ? (
        <>
          <ErrorMessage message={conversionResult.error} />
          {conversionResult.result && !conversionResult.error && (
            <div className="results-section">
              <ResultCard title="変換結果">
                <div className="result-item">
                  <span className="result-label">{getTimezoneName(sourceTimezone)}:</span>
                  <span className="result-value">{conversionResult.result.formatted.source}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">{getTimezoneName(targetTimezone)}:</span>
                  <span className="result-value">{conversionResult.result.formatted.target}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">時差:</span>
                  <span className="result-value">
                    {conversionResult.result.timeDifference.hours}時間
                    {conversionResult.result.timeDifference.minutes > 0 && `${conversionResult.result.timeDifference.minutes}分`}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">変換元オフセット:</span>
                  <span className="result-value">{getCurrentOffset(sourceTimezone, conversionResult.result.sourceTime)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">変換先オフセット:</span>
                  <span className="result-value">{getCurrentOffset(targetTimezone, conversionResult.result.targetTime)}</span>
                </div>
              </ResultCard>
            </div>
          )}
        </>
      ) : (
        <div className="results-section">
          <ResultCard title="世界の時刻">
            {multiTimezoneDisplay.length === 0 && (
              <p>タイムゾーンを選択してください。</p>
            )}
            {multiTimezoneDisplay.map(display => (
              <div key={display.timezone} className="result-item">
                <span className="result-label">
                  {getTimezoneName(display.timezone)} ({display.offset}):
                </span>
                <span className="result-value">{display.formatted}</span>
              </div>
            ))}
          </ResultCard>
        </div>
      )}
    </div>
  );
}
