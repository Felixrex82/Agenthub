// components/SkillsViewer.jsx
import { useState, useEffect } from 'react'

function ipfsToHttp(uri) {
  if (!uri) return null
  return uri.startsWith('ipfs://') ? `https://ipfs.io/ipfs/${uri.replace('ipfs://', '')}` : uri
}

export default function SkillsViewer({ skillsURI }) {
  const [open, setOpen]       = useState(false)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const httpUrl = ipfsToHttp(skillsURI)

  useEffect(() => {
    if (!open || !httpUrl || content) return
    setLoading(true)
    fetch(httpUrl)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text() })
      .then(setContent)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [open, httpUrl])

  if (!skillsURI) return null

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', marginBottom: 14 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', transition: 'background var(--transition)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--accent-dim)', border: '1px solid rgba(79,140,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', marginBottom: 2 }}>skills.yaml</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>{skillsURI}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {httpUrl && (
            <a href={httpUrl} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', padding: '4px 10px', background: 'var(--accent-dim)', borderRadius: 6, textDecoration: 'none', border: '1px solid rgba(79,140,255,0.18)' }}>
              IPFS ↗
            </a>
          )}
          <svg width="15" height="15" viewBox="0 0 20 20" fill="var(--text-3)" style={{ transition: 'transform var(--transition)', transform: open ? 'rotate(180deg)' : 'none' }}>
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-raised)' }}>
          {loading && (
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
              <svg style={{ animation: 'spin 0.75s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
              </svg>
              Fetching from IPFS…
            </div>
          )}
          {error && <div style={{ padding: '14px 20px', fontSize: 12, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{error}</div>}
          {content && (
            <pre style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.8, overflowX: 'auto', maxHeight: 300, whiteSpace: 'pre-wrap' }}>
              {content}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
