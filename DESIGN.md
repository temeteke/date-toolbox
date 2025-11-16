# Date Toolbox - 設計書

## 1. アーキテクチャ概要

### レイヤー構成

```
┌─────────────────────────────────────┐
│   Presentation Layer (React)        │
│   - Components (UI + State)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Logic Layer (Pure Functions)      │
│   - lib/*.ts (計算ロジック)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   External Library (date-fns)       │
└─────────────────────────────────────┘
```

### 設計原則

1. **関心の分離**: UIとロジックを完全に分離
2. **テスタビリティ**: ロジック層は純粋関数として実装し、テスト可能に
3. **型安全性**: TypeScriptの型システムを最大限活用
4. **シンプルさ**: 複雑な状態管理は避け、各タブは独立した状態を持つ

---

## 2. ディレクトリ構成

```
src/
├── main.tsx                    # エントリーポイント
├── App.tsx                     # メインアプリケーション（タブ管理）
├── types/                      # 型定義
│   ├── dateDiff.ts
│   ├── addSubtract.ts
│   ├── businessDays.ts
│   ├── recurrence.ts
│   └── age.ts
├── lib/                        # ロジック層（純粋関数）
│   ├── dateDiff.ts
│   ├── addSubtract.ts
│   ├── businessDays.ts
│   ├── recurrence.ts
│   ├── age.ts
│   └── utils.ts               # 共通ユーティリティ
├── components/                 # UIコンポーネント
│   ├── DateDiffTab.tsx
│   ├── AddSubtractTab.tsx
│   ├── BusinessDaysTab.tsx
│   ├── RecurrenceTab.tsx
│   ├── AgeTab.tsx
│   └── common/                # 共通コンポーネント
│       ├── DateInput.tsx
│       ├── ResultCard.tsx
│       └── ErrorMessage.tsx
└── styles/                     # スタイル（必要に応じて）
    └── index.css
```

---

## 3. 各機能の詳細設計

### 3.1 期間計算（DateDiff）

#### 型定義

```typescript
// src/types/dateDiff.ts

export interface DateDiffOptions {
  includeStartDate: boolean;  // 開始日を含めるか（デフォルト: true）
  includeEndDate: boolean;    // 終了日を含めるか（デフォルト: true）
  excludeWeekends: boolean;   // 土日を除くか（デフォルト: false）
}

export interface DateDiffResult {
  // 単純な日数差
  totalDays: number;

  // 週数＋余り日数
  weeks: number;
  remainingDays: number;

  // 年月日差（暦としての差）
  years: number;
  months: number;
  days: number;

  // 営業日数（excludeWeekendsがtrueの場合のみ）
  businessDays?: number;
}
```

#### 関数仕様

```typescript
// src/lib/dateDiff.ts

/**
 * 2つの日付の差を計算
 * @param startDate 開始日
 * @param endDate 終了日
 * @param options オプション
 * @returns 計算結果
 */
export function calculateDateDiff(
  startDate: Date,
  endDate: Date,
  options: DateDiffOptions = {
    includeStartDate: true,
    includeEndDate: true,
    excludeWeekends: false,
  }
): DateDiffResult;

/**
 * 日数を週数＋余り日数に変換
 * @param totalDays 総日数
 * @returns {weeks: 週数, days: 余り日数}
 */
export function convertToWeeksAndDays(totalDays: number): {
  weeks: number;
  days: number;
};

/**
 * 2つの日付の年月日差を計算
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns {years: 年差, months: 月差, days: 日差}
 */
export function calculateYearsMonthsDays(
  startDate: Date,
  endDate: Date
): { years: number; months: number; days: number };

/**
 * 期間内の営業日数を計算（土日を除く）
 * @param startDate 開始日
 * @param endDate 終了日
 * @param includeStartDate 開始日を含めるか
 * @param includeEndDate 終了日を含めるか
 * @returns 営業日数
 */
export function calculateBusinessDaysSimple(
  startDate: Date,
  endDate: Date,
  includeStartDate: boolean,
  includeEndDate: boolean
): number;
```

#### UI設計

- **入力フィールド**
  - 開始日（DateInput）
  - 終了日（DateInput）

