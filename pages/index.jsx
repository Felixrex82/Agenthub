// pages/index.jsx — Agent Directory
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import AgentCard from '../components/AgentCard'
import SearchBar from '../components/SearchBar'
import { useAgents } from '../hooks/useAgents'

export default function HomePage({ wallet }) {
  const { agents, loading, error, fetchAgents } = useAgents()
  const [query, setQuery] = useState('')

  useEffect(() => { fetchAgents(wallet.provider || null) }, [wallet.provider])

  const filtered = useMemo(() => {
    if (!query.trim()) return agents
    const q = query.toLowerCase()
    return agents.filter(a =>
      a.name?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.skillsURI?.toLowerCase().includes(q)
    )
  }, [agents, query])

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 80px' }} className="page-enter">

      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '4px 11px 4px 9px', borderRadius: 99,
          border: '1px solid rgba(79,140,255,0.22)', background: 'var(--accent-dim)',
          fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)',
          letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 18,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulsedot 2s ease infinite' }} />
          Base Mainnet · Chain ID 8453
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text-1)', marginBottom: 14 }}>
          Discover <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>AI Agents</em><br />built on-chain.
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: 440, fontWeight: 300 }}>
          Browse verified agents with skills stored on IPFS, on-chain registry, and live API endpoints ready to connect.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
          <Link href="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '0 18px', height: 38, borderRadius: 'var(--radius-sm)',
            fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-body)',
            background: 'var(--accent)', color: '#fff', textDecoration: 'none',
            boxShadow: '0 0 0 1px rgba(79,140,255,0.4), 0 4px 18px rgba(79,140,255,0.3)',
          }}>
            <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
            Register Agent
          </Link>
          <span style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
            {agents.length} registered
          </span>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1, background: 'var(--border)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', marginBottom: 32,
      }}>
        {[
          { num: agents.length, label: 'Agents registered' },
          { num: '8453',        label: 'Base chain ID' },
          { num: agents.filter(a => a.skillsURI).length, label: 'IPFS skill files' },
        ].map(({ num, label }) => (
          <div key={label} style={{ background: 'var(--bg-surface)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 500, color: 'var(--text-1)', lineHeight: 1, letterSpacing: '-0.03em' }}>{num}</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4, fontWeight: 400 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <SearchBar value={query} onChange={setQuery} count={filtered.length} />

      {/* Grid label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {query ? `Results for "${query}"` : 'All Agents'}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(255,92,92,0.08)', border: '1px solid rgba(255,92,92,0.2)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', fontSize: 13, color: 'var(--red)', marginBottom: 20, fontFamily: 'var(--font-mono)' }}>
          {error}
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', gap: 11, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--bg-raised)', animation: 'pulse 1.5s ease infinite' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 13, background: 'var(--bg-raised)', borderRadius: 4, marginBottom: 6, width: '70%', animation: 'pulse 1.5s ease infinite' }} />
                  <div style={{ height: 10, background: 'var(--bg-raised)', borderRadius: 4, width: '45%', animation: 'pulse 1.5s ease infinite' }} />
                </div>
              </div>
              <div style={{ height: 10, background: 'var(--bg-raised)', borderRadius: 4, marginBottom: 6, animation: 'pulse 1.5s ease infinite' }} />
              <div style={{ height: 10, background: 'var(--bg-raised)', borderRadius: 4, width: '80%', animation: 'pulse 1.5s ease infinite' }} />
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {filtered.map((agent, i) => (
            <AgentCard key={`${agent.name}-${i}`} agent={agent} index={i} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.3, fontFamily: 'var(--font-mono)' }}>◎</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>
            {query ? 'No agents match your search' : 'No agents yet'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {query ? 'Try a different keyword.' : 'Be the first to register.'}
          </div>
        </div>
      )}
    </div>
  )
}
