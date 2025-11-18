import { useCallback, useEffect, useState } from 'react';

/**
 * URLクエリパラメータを管理するカスタムフック
 */
export function useQueryParams() {
  const [params, setParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  // URLの変更を監視
  useEffect(() => {
    const handlePopState = () => {
      setParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // クエリパラメータを取得
  const getParam = useCallback(
    (key: string): string | null => {
      return params.get(key);
    },
    [params]
  );

  // クエリパラメータを設定（単一）
  const setParam = useCallback((key: string, value: string | null) => {
    const newParams = new URLSearchParams(window.location.search);

    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    const newUrl = `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
    setParams(newParams);
  }, []);

  // クエリパラメータを設定（複数）
  const setMultipleParams = useCallback((updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(window.location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    const newUrl = `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
    setParams(newParams);
  }, []);

  // クエリパラメータを削除
  const deleteParam = useCallback((key: string) => {
    setParam(key, null);
  }, [setParam]);

  // すべてのクエリパラメータをクリア
  const clearParams = useCallback(() => {
    window.history.pushState({}, '', window.location.pathname);
    setParams(new URLSearchParams());
  }, []);

  return {
    params,
    getParam,
    setParam,
    setMultipleParams,
    deleteParam,
    clearParams,
  };
}

/**
 * 特定のクエリパラメータと同期するステートを管理するフック
 */
export function useQueryParamState<T extends string>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const { getParam, setParam } = useQueryParams();
  const [state, setState] = useState<T>(() => {
    const paramValue = getParam(key);
    return (paramValue as T) || defaultValue;
  });

  // パラメータが変更されたら状態を更新
  useEffect(() => {
    const paramValue = getParam(key);
    if (paramValue && paramValue !== state) {
      setState(paramValue as T);
    }
  }, [key, getParam, state]);

  // 状態を更新してURLパラメータに反映
  const updateState = useCallback(
    (value: T) => {
      setState(value);
      setParam(key, value);
    },
    [key, setParam]
  );

  return [state, updateState];
}

/**
 * Date型のクエリパラメータを管理するフック
 */
export function useQueryParamDate(
  key: string,
  defaultValue: Date | null = null
): [Date | null, (value: Date | null) => void] {
  const { getParam, setParam } = useQueryParams();
  const [state, setState] = useState<Date | null>(() => {
    const paramValue = getParam(key);
    if (paramValue) {
      const date = new Date(paramValue);
      return isNaN(date.getTime()) ? defaultValue : date;
    }
    return defaultValue;
  });

  // パラメータが変更されたら状態を更新
  useEffect(() => {
    const paramValue = getParam(key);
    if (paramValue) {
      const date = new Date(paramValue);
      if (!isNaN(date.getTime())) {
        setState(date);
      }
    }
  }, [key, getParam]);

  // 状態を更新してURLパラメータに反映
  const updateState = useCallback(
    (value: Date | null) => {
      setState(value);
      if (value) {
        setParam(key, value.toISOString());
      } else {
        setParam(key, null);
      }
    },
    [key, setParam]
  );

  return [state, updateState];
}

/**
 * Number型のクエリパラメータを管理するフック
 */
export function useQueryParamNumber(
  key: string,
  defaultValue: number = 0
): [number, (value: number) => void] {
  const { getParam, setParam } = useQueryParams();
  const [state, setState] = useState<number>(() => {
    const paramValue = getParam(key);
    if (paramValue) {
      const num = Number(paramValue);
      return isNaN(num) ? defaultValue : num;
    }
    return defaultValue;
  });

  // パラメータが変更されたら状態を更新
  useEffect(() => {
    const paramValue = getParam(key);
    if (paramValue) {
      const num = Number(paramValue);
      if (!isNaN(num)) {
        setState(num);
      }
    }
  }, [key, getParam]);

  // 状態を更新してURLパラメータに反映
  const updateState = useCallback(
    (value: number) => {
      setState(value);
      setParam(key, value.toString());
    },
    [key, setParam]
  );

  return [state, updateState];
}

/**
 * Boolean型のクエリパラメータを管理するフック
 */
export function useQueryParamBoolean(
  key: string,
  defaultValue: boolean = false
): [boolean, (value: boolean) => void] {
  const { getParam, setParam } = useQueryParams();
  const [state, setState] = useState<boolean>(() => {
    const paramValue = getParam(key);
    if (paramValue === 'true') return true;
    if (paramValue === 'false') return false;
    return defaultValue;
  });

  // パラメータが変更されたら状態を更新
  useEffect(() => {
    const paramValue = getParam(key);
    if (paramValue === 'true') {
      setState(true);
    } else if (paramValue === 'false') {
      setState(false);
    }
  }, [key, getParam]);

  // 状態を更新してURLパラメータに反映
  const updateState = useCallback(
    (value: boolean) => {
      setState(value);
      setParam(key, value.toString());
    },
    [key, setParam]
  );

  return [state, updateState];
}
