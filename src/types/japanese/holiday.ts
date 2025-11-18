export interface Holiday {
  date: Date;
  name: string;
  type: 'fixed' | 'variable' | 'substitute';
}

export interface HolidayCheckResult {
  isHoliday: boolean;
  holiday?: Holiday;
}
