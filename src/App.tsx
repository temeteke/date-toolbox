import { useState, useEffect } from 'react';
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
import { useQueryParams } from './hooks/useQueryParams';
import './App.css';

type TabId = 'diff' | 'add-subtract' | 'business' | 'recurrence' | 'age' | 'wareki' | 'time-calc' | 'countdown' | 'calendar' | 'timezone' | 'work-hours' | 'date-format' | 'history' | 'date-stats' | 'anniversary' | 'settings' | 'date-compare';
type CategoryId = 'basic' | 'format' | 'analysis' | 'business' | 'japan' | 'other';

interface TabInfo {
  id: TabId;
  label: string;
}

interface CategoryInfo {
  id: CategoryId;
  label: string;
  tabs: TabInfo[];
}

const categories: CategoryInfo[] = [
  {
    id: 'basic',
    label: '基本',
    tabs: [
      { id: 'diff', label: '期間計算' },
      { id: 'add-subtract', label: '加算/減算' },
      { id: 'age', label: '年齢計算' },
      { id: 'date-compare', label: '日付比較' },
    ],
  },
  {
    id: 'format',
    label: 'フォーマット',
    tabs: [
      { id: 'date-format', label: 'フォーマット' },
      { id: 'time-calc', label: '時刻計算' },
      { id: 'timezone', label: 'タイムゾーン' },
    ],
  },
  {
    id: 'analysis',
    label: '分析',
    tabs: [
      { id: 'date-stats', label: '期間統計' },
      { id: 'anniversary', label: '記念日' },
      { id: 'recurrence', label: '繰り返し' },
    ],
  },
  {
    id: 'business',
    label: 'ビジネス',
    tabs: [
      { id: 'business', label: '営業日' },
      { id: 'work-hours', label: '勤務時間' },
    ],
  },
  {
    id: 'japan',
    label: '日本',
    tabs: [
      { id: 'wareki', label: '和暦変換' },
      { id: 'calendar', label: 'カレンダー' },
    ],
  },
  {
    id: 'other',
    label: 'その他',
    tabs: [
      { id: 'countdown', label: 'カウントダウン' },
      { id: 'history', label: '履歴' },
      { id: 'settings', label: '設定' },
    ],
  },
];

function App() {
  const { getParam, setParam } = useQueryParams();

  // URLパラメータから初期値を取得
  const [activeCategory, setActiveCategory] = useState<CategoryId>(() => {
    const paramCategory = getParam('category') as CategoryId;
    return paramCategory && categories.some(c => c.id === paramCategory)
      ? paramCategory
      : 'basic';
  });

  const [activeTab, setActiveTab] = useState<TabId>(() => {
    const paramTab = getParam('tab') as TabId;
    // タブが有効かチェック
    const isValidTab = categories.some(category =>
      category.tabs.some(tab => tab.id === paramTab)
    );
    return isValidTab ? paramTab : 'diff';
  });

  // カテゴリーとタブの変更をURLパラメータに同期
  useEffect(() => {
    setParam('category', activeCategory);
  }, [activeCategory, setParam]);

  useEffect(() => {
    setParam('tab', activeTab);
  }, [activeTab, setParam]);

  // URLパラメータの変更を監視（戻る/進むボタン対応）
  useEffect(() => {
    const handlePopState = () => {
      const paramCategory = getParam('category') as CategoryId;
      const paramTab = getParam('tab') as TabId;

      if (paramCategory && categories.some(c => c.id === paramCategory)) {
        setActiveCategory(paramCategory);
      }

      if (paramTab && categories.some(category =>
        category.tabs.some(tab => tab.id === paramTab)
      )) {
        setActiveTab(paramTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getParam]);

  const handleCategoryChange = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    // カテゴリー変更時は、そのカテゴリーの最初のタブを選択
    const category = categories.find(c => c.id === categoryId);
    if (category && category.tabs.length > 0) {
      setActiveTab(category.tabs[0].id);
    }
  };

  const currentCategory = categories.find(c => c.id === activeCategory);

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <a href="/">📅 Date Toolbox</a>
        </h1>
        <p>日付計算ツール集</p>
      </header>

      <nav className="tabs-nav">
        {/* カテゴリー選択（上段） */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={activeCategory === category.id ? 'active' : ''}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* 機能タブ（下段） */}
        <div className="function-tabs">
          {currentCategory?.tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
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
