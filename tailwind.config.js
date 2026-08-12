/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-sunk': 'var(--paper-sunk)',
        carbon: 'var(--carbon)',
        'carbon-lift': 'var(--carbon-lift)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        'ink-faint': 'var(--ink-faint)',
        'ink-inverse': 'var(--ink-inverse)',
        'ink-inverse-muted': 'var(--ink-inverse-muted)',
        violet: 'var(--violet)',
        'violet-lum': 'var(--violet-lum)',
      },
      borderColor: {
        rule: 'var(--rule)',
        'rule-strong': 'var(--rule-strong)',
        'rule-inverse': 'var(--rule-inverse)',
      },
      fontFamily: {
        sans: [
          'Schibsted Grotesk',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Editorial display scale. Line height and tracking travel with the size.
        'display-xl': ['clamp(2.8rem, 6.1vw, 5.3rem)', { lineHeight: '1.0', letterSpacing: '-0.034em' }],
        'display-lg': ['clamp(2.3rem, 5.6vw, 4.9rem)', { lineHeight: '1.03', letterSpacing: '-0.031em' }],
        'display-md': ['clamp(1.85rem, 3.9vw, 3.2rem)', { lineHeight: '1.09', letterSpacing: '-0.026em' }],
        'display-sm': ['clamp(1.5rem, 2.6vw, 2.1rem)', { lineHeight: '1.18', letterSpacing: '-0.02em' }],
        lede: ['clamp(1.02rem, 1.5vw, 1.28rem)', { lineHeight: '1.56', letterSpacing: '-0.006em' }],
        body: ['1.0625rem', { lineHeight: '1.68', letterSpacing: '-0.004em' }],
        small: ['0.9375rem', { lineHeight: '1.62' }],
        label: ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.16em' }],
        micro: ['0.75rem', { lineHeight: '1.55' }],
      },
      maxWidth: {
        shell: '1240px',
        measure: '30rem',
        'measure-wide': '38rem',
      },
      transitionTimingFunction: {
        quiet: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
