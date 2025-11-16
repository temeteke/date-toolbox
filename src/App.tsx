import { useState } from 'react';
import DateDiffTab from './components/DateDiffTab';
import AddSubtractTab from './components/AddSubtractTab';
import AgeTab from './components/AgeTab';
import BusinessDaysTab from './components/BusinessDaysTab';
import RecurrenceTab from './components/RecurrenceTab';
import WarekiTab from './components/WarekiTab';
import TimeCalcTab from './components/TimeCalcTab';
import CountdownTab from './components/CountdownTab';
import CalendarTab from './components/CalendarTab';
import TimezoneTab from './components/TimezoneTab';
import WorkHoursTab from './components/WorkHoursTab';
import DateFormatTab from './components/DateFormatTab';
import HistoryTab from './components/HistoryTab';
import DateStatsTab from './components/DateStatsTab';
import AnniversaryTab from './components/AnniversaryTab';
import SettingsTab from './components/SettingsTab';
import DateCompareTab from './components/DateCompareTab';
import './App.css';

type TabId = 'diff' | 'add-subtract' | 'business' | 'recurrence' | 'age' | 'wareki' | 'time-calc' | 'countdown' | 'calendar' | 'timezone' | 'work-hours' | 'date-format' | 'history' | 'date-stats' | 'anniversary' | 'settings' | 'date-compare';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('diff');

  return (
    <div className="app">
      <header className="app-header">
        <h1>📅 Date Toolbox</h1>
        <p>日付計算ツール集</p>
      </header>

      <nav className="tabs-nav">
        <button
          className={activeTab === 'diff' ? 'active' : ''}
          onClick={() => setActiveTab('diff')}
        >
          期間計算
        </button>
        <button
          className={activeTab === 'add-subtract' ? 'active' : ''}
          onClick={() => setActiveTab('add-subtract')}
        >
          加算/減算
        </button>
        <button
          className={activeTab === 'age' ? 'active' : ''}
          onClick={() => setActiveTab('age')}
        >
          年齢計算
        </button>
        <button
          className={activeTab === 'business' ? 'active' : ''}
          onClick={() => setActiveTab('business')}
        >
          営業日
        </button>
        <button
          className={activeTab === 'recurrence' ? 'active' : ''}
          onClick={() => setActiveTab('recurrence')}
        >
          繰り返し
        </button>
        <button
          className={activeTab === 'wareki' ? 'active' : ''}
          onClick={() => setActiveTab('wareki')}
        >
          和暦変換
        </button>
        <button
          className={activeTab === 'time-calc' ? 'active' : ''}
          onClick={() => setActiveTab('time-calc')}
        >
          時刻計算
        </button>
        <button
          className={activeTab === 'countdown' ? 'active' : ''}
          onClick={() => setActiveTab('countdown')}
        >
          カウントダウン
        </button>
        <button
          className={activeTab === 'calendar' ? 'active' : ''}
          onClick={() => setActiveTab('calendar')}
        >
          カレンダー
        </button>
        <button
          className={activeTab === 'timezone' ? 'active' : ''}
          onClick={() => setActiveTab('timezone')}
        >
          タイムゾーン
        </button>
        <button
          className={activeTab === 'work-hours' ? 'active' : ''}
          onClick={() => setActiveTab('work-hours')}
        >
          勤務時間
        </button>
        <button
          className={activeTab === 'date-format' ? 'active' : ''}
          onClick={() => setActiveTab('date-format')}
        >
          フォーマット
        </button>
        <button
          className={activeTab === 'date-stats' ? 'active' : ''}
          onClick={() => setActiveTab('date-stats')}
        >
          期間統計
        </button>
        <button
          className={activeTab === 'anniversary' ? 'active' : ''}
          onClick={() => setActiveTab('anniversary')}
        >
          記念日
        </button>
        <button
          className={activeTab === 'date-compare' ? 'active' : ''}
          onClick={() => setActiveTab('date-compare')}
        >
          日付比較
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          履歴
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          設定
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'diff' && <DateDiffTab />}
        {activeTab === 'add-subtract' && <AddSubtractTab />}
        {activeTab === 'age' && <AgeTab />}
        {activeTab === 'business' && <BusinessDaysTab />}
        {activeTab === 'recurrence' && <RecurrenceTab />}
        {activeTab === 'wareki' && <WarekiTab />}
        {activeTab === 'time-calc' && <TimeCalcTab />}
        {activeTab === 'countdown' && <CountdownTab />}
        {activeTab === 'calendar' && <CalendarTab />}
        {activeTab === 'timezone' && <TimezoneTab />}
        {activeTab === 'work-hours' && <WorkHoursTab />}
        {activeTab === 'date-format' && <DateFormatTab />}
        {activeTab === 'date-stats' && <DateStatsTab />}
        {activeTab === 'anniversary' && <AnniversaryTab />}
        {activeTab === 'date-compare' && <DateCompareTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      <footer className="app-footer">
        <p>© 2025 Date Toolbox</p>
      </footer>
    </div>
  );
}

export default App;
