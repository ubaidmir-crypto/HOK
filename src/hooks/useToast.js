import { useState, useRef } from 'react';

export function useToast() {
  const [current, setCurrent] = useState(null);
  const timerRef = useRef(null);

  const notify = (msg, kind = 'ok') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrent({ msg, kind });
    timerRef.current = setTimeout(() => setCurrent(null), 3500);
  };

  return { current, notify };
}