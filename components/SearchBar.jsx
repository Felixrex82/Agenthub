// components/SearchBar.jsx
export default function SearchBar({ value, onChange, count }) {
  return (
    <div style={{ position: 'relative', marginBottom: 28 }}>
      <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}
        width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="8.5" cy="8.5" r="5.75"/><path d="M17 17l-3.87-3.87" strokeLinecap="round"/>
      </svg>
      <input
        type="text"
        placeholder="Search by name, description, skills…"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '0 80px 0 42px', height: 44,
          border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)', color: 'var(--text-1)',
          fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none',
          transition: 'all var(--transition)', boxShadow: 'var(--shadow-card)',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(79,140,255,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,140,255,0.08), var(--shadow-card)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'var(--shadow-card)' }}
      />
      <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
        {count} agent{count !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
