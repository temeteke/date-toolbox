# Date Toolbox

日付まわりのよくある計算を、ブラウザだけでサクッと行うためのツール集です。
GitHub Pages にデプロイして、クライアントサイドのみで動作します。

## 機能概要

5つの日付計算機能をタブで切り替えて利用できます。

### 1. 期間計算（2つの日付の差）

* 開始日と終了日から、次のような差を計算

  * 日数差
  * 週数＋日数（例: 3週と4日）
  * 年月日差（例: 1年2か月5日）※暦としての差
* オプション

  * ✅ 開始日・終了日を含める／含めない
  * ✅ 土日を除いたビジネス日数

### 2. 加算／減算（X日後・X日前）

* 基準日（デフォルトは「今日」）に対して次を加減算

  * 日・週・月・年
* 出力

  * 計算後の日付
  * その曜日
  * 「今日から何日後／何日前か」

### 3. 営業日／ビジネス日数計算

* 入力

  * 開始日／終了日
  * 除外する曜日（例: 土日を除外）
  * 任意の休日リスト（テキストで日付列挙）
* 出力

  * 営業日数
  * 営業日の一覧

### 4. 繰り返し日付の生成

* 例:

  * 毎週 ○曜日
  * 毎月 ○日
  * 毎月第 N ○曜日（第2火曜など）
* 入力範囲（開始日〜終了日）内の該当日付を一覧で出力

### 5. 年齢・経過年数の計算

* 生年月日／開始日から、今日時点の

  * 年齢（○歳○か月○日）
  * 経過年数
  * 総日数、総月数
  * 次の誕生日までの日数
  * ✅ 節目の年齢になる日（20歳、30歳など）

---

## 技術スタック

* ビルドツール: [Vite](https://vitejs.dev/)
* フロントエンド: [React](https://react.dev/)
* 言語: TypeScript
* 日付計算ライブラリ: [date-fns](https://date-fns.org/)
* テストフレームワーク: [Vitest](https://vitest.dev/)
* PWA対応: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

クライアントサイドのみで完結しており、サーバサイドコンポーネントや外部 API は使用しません。
PWA（Progressive Web App）として動作するため、オフラインでも利用可能です。

---

## 開発環境セットアップ

Node.js (推奨: 18 以降) がインストールされている前提です。

```bash
git clone https://github.com/<your-account>/date-toolbox.git
cd date-toolbox

npm install
```

### 開発サーバの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173`（ポート番号はログに表示される値）にアクセスします。

### ビルド

```bash
npm run build
```

`dist/` ディレクトリに静的ファイルが出力されます。

### テスト

```bash
npm run test
```

### リント

```bash
npm run lint
```

---

## GitHub Pages へのデプロイ

GitHub Pages で `https://<your-account>.github.io/date-toolbox/` として公開することを想定しています。

### 自動デプロイ

GitHub Actions ワークフロー（`.github/workflows/deploy.yml`）が設定されており、`main` または `master` ブランチへのプッシュで自動的にビルド・デプロイされます。

### 設定

`vite.config.ts` では、リポジトリ名に合わせて `base` を設定し、PWAプラグインも含まれています：

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Date Toolbox - 日付計算ツール集',
        short_name: 'Date Toolbox',
        // ... その他のPWA設定
      }
    })
  ],
  base: '/date-toolbox/', // GitHub Pages の公開パスに合わせる
});
```

---

## ディレクトリ構成

```text
date-toolbox/
  ├─ index.html
  ├─ package.json
  ├─ vite.config.ts
  ├─ tsconfig.json
  ├─ README.md
  ├─ public/                        # 静的アセット
  │   ├─ icon.svg                   # PWAアイコン（SVG）
  │   ├─ icon-192.png               # PWAアイコン（192x192）
  │   ├─ icon-512.png               # PWAアイコン（512x512）
  │   └─ manifest.webmanifest       # PWAマニフェスト
  ├─ scripts/
  │   └─ generate-icons.js          # アイコン生成スクリプト
  ├─ src/
  │   ├─ main.tsx
  │   ├─ App.tsx
  │   ├─ App.css
  │   ├─ index.css
  │   ├─ components/
  │   │   ├─ DateDiffTab.tsx        # 期間計算
  │   │   ├─ AddSubtractTab.tsx     # 加算／減算
  │   │   ├─ BusinessDaysTab.tsx    # 営業日
  │   │   ├─ RecurrenceTab.tsx      # 繰り返し日付
  │   │   ├─ AgeTab.tsx             # 年齢・経過年数
  │   │   └─ common/                # 共通コンポーネント
  │   │       ├─ DateInput.tsx
  │   │       ├─ NumberInput.tsx
  │   │       ├─ ErrorMessage.tsx
  │   │       └─ ResultCard.tsx
  │   ├─ lib/                       # 計算ロジック
  │   │   ├─ dateDiff.ts            # 期間計算
  │   │   ├─ addSubtract.ts         # 加算／減算
  │   │   ├─ businessDays.ts        # 営業日計算
  │   │   ├─ recurrence.ts          # 繰り返し日付の生成
  │   │   ├─ age.ts                 # 年齢計算
  │   │   └─ utils.ts               # ユーティリティ関数
  │   └─ types/                     # 型定義
  │       ├─ common.ts
  │       ├─ dateDiff.ts
  │       ├─ addSubtract.ts
  │       ├─ businessDays.ts
  │       ├─ recurrence.ts
  │       └─ age.ts
  └─ .github/
      └─ workflows/
          └─ deploy.yml             # GitHub Pages 自動デプロイワークフロー
```

---

## 開発の方針

* **UI と計算ロジックの分離**: 日付計算ロジックは `src/lib/` 以下に集約し、コンポーネントから独立させています。
* **型安全性**: TypeScript を活用し、`src/types/` で各機能の型定義を管理しています。
* **コンポーネントの責務**:
  * 入力フォームの状態管理
  * `lib` の関数呼び出し
  * 結果表示
* **共通コンポーネント**: `src/components/common/` に再利用可能なUI部品を配置しています。
* **日付計算**: `date-fns` をベースに実装し、テスタビリティを確保しています。
* **PWA対応**: オフライン動作をサポートし、ホーム画面への追加が可能です。
* **テスト**: Vitest によるユニットテストで品質を担保しています。
