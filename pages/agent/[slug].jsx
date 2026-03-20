// pages/agent/[slug].jsx — Agent Profile
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import SkillsViewer from '../../components/SkillsViewer'
import { useAgents } from '../../hooks/useAgents'

export default function AgentProfilePage({ wallet }) {
  const router = useRouter()
  const { slug } = router.query
  const name = slug ? decodeURIComponent(slug) : null

  const { agents, fetchAgents } = useAgents()
  const [agent, setAgent]           = useState(null)
  const [connected, setConnected]   = useState(false)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => { fetchAgents(wallet.provider || null) }, [wallet.provider])
  useEffect(() => {
    if (name && agents.length > 0) {
      setAgent(agents.find(a => a.name?.toLowerCase() === name.toLowerCase()) || null)
    }
  }, [name, agents])

  const handleConnect = async () => {
    if (!wallet.account) { wallet.connect(); return }
    setConnecting(true)
    await new Promise(r => setTimeout(r, 900))
    setConnected(true)
    setConnecting(false)
  }

  const AVATAR_COLORS = [
    ['rgba(79,140,255,0.15)','#4f8cff'],
    ['rgba(62,207,142,0.15)','#3ecf8e'],
    ['rgba(245,166,35,0.15)','#f5a623'],
    ['rgba(255,92,92,0.15)','#ff5c5c'],
    ['rgba(167,139,250,0.15)','#a78bfa'],
    ['rgba(34,211,238,0.15)','#22d3ee'],
  ]
  const [bg, fg] = agent ? AVATAR_COLORS[(agent.name?.charCodeAt(0)||0) % AVATAR_COLORS.length] : ['#1c1c1c','#555']

  const exampleCode = agent ? `// POST request to ${agent.name} agent
const response = await fetch('${agent.endpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${YOUR_API_KEY}\`,
    'X-Caller-Address': \`\${wallet.address}\`,
  },
  body: JSON.stringify({
    input: 'Your task or query here',
    options: {
      format: 'json',
      max_tokens: 1024,
      stream: false,
    },
  }),
})

const result = await response.json()
console.log(result)` : ''

  if (!agent && agents.length === 0) {
    return (
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <svg style={{ animation: 'spin 0.75s linear infinite', margin: '0 auto 16px', display: 'block' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
        </svg>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}>Loading agent…</p>
      </div>
    )
  }

  if (!agent) {
    return (
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, marginBottom: 12, color: 'var(--text-3)' }}>◎</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--text-1)', marginBottom: 8 }}>Agent not found</h2>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>No agent named "{name}" is registered.</p>
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>← back to directory</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 80px' }} className="page-enter">
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', textDecoration: 'none', marginBottom: 24, letterSpacing: '0.04em' }}>
        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
        ← back to directory
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* ── Main column ── */}
        <div>
          {/* Profile card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', marginBottom: 14 }}>
            {/* Accent bar */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${fg}, var(--accent))` }} />

            {/* Hero section */}
            <div style={{ padding: '28px 28px 24px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'var(--accent-dim)', filter: 'blur(40px)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, color: fg, border: `1px solid ${fg}33`, fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 500, flexShrink: 0 }}>
                  {agent.name?.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--text-1)', marginBottom: 8 }}>{agent.name}</h1>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                    {[
                      { label: 'live', bg: 'var(--green-dim)', color: 'var(--green)', border: 'rgba(62,207,142,0.18)', dot: true },
                      { label: 'base mainnet', bg: 'var(--accent-dim)', color: 'var(--accent)', border: 'rgba(79,140,255,0.18)' },
                      { label: 'ipfs', bg: 'var(--accent-dim)', color: 'var(--accent)', border: 'rgba(79,140,255,0.18)' },
                    ].map(t => (
                      <span key={t.label} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.03em', background: t.bg, color: t.color, border: `1px solid ${t.border}`, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {t.dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />}
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '0 16px', height: 36, borderRadius: 'var(--radius-sm)',
                    fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-body)',
                    border: 'none', cursor: connecting ? 'wait' : 'pointer', flexShrink: 0,
                    ...(connected
                      ? { background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(62,207,142,0.3)', boxShadow: 'none' }
                      : { background: 'var(--accent)', color: '#fff', boxShadow: '0 0 0 1px rgba(79,140,255,0.4), 0 4px 16px rgba(79,140,255,0.25)', opacity: connecting ? 0.7 : 1 }
                    ),
                  }}
                >
                  {connecting ? (
                    <><svg style={{ animation: 'spin 0.75s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/></svg>Connecting</>
                  ) : connected ? (
                    <><svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>Connected</>
                  ) : (
                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>Connect</>
                  )}
                </button>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, fontWeight: 300 }}>{agent.description}</p>
            </div>

            {/* Meta grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)' }}>
              {[
                { label: 'Creator', value: agent.creator, mono: true, accent: true },
                { label: 'Endpoint', value: agent.endpoint, mono: true },
              ].map(({ label, value, mono, accent }) => (
                <div key={label} style={{ background: 'var(--bg-surface)', padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
                  <div style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: 12, color: accent ? 'var(--accent)' : 'var(--text-1)', wordBreak: 'break-all', lineHeight: 1.4 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Success banner */}
          {connected && (
            <div className="animate-fadeup" style={{ background: 'var(--green-dim)', border: '1px solid rgba(62,207,142,0.22)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'rgba(62,207,142,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="var(--green)"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--green)', marginBottom: 3 }}>Agent connected</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(62,207,142,0.65)' }}>Endpoint: {agent.endpoint}</div>
              </div>
            </div>
          )}

          {/* Skills */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Skill File</div>
            <SkillsViewer skillsURI={agent.skillsURI} />
          </div>

          {/* Code block */}
          {agent.endpoint && (
            <>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, marginTop: 20 }}>Example API Request</div>
              <div style={{ background: 'var(--code-bg)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em' }}>API REQUEST · JAVASCRIPT</span>
                </div>
                <pre style={{ padding: '18px 20px', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.8, color: '#cdd9e5', overflowX: 'auto', whiteSpace: 'pre' }}>
                  <code dangerouslySetInnerHTML={{ __html: exampleCode
                    .replace(/\b(const|await|false)\b/g, '<span style="color:#ff7b72">$1</span>')
                    .replace(/\b(fetch|JSON\.stringify|console\.log|response\.json)\b/g, '<span style="color:#79c0ff">$1</span>')
                    .replace(/(['"`][^'"`\n]*['"`])/g, '<span style="color:#a5d6ff">$1</span>')
                    .replace(/(\/\/[^\n]*)/g, '<span style="color:#8b949e">$1</span>')
                  }} />
                </pre>
              </div>
            </>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div>
          {/* Agent info */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 20, boxShadow: 'var(--shadow-card)', marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Agent Info</div>
            {[
              { dot: 'var(--green)', shadow: '0 0 5px rgba(62,207,142,0.5)', label: 'Status', val: 'Live', color: 'var(--green)' },
              { dot: 'var(--accent)', label: 'Network', val: 'Base' },
              { dot: 'var(--amber)', label: 'Chain ID', val: '8453' },
              { dot: 'var(--text-3)', label: 'Skills', val: 'IPFS' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.dot, boxShadow: r.shadow || 'none', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-2)', flex: 1 }}>{r.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: r.color || 'var(--text-1)' }}>{r.val}</span>
              </div>
            ))}
          </div>

          {/* On-chain info */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 20, boxShadow: 'var(--shadow-card)', marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>On-chain</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', lineHeight: 1.9 }}>
              <div>registry: <span style={{ color: 'var(--accent)' }}>Base Mainnet</span></div>
              <div>function: <span style={{ color: 'var(--text-2)' }}>getAgents()</span></div>
              <div>verified: <span style={{ color: 'var(--green)' }}>✓</span></div>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 20, boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { label: 'Connect Agent', icon: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71', action: handleConnect },
                { label: 'View on IPFS', icon: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6', action: () => agent.skillsURI && window.open(`https://ipfs.io/ipfs/${agent.skillsURI.replace('ipfs://','')}`, '_blank') },
                { label: 'View on Basescan', icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14', action: () => window.open(`https://basescan.org/address/${agent.creator}`, '_blank') },
              ].map(({ label, icon, action }) => (
                <button key={label} onClick={action} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 34, borderRadius: 'var(--radius-sm)', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 500,
                  background: 'none', border: '1px solid var(--border)', color: 'var(--text-2)', cursor: 'pointer', textAlign: 'left', transition: 'all var(--transition)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.background = 'var(--bg-raised)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'none'; }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={icon}/></svg>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
