import * as fcl from '@onflow/fcl'
import { UInt64, Address, String, UFix64, Array, Int } from '@onflow/types'

import { buildAndExecScript } from './scripts'
import { buildAndSendTrx } from './transactions'
import {
  referAddr,
  getSupportTokenConfig,
  getGraffleUrl,
} from '../config/constants'
import { isFlowAddr, getQuery } from '../utils'
import { namehash } from '../utils/hash'

export const queryGraffle = async (params) => {
  let url = getGraffleUrl()
  let res = await getQuery(url, params)
  return res
}

export const queryRootDomains = async () => {
  const res = await buildAndExecScript('query_root_domains')
  return res
}

export const queryRootVaultBalance = async (rootId) => {
  const res = await buildAndExecScript('query_root_vault_balance', [
    fcl.arg(Number(rootId), UInt64),
  ])
  return res
}

export const checkDomainCollection = async (address) => {
  const res = await buildAndExecScript('check_domain_collection', [
    fcl.arg(address, Address),
  ])
  return res
}

export const getUserDomainIds = async (address) => {
  const res = await buildAndExecScript('get_user_domain_ids', [
    fcl.arg(address, Address),
  ])
  return res
}

export const getUserDomainsInfo = async (address) => {
  const res = await buildAndExecScript('query_user_domains_info', [
    fcl.arg(address, Address),
  ])
  return res
}

export const queryFlowBalence = async (address) => {
  const res = await buildAndExecScript('query_flow_balance', [
    fcl.arg(address, Address),
  ])
  return res
}

export const queryBals = async (address, tokens = []) => {
  const tokenTypes = getSupportTokenConfig()
  let keys = tokens

  let reqArr = []

  keys = Object.keys(tokenTypes)
  reqArr = keys.map((key) => {
    return queryFTBalence(address, tokenTypes[key])
  })

  const resArr = await Promise.all(reqArr)
  let bals = {}

  keys.map((k, idx) => {
    bals[k] = resArr[idx]
  })

  return bals
}

export const queryDomainRecord = async (name, root) => {
  const res = await buildAndExecScript('query_domain_record', [
    fcl.arg(name, String),
    fcl.arg(root, String),
  ])
  return res
}

export const queryFTBalence = async (address, conf) => {
  const res = await buildAndExecScript(
    'query_ft_balance',
    [fcl.arg(address, Address)],
    {
      tokenConfig: conf,
    },
  )
  return res
}

export const getDomainInfo = async (hash) => {
  const res = await buildAndExecScript('query_domain_info', [
    fcl.arg(hash, String),
  ])
  return res
}
export const getDomainDeprecatedInfo = async (hash, id) => {
  const res = await buildAndExecScript('query_domain_deprecated_info', [
    fcl.arg(hash, String),
    fcl.arg(id, UInt64),
  ])
  return res
}

export const getUserDefaultDomain = async (address) => {
  const res = await buildAndExecScript('get_default_flowns_name', [
    fcl.arg(address, Address),
  ])
  return res
}

export const getDomainLength = async (hash) => {
  const res = await buildAndExecScript('get_domain_length', [
    fcl.arg(hash, String),
  ])
  return res
}

export const queryDomainAvailable = async (hash) => {
  const res = await buildAndExecScript('query_domain_available', [
    fcl.arg(hash, String),
  ])
  return res
}

export const getDomainPrice = async (id, name) => {
  const res = await buildAndExecScript('get_domain_price', [
    fcl.arg(id, UInt64),
    fcl.arg(name, String),
  ])
  return res
}

export const getDomainAvaliableWithRaw = async (name, root) => {
  const res = await buildAndExecScript('query_domain_available_with_raw', [
    fcl.arg(name, String),
    fcl.arg(root, String),
  ])
  return res
}

export const calcHash = async (name, root) => {
  const res = await buildAndExecScript('calc_hash', [
    fcl.arg(name, String),
    fcl.arg(root, String),
  ])
  return res
}

export const initDomainCollection = async () => {
  const res = await buildAndSendTrx('init_domain_collection', [])
  return res
}

export const setDomainAddress = async (hash, chainType, address) => {
  const res = await buildAndSendTrx('set_domain_address', [
    fcl.arg(hash, String),
    fcl.arg(chainType, UInt64),
    fcl.arg(address, String),
  ])
  return res
}

export const removeDomainAddress = async (hash, chainType) => {
  const res = await buildAndSendTrx('remove_domain_address', [
    fcl.arg(hash, String),
    fcl.arg(chainType, UInt64),
  ])
  return res
}

export const setDomainText = async (hash, key, obj) => {
  const res = await buildAndSendTrx('set_domain_text', [
    fcl.arg(hash, String),
    fcl.arg(key, String),
    fcl.arg(JSON.stringify(obj), String),
  ])
  return res
}

export const renewDomain = async (id, hash, duration, amount) => {
  const res = await buildAndSendTrx('renew_domain_with_hash', [
    fcl.arg(hash, String),
    fcl.arg(duration, UFix64),
    fcl.arg(amount, UFix64),
    fcl.arg(referAddr, Address),
  ])
  return res
}

export const batchRenewDomain = async (names, duration) => {
  const res = await buildAndSendTrx('batch_renew_domain_with_hash', [
    fcl.arg(
      names.map((n) => namehash(n)),
      Array(String),
    ),
    fcl.arg(duration, UFix64),
    fcl.arg(referAddr, Address),
  ])
  return res
}

