// components/WalletButton.jsx
import { useState } from 'react'

function truncate(addr) {
  return addr ? addr.slice(0, 6) + '…' + addr.slice(-4) : ''
}

export default function WalletButton({ wallet }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.account)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!wallet.account) {
    return (
      <button
        onClick={wallet.connect}
        disabled={wallet.connecting}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 14px', height: 34, borderRadius: 'var(--radius-sm)',
          fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500,
          background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
          boxShadow: '0 0 0 1px rgba(79,140,255,0.4), 0 4px 16px rgba(79,140,255,0.25)',
          transition: 'all var(--transition)',
          opacity: wallet.connecting ? 0.6 : 1,
        }}
      >
        {wallet.connecting ? (
          <>
            <svg style={{ animation: 'spin 0.75s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
              <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
            </svg>
            Connecting…
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M16 12h2"/></svg>
            Connect Wallet
          </>
        )}
      </button>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 12px', height: 34, borderRadius: 'var(--radius-sm)',
          fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 400,
          background: 'var(--bg-raised)', border: '1px solid var(--border)',
          color: 'var(--text-1)', cursor: 'pointer',
          transition: 'all var(--transition)',
        }}
      >
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: wallet.isBaseNetwork ? 'var(--green)' : 'var(--amber)',
          boxShadow: wallet.isBaseNetwork ? '0 0 6px rgba(62,207,142,0.6)' : '0 0 6px rgba(245,166,35,0.6)',
        }} />
        {truncate(wallet.account)}
        <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--text-3)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition)' }}>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
        </svg>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 6px)',
            width: 210, background: 'var(--bg-surface)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-hover)', zIndex: 50,
            overflow: 'hidden', animation: 'fadeup 0.18s ease both',
          }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Connected</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-1)' }}>{truncate(wallet.account)}</div>
              <div style={{ fontSize: 11, marginTop: 3, color: wallet.isBaseNetwork ? 'var(--green)' : 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
                {wallet.isBaseNetwork ? '✓ Base Network' : '⚠ Wrong Network'}
              </div>
            </div>
            {[
              { label: copied ? 'Copied!' : 'Copy address', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', action: () => { handleCopy(); setOpen(false) } },
              !wallet.isBaseNetwork && { label: 'Switch to Base', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', action: () => { wallet.switchToBase(); setOpen(false) }, color: 'var(--amber)' },
              { label: 'Disconnect', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1', action: () => { wallet.disconnect(); setOpen(false) }, color: 'var(--red)' },
            ].filter(Boolean).map(({ label, icon, action, color }) => (
              <button key={label} onClick={action} style={{
                width: '100%', padding: '9px 14px', background: 'none', border: 'none',
                display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
                fontSize: 13, fontFamily: 'var(--font-body)',
                color: color || 'var(--text-2)', textAlign: 'left',
                transition: 'background var(--transition)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={icon}/></svg>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
