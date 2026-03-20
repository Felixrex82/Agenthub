// ============================================================
// hooks/useAgents.js
// Fetch agents from contract + register new agents
// ============================================================
import { useState, useCallback } from 'react'
import { Contract } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract'

const MOCK_AGENTS = [
  {
    name: 'DataSift',
    description: 'Autonomously scrapes, cleans, and structures data from any public web source. Returns normalized JSON with source attribution.',
    skillsURI: 'ipfs://QmXyz123abc456def789DataSiftSkills',
    endpoint: 'https://api.datasift.agent/v1/run',
    creator: '0x1234567890123456789012345678901234567890',
  },
  {
    name: 'CodeReviewer',
    description: 'Performs static analysis and semantic code review on pull requests. Supports Solidity, TypeScript, and Python.',
    skillsURI: 'ipfs://QmAbc789def123ghi456CodeReviewer',
    endpoint: 'https://api.codereviewer.agent/v1/analyze',
    creator: '0xabcdef1234567890abcdef1234567890abcdef12',
  },
  {
    name: 'ContractAuditor',
    description: 'Audits EVM smart contracts for common vulnerabilities including reentrancy, overflow, and access control issues.',
    skillsURI: 'ipfs://QmDef456ghi789jkl012ContractAudit',
    endpoint: 'https://api.contractauditor.agent/v1/audit',
    creator: '0xfedcba9876543210fedcba9876543210fedcba98',
  },
  {
    name: 'SummaryBot',
    description: 'Ingests long documents, PDFs, or URLs and returns structured summaries with key insights and action items.',
    skillsURI: 'ipfs://QmGhi012jkl345mno678SummaryBot',
    endpoint: 'https://api.summarybot.agent/v1/summarize',
    creator: '0x9876543210abcdef9876543210abcdef98765432',
  },
  {
    name: 'PriceOracle',
    description: 'On-chain price oracle agent that aggregates real-time price feeds from multiple DEXes on Base network.',
    skillsURI: 'ipfs://QmJkl678mno901pqr234PriceOracle',
    endpoint: 'https://api.priceoracle.agent/v1/price',
    creator: '0x1111222233334444555566667777888899990000',
  },
  {
    name: 'TranslatorAgent',
    description: 'Translates text, documents, and API responses across 50+ languages with dialect and tone-preservation options.',
    skillsURI: 'ipfs://QmMno234pqr567stu890TranslatorAgent',
    endpoint: 'https://api.translator.agent/v1/translate',
    creator: '0xaaaabbbbccccddddeeeeffffaaaabbbbccccdddd',
  },
]

const USE_MOCK =
  !CONTRACT_ADDRESS ||
  CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000'

export function useAgents() {
  const [agents, setAgents]         = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [txPending, setTxPending]   = useState(false)
  const [txHash, setTxHash]         = useState(null)

  const fetchAgents = useCallback(async (provider) => {
    setLoading(true)
    setError(null)
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 700))
        setAgents(MOCK_AGENTS)
        return
      }
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
let raw = []
try {
  raw = await contract.getAgents()
} catch (callErr) {
  // Empty array returns 0x on some RPCs — treat as no agents yet
  console.warn('getAgents returned empty or failed:', callErr.message)
  setAgents([])
  return
}
const parsed = raw.map((a) => ({
  name:        a.name,
  description: a.description,
  skillsURI:   a.skillsURI,
  endpoint:    a.endpoint,
  creator:     a.creator,
}))
setAgents(parsed)
      setAgents(parsed)
    } catch (err) {
      console.error('fetchAgents error:', err)
      setError('Failed to load agents: ' + (err.reason || err.message))
    } finally {
      setLoading(false)
    }
  }, [])

  const registerAgent = useCallback(
    async (signer, { name, description, skillsURI, endpoint }) => {
      setError(null)
      setTxHash(null)
      setTxPending(true)
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 1500))
          const address = await signer.getAddress()
          setAgents((prev) => [
            { name, description, skillsURI, endpoint, creator: address },
            ...prev,
          ])
          setTxHash('0xMOCK_' + Date.now())
          return true
        }
        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        const tx = await contract.registerAgent(name, description, skillsURI, endpoint)
setTxHash(tx.hash)
await tx.wait()
// Re-fetch agents after successful registration
const updated = await contract.getAgents()
const parsed = updated.map((a) => ({
  name:        a.name,
  description: a.description,
  skillsURI:   a.skillsURI,
  endpoint:    a.endpoint,
  creator:     a.creator,
}))
setAgents(parsed)
return true
      } catch (err) {
        console.error('registerAgent error:', err)
        setError(err.reason || err.message || 'Transaction failed')
        return false
      } finally {
        setTxPending(false)
      }
    },
    []
  )

  return { agents, loading, error, txPending, txHash, fetchAgents, registerAgent }
}
