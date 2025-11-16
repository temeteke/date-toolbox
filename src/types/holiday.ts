export interface Holiday {
  date: Date;
  name: string;
  type: 'fixed' | 'variable' | 'substitue';
}

export interface HolidayCheckResult {
  isHoliday: boolean;
  holiday?: Holiday;
}
