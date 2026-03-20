// pages/register.jsx — Register Agent
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAgents } from '../hooks/useAgents'

const FIELDS = [
  { id: 'name',        label: 'Agent Name',     placeholder: 'e.g. DataSift',                      hint: 'A unique, human-readable name for your agent.', mono: false },
  { id: 'description', label: 'Description',    placeholder: 'Describe what your agent does…',     hint: 'Explain the tasks this agent can perform.',       mono: false, textarea: true },
  { id: 'skillsURI',   label: 'Skills URI',     placeholder: 'ipfs://Qm…',                         hint: 'IPFS CID of your agent capability definition file.', mono: true },
  { id: 'endpoint',    label: 'API Endpoint',   placeholder: 'https://api.youragent.com/v1/run',   hint: 'HTTPS endpoint where your agent accepts POST requests.', mono: true },
]

export default function RegisterPage({ wallet }) {
  const router = useRouter()
  const { registerAgent, txPending, txHash, error: txError } = useAgents()
  const [form, setForm]     = useState({ name: '', description: '', skillsURI: '', endpoint: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name = 'Name is required.'
    if (!form.description.trim()) e.description = 'Description is required.'
    if (!form.skillsURI.trim() || (!form.skillsURI.startsWith('ipfs://') && !form.skillsURI.startsWith('https://')))
      e.skillsURI = 'Must start with ipfs:// or https://'
    if (!form.endpoint.trim() || !form.endpoint.startsWith('https://'))
      e.endpoint = 'Must be a valid https:// URL.'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate(); setErrors(errs)
    if (Object.keys(errs).length) return
    if (!wallet.account) { wallet.connect(); return }
    if (!wallet.isBaseNetwork) { wallet.switchToBase(); return }
    const ok = await registerAgent(wallet.signer, form)
    if (ok) { setSuccess(true); setTimeout(() => router.push('/'), 2500) }
  }

  const set = field => e => {
    setForm(p => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: null }))
  }

  if (success) {
    return (
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }} className="page-enter">
        <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-lg)', background: 'var(--green-dim)', border: '1px solid rgba(62,207,142,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="24" height="24" viewBox="0 0 20 20" fill="var(--green)"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--text-1)', marginBottom: 8 }}>Agent Registered</h2>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12, fontWeight: 300 }}>Your agent has been registered on-chain. Redirecting…</p>
        {txHash && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>{txHash}</div>}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 80px' }} className="page-enter">
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', textDecoration: 'none', marginBottom: 24, letterSpacing: '0.04em' }}>
        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
        ← directory
      </Link>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 11px 4px 9px', borderRadius: 99, border: '1px solid rgba(79,140,255,0.22)', background: 'var(--accent-dim)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 14 }}>
          <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
          New Registration
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--text-1)', marginBottom: 8, lineHeight: 1.15 }}>Register an Agent</h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.65, maxWidth: 480 }}>
          Deploy your AI agent to the on-chain registry. Metadata stored permanently on Base; capabilities referenced via IPFS.
        </p>
      </div>

      {/* Wallet warnings */}
      {!wallet.account && (
        <div style={{ background: 'rgba(79,140,255,0.06)', border: '1px solid rgba(79,140,255,0.18)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)', marginBottom: 3 }}>Wallet required</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 300 }}>Connect MetaMask to register an agent on Base.</div>
          </div>
          <button onClick={wallet.connect} style={{ flexShrink: 0, padding: '0 14px', height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Connect
          </button>
        </div>
      )}
      {wallet.account && !wallet.isBaseNetwork && (
        <div style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--amber)', marginBottom: 3 }}>Wrong network</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 300 }}>Switch to Base Mainnet to register.</div>
          </div>
          <button onClick={wallet.switchToBase} style={{ flexShrink: 0, padding: '0 14px', height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--amber)', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Switch to Base
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: 24, alignItems: 'start' }}>

        {/* Form */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 28, boxShadow: 'var(--shadow-card)' }}>
          <form onSubmit={handleSubmit} noValidate>
            {FIELDS.map(({ id, label, placeholder, hint, mono, textarea }, i) => (
              <div key={id} style={{ marginBottom: i < FIELDS.length - 1 ? 20 : 0 }}>
                {id === 'skillsURI' && <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 20px' }} />}
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 7 }}>
                  {label} <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                {textarea ? (
                  <textarea value={form[id]} onChange={set(id)} placeholder={placeholder} rows={3}
                    style={{ width: '100%', padding: '10px 14px', border: `1px solid ${errors[id] ? 'rgba(255,92,92,0.5)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', color: 'var(--text-1)', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', resize: 'none', lineHeight: 1.5, transition: 'border-color var(--transition)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(79,140,255,0.4)'}
                    onBlur={e => e.target.style.borderColor = errors[id] ? 'rgba(255,92,92,0.5)' : 'var(--border)'}
                  />
                ) : (
                  <input type="text" value={form[id]} onChange={set(id)} placeholder={placeholder}
                    style={{ width: '100%', padding: '0 14px', height: 40, border: `1px solid ${errors[id] ? 'rgba(255,92,92,0.5)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', color: 'var(--text-1)', fontSize: 13, fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', outline: 'none', transition: 'border-color var(--transition)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(79,140,255,0.4)'}
                    onBlur={e => e.target.style.borderColor = errors[id] ? 'rgba(255,92,92,0.5)' : 'var(--border)'}
                  />
                )}
                {errors[id]
                  ? <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 5 }}>{errors[id]}</div>
                  : <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5, lineHeight: 1.5 }}>{hint}</div>
                }
              </div>
            ))}

            {txError && (
              <div style={{ background: 'rgba(255,92,92,0.08)', border: '1px solid rgba(255,92,92,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 12, color: 'var(--red)', marginTop: 20, fontFamily: 'var(--font-mono)' }}>
                {txError}
              </div>
            )}

            <button type="submit" disabled={txPending}
              style={{ width: '100%', height: 42, borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 500, border: 'none', cursor: txPending ? 'wait' : 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 0 0 1px rgba(79,140,255,0.4), 0 4px 18px rgba(79,140,255,0.28)', marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: txPending ? 0.7 : 1, transition: 'all var(--transition)' }}>
              {txPending ? (
                <><svg style={{ animation: 'spin 0.75s linear infinite' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/></svg>Broadcasting transaction…</>
              ) : !wallet.account ? 'Connect Wallet to Register'
                : !wallet.isBaseNetwork ? 'Switch to Base Network'
                : 'Register Agent on Base'
              }
            </button>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', marginTop: 10, fontFamily: 'var(--font-mono)' }}>
              Transaction required · Gas fees apply on Base Mainnet
            </div>
          </form>
        </div>

        {/* Info sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '⛓', title: 'On-chain Registry', desc: 'Agent identity stored permanently on Base. Immutable and publicly verifiable.' },
            { icon: '📦', title: 'IPFS Skill Files', desc: 'Capabilities referenced via IPFS CID — content-addressed and tamper-proof.' },
            { icon: '🔍', title: 'Discoverable', desc: 'Listed in the AgentHub directory immediately after on-chain confirmation.' },
            { icon: '🔌', title: 'Instantly Connectable', desc: 'Any wallet holder can connect via the live API endpoint.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55, fontWeight: 300 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
