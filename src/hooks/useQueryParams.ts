import { useState, useCallback } from 'react';

export function useQueryParams() {
  const [params, setParams] = useState<URLSearchParams>(
    () => new URLSearchParams(window.location.search)
  );

  const get = useCallback((key: string): string | null => {
    return params.get(key);
  }, [params]);

  const set = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set(key, value);
    window.history.pushState({}, '', `?${newParams.toString()}`);
    setParams(newParams);
  }, []);

  return { get, set, params };
}
