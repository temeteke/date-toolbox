export interface TimeDifference {
  totalMilliseconds: number;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TimeAddSubtractResult {
  resultDate: Date;
  formatted: {
    date: string;
    time: string;
    dateTime: string;
    iso: string;
  };
}
