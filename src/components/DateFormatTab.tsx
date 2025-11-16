import { useState, useMemo } from 'react';
import DateInput from './common/DateInput';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import {
  convertDateFormats,
  fromUnixTimestamp,
  fromUnixMillis,
  fromISOString,
  FORMAT_PRESETS,
} from '../lib/dateFormat';

type InputMode = 'date-picker' | 'iso' | 'unix' | 'unix-millis';

export default function DateFormatTab() {
  const [inputMode, setInputMode] = useState<InputMode>('date-picker');

  // 日付ピッカー
  const [pickedDate, setPickedDate] = useState<Date | null>(new Date());

  // ISO形式入力
  const [isoInput, setIsoInput] = useState<string>('');

  // Unix時間（秒）入力
  const [unixInput, setUnixInput] = useState<string>('');

  // Unix時間（ミリ秒）入力
  const [unixMillisInput, setUnixMillisInput] = useState<string>('');

  // カスタムフォーマット
  const [customFormat, setCustomFormat] = useState<string>('yyyy-MM-dd');
  const [useCustomFormat, setUseCustomFormat] = useState<boolean>(false);

  // 入力された日付を取得
  const inputDate = useMemo(() => {
    switch (inputMode) {
      case 'date-picker':
        return pickedDate;
      case 'iso':
        return fromISOString(isoInput);
      case 'unix':
        const unixNum = parseInt(unixInput, 10);
        return isNaN(unixNum) ? null : fromUnixTimestamp(unixNum);
      case 'unix-millis':
        const millisNum = parseInt(unixMillisInput, 10);
        return isNaN(millisNum) ? null : fromUnixMillis(millisNum);
      default:
        return null;
    }
  }, [inputMode, pickedDate, isoInput, unixInput, unixMillisInput]);

  // フォーマット変換結果
  const formatResult = useMemo(() => {
    if (!inputDate) {
      return { result: null, error: '有効な日付を入力してください。' };
    }

    const result = convertDateFormats(
      inputDate,
      useCustomFormat ? customFormat : undefined
    );

    if (!result) {
      return { result: null, error: '変換に失敗しました。' };
    }

    return { result, error: '' };
  }, [inputDate, customFormat, useCustomFormat]);

  const handlePresetSelect = (presetValue: string) => {
    setCustomFormat(presetValue);
    setUseCustomFormat(true);
  };

  return (
    <div className="date-format-tab">
      <h2>日付フォーマット変換</h2>
      <p>日付を様々なフォーマットに変換します。</p>

      <div className="input-section">
        <div className="input-mode-selector">
          <label>入力方法</label>
          <select
            value={inputMode}
            onChange={(e) => setInputMode(e.target.value as InputMode)}
          >
            <option value="date-picker">日付ピッカー</option>
            <option value="iso">ISO 8601形式</option>
            <option value="unix">Unix時間（秒）</option>
            <option value="unix-millis">Unix時間（ミリ秒）</option>
          </select>
        </div>

        {inputMode === 'date-picker' && (
          <DateInput
            label="日付"
            value={pickedDate}
            onChange={setPickedDate}
            required
          />
        )}

        {inputMode === 'iso' && (
          <label>
            ISO 8601形式
            <input
              type="text"
              value={isoInput}
              onChange={(e) => setIsoInput(e.target.value)}
              placeholder="2025-01-15T12:00:00.000Z"
            />
          </label>
        )}

        {inputMode === 'unix' && (
          <label>
            Unix時間（秒）
            <input
              type="number"
              value={unixInput}
              onChange={(e) => setUnixInput(e.target.value)}
              placeholder="1736942400"
            />
          </label>
        )}

        {inputMode === 'unix-millis' && (
          <label>
            Unix時間（ミリ秒）
            <input
              type="number"
              value={unixMillisInput}
              onChange={(e) => setUnixMillisInput(e.target.value)}
              placeholder="1736942400000"
            />
          </label>
        )}

        <div className="custom-format-section">
          <label>
            <input
              type="checkbox"
              checked={useCustomFormat}
              onChange={(e) => setUseCustomFormat(e.target.checked)}
            />
            カスタムフォーマットを使用
          </label>

          {useCustomFormat && (
            <>
              <label>
                カスタムフォーマット（date-fns形式）
                <input
                  type="text"
                  value={customFormat}
                  onChange={(e) => setCustomFormat(e.target.value)}
                  placeholder="yyyy-MM-dd HH:mm:ss"
                />
              </label>

              <div className="format-presets">
                <label>プリセット:</label>
                <div className="preset-buttons">
                  {FORMAT_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handlePresetSelect(preset.value)}
                      className="preset-button"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ErrorMessage message={formatResult.error} />

      {formatResult.result && !formatResult.error && (
        <div className="results-section">
          <ResultCard title="変換結果">
            <div className="result-item">
              <span className="result-label">ISO 8601:</span>
              <span className="result-value">{formatResult.result.iso8601}</span>
            </div>
            <div className="result-item">
              <span className="result-label">RFC 2822:</span>
              <span className="result-value">{formatResult.result.rfc2822}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Unix時間（秒）:</span>
              <span className="result-value">{formatResult.result.unix}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Unix時間（ミリ秒）:</span>
              <span className="result-value">{formatResult.result.unixMillis}</span>
            </div>
            <div className="result-item">
              <span className="result-label">日本形式:</span>
              <span className="result-value">{formatResult.result.japanese}</span>
            </div>
            <div className="result-item">
              <span className="result-label">アメリカ形式:</span>
              <span className="result-value">{formatResult.result.american}</span>
            </div>
            <div className="result-item">
              <span className="result-label">ヨーロッパ形式:</span>
              <span className="result-value">{formatResult.result.european}</span>
            </div>
            {useCustomFormat && formatResult.result.custom && (
              <div className="result-item">
                <span className="result-label">カスタム:</span>
                <span className="result-value">{formatResult.result.custom}</span>
              </div>
            )}
          </ResultCard>
        </div>
      )}
    </div>
  );
}
