import { useState } from 'react';
import DateDiffTab from './components/DateDiffTab';
import AddSubtractTab from './components/AddSubtractTab';
import AgeTab from './components/AgeTab';
import BusinessDaysTab from './components/BusinessDaysTab';
import RecurrenceTab from './components/RecurrenceTab';
import './App.css';

type TabId = 'diff' | 'add-subtract' | 'business' | 'recurrence' | 'age';

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
      </nav>

      <main className="app-main">
        {activeTab === 'diff' && <DateDiffTab />}
        {activeTab === 'add-subtract' && <AddSubtractTab />}
        {activeTab === 'age' && <AgeTab />}
        {activeTab === 'business' && <BusinessDaysTab />}
        {activeTab === 'recurrence' && <RecurrenceTab />}
      </main>

      <footer className="app-footer">
        <p>© 2025 Date Toolbox</p>
      </footer>
    </div>
  );
}

export default App;