- **オプション（チェックボックス）**
  - ☑ 開始日を含める
  - ☑ 終了日を含める
  - ☐ 土日を除く

- **出力**
  - 日数差: `○○日`
  - 週数表示: `○週と○日`
  - 年月日差: `○年○か月○日`
  - （土日除く場合）営業日数: `○○営業日`

---

### 3.2 加算/減算（AddSubtract）

#### 型定義

```typescript
// src/types/addSubtract.ts

export type TimeUnit = 'days' | 'weeks' | 'months' | 'years';

export interface AddSubtractInput {
  baseDate: Date;        // 基準日
  amount: number;        // 数量（正: 加算, 負: 減算）
  unit: TimeUnit;        // 単位
}

export interface AddSubtractResult {
  resultDate: Date;          // 計算結果の日付
  dayOfWeek: string;         // 曜日（例: "月曜日"）
  dayOfWeekShort: string;    // 曜日（短縮形、例: "月"）
  daysFromToday: number;     // 今日からの日数（正: 未来, 負: 過去）
  isPast: boolean;           // 過去の日付か
  isFuture: boolean;         // 未来の日付か
  isToday: boolean;          // 今日か
}
```

#### 関数仕様

```typescript
// src/lib/addSubtract.ts

/**
 * 日付の加算/減算を行う
 * @param input 入力パラメータ
 * @returns 計算結果
 */
export function addSubtractDate(input: AddSubtractInput): AddSubtractResult;

/**
 * 曜日を日本語で取得
 * @param date 日付
 * @param short 短縮形か（デフォルト: false）
 * @returns 曜日文字列
 */
export function getDayOfWeekJa(date: Date, short?: boolean): string;

/**
 * 今日からの日数を計算
 * @param date 対象日付
 * @returns 今日からの日数（正: 未来, 負: 過去）
 */
export function getDaysFromToday(date: Date): number;
```

#### UI設計

- **入力フィールド**
  - 基準日（DateInput、デフォルト: 今日）
  - 数値（NumberInput）
  - 単位（Select: 日/週/月/年）
  - または、加算/減算ボタンを分ける

- **出力**
  - 結果の日付: `2025年12月1日`
  - 曜日: `月曜日`
  - 今日から: `15日後` または `30日前`

---

### 3.3 営業日/ビジネス日数計算（BusinessDays）

#### 型定義

```typescript
// src/types/businessDays.ts

export interface BusinessDaysOptions {
  excludedWeekdays: number[];  // 除外する曜日（0=日曜, 6=土曜）
  holidays: Date[];            // 休日リスト
}

export interface BusinessDaysResult {
  businessDays: number;        // 営業日数
  businessDateList: Date[];    // 営業日の一覧
  excludedWeekends: number;    // 除外された週末の日数
  excludedHolidays: number;    // 除外された祝日の日数
}
```

#### 関数仕様

```typescript
// src/lib/businessDays.ts

/**
 * 営業日数を計算
 * @param startDate 開始日
 * @param endDate 終了日
 * @param options 除外設定
 * @returns 営業日数と営業日リスト
 */
export function calculateBusinessDays(
  startDate: Date,
  endDate: Date,
  options: BusinessDaysOptions
): BusinessDaysResult;

/**
 * 指定日が営業日かどうかを判定
 * @param date 対象日
 * @param options 除外設定
 * @returns true: 営業日, false: 非営業日
 */
export function isBusinessDay(
  date: Date,
  options: BusinessDaysOptions
): boolean;

/**
 * テキストから休日リストをパース
 * @param text テキスト（改行区切りまたはカンマ区切り）
 * @returns 日付配列
 * @example "2025-01-01\n2025-01-13" → [Date, Date]
 */
export function parseHolidaysFromText(text: string): Date[];

/**
 * 休日リストを日付文字列の配列に変換
 * @param dates 日付配列
 * @returns 文字列配列（YYYY-MM-DD形式）
 */
export function formatHolidaysList(dates: Date[]): string[];
```

#### UI設計

- **入力フィールド**
  - 開始日（DateInput）
  - 終了日（DateInput）

