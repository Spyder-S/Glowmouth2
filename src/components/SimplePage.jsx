import React from 'react';

export default function SimplePage({ title, children }) {
  return (
    <div className="static-page">
      <section className="wrap" style={{ padding: '120px 0' }}>
        <h1>{title}</h1>
        <div className="static-body" style={{ marginTop: 24, lineHeight: 1.72, color: 'var(--muted)', fontSize: 16 }}>
          {children}
        </div>
      </section>
    </div>
  );
}
