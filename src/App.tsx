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
import './App.css';

type TabId = 'diff' | 'add-subtract' | 'business' | 'recurrence' | 'age' | 'wareki' | 'time-calc' | 'countdown' | 'calendar';

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
      </main>

      <footer className="app-footer">
        <p>© 2025 Date Toolbox</p>
      </footer>
    </div>
  );
}

export default App;
