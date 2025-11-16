import { useState, useMemo } from 'react';
import DateInput from './common/DateInput';
import NumberInput from './common/NumberInput';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import { calculateWorkHours, summarizeWorkRecords } from '../lib/workHours';
import type { WorkRecord } from '../types/workHours';
import { format } from 'date-fns';

type CalcMode = 'single' | 'summary';

export default function WorkHoursTab() {
  const [mode, setMode] = useState<CalcMode>('single');

  // 単一計算用
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('18:00');
  const [breakMinutes, setBreakMinutes] = useState<number>(60);
  const [standardWorkHours, setStandardWorkHours] = useState<number>(8);

  // 集計用
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [newRecordDate, setNewRecordDate] = useState<Date | null>(new Date());
  const [newRecordStart, setNewRecordStart] = useState<string>('09:00');
  const [newRecordEnd, setNewRecordEnd] = useState<string>('18:00');
  const [newRecordBreak, setNewRecordBreak] = useState<number>(60);

  // 単一計算結果
  const singleResult = useMemo(() => {
    const result = calculateWorkHours(
      startTime,
      endTime,
      breakMinutes,
      standardWorkHours * 60
    );

    if (!result) {
      return { result: null, error: '有効な時刻を入力してください。' };
    }

    return { result, error: '' };
  }, [startTime, endTime, breakMinutes, standardWorkHours]);

  // 集計結果
  const summaryResult = useMemo(() => {
    const result = summarizeWorkRecords(records, standardWorkHours * 60);

    if (!result) {
      return { result: null, error: '集計に失敗しました。' };
    }

    return { result, error: '' };
  }, [records, standardWorkHours]);

  const handleAddRecord = () => {
    if (!newRecordDate) {
      return;
    }

    const newRecord: WorkRecord = {
      date: newRecordDate,
      startTime: newRecordStart,
      endTime: newRecordEnd,
      breakMinutes: newRecordBreak,
    };

    setRecords([...records, newRecord].sort((a, b) => a.date.getTime() - b.date.getTime()));
  };

  const handleRemoveRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleClearRecords = () => {
    setRecords([]);
  };

  return (
    <div className="work-hours-tab">
      <h2>勤務時間計算</h2>
      <p>労働時間と残業時間を計算します。</p>

      <div className="input-section">
        <div className="mode-selector">
          <label>
            <input
              type="radio"
              name="mode"
              value="single"
              checked={mode === 'single'}
              onChange={() => setMode('single')}
            />
            単一計算
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="summary"
              checked={mode === 'summary'}
              onChange={() => setMode('summary')}
            />
            週間・月間集計
          </label>
        </div>

        <div className="standard-hours-input">
          <NumberInput
            label="標準労働時間（時間/日）"
            value={standardWorkHours}
            onChange={setStandardWorkHours}
            min={1}
            max={24}
          />
        </div>

        {mode === 'single' ? (
          <div className="work-hours-inputs">
            <label>
              出勤時刻
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </label>

            <label>
              退勤時刻
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </label>

            <NumberInput
              label="休憩時間（分）"
              value={breakMinutes}
              onChange={setBreakMinutes}
              min={0}
              max={480}
            />
          </div>
        ) : (
          <div className="work-summary-inputs">
            <div className="add-record-form">
              <h3>勤務記録を追加</h3>
              <DateInput
                label="日付"
                value={newRecordDate}
                onChange={setNewRecordDate}
                required
              />

              <label>
                出勤時刻
                <input
                  type="time"
                  value={newRecordStart}
                  onChange={(e) => setNewRecordStart(e.target.value)}
                />
              </label>

              <label>
                退勤時刻
                <input
                  type="time"
                  value={newRecordEnd}
                  onChange={(e) => setNewRecordEnd(e.target.value)}
                />
              </label>

              <NumberInput
                label="休憩時間（分）"
                value={newRecordBreak}
                onChange={setNewRecordBreak}
                min={0}
                max={480}
              />

              <button onClick={handleAddRecord} className="add-button">
                記録を追加
              </button>
            </div>

            {records.length > 0 && (
              <div className="records-list">
                <div className="records-header">
                  <h3>勤務記録一覧（{records.length}件）</h3>
                  <button onClick={handleClearRecords} className="clear-button">
                    全てクリア
                  </button>
                </div>
                <div className="records-table">
                  {records.map((record, index) => (
                    <div key={index} className="record-row">
                      <span className="record-date">
                        {format(record.date, 'yyyy/MM/dd')}
                      </span>
                      <span className="record-time">
                        {record.startTime} - {record.endTime}
                      </span>
                      <span className="record-break">
                        休憩: {record.breakMinutes}分
                      </span>
                      <button
                        onClick={() => handleRemoveRecord(index)}
                        className="remove-button"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {mode === 'single' ? (
        <>
          <ErrorMessage message={singleResult.error} />
          {singleResult.result && !singleResult.error && (
            <div className="results-section">
              <ResultCard title="勤務時間">
                <div className="result-item">
                  <span className="result-label">総拘束時間:</span>
                  <span className="result-value">
                    {Math.floor(singleResult.result.totalMinutes / 60)}時間
                    {singleResult.result.totalMinutes % 60}分
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">休憩時間:</span>
                  <span className="result-value">{breakMinutes}分</span>
                </div>
                <div className="result-item">
                  <span className="result-label">実労働時間:</span>
                  <span className="result-value">{singleResult.result.formatted}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">残業時間:</span>
                  <span className="result-value">{singleResult.result.overtimeFormatted}</span>
                </div>
              </ResultCard>
            </div>
          )}
        </>
      ) : (
        <>
          <ErrorMessage message={summaryResult.error} />
          {summaryResult.result && !summaryResult.error && records.length > 0 && (
            <div className="results-section">
              <ResultCard title="集計結果">
                <div className="result-item">
                  <span className="result-label">勤務日数:</span>
                  <span className="result-value">{summaryResult.result.totalDays}日</span>
                </div>
                <div className="result-item">
                  <span className="result-label">総労働時間:</span>
                  <span className="result-value">{summaryResult.result.totalFormatted}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">総休憩時間:</span>
                  <span className="result-value">
                    {Math.floor(summaryResult.result.totalBreakMinutes / 60)}時間
                    {summaryResult.result.totalBreakMinutes % 60}分
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">平均労働時間:</span>
                  <span className="result-value">{summaryResult.result.averageFormatted}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">総残業時間:</span>
                  <span className="result-value">{summaryResult.result.overtimeFormatted}</span>
                </div>
              </ResultCard>
            </div>
          )}
        </>
      )}
    </div>
  );
}
