export const discoveryUrl = process.env.NEXT_PUBLIC_DISCOVERY_URL

export const discoveryEndpointUrl =
  process.env.NEXT_PUBLIC_DISCOVERY_ENDPOINT_URL

export const flowTokenAddr = process.env.NEXT_PUBLIC_FLOW_TOKEN_ADDRESS

export const fusdTokenAddr = process.env.NEXT_PUBLIC_FUSD_TOKEN_ADDRESS

export const flowFungibleAddr = process.env.NEXT_PUBLIC_FLOW_FUNGIBLE_ADDRESS

export const flowNonFungibleAddr =
  process.env.NEXT_PUBLIC_FLOW_NONFUNGIBLE_ADDRESS

export const flownsDomainAddr = process.env.NEXT_PUBLIC_FLOWNS_DOMAINS_ADDRESS

export const flownsAddr = process.env.NEXT_PUBLIC_FLOWNS_ADDRESS

export const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY

export const mailURL = process.env.NEXT_PUBLIC_MAIL_URL

export const gaCode = process.env.NEXT_PUBLIC_GA

export const fnId = Number(process.env.NEXT_PUBLIC_FN_ID || 0)

export const hostSuffix = process.env.NEXT_PUBLIC_HOST_SUFFIX

export const network = process.env.NEXT_PUBLIC_NETWORK

export const rpcType = process.env.NEXT_PUBLIC_RPC_TYPE || 'RPC'


export const nodeUrl =
  rpcType == 'REST'
    ? process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE_REST
    : process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE_RPC

export const isTestnet = network == 'testnet'

export const isBrowser = process.browser

export const rootNames = ['fn', 'meow']

export const oneYear = 60 * 60 * 24 * 365

export const referAddr = process.env.NEXT_PUBLIC_REFER_ADDR

export const graffleId = process.env.NEXT_PUBLIC_GRAFFLE_ID

export const improvmxKey = process.env.NEXT_PUBLIC_IMPROVMX_KEY

export const cfEmail = process.env.NEXT_PUBLIC_CF_EMAIL
export const cfAPIKey = process.env.NEXT_PUBLIC_CF_KEY
export const cfZoneId = process.env.NEXT_PUBLIC_CF_ZONE_ID

export const privateKey = process.env.NEXT_PUBLIC_FLOWNS_PRIVATE_KEY
export const publicKey = process.env.NEXT_PUBLIC_FLOWNS_PUBLIC_KEY

export const flownsAppUrl = isTestnet
  ? 'https://testnet.flowns.org'
  : 'https://flowns.org'

export const improvmxUrl =
  'https://api.improvmx.com/v3/domains/fn.services/aliases'

export const navLinks = {
  faq: '/faq',
  stats: '/stats',
  // blog: '/blog',
  // team: '/team',
  register: '/search',
  reserve:
    'https://github.com/flowns-org/ReservedFlowns/blob/main/Apply_for_Reserved.md',
  resources: {
    contact: '/contact',
    twitter: 'https://twitter.com/flownsorg',
    github: 'https://github.com/flowns-org',
    forum: 'https://github.com/flowns-org/forum/discussions',
    discord: 'https://discord.gg/fXz4gBaYXd',
  },
}

export const appNavLinks = {
  account: '/account',
  search: '/search',
  doodles: '/doodles',
}

export const links = {
  twitter: {
    name: 'Twitter',
    url: 'https://twitter.com/flownsorg',
  },
  github: {
    name: 'Github',
    url: 'https://github.com/flowns-org',
  },
  discord: {
    name: 'Discord',
    url: 'https://discord.gg/fXz4gBaYXd',
  },
}

export const partners = {
  mynft: {
    name: 'Mynft',
    url: 'https://mynft.io/flowns?utm_source=flowns',
  },
  flowfans: {
    name: 'FlowFans',
    url: 'https://github.com/FlowFans',
  },
  cata: {
    name: 'CATA',
    url: 'https://www.cata.network/',
  },
  blocto: {
    name: 'Blocto',
    url: 'https://blocto.portto.io/',
  },
  thing: {
    name: 'THING.FUND',
    url: 'https://thing.fn.pub/',
  },
  graffle: {
    name: 'Graffle',
    url: 'https://graffle.io/',
  },
  outblock: {
    name: 'Outblock',
    url: 'https://outblock.io/',
  },
  // snw: {
  //   name: 'SNW',
  //   url: 'https://snw.fn.pub/',
  // },
  // mantle: {
  //   name: 'Mantle',
  //   url: 'https://flow.mantlefi.com/',
  // },
  increment: {
    name: 'IncrementFi',
    url: 'https://increment.fi/',
  },
  '4everland': {
    name: '4everland',
    url: 'https://www.4everland.org/',
  },
}

export const getGraffleUrl = () => {
  let url = `https://prod-${
    isTestnet ? 'test-net' : 'main-net'
  }-dashboard-api.azurewebsites.net/api/company/${graffleId}/search`
  return url
}

