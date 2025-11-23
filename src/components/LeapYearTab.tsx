import { useState, useMemo } from 'react';
import {
  getLeapYearInfo,
  getNextLeapYearInfo,
  getPreviousLeapYear,
  getLeapYearsOnly,
  getLeapYearStats,
  getCalendarInfo,
} from '../lib/analysis/leapYear';
import NumberInput from './common/NumberInput';
import ResultCard from './common/ResultCard';

export default function LeapYearTab() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [rangeStart, setRangeStart] = useState<number>(2000);
  const [rangeEnd, setRangeEnd] = useState<number>(2100);

  const yearInfo = useMemo(() => getLeapYearInfo(year), [year]);
  const nextLeapYearInfo = useMemo(() => getNextLeapYearInfo(new Date(year, 0, 1)), [year]);
  const previousLeapYear = useMemo(() => getPreviousLeapYear(year), [year]);

  const leapYearList = useMemo(() => {
    if (rangeStart > rangeEnd) return [];
    return getLeapYearsOnly(rangeStart, rangeEnd);
  }, [rangeStart, rangeEnd]);

  const stats = useMemo(() => {
    if (rangeStart > rangeEnd) return null;
    return getLeapYearStats(rangeStart, rangeEnd);
  }, [rangeStart, rangeEnd]);

  const calendarInfo = useMemo(() => getCalendarInfo(), []);

  return (
    <div className="leap-year-tab">
      <h2>うるう年詳細ツール</h2>
      <p>うるう年の判定と詳細情報を表示します。</p>

      <section className="input-section">
        <h3>年を入力</h3>
        <NumberInput
          label="年"
          value={year}
          onChange={setYear}
          min={1}
          max={9999}
        />
      </section>

      <section className="results-section">
        <ResultCard title="判定結果">
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">年:</span>
              <span className="result-value">{yearInfo.year}年</span>
            </div>
            <div className="result-item">
              <span className="result-label">判定:</span>
              <span className={`result-value ${yearInfo.isLeapYear ? 'leap-year' : 'regular-year'}`}>
                {yearInfo.isLeapYear ? 'うるう年' : '平年'}
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">年間日数:</span>
              <span className="result-value">{yearInfo.daysInYear}日</span>
            </div>
            <div className="result-item">
              <span className="result-label">2月の日数:</span>
              <span className="result-value">{yearInfo.februaryDays}日</span>
            </div>
            <div className="result-item full-width">
              <span className="result-label">理由:</span>
              <span className="result-value">{yearInfo.reason}</span>
            </div>
          </div>
        </ResultCard>

        <ResultCard title="前後のうるう年">
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">前のうるう年:</span>
              <span className="result-value">{previousLeapYear}年</span>
            </div>
            <div className="result-item">
              <span className="result-label">次のうるう年:</span>
              <span className="result-value">{nextLeapYearInfo.nextLeapYear}年</span>
            </div>
            <div className="result-item">
              <span className="result-label">次まで:</span>
              <span className="result-value">{nextLeapYearInfo.yearsUntilNext}年後</span>
            </div>
            <div className="result-item">
              <span className="result-label">次まで:</span>
              <span className="result-value">{nextLeapYearInfo.daysUntilNext}日</span>
            </div>
          </div>
        </ResultCard>

        <ResultCard title="うるう年のルール">
          <div className="calendar-info">
            <div className="calendar-system">
              <h4>{calendarInfo.gregorian.name}（現在使用中）</h4>
              <ul>
                {calendarInfo.gregorian.leapYearRule.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
              <p>
                <strong>精度:</strong> {calendarInfo.gregorian.accuracy}
              </p>
              <p>
                <strong>周期:</strong> {calendarInfo.gregorian.rule}
              </p>
            </div>
            <div className="calendar-system">
              <h4>{calendarInfo.julian.name}（歴史的）</h4>
              <ul>
                {calendarInfo.julian.leapYearRule.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
              <p>
                <strong>精度:</strong> {calendarInfo.julian.accuracy}
              </p>
            </div>
            <div className="calendar-difference">
              <p>{calendarInfo.difference}</p>
            </div>
          </div>
        </ResultCard>
      </section>

      <section className="range-section">
        <h3>期間内のうるう年一覧</h3>
        <div className="range-inputs">
          <NumberInput
            label="開始年"
            value={rangeStart}
            onChange={setRangeStart}
            min={1}
            max={9999}
          />
          <NumberInput
            label="終了年"
            value={rangeEnd}
            onChange={setRangeEnd}
            min={1}
            max={9999}
          />
        </div>

        {stats && (
          <>
            <ResultCard title="統計情報">
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">総年数:</span>
                  <span className="result-value">{stats.totalYears}年</span>
                </div>
                <div className="result-item">
                  <span className="result-label">うるう年:</span>
                  <span className="result-value">{stats.leapYearCount}回</span>
                </div>
                <div className="result-item">
                  <span className="result-label">平年:</span>
                  <span className="result-value">{stats.regularYearCount}回</span>
                </div>
                <div className="result-item">
                  <span className="result-label">うるう年の割合:</span>
                  <span className="result-value">{stats.leapYearRatio.toFixed(2)}%</span>
                </div>
                <div className="result-item">
                  <span className="result-label">平均間隔:</span>
                  <span className="result-value">{stats.averageLeapYearInterval.toFixed(2)}年</span>
                </div>
              </div>
            </ResultCard>

            <ResultCard title={`うるう年一覧（${leapYearList.length}件）`}>
              <div className="leap-year-list">
                {leapYearList.map((year, index) => (
                  <span key={index} className="leap-year-item">
                    {year}
                  </span>
                ))}
              </div>
            </ResultCard>
          </>
        )}
      </section>
    </div>
  );
}
