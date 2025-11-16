/**
 * 二十四節気（にじゅうしせっき）計算ライブラリ
 */

export interface Sekki {
  name: string;
  date: Date;
  description: string;
}

/**
 * 二十四節気の名称と説明
 */
const SEKKI_INFO: Array<{ name: string; description: string }> = [
  { name: '立春', description: '春の始まり' },
  { name: '雨水', description: '雪が雨に変わる頃' },
  { name: '啓蟄', description: '虫が地中から出てくる頃' },
  { name: '春分', description: '昼と夜の長さがほぼ等しい' },
  { name: '清明', description: '万物が清らかで生き生きとする頃' },
  { name: '穀雨', description: '穀物を潤す春雨が降る頃' },
  { name: '立夏', description: '夏の始まり' },
  { name: '小満', description: '草木が茂り天地に満ち始める頃' },
  { name: '芒種', description: '稲などの穀物の種をまく頃' },
  { name: '夏至', description: '一年で最も昼が長い日' },
  { name: '小暑', description: '暑さが本格的になる前' },
  { name: '大暑', description: '一年で最も暑い頃' },
  { name: '立秋', description: '秋の始まり' },
  { name: '処暑', description: '暑さが収まる頃' },
  { name: '白露', description: '朝露が白く光る頃' },
  { name: '秋分', description: '昼と夜の長さがほぼ等しい' },
  { name: '寒露', description: '冷たい露が降りる頃' },
  { name: '霜降', description: '霜が降り始める頃' },
  { name: '立冬', description: '冬の始まり' },
  { name: '小雪', description: 'わずかに雪が降り始める頃' },
  { name: '大雪', description: '本格的に雪が降る頃' },
  { name: '冬至', description: '一年で最も昼が短い日' },
  { name: '小寒', description: '寒さが厳しくなる前' },
  { name: '大寒', description: '一年で最も寒い頃' },
];

/**
 * 二十四節気の近似日（2000年代の平均値を使用）
 * 実際の計算は太陽黄経に基づくが、簡易版として月日で近似
 */
const SEKKI_DATES = [
  { month: 2, day: 4, index: 0 },  // 立春
  { month: 2, day: 19, index: 1 }, // 雨水
  { month: 3, day: 6, index: 2 },  // 啓蟄
  { month: 3, day: 21, index: 3 }, // 春分
  { month: 4, day: 5, index: 4 },  // 清明
  { month: 4, day: 20, index: 5 }, // 穀雨
  { month: 5, day: 6, index: 6 },  // 立夏
  { month: 5, day: 21, index: 7 }, // 小満
  { month: 6, day: 6, index: 8 },  // 芒種
  { month: 6, day: 21, index: 9 }, // 夏至
  { month: 7, day: 7, index: 10 }, // 小暑
  { month: 7, day: 23, index: 11 }, // 大暑
  { month: 8, day: 8, index: 12 }, // 立秋
  { month: 8, day: 23, index: 13 }, // 処暑
  { month: 9, day: 8, index: 14 }, // 白露
  { month: 9, day: 23, index: 15 }, // 秋分
  { month: 10, day: 8, index: 16 }, // 寒露
  { month: 10, day: 23, index: 17 }, // 霜降
  { month: 11, day: 7, index: 18 }, // 立冬
  { month: 11, day: 22, index: 19 }, // 小雪
  { month: 12, day: 7, index: 20 }, // 大雪
  { month: 12, day: 22, index: 21 }, // 冬至
  { month: 1, day: 6, index: 22 }, // 小寒
  { month: 1, day: 20, index: 23 }, // 大寒
];

/**
 * 指定年の二十四節気を取得
 * @param year 年
 * @returns 二十四節気のリスト
 */
export function getSekki(year: number): Sekki[] {
  return SEKKI_DATES.map(({ month, day, index }) => {
    const info = SEKKI_INFO[index];
    return {
      name: info.name,
      date: new Date(year, month - 1, day),
      description: info.description,
    };
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * 指定日付に最も近い二十四節気を取得
 * @param date 日付
 * @returns 二十四節気
 */
export function getNearestSekki(date: Date): Sekki | null {
  const year = date.getFullYear();
  const allSekki = [
    ...getSekki(year - 1),
    ...getSekki(year),
    ...getSekki(year + 1),
  ];

  let nearest: Sekki | null = null;
  let minDiff = Infinity;

  for (const sekki of allSekki) {
    const diff = Math.abs(sekki.date.getTime() - date.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      nearest = sekki;
    }
  }

  return nearest;
}

/**
 * 指定日付が二十四節気かどうかを判定
 * @param date 日付
 * @returns 二十四節気の情報（該当しない場合はnull）
 */
export function isSekki(date: Date): Sekki | null {
  const year = date.getFullYear();
  const sekkiList = getSekki(year);

  for (const sekki of sekkiList) {
    if (
      sekki.date.getFullYear() === date.getFullYear() &&
      sekki.date.getMonth() === date.getMonth() &&
      sekki.date.getDate() === date.getDate()
    ) {
      return sekki;
    }
  }

  return null;
}
