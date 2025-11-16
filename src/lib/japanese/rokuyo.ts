/**
 * 六曜（ろくよう）計算ライブラリ
 * 大安、赤口、先勝、友引、先負、仏滅の計算
 */

export type RokuyoType = '大安' | '赤口' | '先勝' | '友引' | '先負' | '仏滅';

/**
 * 六曜の順序
 */
const ROKUYO_ORDER: RokuyoType[] = ['先勝', '友引', '先負', '仏滅', '大安', '赤口'];

/**
 * 六曜の説明
 */
export const ROKUYO_DESCRIPTIONS: Record<RokuyoType, string> = {
  '大安': '何事においても吉、最良の日',
  '赤口': '正午のみ吉、それ以外は凶',
  '先勝': '午前は吉、午後は凶',
  '友引': '朝夕は吉、正午は凶。葬儀は避けるべき',
  '先負': '午前は凶、午後は吉',
  '仏滅': '何事も慎むべき日、最も凶',
};

/**
 * 指定した日付の六曜を取得
 * @param date 日付
 * @returns 六曜
 */
export function getRokuyo(date: Date): RokuyoType {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // 旧暦を簡易計算（近似値）
  // 実際の旧暦計算は複雑なので、簡易的な計算を使用
  // 六曜は (旧暦の月 + 旧暦の日) % 6 で決まる

  // 新暦から旧暦への近似変換（簡易版）
  // より正確な計算が必要な場合は、旧暦計算ライブラリを使用
  const lunarMonthApprox = month;
  const lunarDayApprox = day;

  const index = (lunarMonthApprox + lunarDayApprox) % 6;
  return ROKUYO_ORDER[index];
}

/**
 * 六曜の説明を取得
 * @param rokuyo 六曜
 * @returns 説明
 */
export function getRokuyoDescription(rokuyo: RokuyoType): string {
  return ROKUYO_DESCRIPTIONS[rokuyo];
}

/**
 * 六曜が吉日かどうかを判定
 * @param rokuyo 六曜
 * @returns true: 吉日, false: 凶日
 */
export function isLuckyDay(rokuyo: RokuyoType): boolean {
  return rokuyo === '大安' || rokuyo === '先勝' || rokuyo === '友引';
}

/**
 * 六曜の色を取得（UI表示用）
 * @param rokuyo 六曜
 * @returns 色コード
 */
export function getRokuyoColor(rokuyo: RokuyoType): string {
  switch (rokuyo) {
    case '大安':
      return '#ff4444'; // 赤
    case '友引':
      return '#ff8844'; // オレンジ
    case '先勝':
      return '#4488ff'; // 青
    case '先負':
      return '#8844ff'; // 紫
    case '仏滅':
      return '#444444'; // グレー
    case '赤口':
      return '#ff44aa'; // ピンク
    default:
      return '#000000';
  }
}
