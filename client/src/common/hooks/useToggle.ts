import { useCallback, useState } from 'react';

export function useToggle(initialValue = false) {
  const [isToggled, setIsToggled] = useState(initialValue);
  const toggle = useCallback((value?: any) => {
    if (typeof value === 'boolean') setIsToggled(value);
    else setIsToggled((isToggled) => !isToggled);
  }, []);
  return [isToggled, toggle] as const;
}