- **除外設定**
  - 除外する曜日（チェックボックス）
    - ☐ 日 ☐ 月 ☐ 火 ☐ 水 ☐ 木 ☐ 金 ☐ 土
    - デフォルト: 土日にチェック
  - 休日リスト（Textarea）
    - プレースホルダー: "2025-01-01\n2025-01-13\n..."

- **出力**
  - 営業日数: `○○営業日`
  - 除外された日数: `週末: ○日、祝日: ○日`
  - 営業日一覧（スクロール可能なリスト）
    - `2025-01-06（月）`
    - `2025-01-07（火）`
    - ...

---

### 3.4 繰り返し日付の生成（Recurrence）

#### 型定義

```typescript
// src/types/recurrence.ts

export type RecurrenceType =
  | 'weekly'           // 毎週○曜日
  | 'monthly-date'     // 毎月○日
  | 'monthly-weekday'; // 毎月第N○曜日

// 毎週○曜日
export interface WeeklyRecurrence {
  type: 'weekly';
  weekday: number;  // 0=日曜, 6=土曜
}

// 毎月○日
export interface MonthlyDateRecurrence {
  type: 'monthly-date';
  date: number;  // 1-31
}

// 毎月第N○曜日
export interface MonthlyWeekdayRecurrence {
  type: 'monthly-weekday';
  weekday: number;     // 0=日曜, 6=土曜
  weekNumber: number;  // 1=第1, 2=第2, ..., 5=第5（最終）
}

export type RecurrencePattern =
  | WeeklyRecurrence
  | MonthlyDateRecurrence
  | MonthlyWeekdayRecurrence;

export interface RecurrenceInput {
  startDate: Date;
  endDate: Date;
  pattern: RecurrencePattern;
}

export interface RecurrenceResult {
  dates: Date[];
  count: number;
}
```

#### 関数仕様

```typescript
// src/lib/recurrence.ts

/**
 * 繰り返し日付を生成
 * @param input 入力パラメータ
 * @returns 生成された日付リスト
 */
export function generateRecurringDates(input: RecurrenceInput): RecurrenceResult;

/**
 * 毎週○曜日の日付を生成
 * @param startDate 開始日
 * @param endDate 終了日
 * @param weekday 曜日（0=日曜, 6=土曜）
 * @returns 日付配列
 */
export function generateWeeklyDates(
  startDate: Date,
  endDate: Date,
  weekday: number
): Date[];

/**
 * 毎月○日の日付を生成
 * @param startDate 開始日
 * @param endDate 終了日
 * @param date 日（1-31）
 * @returns 日付配列
 * @note 存在しない日（例: 2月31日）はスキップ
 */
export function generateMonthlyDates(
  startDate: Date,
  endDate: Date,
  date: number
): Date[];

/**
 * 毎月第N○曜日の日付を生成
 * @param startDate 開始日
 * @param endDate 終了日
 * @param weekday 曜日（0=日曜, 6=土曜）
 * @param weekNumber 第N週（1-5）
 * @returns 日付配列
 * @note 存在しない週（例: 第5月曜がない月）はスキップ
 */
export function generateMonthlyWeekdayDates(
  startDate: Date,
  endDate: Date,
  weekday: number,
  weekNumber: number
): Date[];

/**
 * 指定月の第N○曜日を取得
 * @param year 年
 * @param month 月（0-11）
 * @param weekday 曜日（0=日曜, 6=土曜）
 * @param weekNumber 第N週（1-5）
 * @returns 日付（存在しない場合はnull）
 */
export function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  weekNumber: number
): Date | null;
```

#### UI設計

- **入力フィールド**
  - 開始日（DateInput）
  - 終了日（DateInput）

- **パターン選択（ラジオボタン + 動的フォーム）**
  - ○ 毎週○曜日
    - 曜日選択（Select: 日/月/火/水/木/金/土）
  - ○ 毎月○日
    - 日選択（NumberInput: 1-31）
  - ○ 毎月第N○曜日
    - 第N選択（Select: 第1/第2/第3/第4/第5）
    - 曜日選択（Select: 日/月/火/水/木/金/土）

