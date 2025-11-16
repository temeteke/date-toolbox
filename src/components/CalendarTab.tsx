import { useState, useMemo } from 'react';
import { addMonths, subMonths } from 'date-fns';
import Calendar from './common/Calendar';
import { getHolidays } from '../lib/holiday';
import { getISOWeekNumber, getDayOfYear } from '../lib/utils';

export default function CalendarTab() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const holidays = useMemo(() => {
    const year = currentDate.getFullYear();
    const holidayList = getHolidays(year);
    const holidayMap = new Map<string, string>();

    for (const holiday of holidayList) {
      const key = `${holiday.date.getFullYear()}-${String(holiday.date.getMonth() + 1).padStart(2, '0')}-${String(holiday.date.getDate()).padStart(2, '0')}`;
      holidayMap.set(key, holiday.name);
    }

    return holidayMap;
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
      <p>月次カレンダーと日本の祝日を表示します。</p>

      <div className="calendar-controls">
        <button onClick={handlePrevMonth}>← 前月</button>
        <button onClick={handleToday}>今月</button>
        <button onClick={handleNextMonth}>次月 →</button>
      </div>

      <Calendar
        currentDate={currentDate}
        highlightDates={selectedDate ? [selectedDate] : []}
        holidayDates={holidays}
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
            {holidays.get(
              `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
            ) && (
              <div className="info-item">
                <span className="info-label">祝日:</span>
                <span className="info-value">
                  {holidays.get(
                    `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
