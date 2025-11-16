export interface WarekiEra {
  name: string;        // 元号名（例: '令和'）
  nameEn: string;      // 元号名（ローマ字、例: 'Reiwa'）
  symbol: string;      // 記号（例: 'R'）
  startDate: Date;     // 開始日
  endDate: Date | null; // 終了日（現在の元号の場合はnull）
}

export interface WarekiDate {
  era: string;         // 元号名
  eraSymbol: string;   // 元号記号
  year: number;        // 年（元号の年）
  month: number;       // 月
  day: number;         // 日
  westernYear: number; // 西暦年
}

export interface WarekiConversionResult {
  wareki: WarekiDate;
  formatted: {
    full: string;      // 例: '令和7年1月15日'
    short: string;     // 例: 'R7.1.15'
    standard: string;  // 例: '令和7年01月15日'
  };
}
