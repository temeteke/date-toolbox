import { useState, useMemo } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import {
  getMoonPhaseInfo,
  getMoonPhaseCalendar,
  getNextMoonPhaseInfo,
} from '../lib/analysis/moonPhase';
import Calendar from './common/Calendar';
import ResultCard from './common/ResultCard';

export default function MoonPhaseTab() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const moonPhaseCalendar = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return getMoonPhaseCalendar(year, month);
  }, [currentDate]);

  const currentMoonInfo = useMemo(() => getMoonPhaseInfo(new Date()), []);
  const nextPhases = useMemo(() => getNextMoonPhaseInfo(new Date()), []);

  const selectedMoonInfo = useMemo(() => {
    if (!selectedDate) return null;
    return getMoonPhaseInfo(selectedDate);
  }, [selectedDate]);

  // カレンダーに月相を表示するためのマップを作成
  const moonPhaseDates = useMemo(() => {
    const map = new Map<string, string>();
    moonPhaseCalendar.phases.forEach((info, dateKey) => {
      map.set(dateKey, `${info.phaseEmoji} ${info.phase}`);
    });
    return map;
  }, [moonPhaseCalendar]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="moon-phase-tab">
      <h2>月齢・月相カレンダー</h2>
      <p>月の満ち欠けと月齢を表示します。</p>

      <section className="current-moon-section">
        <ResultCard title="今日の月">
          <div className="moon-display">
            <div className="moon-emoji">{currentMoonInfo.phaseEmoji}</div>
            <div className="moon-details">
              <div className="moon-info-item">
                <span className="label">月相:</span>
                <span className="value">{currentMoonInfo.phase}</span>
              </div>
              <div className="moon-info-item">
                <span className="label">月齢:</span>
                <span className="value">{currentMoonInfo.age.toFixed(1)}日</span>
              </div>
              <div className="moon-info-item">
                <span className="label">輝面比:</span>
                <span className="value">{currentMoonInfo.illumination.toFixed(1)}%</span>
              </div>
              <div className="moon-description">{currentMoonInfo.description}</div>
            </div>
          </div>
        </ResultCard>

        <ResultCard title="次の主要な月相">
          <div className="next-phases">
            <div className="phase-item">
              <span className="phase-emoji">🌑</span>
              <div className="phase-info">
                <div className="phase-name">新月</div>
                <div className="phase-date">{format(nextPhases.nextNewMoon, 'yyyy年MM月dd日')}</div>
              </div>
            </div>
            <div className="phase-item">
              <span className="phase-emoji">🌓</span>
              <div className="phase-info">
                <div className="phase-name">上弦</div>
                <div className="phase-date">{format(nextPhases.nextFirstQuarter, 'yyyy年MM月dd日')}</div>
              </div>
            </div>
            <div className="phase-item">
              <span className="phase-emoji">🌕</span>
              <div className="phase-info">
                <div className="phase-name">満月</div>
                <div className="phase-date">{format(nextPhases.nextFullMoon, 'yyyy年MM月dd日')}</div>
              </div>
            </div>
            <div className="phase-item">
              <span className="phase-emoji">🌗</span>
              <div className="phase-info">
                <div className="phase-name">下弦</div>
                <div className="phase-date">{format(nextPhases.nextLastQuarter, 'yyyy年MM月dd日')}</div>
              </div>
            </div>
          </div>
        </ResultCard>
      </section>

      <section className="calendar-section">
        <h3>月相カレンダー</h3>
        <div className="calendar-controls">
          <button onClick={handlePrevMonth}>← 前月</button>
          <button onClick={handleToday}>今月</button>
          <button onClick={handleNextMonth}>次月 →</button>
        </div>

        <div className="moon-calendar-wrapper">
          <Calendar
            currentDate={currentDate}
            highlightDates={selectedDate ? [selectedDate] : []}
            holidayDates={moonPhaseDates}
            onDateClick={handleDateClick}
          />
        </div>
      </section>

      {selectedMoonInfo && (
        <section className="selected-moon-section">
          <ResultCard title="選択した日の月">
            <div className="moon-display">
              <div className="moon-emoji large">{selectedMoonInfo.phaseEmoji}</div>
              <div className="moon-details">
                <div className="moon-info-item">
                  <span className="label">日付:</span>
                  <span className="value">{format(selectedDate!, 'yyyy年MM月dd日')}</span>
                </div>
                <div className="moon-info-item">
                  <span className="label">月相:</span>
                  <span className="value">{selectedMoonInfo.phase}</span>
                </div>
                <div className="moon-info-item">
                  <span className="label">月齢:</span>
                  <span className="value">{selectedMoonInfo.age.toFixed(2)}日</span>
                </div>
                <div className="moon-info-item">
                  <span className="label">輝面比:</span>
                  <span className="value">{selectedMoonInfo.illumination.toFixed(1)}%</span>
                </div>
                <div className="moon-description">{selectedMoonInfo.description}</div>

                <div className="moon-progress-bar">
                  <div className="progress-label">月の満ち具合</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${selectedMoonInfo.illumination}%` }}
                    />
                  </div>
                  <div className="progress-value">{selectedMoonInfo.illumination.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </ResultCard>
        </section>
      )}

      <section className="moon-info-section">
        <ResultCard title="月の満ち欠けについて">
          <div className="moon-explanation">
            <p>
              月は約29.5日の周期で満ち欠けを繰り返します。この周期を「朔望月」といいます。
            </p>
            <ul>
              <li><strong>新月（🌑）:</strong> 月と太陽が同じ方向にあり、月が見えません</li>
              <li><strong>上弦（🌓）:</strong> 月の右半分が光って見えます</li>
              <li><strong>満月（🌕）:</strong> 月が完全に丸く光って見えます</li>
              <li><strong>下弦（🌗）:</strong> 月の左半分が光って見えます</li>
            </ul>
            <p>
              月齢0が新月、月齢15前後が満月となります。
            </p>
          </div>
        </ResultCard>
      </section>
    </div>
  );
}
