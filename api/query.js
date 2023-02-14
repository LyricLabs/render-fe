import {
  useQuery,
  // useMutation,
  useInfiniteQuery,
} from 'react-query'

import { rootNames } from '../config/constants'
import domainStore from '../stores/domains'
import accountStore from '../stores/account'
import {
  queryRootDomains,
  queryRootVaultBalance,
  checkDomainCollection,
  queryFlowBalence,
  getUserDomainIds,
  getUserDomainsInfo,
  getDomainInfo,
  queryBals,
  queryGraffle,
  getDomainDeprecatedInfo,
  getUserDefaultDomain,
  queryFlowNFTsLengthByPath,
  queryFlowNFTsByPath,
} from './index'
import { namehash } from '../utils/hash'
import axios from 'axios'

export * from './queryClient'

const ROOT_DOMAINS_QUERY = 'getRootDomains'
const FLOWNS_INFO_QUERY = 'getFlownsInfo'
const DOMAIN_HISTORY_QUERY = 'getDomainHistory'
const USER_COLLECTION_QUERY = 'getUserCollection'
const GET_NFT_INFO = 'getETHNftInfo'
const GET_FLOW_NFT_INFO = 'getFLOWNftInfo'

export const getConnectedState = () => {
  const { appState = {} } = globalStore.useState('appState')
  const { connected = false } = appState
  return connected
}

// query root domains info
export const useRootDomains = () => {
  // const connect = getConnectedState();
  // if (!connect) return { data: {} };P:10
  const getRootDomains = async () => {
    const domains = await queryRootDomains()
    const domainMap = {}
    Object.keys(domains).map((id) => {
      domainMap[domains[id].name] = { ...domains[id] }
    })
    const reqs = rootNames.map((rootName) => {
      const rootId = domainMap[rootName].id
      // return buildAndExecScript('query_root_vault_balance', [fcl.arg(Number(rootId), UInt64)])
      return queryRootVaultBalance(rootId)
    })
    const vaultBals = await Promise.all(reqs)
    let balSum = 0
    let domainSum = 0
    rootNames.forEach((rootName, idx) => {
      const bal = parseFloat(vaultBals[idx])
      balSum += bal
      domainSum += Number(domainMap[rootName].domainCount)
      domainMap[rootName].vaultBalance = vaultBals[idx]
    })
    balSum = Number(balSum.toFixed(0))
    domainStore.setState({ rootDomains: domainMap, balSum, domainSum })
    console.log(domainMap)
    return { domainMap }
  }

  return useQuery(ROOT_DOMAINS_QUERY, getRootDomains)
}

export const useUserCollection = (address = '') => {
  const queryUserCollection = async () => {
    if (address == null || address.length === 0) {
      return { collectionIds: [], initState: false }
    }
    const initState = await checkDomainCollection(address)
    let collectionIds = []
    let domains = []
    let defaultDomain = null
    if (initState) {
      collectionIds = await getUserDomainIds(address)
      domains = await getUserDomainsInfo(address)
    }

    // domains = domains.map(domain=>{

    // })
    for (let i = 0; i < domains.length; i++) {
      let domain = domains[i]
      if (domain.deprecated) {
        // console.log(domain.nameHash, domain.id, '====')
        const deprecatedInfo = await getDomainDeprecatedInfo(
          domain.nameHash,
          domain.id,
        )
        if (deprecatedInfo) {
          domains[i] = {
            ...domain,
            ...deprecatedInfo,
            name: `${deprecatedInfo.name}.${deprecatedInfo.parentName}`,
          }
        }
      }
      const isDefault = domain.texts && domain.texts.isDefault
      if (isDefault) {
        defaultDomain = domain.name
      }
    }
    const flowBalance = await queryFlowBalence(address)
    const bals = await queryBals(address)
    accountStore.setState({
      domainIds: collectionIds,
      flowBalance,
      domains,
      tokenBals: bals,
      defaultDomain: defaultDomain || domains[0].name,
    })

    return { collectionIds, initState, flowBalance, domains, defaultDomain }
  }

  return useQuery(`${USER_COLLECTION_QUERY}-${address}`, queryUserCollection)
}

export const useDomainInfo = (domain = '') => {
  const hash = namehash(domain)

  const queryDomainInfo = async () => {
    try {
      if (domain.length === 0) {
        return { domainInfo: {} }
      }
      const domainInfo = await getDomainInfo(hash)
      const { owner } = domainInfo
      const defaultDomain = await getUserDefaultDomain(owner)
      return { domainInfo, defaultDomain }
    } catch (error) {
      console.log(error)
      return { domainInfo: null }
    }
  }

  return useQuery(`${FLOWNS_INFO_QUERY}-${hash}`, queryDomainInfo)
}

export const useDomainHistory = (hash = '') => {
  const queryDomainHistory = async () => {
    try {
      if (hash.length === 0) {
        return { history: [] }
      }
      const history = await queryGraffle({ nameHash: hash })
      return { history }
    } catch (error) {
      console.log(error)
      return { domainInfo: null }
    }
  }

  return useQuery(`${DOMAIN_HISTORY_QUERY}-${hash}`, queryDomainHistory)
}

export const useRegisterHistory = (parentName = '') => {
  const queryRegisterHistory = async () => {
    try {
      if (parentName.length === 0) {
        return { history: [] }
      }
      const history = await queryGraffle({ parentName })
      // console.log(history, parentName)
      return { history }
    } catch (error) {
      console.log(error)
      return { domainInfo: null }
    }
  }

  return useQuery(`${DOMAIN_HISTORY_QUERY}-${parentName}`, queryRegisterHistory)
}

export const useNFTInfo = (cid, id, baseURI = null) => {
  const queryNFTInfo = async () => {
    if (!cid || !baseURI) {
      return {}
    }
    try {
      let nftData = null
      if (baseURI) {
        const { data } = await axios.get(`${baseURI}/${id}`)
        nftData = data
      } else {
        const { data } = await axios.get('/api/data/ipfs', {
          params: { cid, id },
        })
        nftData = data
      }

      // console.log(data)
      const { image } = nftData
      const imgCID = image.split('ipfs://')[1]

      return {
        ...nftData,
        mediaUrl: `https://gateway.pinata.cloud/ipfs/${imgCID}`,
      }
    } catch (error) {
      console.log(error)
      return {}
    }
  }

  return useQuery(`${GET_NFT_INFO}-${id}`, queryNFTInfo)
}

export const useFlowNFTs = (path, address, limit = 10, offset = 0) => {
  const queryNFTs = async (config) => {
    try {
      if (address == null || address.length === 0) {
        return []
      }
      const { pageParam = 1 } = config
      const offset = (pageParam - 1) * limit
      const res = await queryFlowNFTsByPath(path, address, limit, offset)
      const length = await queryFlowNFTsLengthByPath(path, address)
      if (res && length > 0) {
        return {
          nfts: res,
          nextPage: pageParam + 1,
          totalPages: Math.ceil(length / limit),
        }
      } else {
        return {}
      }
    } catch (error) {
      console.log(error)
      return {}
    }
  }

  return useInfiniteQuery(`${GET_FLOW_NFT_INFO}`, queryNFTs, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.nextPage <= lastPage.totalPages) return lastPage.nextPage
      return undefined
    },
  })
}
