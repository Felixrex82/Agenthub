export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'name',        type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'skillsURI',   type: 'string' },
      { internalType: 'string', name: 'endpoint',    type: 'string' },
    ],
    name: 'registerAgent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAgents',
    outputs: [
      {
        components: [
          { internalType: 'string',  name: 'name',        type: 'string'  },
          { internalType: 'string',  name: 'description', type: 'string'  },
          { internalType: 'string',  name: 'skillsURI',   type: 'string'  },
          { internalType: 'string',  name: 'endpoint',    type: 'string'  },
          { internalType: 'address', name: 'creator',     type: 'address' },
        ],
        internalType: 'struct AgentRegistry.Agent[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'agents',
    outputs: [
      { internalType: 'string',  name: 'name',        type: 'string'  },
      { internalType: 'string',  name: 'description', type: 'string'  },
      { internalType: 'string',  name: 'skillsURI',   type: 'string'  },
      { internalType: 'string',  name: 'endpoint',    type: 'string'  },
      { internalType: 'address', name: 'creator',     type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const BASE_CHAIN_ID     = 8453
export const BASE_CHAIN_ID_HEX = '0x2105'

export const BASE_NETWORK_PARAMS = {
  chainId: BASE_CHAIN_ID_HEX,
  chainName: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org'],
}