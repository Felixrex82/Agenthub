// components/Layout.jsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import WalletButton from './WalletButton'

export default function Layout({ children, wallet }) {
  const router = useRouter()
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ah-theme') : null
    const t = saved || 'dark'
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('ah-theme', next)
  }

  const navLinks = [
    { href: '/',         label: 'Directory' },
    { href: '/register', label: 'Register'  },
  ]

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid var(--border)',
        background: theme === 'dark' ? 'rgba(13,13,13,0.85)' : 'rgba(247,247,245,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 30, height: 30, borderRadius: 'var(--radius-sm)',
                background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 1px rgba(79,140,255,0.4), 0 4px 16px rgba(79,140,255,0.3)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 500, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
                agent<span style={{ color: 'var(--accent)' }}>hub</span>
              </span>
            </Link>

            {/* Nav links */}
            <nav style={{ display: 'flex', gap: 2 }}>
              {navLinks.map(({ href, label }) => {
                const active = router.pathname === href
                return (
                  <Link key={href} href={href} style={{
                    padding: '6px 13px', borderRadius: 'var(--radius-sm)',
                    fontSize: 13, fontWeight: 500, textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    color: active ? 'var(--text-1)' : 'var(--text-2)',
                    background: active ? 'var(--bg-raised)' : 'transparent',
                    transition: 'all var(--transition)',
                  }}>
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* Right: theme toggle + wallet */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={toggleTheme} title="Toggle theme" style={{
                width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-raised)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-2)',
                transition: 'all var(--transition)',
              }}>
                {theme === 'dark' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                  </svg>
                )}
              </button>
              <WalletButton wallet={wallet} />
            </div>
          </div>
        </div>
      </header>

      {/* Network warning */}
      {wallet.account && !wallet.isBaseNetwork && (
        <div style={{ background: 'rgba(245,166,35,0.08)', borderBottom: '1px solid rgba(245,166,35,0.2)' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--amber)' }}>⚠ You are not on Base network. Switch to use AgentHub.</span>
            <button onClick={wallet.switchToBase} style={{ background: 'none', border: 'none', color: 'var(--amber)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, textDecoration: 'underline' }}>
              Switch to Base →
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-2)' }}>
            agent<span style={{ color: 'var(--accent)' }}>hub</span>
            <span style={{ color: 'var(--text-3)', marginLeft: 8 }}>· on-chain · ipfs · base</span>
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px rgba(62,207,142,0.5)', display: 'inline-block' }} />
            Base Mainnet · 8453
          </span>
        </div>
      </footer>
    </div>
  )
}
