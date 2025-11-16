import { useState, useMemo } from 'react';
import DateInput from './common/DateInput';
import NumberInput from './common/NumberInput';
import ResultCard from './common/ResultCard';
import ErrorMessage from './common/ErrorMessage';
import { convertToWareki, convertToSeireki, getAllEras } from '../lib/wareki';

type ConversionMode = 'to-wareki' | 'to-seireki';

export default function WarekiTab() {
  const [mode, setMode] = useState<ConversionMode>('to-wareki');

  // 西暦→和暦
  const [seireikiDate, setSeireikiDate] = useState<Date | null>(new Date());

  // 和暦→西暦
  const [selectedEra, setSelectedEra] = useState<string>('令和');
  const [warekiYear, setWarekiYear] = useState<number>(7);
  const [warekiMonth, setWarekiMonth] = useState<number>(1);
  const [warekiDay, setWarekiDay] = useState<number>(1);

  const eras = useMemo(() => getAllEras(), []);

  // 西暦→和暦の変換結果
  const toWarekiResult = useMemo(() => {
    if (!seireikiDate) {
      return { result: null, error: '日付を入力してください。' };
    }

    const result = convertToWareki(seireikiDate);
    if (!result) {
      return { result: null, error: '変換できませんでした。明治以降の日付を入力してください。' };
    }

    return { result, error: '' };
  }, [seireikiDate]);

  // 和暦→西暦の変換結果
  const toSeireikiResult = useMemo(() => {
    const result = convertToSeireki(selectedEra, warekiYear, warekiMonth, warekiDay);

    if (!result) {
      return { result: null, error: '変換できませんでした。有効な和暦を入力してください。' };
    }

    return { result, error: '' };
  }, [selectedEra, warekiYear, warekiMonth, warekiDay]);

  return (
    <div className="wareki-tab">
      <h2>和暦変換</h2>
      <p>西暦と和暦を相互変換します（明治以降対応）。</p>

      <div className="input-section">
        <div className="mode-selector">
          <label>
            <input
              type="radio"
              name="mode"
              value="to-wareki"
              checked={mode === 'to-wareki'}
              onChange={() => setMode('to-wareki')}
            />
            西暦 → 和暦
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="to-seireki"
              checked={mode === 'to-seireki'}
              onChange={() => setMode('to-seireki')}
            />
            和暦 → 西暦
          </label>
        </div>

        {mode === 'to-wareki' ? (
          <div className="to-wareki-inputs">
            <DateInput
              label="西暦日付"
              value={seireikiDate}
              onChange={setSeireikiDate}
              required
            />
          </div>
        ) : (
          <div className="to-seireki-inputs">
            <div className="wareki-input-group">
              <label>
                元号
                <select
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value)}
                >
                  {eras.reverse().map((era) => (
                    <option key={era.name} value={era.name}>
                      {era.name}
                    </option>
                  ))}
                </select>
              </label>

              <NumberInput
                label="年"
                value={warekiYear}
                onChange={setWarekiYear}
                min={1}
                max={100}
              />

              <NumberInput
                label="月"
                value={warekiMonth}
                onChange={setWarekiMonth}
                min={1}
                max={12}
              />

              <NumberInput
                label="日"
                value={warekiDay}
                onChange={setWarekiDay}
                min={1}
                max={31}
              />
            </div>
          </div>
        )}
      </div>

      {mode === 'to-wareki' ? (
        <>
          <ErrorMessage message={toWarekiResult.error} />
          {toWarekiResult.result && !toWarekiResult.error && (
            <div className="results-section">
              <ResultCard title="変換結果">
                <div className="result-item">
                  <span className="result-label">和暦（標準）:</span>
                  <span className="result-value">{toWarekiResult.result.formatted.standard}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">和暦（完全）:</span>
                  <span className="result-value">{toWarekiResult.result.formatted.full}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">和暦（短縮）:</span>
                  <span className="result-value">{toWarekiResult.result.formatted.short}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">元号:</span>
                  <span className="result-value">{toWarekiResult.result.wareki.era}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">年:</span>
                  <span className="result-value">{toWarekiResult.result.wareki.year === 1 ? '元年' : `${toWarekiResult.result.wareki.year}年`}</span>
                </div>
              </ResultCard>
            </div>
          )}
        </>
      ) : (
        <>
          <ErrorMessage message={toSeireikiResult.error} />
          {toSeireikiResult.result && !toSeireikiResult.error && (
            <div className="results-section">
              <ResultCard title="変換結果">
                <div className="result-item">
                  <span className="result-label">西暦日付:</span>
                  <span className="result-value">
                    {toSeireikiResult.result.getFullYear()}年
                    {toSeireikiResult.result.getMonth() + 1}月
                    {toSeireikiResult.result.getDate()}日
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">ISO形式:</span>
                  <span className="result-value">
                    {toSeireikiResult.result.toISOString().split('T')[0]}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">曜日:</span>
                  <span className="result-value">
                    {['日', '月', '火', '水', '木', '金', '土'][toSeireikiResult.result.getDay()]}曜日
                  </span>
                </div>
              </ResultCard>
            </div>
          )}
        </>
      )}
    </div>
  );
}
