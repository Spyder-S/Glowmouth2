import { useEffect } from 'react';

// simple hook: when ref current mounts, observe all children with class "fade" and
// add class "in" when they intersect
export default function useFade(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    ref.current.querySelectorAll('.fade').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}
