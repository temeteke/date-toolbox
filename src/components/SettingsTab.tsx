import { useState, useEffect } from 'react';
import ResultCard from './common/ResultCard';

interface Settings {
  weekStartsOn: number; // 0: 日曜, 1: 月曜
  theme: 'light' | 'dark' | 'auto';
  dateFormat: string;
}

export default function SettingsTab() {
  const [settings, setSettings] = useState<Settings>({
    weekStartsOn: 0,
    theme: 'light',
    dateFormat: 'yyyy/MM/dd',
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // LocalStorageから設定を読み込み
    const savedSettings = localStorage.getItem('date-toolbox-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch {
        // エラー時はデフォルト設定を使用
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('date-toolbox-settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('設定をデフォルトに戻しますか？')) {
      const defaultSettings: Settings = {
        weekStartsOn: 0,
        theme: 'light',
        dateFormat: 'yyyy/MM/dd',
      };
      setSettings(defaultSettings);
      localStorage.setItem('date-toolbox-settings', JSON.stringify(defaultSettings));
    }
  };

  const handleExportData = () => {
    const data = {
      settings,
      history: localStorage.getItem('date-toolbox-history'),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'date-toolbox-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          setSettings(data.settings);
          localStorage.setItem('date-toolbox-settings', JSON.stringify(data.settings));
        }
        if (data.history) {
          localStorage.setItem('date-toolbox-history', data.history);
        }
        alert('データをインポートしました。');
      } catch {
        alert('データのインポートに失敗しました。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="settings-tab">
      <h2>設定</h2>
      <p>アプリケーションの設定をカスタマイズします。</p>

      <div className="settings-section">
        <ResultCard title="表示設定">
          <div className="setting-item">
            <label>
              週の開始曜日:
              <select
                value={settings.weekStartsOn}
                onChange={(e) => setSettings({ ...settings, weekStartsOn: Number(e.target.value) })}
              >
                <option value={0}>日曜日</option>
                <option value={1}>月曜日</option>
              </select>
            </label>
          </div>

          <div className="setting-item">
            <label>
              テーマ:
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' | 'auto' })}
              >
                <option value="light">ライト</option>
                <option value="dark">ダーク</option>
                <option value="auto">自動</option>
              </select>
            </label>
          </div>

          <div className="setting-item">
            <label>
              デフォルト日付フォーマット:
              <select
                value={settings.dateFormat}
                onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
              >
                <option value="yyyy/MM/dd">yyyy/MM/dd</option>
                <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                <option value="yyyy年M月d日">yyyy年M月d日</option>
                <option value="MM/dd/yyyy">MM/dd/yyyy</option>
              </select>
            </label>
          </div>

          <div className="setting-actions">
            <button onClick={handleSave} className="save-button">
              設定を保存
            </button>
            <button onClick={handleReset} className="reset-button">
              デフォルトに戻す
            </button>
            {saved && <span className="save-message">✓ 保存しました</span>}
          </div>
        </ResultCard>

        <ResultCard title="データ管理">
          <div className="setting-item">
            <label>データのエクスポート</label>
            <p>設定と履歴データをJSONファイルとしてエクスポートします。</p>
            <button onClick={handleExportData} className="export-button">
              エクスポート
            </button>
          </div>

          <div className="setting-item">
            <label>データのインポート</label>
            <p>バックアップファイルから設定と履歴データを復元します。</p>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="import-input"
            />
          </div>
        </ResultCard>

        <ResultCard title="アプリケーション情報">
          <div className="result-item">
            <span className="result-label">バージョン:</span>
            <span className="result-value">1.0.0</span>
          </div>
          <div className="result-item">
            <span className="result-label">ビルド日:</span>
            <span className="result-value">{new Date().toLocaleDateString()}</span>
          </div>
        </ResultCard>
      </div>
    </div>
  );
}
