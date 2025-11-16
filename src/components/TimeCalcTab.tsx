import { useState, useMemo } from 'react';
import NumberInput from './common/NumberInput';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import { calculateTimeDifference, addTime } from '../lib/format/timeCalc';

type CalcMode = 'diff' | 'add-subtract';

export default function TimeCalcTab() {
  const [mode, setMode] = useState<CalcMode>('diff');

  // 時間差計算用
  const [startDateTime, setStartDateTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [endDateTime, setEndDateTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  // 時間加算/減算用
  const [baseDateTime, setBaseDateTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isAddMode, setIsAddMode] = useState<boolean>(true);

  // 時間差計算結果
  const timeDiffResult = useMemo(() => {
    try {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { result: null, error: '有効な日時を入力してください。' };
      }

      const result = calculateTimeDifference(start, end);
      if (!result) {
        return { result: null, error: '計算に失敗しました。' };
      }

      return { result, error: '' };
    } catch {
      return { result: null, error: '計算に失敗しました。' };
    }
  }, [startDateTime, endDateTime]);

  // 時間加算/減算結果
  const addSubtractResult = useMemo(() => {
    try {
      const base = new Date(baseDateTime);

      if (isNaN(base.getTime())) {
        return { result: null, error: '有効な日時を入力してください。' };
      }

      const h = isAddMode ? hours : -hours;
      const m = isAddMode ? minutes : -minutes;
      const s = isAddMode ? seconds : -seconds;

      const result = addTime(base, h, m, s);
      if (!result) {
        return { result: null, error: '計算に失敗しました。' };
      }

      return { result, error: '' };
    } catch {
      return { result: null, error: '計算に失敗しました。' };
    }
  }, [baseDateTime, hours, minutes, seconds, isAddMode]);

  return (
    <div className="time-calc-tab">
      <h2>時刻計算</h2>
      <p>時刻の計算と加算/減算を行います。</p>

      <div className="input-section">
        <div className="mode-selector">
          <label>
            <input
              type="radio"
              name="mode"
              value="diff"
              checked={mode === 'diff'}
              onChange={() => setMode('diff')}
            />
            時間差計算
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="add-subtract"
              checked={mode === 'add-subtract'}
              onChange={() => setMode('add-subtract')}
            />
            加算/減算
          </label>
        </div>

        {mode === 'diff' ? (
          <div className="time-diff-inputs">
            <label>
              開始日時
              <input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
              />
            </label>
            <label>
              終了日時
              <input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
              />
            </label>
          </div>
        ) : (
          <div className="time-add-subtract-inputs">
            <label>
              基準日時
              <input
                type="datetime-local"
                value={baseDateTime}
                onChange={(e) => setBaseDateTime(e.target.value)}
              />
            </label>

            <div className="operation-selector">
              <label>
                <input
                  type="radio"
                  name="operation"
                  value="add"
                  checked={isAddMode}
                  onChange={() => setIsAddMode(true)}
                />
                加算
              </label>
              <label>
                <input
                  type="radio"
                  name="operation"
                  value="subtract"
                  checked={!isAddMode}
                  onChange={() => setIsAddMode(false)}
                />
                減算
              </label>
            </div>

            <div className="time-inputs">
              <NumberInput
                label="時間"
                value={hours}
                onChange={setHours}
                min={0}
              />
              <NumberInput
                label="分"
                value={minutes}
                onChange={setMinutes}
                min={0}
              />
              <NumberInput
                label="秒"
                value={seconds}
                onChange={setSeconds}
                min={0}
              />
            </div>
          </div>
        )}
      </div>

      {mode === 'diff' ? (
        <>
          <ErrorMessage message={timeDiffResult.error} />
          {timeDiffResult.result && !timeDiffResult.error && (
            <div className="results-section">
              <ResultCard title="時間差">
                <div className="result-item">
                  <span className="result-label">合計:</span>
                  <span className="result-value">
                    {timeDiffResult.result.days}日 {timeDiffResult.result.hours}時間{' '}
                    {timeDiffResult.result.minutes}分 {timeDiffResult.result.seconds}秒
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">総時間:</span>
                  <span className="result-value">{timeDiffResult.result.totalHours}時間</span>
                </div>
                <div className="result-item">
                  <span className="result-label">総分:</span>
                  <span className="result-value">{timeDiffResult.result.totalMinutes}分</span>
                </div>
                <div className="result-item">
                  <span className="result-label">総秒:</span>
                  <span className="result-value">{timeDiffResult.result.totalSeconds}秒</span>
                </div>
              </ResultCard>
            </div>
          )}
        </>
      ) : (
        <>
          <ErrorMessage message={addSubtractResult.error} />
          {addSubtractResult.result && !addSubtractResult.error && (
            <div className="results-section">
              <ResultCard title="計算結果">
                <div className="result-item">
                  <span className="result-label">日時:</span>
                  <span className="result-value">
                    {addSubtractResult.result.formatted.dateTime}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">日付:</span>
                  <span className="result-value">{addSubtractResult.result.formatted.date}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">時刻:</span>
                  <span className="result-value">{addSubtractResult.result.formatted.time}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">ISO形式:</span>
                  <span className="result-value">{addSubtractResult.result.formatted.iso}</span>
                </div>
              </ResultCard>
            </div>
          )}
        </>
      )}
    </div>
  );
}
