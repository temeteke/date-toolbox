/**
 * タイムゾーン情報
 */
export interface TimezoneInfo {
  name: string;
  identifier: string;
  offset: string;
  abbreviation?: string;
}

/**
 * タイムゾーン変換結果
 */
export interface TimezoneConversionResult {
  sourceTime: Date;
  targetTime: Date;
  formatted: {
    source: string;
    target: string;
    sourceISO: string;
    targetISO: string;
  };
  timeDifference: {
    hours: number;
    minutes: number;
  };
}

/**
 * 複数タイムゾーン表示用
 */
export interface MultiTimezoneDisplay {
  timezone: string;
  time: Date;
  formatted: string;
  offset: string;
}
