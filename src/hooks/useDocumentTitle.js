import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — GlowMouth` : 'GlowMouth — Oral Health Intelligence';
    return () => { document.title = prev; };
  }, [title]);
}
