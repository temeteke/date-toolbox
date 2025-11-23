import { useState, useMemo } from 'react';
import { addMonths, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import Calendar from './common/Calendar';
import { getHolidays } from '../lib/japanese/holiday';
import { getSekki } from '../lib/japanese/sekki';
import { getRokuyo, type RokuyoType } from '../lib/japanese/rokuyo';
import { getISOWeekNumber, getDayOfYear } from '../lib/utils';

export default function CalendarTab() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showRokuyo, setShowRokuyo] = useState<boolean>(true);
  const [showSekki, setShowSekki] = useState<boolean>(true);

  const holidays = useMemo(() => {
    const year = currentDate.getFullYear();
    const holidayList = getHolidays(year);
    const holidayMap = new Map<string, string>();

    for (const holiday of holidayList) {
      const key = format(holiday.date, 'yyyy-MM-dd');
      holidayMap.set(key, holiday.name);
    }

    return holidayMap;
  }, [currentDate]);

  const sekkiDates = useMemo(() => {
    const year = currentDate.getFullYear();
    const sekkiList = getSekki(year);
    const sekkiMap = new Map<string, string>();

    for (const sekki of sekkiList) {
      const key = format(sekki.date, 'yyyy-MM-dd');
      sekkiMap.set(key, sekki.name);
    }

    return sekkiMap;
  }, [currentDate]);

  const rokuyoDates = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const rokuyoMap = new Map<string, RokuyoType>();

    for (const day of days) {
      const key = format(day, 'yyyy-MM-dd');
      const rokuyo = getRokuyo(day);
      rokuyoMap.set(key, rokuyo);
    }

    return rokuyoMap;
  }, [currentDate]);

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
    <div className="calendar-tab">
      <h2>カレンダー表示</h2>
      <p>月次カレンダーと日本の祝日、二十四節気、六曜を表示します。</p>

      <div className="calendar-controls">
        <button onClick={handlePrevMonth}>← 前月</button>
        <button onClick={handleToday}>今月</button>
        <button onClick={handleNextMonth}>次月 →</button>
      </div>

      <div className="calendar-options">
        <label>
          <input
            type="checkbox"
            checked={showRokuyo}
            onChange={(e) => setShowRokuyo(e.target.checked)}
          />
          六曜を表示
        </label>
        <label>
          <input
            type="checkbox"
            checked={showSekki}
            onChange={(e) => setShowSekki(e.target.checked)}
          />
          二十四節気を表示
        </label>
      </div>

      <Calendar
        currentDate={currentDate}
        highlightDates={selectedDate ? [selectedDate] : []}
        holidayDates={holidays}
        sekkiDates={sekkiDates}
        rokuyoDates={rokuyoDates}
        showRokuyo={showRokuyo}
        showSekki={showSekki}
        onDateClick={handleDateClick}
      />

      {selectedDate && (
        <div className="selected-date-info">
          <h3>選択された日付</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">日付:</span>
              <span className="info-value">
                {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月
                {selectedDate.getDate()}日
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">曜日:</span>
              <span className="info-value">
                {['日', '月', '火', '水', '木', '金', '土'][selectedDate.getDay()]}曜日
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">ISO週番号:</span>
              <span className="info-value">第{getISOWeekNumber(selectedDate)}週</span>
            </div>
            <div className="info-item">
              <span className="info-label">年間通算日:</span>
              <span className="info-value">{getDayOfYear(selectedDate)}日目</span>
            </div>
            {holidays.get(format(selectedDate, 'yyyy-MM-dd')) && (
              <div className="info-item">
                <span className="info-label">祝日:</span>
                <span className="info-value">
                  {holidays.get(format(selectedDate, 'yyyy-MM-dd'))}
                </span>
              </div>
            )}
            {sekkiDates.get(format(selectedDate, 'yyyy-MM-dd')) && (
              <div className="info-item">
                <span className="info-label">二十四節気:</span>
                <span className="info-value">
                  {sekkiDates.get(format(selectedDate, 'yyyy-MM-dd'))}
                </span>
              </div>
            )}
            {rokuyoDates.get(format(selectedDate, 'yyyy-MM-dd')) && (
              <div className="info-item">
                <span className="info-label">六曜:</span>
                <span className="info-value">
                  {rokuyoDates.get(format(selectedDate, 'yyyy-MM-dd'))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