- **出力**
  - 該当日数: `○○件`
  - 日付一覧（スクロール可能）
    - `2025-01-06（月）`
    - `2025-01-13（月）`
    - ...

---

### 3.5 年齢・経過年数の計算（Age）

#### 型定義

```typescript
// src/types/age.ts

export interface AgeInput {
  birthDate: Date;               // 生年月日
  referenceDate?: Date;          // 基準日（デフォルト: 今日）
}

export interface AgeResult {
  years: number;                 // 年齢（年）
  months: number;                // 月数（年を除いた残り）
  days: number;                  // 日数（年月を除いた残り）
  totalDays: number;             // 総日数
  totalMonths: number;           // 総月数（概算）
  nextBirthday: Date;            // 次の誕生日
  daysUntilNextBirthday: number; // 次の誕生日までの日数
}

export interface MilestoneAge {
  age: number;                   // 節目の年齢
  date: Date;                    // その年齢になる日
  isPast: boolean;               // 既に過ぎたか
}
```

#### 関数仕様

```typescript
// src/lib/age.ts

/**
 * 年齢を計算
 * @param input 入力パラメータ
 * @returns 年齢情報
 */
export function calculateAge(input: AgeInput): AgeResult;

/**
 * 節目の年齢になる日を計算
 * @param birthDate 生年月日
 * @param milestones 節目の年齢リスト（例: [20, 30, 40, 60, 65, 100]）
 * @returns 節目の年齢情報リスト
 */
export function calculateMilestoneAges(
  birthDate: Date,
  milestones: number[]
): MilestoneAge[];

/**
 * 次の誕生日を計算
 * @param birthDate 生年月日
 * @param referenceDate 基準日（デフォルト: 今日）
 * @returns 次の誕生日
 */
export function getNextBirthday(
  birthDate: Date,
  referenceDate?: Date
): Date;
```

#### UI設計

- **入力フィールド**
  - 生年月日（DateInput）
  - 基準日（DateInput、デフォルト: 今日）

- **出力**
  - 年齢: `○歳○か月○日`
  - 総日数: `○○○○日`
  - 総月数: `約○○か月`
  - 次の誕生日: `2025年12月1日（あと○日）`

- **オプション: 節目の年齢（折りたたみ可能）**
  - 20歳: `2045-12-01` ✓既に過ぎた / ○日後
  - 30歳: `2055-12-01` ○日後
  - ...

---

## 4. 共通設計

### 4.1 共通型定義

```typescript
// src/types/common.ts

export interface ValidationError {
  field: string;
  message: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
```

### 4.2 共通ユーティリティ

```typescript
// src/lib/utils.ts

/**
 * 日付を文字列にフォーマット
 * @param date 日付
 * @param format フォーマット（デフォルト: 'yyyy-MM-dd'）
 * @returns フォーマット済み文字列
 */
export function formatDate(date: Date, format?: string): string;

/**
 * 文字列を日付にパース
 * @param dateString 日付文字列
 * @returns パースされた日付（無効な場合はnull）
 */
export function parseDate(dateString: string): Date | null;

/**
 * 有効な日付かどうかを判定
 * @param date 日付
 * @returns true: 有効, false: 無効
 */
export function isValidDate(date: Date): boolean;

/**
 * 日付範囲が有効かどうかを判定
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns true: 有効（開始日 <= 終了日）, false: 無効
 */
export function isValidDateRange(startDate: Date, endDate: Date): boolean;

/**
 * 曜日番号から日本語曜日名を取得
 * @param weekday 曜日番号（0=日曜, 6=土曜）
 * @param short 短縮形か
 * @returns 曜日名
 */
export function getWeekdayNameJa(weekday: number, short?: boolean): string;

/**
 * 日付配列をソート（昇順）
 * @param dates 日付配列
 * @returns ソート済み配列
 */
export function sortDates(dates: Date[]): Date[];
```

### 4.3 共通コンポーネント