export const registerDomain = async (id, hash, duration, amount) => {
  const res = await buildAndSendTrx('register_domain', [
    fcl.arg(id, UInt64),
    fcl.arg(hash, String),
    fcl.arg(duration, UFix64),
    fcl.arg(amount, UFix64),
    fcl.arg(referAddr, Address),
  ])
  return res
}

export const widhdrawDomainVault = async (hash, token, amount) => {
  const tokenTypes = getSupportTokenConfig()
  const key = tokenTypes[token].type
  const res = await buildAndSendTrx(
    'withdraw_domain_vault',
    [
      fcl.arg(hash, String),
      fcl.arg(key, String),
      fcl.arg(amount.toFixed(8), UFix64),
    ],
    { token },
  )
  return res
}

export const depositeDomainVault = async (hash, token, amount) => {
  const res = await buildAndSendTrx(
    'deposit_domain_vault',
    [fcl.arg(hash, String), fcl.arg(amount.toFixed(8), UFix64)],
    { token },
  )
  return res
}

export const transferNFT = async (type, id, to) => {
  console.log(type, id, to)
  const receiever = isFlowAddr(to)
    ? to
    : await queryDomainRecord(...to.split('.'))

  let scriptName = ''
  let args = []
  switch (type) {
    case 'Domains':
      const nameHash = await calcHash(...id.split('.'))

      scriptName = 'transfer_domain_with_hash_name'
      args = [fcl.arg(nameHash, String), fcl.arg(receiever, Address)]
  }
  console.log(args, scriptName)
  const res = await buildAndSendTrx(scriptName, args)
  return res
}

export const transferToken = async (token, amount, to) => {
  const receiever = isFlowAddr(to)
    ? to
    : await queryDomainRecord(...to.split('.'))

  const res = await buildAndSendTrx(
    'transfer_ft',
    [fcl.arg(receiever, Address), fcl.arg(amount.toFixed(8), UFix64)],
    { token },
  )
  return res
}

export const initTokenVault = async (token) => {
  const res = await buildAndSendTrx('init_ft_token', [], { token })
  return res
}

export const changeDefault = async (oldName, newName) => {
  const oldNameHash = oldName.length > 0 ? namehash(oldName) : namehash('')
  const newNameHash = namehash(newName)
  const res = await buildAndSendTrx('change_default_domain_name', [
    fcl.arg(oldNameHash, String),
    fcl.arg(newNameHash, String),
  ])
  return res
}

export const removeDefault = async (name) => {
  const hash = namehash(name)
  const res = await buildAndSendTrx('remove_domain_text', [
    fcl.arg(hash, String),
    fcl.arg('isDefault', String),
  ])
  return res
}

// subdomain

export const createSubdomain = async (name) => {
  const nameArr = name.split('.')
  const hash = namehash(`${nameArr[1]}.${nameArr[2]}`)
  const subName = nameArr[0]
  const res = await buildAndSendTrx('mint_subdomain', [
    fcl.arg(hash, String),
    fcl.arg(subName, String),
  ])
  return res
}

export const setSubdomainText = async (namehash, subHash, key, obj) => {
  const res = await buildAndSendTrx('set_subdomain_text', [
    fcl.arg(namehash, String),
    fcl.arg(subHash, String),
    fcl.arg(key, String),
    fcl.arg(typeof obj == 'string' ? obj : JSON.stringify(obj), String),
  ])
  return res
}

export const removeSubdomainText = async (namehash, subHash, key) => {
  const res = await buildAndSendTrx('remove_subdomain_text', [
    fcl.arg(namehash, String),
    fcl.arg(subHash, String),
    fcl.arg(key, String),
  ])
  return res
}

export const setSubdomainAddress = async (
  hash,
  subHash,
  chainType,
  address,
) => {
  const res = await buildAndSendTrx('set_subdomain_address', [
    fcl.arg(hash, String),
    fcl.arg(subHash, String),
    fcl.arg(chainType, UInt64),
    fcl.arg(address, String),
  ])
  return res
}

export const removeSubdomainAddress = async (hash, subHash, chainType) => {
  const res = await buildAndSendTrx('remove_subdomain_address', [
    fcl.arg(hash, String),
    fcl.arg(subHash, String),
    fcl.arg(chainType, UInt64),
  ])
  return res
}

export const removeSubdomain = async (hash, subHash) => {
  const res = await buildAndSendTrx('remove_subdomain', [
    fcl.arg(hash, String),
    fcl.arg(subHash, String),
  ])
  return res
}

export const setEthAddrOnDomain = async (hash, addr, pubKey, signature) => {
  const res = await buildAndSendTrx('set_eth_addr_on_domain', [
    fcl.arg(hash, String),
    fcl.arg(addr, String),
    fcl.arg(pubKey, String),
    fcl.arg(signature, String),
  ])
  return res
}

export const queryFlowNFTsByPath = async (path, address, limit, offset) => {
  const res = await buildAndExecScript('query_nft_datas_by_path', [
    fcl.arg(address, Address),
    fcl.arg(path, String),
    fcl.arg(limit, Int),
    fcl.arg(offset, Int),
  ])
  return res
}

export const queryFlowNFTsLengthByPath = async (path, address) => {
  const res = await buildAndExecScript('query_nfts_count_by_path', [
    fcl.arg(address, Address),
    fcl.arg(path, String),
  ])
  return res
}
