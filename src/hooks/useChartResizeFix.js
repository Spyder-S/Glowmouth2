import { useEffect } from 'react';

// Recharts' ResponsiveContainer occasionally measures a stale/zero width on
// first paint (most visible right after a route change). Dispatching a
// resize event after mount forces it to remeasure against the real layout.
export default function useChartResizeFix() {
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
    return () => cancelAnimationFrame(id);
  }, []);
}
