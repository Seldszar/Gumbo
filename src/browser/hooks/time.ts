import { useState } from "react";
import { useHarmonicIntervalFn } from "react-use";

export function useNow(interval = 1000): Date {
  const [now, setNow] = useState(new Date());

  useHarmonicIntervalFn(() => {
    setNow(new Date());
  }, interval);

  return now;
}
