import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export function useReadOnly(): boolean {
  const location = useLocation();
  return useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('mode') === 'readonly';
  }, [location.search]);
}