export const getExplorerTxUrl = (type = 'flowScan') => {
  const flowScanUrl = `https://${
    isTestnet ? 'testnet.' : ''
  }flowscan.org/transaction/`
  const viewSourceUrl = `https://flow-view-source.com/${network}/tx/`
  return type == 'flowScan' ? flowScanUrl : viewSourceUrl
}

export const chainAddressExploreLink = {
  0: 'https://flowscan.org/account/',
  1: 'https://etherscan.io/address/',
}

export const getSupportTokenConfig = () => {
  let tokenConfigs = {}
  if (isTestnet) {
    tokenConfigs = {
      FLOW: {
        type: 'A.7e60df042a9c0868.FlowToken.Vault',
        publicBalPath: getSupportTokenVaultPath()['FLOW'],
        publicReceiverPath: getSupportTokenVaultPath('receiver')['FLOW'],
        storagePath: getSupportTokenVaultPath('private')['FLOW'],
      },
      FUSD: {
        type: 'A.e223d8a629e49c68.FUSD.Vault',
        publicBalPath: getSupportTokenVaultPath()['FUSD'],
        publicReceiverPath: getSupportTokenVaultPath('receiver')['FUSD'],
        storagePath: getSupportTokenVaultPath('private')['FUSD'],
      },
      BLT: {
        type: 'A.6e0797ac987005f5.BloctoToken.Vault',
        publicBalPath: getSupportTokenVaultPath()['BLT'],
        publicReceiverPath: getSupportTokenVaultPath('receiver')['BLT'],
        storagePath: getSupportTokenVaultPath('private')['BLT'],
      },
      USDC: {
        type: 'A.a983fecbed621163.FiatToken.Vault',
        publicBalPath: getSupportTokenVaultPath()['USDC'],
        publicReceiverPath: getSupportTokenVaultPath('receiver')['USDC'],
        storagePath: getSupportTokenVaultPath('private')['USDC'],
      },
      MY: {
        type: 'A.40212f3e288efd03.MyToken.Vault',
        publicBalPath: getSupportTokenVaultPath()['MY'],
        publicReceiverPath: getSupportTokenVaultPath('receiver')['MY'],
        storagePath: getSupportTokenVaultPath('private')['MY'],
      },
    }
  } else {
    tokenConfigs = {
      FLOW: {
        type: 'A.1654653399040a61.FlowToken.Vault',
        publicBalPath: getSupportTokenVaultPath()['FLOW'],
        publicReceiverPath: getSupportTokenVaultPath('receiver')['FLOW'],
        storagePath: getSupportTokenVaultPath('private')['FLOW'],
      },
      FUSD: {
        type: 'A.3c5959b568896393.FUSD.Vault',
        publicBalPath: getSupportTokenVaultPath()['FUSD'],
        publicReceiverPath: getSupportTokenVaultPath('receiver')['FUSD'],
        storagePath: getSupportTokenVaultPath('private')['FUSD'],
      },
      BLT: {
        type: 'A.0f9df91c9121c460.BloctoToken.Vault',
        publicBalPath: getSupportTokenVaultPath()['BLT'],
        publicReceiverPath: getSupportTokenVaultPath('receiver')['BLT'],
        storagePath: getSupportTokenVaultPath('private')['BLT'],
      },
      USDC: {
        type: 'A.b19436aae4d94622.FiatToken.Vault',
        publicBalPath: getSupportTokenVaultPath()['USDC'],
        publicReceiverPath: getSupportTokenVaultPath('receiver')['USDC'],
        storagePath: getSupportTokenVaultPath('private')['USDC'],
      },
      MY: {
        type: 'A.348fe2042c8a70d8.MyToken.Vault',
        publicBalPath: getSupportTokenVaultPath()['MY'],
        publicReceiverPath: getSupportTokenVaultPath('receiver')['MY'],
        storagePath: getSupportTokenVaultPath('private')['MY'],
      },
    }
  }
  return tokenConfigs
}

export const getSupportTokenVaultPath = (type = 'balance') => {
  let paths = {}
  switch (type) {
    case 'balance':
      paths = {
        FLOW: '/public/flowTokenBalance',
        FUSD: '/public/fusdBalance',
        BLT: '/public/bloctoTokenBalance',
        USDC: 'FiatToken.VaultBalancePubPath',
        MY: '/public/mytokenBalance',
      }
      break
    case 'receiver':
      paths = {
        FLOW: '/public/flowTokenReceiver',
        FUSD: '/public/fusdReceiver',
        BLT: '/public/bloctoTokenReceiver',
        USDC: 'FiatToken.VaultReceiverPubPath',
        MY: '/public/mytokenReceiver',
      }
      break
    case 'private':
      paths = {
        FLOW: '/storage/flowTokenVault',
        FUSD: '/storage/fusdVault',
        BLT: '/storage/bloctoTokenVault',
        USDC: 'FiatToken.VaultStoragePath',
        MY: '/storage/mytokenVault',
      }
  }

  return paths
}

export const getSupportCollectionTypes = () => {}
