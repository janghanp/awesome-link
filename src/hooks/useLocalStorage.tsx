import { useEffect, useState } from 'react';

const useLocalStorage = (key: string, defaultValue: string) => {
  const [state, setState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key) || defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem('theme', state);
  }, [state]);

  return { state, setState };
};

export default useLocalStorage;