```typescript
// src/components/common/DateInput.tsx
interface DateInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  min?: Date;
  max?: Date;
  required?: boolean;
}

// src/components/common/ResultCard.tsx
interface ResultCardProps {
  title: string;
  children: React.ReactNode;
}

// src/components/common/ErrorMessage.tsx
interface ErrorMessageProps {
  message: string;
}

// src/components/common/NumberInput.tsx
interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
}
```

### 4.4 App.tsx 設計

```typescript
// src/App.tsx

import { useState } from 'react';
import DateDiffTab from './components/DateDiffTab';
import AddSubtractTab from './components/AddSubtractTab';
import BusinessDaysTab from './components/BusinessDaysTab';
import RecurrenceTab from './components/RecurrenceTab';
import AgeTab from './components/AgeTab';

type TabId = 'diff' | 'add-subtract' | 'business' | 'recurrence' | 'age';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('diff');

  return (
    <div className="app">
      <header>
        <h1>Date Toolbox</h1>
        <p>日付計算ツール集</p>
      </header>

      <nav className="tabs">
        <button onClick={() => setActiveTab('diff')}>期間計算</button>
        <button onClick={() => setActiveTab('add-subtract')}>加算/減算</button>
        <button onClick={() => setActiveTab('business')}>営業日</button>
        <button onClick={() => setActiveTab('recurrence')}>繰り返し</button>
        <button onClick={() => setActiveTab('age')}>年齢計算</button>
      </nav>

      <main>
        {activeTab === 'diff' && <DateDiffTab />}
        {activeTab === 'add-subtract' && <AddSubtractTab />}
        {activeTab === 'business' && <BusinessDaysTab />}
        {activeTab === 'recurrence' && <RecurrenceTab />}
        {activeTab === 'age' && <AgeTab />}
      </main>

      <footer>
        <p>© 2025 Date Toolbox</p>
      </footer>
    </div>
  );
}

export default App;
```

---

## 5. 実装の優先順位

### Phase 1: 基盤構築
1. プロジェクトセットアップ（Vite + React + TypeScript）
2. date-fnsのインストール
3. 共通型定義（`src/types/common.ts`）
4. 共通ユーティリティ（`src/lib/utils.ts`）
5. 共通コンポーネント（DateInput, ResultCard, ErrorMessage）
6. App.tsxの骨組み（タブ切り替え機能）

### Phase 2: 基本機能実装
7. 期間計算（DateDiff）- 最も基本的な機能
8. 加算/減算（AddSubtract）- 比較的シンプル
9. 年齢計算（Age）- DateDiffの応用

### Phase 3: 高度な機能実装
10. 営業日計算（BusinessDays）- 複雑なロジック
11. 繰り返し日付生成（Recurrence）- 最も複雑

### Phase 4: 改善とテスト
12. スタイリング改善（CSS/Tailwind等）
13. レスポンシブ対応
14. エラーハンドリング強化
15. ユニットテスト追加（Vitest）
16. GitHub Actionsでのデプロイ設定

---

## 6. テスト戦略

### 6.1 ユニットテスト（Vitest）

各`lib/*.ts`の関数について、次のようなテストケースを作成：

```typescript
// src/lib/__tests__/dateDiff.test.ts

import { describe, it, expect } from 'vitest';
import { calculateDateDiff, convertToWeeksAndDays } from '../dateDiff';

describe('calculateDateDiff', () => {
  it('should calculate simple date difference', () => {
    const start = new Date('2025-01-01');
    const end = new Date('2025-01-10');
    const result = calculateDateDiff(start, end);

    expect(result.totalDays).toBe(10);
    expect(result.weeks).toBe(1);
    expect(result.remainingDays).toBe(3);
  });

  it('should handle same date', () => {
    const date = new Date('2025-01-01');
    const result = calculateDateDiff(date, date);

    expect(result.totalDays).toBe(1); // includeStartDate & includeEndDate
  });

  it('should exclude weekends when specified', () => {
    // 2025-01-01 (水) ~ 2025-01-07 (火) = 7日間、土日2日を除くと5営業日
    const start = new Date('2025-01-01');
    const end = new Date('2025-01-07');
    const result = calculateDateDiff(start, end, {
      includeStartDate: true,
      includeEndDate: true,
      excludeWeekends: true
    });

    expect(result.businessDays).toBe(5);
  });
});

describe('convertToWeeksAndDays', () => {
  it('should convert days to weeks and days', () => {
    expect(convertToWeeksAndDays(10)).toEqual({ weeks: 1, days: 3 });
    expect(convertToWeeksAndDays(7)).toEqual({ weeks: 1, days: 0 });
    expect(convertToWeeksAndDays(5)).toEqual({ weeks: 0, days: 5 });
  });
});
```

