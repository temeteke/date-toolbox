export interface HistoryItem {
  id: string;
  timestamp: number;
  type: 'date-diff' | 'add-subtract' | 'business-days' | 'recurrence' | 'age' | 'wareki' | 'time-calc' | 'countdown';
  description: string;
  data: any;
}

export interface HistoryState {
  items: HistoryItem[];
  maxItems: number;
}
