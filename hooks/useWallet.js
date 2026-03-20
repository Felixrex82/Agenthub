// ============================================================
// hooks/useWallet.js
// Wallet connection, network switching, global wallet state
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import { BrowserProvider } from 'ethers'
import { BASE_CHAIN_ID, BASE_CHAIN_ID_HEX, BASE_NETWORK_PARAMS } from '../lib/contract'

export function useWallet() {
  const [account, setAccount]       = useState(null)
  const [provider, setProvider]     = useState(null)
  const [signer, setSigner]         = useState(null)
  const [chainId, setChainId]       = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError]           = useState(null)

  const isBaseNetwork = chainId === BASE_CHAIN_ID

  const loadProvider = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) return null
    const _provider = new BrowserProvider(window.ethereum)
    const _network  = await _provider.getNetwork()
    const _chainId  = Number(_network.chainId)
    setProvider(_provider)
    setChainId(_chainId)
    return { _provider, _chainId }
  }, [])

  const connect = useCallback(async () => {
    setError(null)
    if (!window.ethereum) {
      setError('MetaMask not detected. Please install it.')
      return
    }
    try {
      setConnecting(true)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const result = await loadProvider()
      if (!result) return
      const { _provider, _chainId } = result
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      setAccount(accounts[0])
      if (_chainId !== BASE_CHAIN_ID) {
        await switchToBase()
      } else {
        const _signer = await _provider.getSigner()
        setSigner(_signer)
      }
    } catch (err) {
      setError(err.message || 'Connection failed')
    } finally {
      setConnecting(false)
    }
  }, [loadProvider])

  const switchToBase = useCallback(async () => {
    if (!window.ethereum) return
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID_HEX }],
      })
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_NETWORK_PARAMS],
          })
        } catch (addError) {
          setError('Failed to add Base network: ' + addError.message)
        }
      } else {
        setError('Failed to switch to Base: ' + switchError.message)
      }
    }
  }, [])

  const disconnect = useCallback(() => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setChainId(null)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        setAccount(accounts[0])
        const result = await loadProvider()
        if (result?._provider) {
          const _signer = await result._provider.getSigner()
          setSigner(_signer)
        }
      }
    }

    const handleChainChanged = (chainIdHex) => {
      setChainId(parseInt(chainIdHex, 16))
      window.location.reload()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    // Auto-reconnect if already authorized
    ;(async () => {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        const result = await loadProvider()
        if (!result) return
        setAccount(accounts[0])
        if (result._chainId === BASE_CHAIN_ID && result._provider) {
          const _signer = await result._provider.getSigner()
          setSigner(_signer)
        }
      }
    })()

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [disconnect, loadProvider])

  useEffect(() => {
    if (chainId === BASE_CHAIN_ID && provider && account) {
      provider.getSigner().then(setSigner).catch(console.error)
    }
  }, [chainId, provider, account])

  return {
    account,
    provider,
    signer,
    chainId,
    connecting,
    error,
    isBaseNetwork,
    connect,
    disconnect,
    switchToBase,
  }
}