### 6.2 コンポーネントテスト（React Testing Library）

基本的なUIの動作確認：

```typescript
// src/components/__tests__/DateDiffTab.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DateDiffTab from '../DateDiffTab';

describe('DateDiffTab', () => {
  it('should render input fields', () => {
    render(<DateDiffTab />);

    expect(screen.getByLabelText(/開始日/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/終了日/i)).toBeInTheDocument();
  });

  it('should calculate and display result', () => {
    render(<DateDiffTab />);

    // 入力操作とアサーションをここに記述
  });
});
```

---

## 7. 技術選定の補足

### date-fns の主要関数

各機能で使用する date-fns の関数：

```typescript
// 期間計算
import { differenceInDays, differenceInCalendarDays,
         differenceInYears, differenceInMonths } from 'date-fns';

// 加算/減算
import { add, sub, format, getDay } from 'date-fns';

// 営業日
import { eachDayOfInterval, isWeekend, isSameDay } from 'date-fns';

// 繰り返し日付
import { eachWeekOfInterval, eachMonthOfInterval,
         setDay, setDate, getDay } from 'date-fns';

// 年齢計算
import { differenceInYears, differenceInMonths,
         differenceInDays, addYears } from 'date-fns';

// ユーティリティ
import { format, parse, isValid } from 'date-fns';
import { ja } from 'date-fns/locale';
```

### スタイリング

- **オプション1**: Plain CSS（シンプルで軽量）
- **オプション2**: CSS Modules（スコープ付きCSS）
- **オプション3**: Tailwind CSS（ユーティリティファースト）
- **推奨**: まずはPlain CSSで実装、必要に応じてTailwindを導入

### 状態管理

- 各タブは独立した状態を持つため、グローバル状態管理（Redux, Zustand等）は不要
- `useState` で十分
- 将来的に入力値の永続化が必要になったら `localStorage` を利用

---

## 8. パフォーマンス考慮事項

1. **大量の日付生成**
   - 繰り返し日付生成で、長期間の範囲を指定した場合に大量の日付が生成される可能性
   - → 最大件数制限（例: 1000件）を設ける
   - → 仮想スクロール（react-window等）を検討

2. **計算の最適化**
   - ロジック層は純粋関数なので、必要に応じて `useMemo` でメモ化
   - 入力が変わらない限り再計算しない

3. **バンドルサイズ**
   - date-fns は tree-shaking に対応しているため、必要な関数のみをインポート
   - ビルド時に `vite-plugin-compression` などで圧縮を検討

---

## 9. アクセシビリティ

- ラベルとフォーム要素の関連付け（`<label htmlFor="...">`）
- エラーメッセージの適切な表示（`aria-describedby`, `aria-invalid`）
- キーボード操作のサポート
- カラーコントラストの確保（WCAG AA準拠）

---

## 10. 今後の拡張案

- **エクスポート機能**: 計算結果をCSV/JSON形式でダウンロード
- **URL共有**: 入力値をクエリパラメータに保存し、URLで共有可能に
- **ダークモード**: ライト/ダークテーマの切り替え
- **言語切り替え**: 日本語/英語対応（i18n）
- **カレンダー表示**: 視覚的な日付選択UI
- **祝日API連携**: 日本の祝日を自動取得（将来的にサーバー側APIが必要）

---

## まとめ

この設計書に基づいて実装を進めることで、以下を実現できます：

✅ 保守性の高いコード（関心の分離、型安全性）
✅ テスタブルなロジック層
✅ 拡張しやすいアーキテクチャ
✅ ユーザーフレンドリーなUI
✅ GitHub Pages で簡単にデプロイ可能

実装はPhase 1から順に進めることを推奨します。
