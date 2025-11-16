import { useState, useMemo } from 'react';
import DateInput from './common/DateInput';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import { calculateAge, calculateMilestoneAges } from '../lib/age';
import { formatDateJa, isValidDate } from '../lib/utils';

export default function AgeTab() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [referenceDate, setReferenceDate] = useState<Date | null>(new Date());
  const [showMilestones, setShowMilestones] = useState(false);

  const { result, error } = useMemo(() => {
    if (!birthDate) {
      return { result: null, error: '生年月日を入力してください。' };
    }

    if (!isValidDate(birthDate)) {
      return { result: null, error: '有効な生年月日を入力してください。' };
    }

    const refDate = referenceDate || new Date();

    if (birthDate > refDate) {
      return { result: null, error: '生年月日は基準日以前の日付を指定してください。' };
    }

    return { result: calculateAge({ birthDate, referenceDate: refDate }), error: '' };
  }, [birthDate, referenceDate]);

  const milestones = useMemo(
    () =>
      birthDate
        ? calculateMilestoneAges(birthDate, [20, 30, 40, 50, 60, 65, 70, 80, 90, 100])
        : [],
    [birthDate]
  );

  return (
    <div className="age-tab">
      <h2>年齢・経過年数の計算</h2>
      <p>生年月日から年齢を計算します。</p>

      <div className="input-section">
        <DateInput
          label="生年月日"
          value={birthDate}
          onChange={setBirthDate}
          required
        />

        <DateInput
          label="基準日（省略可、デフォルト: 今日）"
          value={referenceDate}
          onChange={setReferenceDate}
        />
      </div>

      <ErrorMessage message={error} />

      {result && !error && (
        <div className="results-section">
          <ResultCard title="年齢">
            <div className="result-item">
              <span className="result-label">年齢:</span>
              <span className="result-value">
                {result.years}歳{result.months}か月{result.days}日
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">総日数:</span>
              <span className="result-value">{result.totalDays.toLocaleString()}日</span>
            </div>
            <div className="result-item">
              <span className="result-label">総月数:</span>
              <span className="result-value">約{result.totalMonths}か月</span>
            </div>
            <div className="result-item">
              <span className="result-label">次の誕生日:</span>
              <span className="result-value">
                {formatDateJa(result.nextBirthday)}
                （あと{result.daysUntilNextBirthday}日）
              </span>
            </div>
          </ResultCard>

          <div className="milestones-section">
            <button
              className="toggle-milestones"
              onClick={() => setShowMilestones(!showMilestones)}
            >
              {showMilestones ? '▼' : '▶'} 節目の年齢を表示
            </button>

            {showMilestones && (
              <div className="milestones-list">
                {milestones.map((milestone) => (
                  <div key={milestone.age} className="milestone-item">
                    <span className="milestone-age">{milestone.age}歳:</span>
                    <span className="milestone-date">
                      {formatDateJa(milestone.date)}
                    </span>
                    <span className="milestone-status">
                      {milestone.isPast ? '✓ 既に過ぎた' : '未来'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
