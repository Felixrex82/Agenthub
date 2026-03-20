// components/AgentCard.jsx
import Link from 'next/link'

const AVATAR_COLORS = [
  ['rgba(79,140,255,0.15)',  '#4f8cff'],
  ['rgba(62,207,142,0.15)',  '#3ecf8e'],
  ['rgba(245,166,35,0.15)',  '#f5a623'],
  ['rgba(255,92,92,0.15)',   '#ff5c5c'],
  ['rgba(167,139,250,0.15)', '#a78bfa'],
  ['rgba(34,211,238,0.15)',  '#22d3ee'],
]

function getColors(name) {
  return AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length]
}

export default function AgentCard({ agent, index }) {
  const [bg, fg] = getColors(agent.name)
  const initials = agent.name?.slice(0, 2).toUpperCase() || '??'
  const slug = encodeURIComponent(agent.name)

  return (
    <Link href={`/agent/${slug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 20,
          cursor: 'pointer',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          overflow: 'hidden',
          animation: `cardin 0.3s ease both`,
          animationDelay: `${index * 45}ms`,
          transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
          e.currentTarget.style.borderColor = 'rgba(79,140,255,0.28)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'var(--shadow-card)'
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {/* Glow overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, var(--accent-glow) 0%, transparent 60%)`,
          opacity: 0, transition: 'opacity 0.18s ease',
          borderRadius: 'inherit', pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, minWidth: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: bg, color: fg,
              border: `1px solid ${fg}33`,
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.02em',
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {agent.name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.02em' }}>
                {agent.creator?.slice(0, 6)}…{agent.creator?.slice(-4)}
              </div>
            </div>
          </div>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="var(--text-3)" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 2, transition: 'all 0.18s ease' }}>
            <path d="M7 3h10v10M17 3L3 17" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Description */}
        <p style={{
          fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, fontWeight: 300,
          marginBottom: 16,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {agent.description}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.03em', background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(79,140,255,0.18)' }}>ipfs</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.03em', background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(62,207,142,0.18)' }}>live</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.03em' }}>view →</span>
        </div>
      </div>
    </Link>
  )
}
