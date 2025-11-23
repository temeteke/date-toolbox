import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  format,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import type { RokuyoType } from '../../lib/japanese/rokuyo';

interface CalendarProps {
  currentDate: Date;
  highlightDates?: Date[];
  holidayDates?: Map<string, string>;
  sekkiDates?: Map<string, string>;
  rokuyoDates?: Map<string, RokuyoType>;
  showRokuyo?: boolean;
  showSekki?: boolean;
  onDateClick?: (date: Date) => void;
}

export default function Calendar({
  currentDate,
  highlightDates = [],
  holidayDates = new Map(),
  sekkiDates = new Map(),
  rokuyoDates = new Map(),
  showRokuyo = false,
  showSekki = false,
  onDateClick,
}: CalendarProps) {
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days: Date[] = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentDate]);

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h3>{format(currentDate, 'yyyy年MM月', { locale: ja })}</h3>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {weekdays.map((day, index) => (
            <div key={index} className={`calendar-weekday ${index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''}`}>
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isHighlighted = highlightDates.some(d => isSameDay(d, day));
            const dateKey = format(day, 'yyyy-MM-dd');
            const holidayName = holidayDates.get(dateKey);
            const sekkiName = sekkiDates.get(dateKey);
            const rokuyo = rokuyoDates.get(dateKey);
            const isToday = isSameDay(day, new Date());
            const dayOfWeek = day.getDay();
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;

            return (
              <div
                key={index}
                className={`calendar-day
                  ${!isCurrentMonth ? 'other-month' : ''}
                  ${isHighlighted ? 'highlighted' : ''}
                  ${holidayName ? 'holiday' : ''}
                  ${isToday ? 'today' : ''}
                  ${isSunday ? 'sunday' : ''}
                  ${isSaturday ? 'saturday' : ''}
                `}
                onClick={() => isCurrentMonth && onDateClick && onDateClick(day)}
              >
                <div className="day-number">{format(day, 'd')}</div>
                {holidayName && isCurrentMonth && (
                  <div className="holiday-name">{holidayName}</div>
                )}
                {showSekki && sekkiName && isCurrentMonth && (
                  <div className="sekki-name">{sekkiName}</div>
                )}
                {showRokuyo && rokuyo && isCurrentMonth && (
                  <div className="rokuyo-name">{rokuyo}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
