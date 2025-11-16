import type { HistoryItem, HistoryState } from '../../types/data/history';

const STORAGE_KEY = 'date-toolbox-history';
const MAX_HISTORY_ITEMS = 50;

/**
 * LocalStorageから履歴を読み込み
 * @returns 履歴の状態
 */
export function loadHistory(): HistoryState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as HistoryState;
      return {
        items: parsed.items || [],
        maxItems: parsed.maxItems || MAX_HISTORY_ITEMS,
      };
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }

  return {
    items: [],
    maxItems: MAX_HISTORY_ITEMS,
  };
}

/**
 * LocalStorageに履歴を保存
 * @param state 履歴の状態
 */
export function saveHistory(state: HistoryState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

/**
 * 履歴にアイテムを追加
 * @param item 履歴アイテム
 */
export function addHistoryItem(
  type: HistoryItem['type'],
  description: string,
  data: any
): void {
  const state = loadHistory();

  const newItem: HistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    type,
    description,
    data,
  };

  // 新しいアイテムを先頭に追加
  state.items.unshift(newItem);

  // 最大数を超えたら古いものを削除
  if (state.items.length > state.maxItems) {
    state.items = state.items.slice(0, state.maxItems);
  }

  saveHistory(state);
}

/**
 * 履歴アイテムを削除
 * @param id アイテムID
 */
export function removeHistoryItem(id: string): void {
  const state = loadHistory();
  state.items = state.items.filter(item => item.id !== id);
  saveHistory(state);
}

/**
 * 履歴を全てクリア
 */
export function clearHistory(): void {
  saveHistory({
    items: [],
    maxItems: MAX_HISTORY_ITEMS,
  });
}

/**
 * 履歴アイテムを取得
 * @param limit 取得する最大数
 * @returns 履歴アイテムの配列
 */
export function getHistory(limit?: number): HistoryItem[] {
  const state = loadHistory();
  if (limit && limit > 0) {
    return state.items.slice(0, limit);
  }
  return state.items;
}

/**
 * 特定のタイプの履歴アイテムを取得
 * @param type 履歴タイプ
 * @param limit 取得する最大数
 * @returns 履歴アイテムの配列
 */
export function getHistoryByType(
  type: HistoryItem['type'],
  limit?: number
): HistoryItem[] {
  const state = loadHistory();
  const filtered = state.items.filter(item => item.type === type);

  if (limit && limit > 0) {
    return filtered.slice(0, limit);
  }
  return filtered;
}
