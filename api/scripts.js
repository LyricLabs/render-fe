import * as fcl from '@onflow/fcl'
import { execScript } from '../utils'
import { getSupportTokenVaultPath } from '../config/constants'
const check_domain_collection = fcl.cdc`
import Domains from 0xDomains

pub fun main(address: Address) : Bool {
    return getAccount(address).getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath).check()
}`

const query_root_domains_by_id = fcl.cdc`
import Flowns from 0xFlowns

pub fun main(id: UInt64): Flowns.RootDomainInfo? {
    return Flowns.getRootDomainInfo(domainId: id)
}`

const query_root_domains = fcl.cdc`
import Flowns from 0xFlowns

pub fun main() : { UInt64: Flowns.RootDomainInfo }? {
  return Flowns.getAllRootDomains()
}`

const query_domain_rent_prices = fcl.cdc`
import Flowns from 0xFlowns

pub fun main(domainId: UInt64) : { Int: UFix64 }? {
    return Flowns.getRentPrices(domainId: domainId)
}`

const query_domain_available = fcl.cdc`
import Flowns from 0xFlowns

pub fun main(nameHash: String) : Bool {
  return Flowns.available(nameHash: nameHash)
}`

const query_flow_balance = fcl.cdc`
import FungibleToken from 0xFungibleToken

pub fun main(address: Address) : UFix64 {
    let account = getAccount(address)
    var balance = 0.00
    if let vault = account.getCapability(/public/flowTokenBalance).borrow<&{FungibleToken.Balance}>() {
      balance = vault.balance
    }
    return balance
}`

const query_domain_record = fcl.cdc`
import Domains from 0xDomains
import Flowns from 0xFlowns

pub fun main(label: String, root: String): Address? {
  let prefix = "0x"
  let rootHahsh = Flowns.hash(node: "", lable: root)
  let nameHash = prefix.concat(Flowns.hash(node: rootHahsh, lable: label))
  var address = Domains.getRecords(nameHash)
  return address
}`

const query_domain_is_expired = fcl.cdc`
import Domains from 0xDomains

pub fun main(nameHash: String): Bool {
  return Domains.isExpired(nameHash)
}`

const query_domain_info = fcl.cdc`
import Domains from 0xDomains

pub fun main(nameHash: String): Domains.DomainDetail? {
  let address = Domains.getRecords(nameHash) ?? panic("Domain not exist")
  let account = getAccount(address)
  let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
  let collection = collectionCap.borrow()!
  var detail: Domains.DomainDetail? = nil

  let id = Domains.getDomainId(nameHash)
  if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
    let domain = collection.borrowDomain(id: id!)
    detail = domain.getDetail()
  }

  return detail
}`

const query_domain_page_info = fcl.cdc`
import Domains from 0xDomains

pub fun main(nameHash: String): {String: AnyStruct}? {
  let map: {String: AnyStruct} = {}

  let address = Domains.getRecords(nameHash) ?? panic("Domain not exist")
  let id = Domains.getDomainId(nameHash)
  let expiredAt = Domains.getExpiredTime(nameHash)

  map["id"] = id
  map["owner"] = address
  map["expiredAt"] = expiredAt

  return map
}`

const query_domain_info_with_raw = fcl.cdc`
import Domains from 0xDomains
import Flowns from 0xFlowns

pub fun main(label: String, root: String): Domains.DomainDetail? {
  let prefix = "0x"
  let rootHahsh = Flowns.hash(node: "", lable: root)
  let nameHash = prefix.concat(Flowns.hash(node: rootHahsh, lable: label))
  let address = Domains.getRecords(nameHash) ?? panic("Domain not exist")
  let account = getAccount(address)
  let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
  let collection = collectionCap.borrow()!
  var detail: Domains.DomainDetail? = nil

  let id = Domains.getDomainId(nameHash)
  if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
    let domain = collection.borrowDomain(id: id!)
    detail = domain.getDetail()
  }

  return detail
}`
const query_domain_deprecated_info = fcl.cdc`
import Domains from 0xDomains
import Flowns from 0xFlowns

pub fun main(nameHash: String, id: UInt64): Domains.DomainDeprecatedInfo? {
  let deprecatedInfo = Domains.getDeprecatedRecords(nameHash) ?? panic("Domain not exist")
  let info = deprecatedInfo[id]
  return info
}`

const query_domain_available_with_raw = fcl.cdc`
import Domains from 0xDomains
import Flowns from 0xFlowns

pub fun main(label: String, root: String): Bool {
  let prefix = "0x"
  let rootHahsh = Flowns.hash(node: "", lable: root)
  let nameHash = prefix.concat(Flowns.hash(node: rootHahsh, lable: label))
  return Flowns.available(nameHash: nameHash)
}`

const query_user_domains_info = fcl.cdc`
import Domains from 0xDomains

pub fun main(address: Address): [Domains.DomainDetail] {
  let account = getAccount(address)
  let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
  let collection = collectionCap.borrow()!
  let domains:[Domains.DomainDetail] = []
  let ids = collection.getIDs()
  
  for id in ids {
    let domain = collection.borrowDomain(id: id)
    let detail = domain.getDetail()
    domains.append(detail)
  }

  return domains
}`

const query_root_vault_balance = fcl.cdc`
import Flowns from 0xFlowns

pub fun main(id: UInt64): UFix64 {
  let balance = Flowns.getRootVaultBalance(domainId: id)
  return balance
}`

const query_domain_deprecated = fcl.cdc`
import Domains from 0xDomains

pub fun main(nameHash: String): {UInt64: Domains.DomainDeprecatedInfo}? {
  return Domains.getDeprecatedRecords(nameHash)
}`

const get_block_timestamp = fcl.cdc`
import Flowns from 0xFlowns

pub fun main(): UFix64 {
  return getCurrentBlock().timestamp
}`

const calc_hash = fcl.cdc`
import Flowns from 0xFlowns

pub fun main(lable: String, root: String) : String {
  let prefix = "0x"
  let rootHahsh = Flowns.hash(node: "", lable: root)
  let nameHash = prefix.concat(Flowns.hash(node: rootHahsh, lable: lable))
  return nameHash
}`

const get_flowns_root_num = fcl.cdc`
import Flowns from 0xFlowns

pub fun main() : Bool {
  return Flowns.totalRootDomains
}`

const get_flowns_domain_num = fcl.cdc`
import Domains from 0xDomains

pub fun main() : Bool {
  return Domains.totalSupply
}`

const get_domain_price = fcl.cdc`
import Flowns from 0xFlowns

pub fun main(domainId: UInt64, name: String) : UFix64? {
  let root = Flowns.getRootDomainInfo(domainId: domainId)!
  var length = name.length
  if length > 10 {
    length = 10
  }
  return root.prices[length]
}`

const get_domain_length = fcl.cdc`
pub fun main(name: String) : Int {
  return name.length
}`

const get_user_domain_ids = fcl.cdc`
import Domains from 0xDomains

pub fun main(address: Address): [UInt64] {
  let account = getAccount(address)
  let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
  let collection = collectionCap.borrow()!
  let domains:[Domains.DomainDetail] = []
  let ids = collection.getIDs()
  return ids
}
`


const get_default_flowns_name = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains

 pub fun main(address: Address): String? {
      
    let account = getAccount(address)
    let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
  
    if collectionCap.check() != true {
      return nil
    }
  
    var flownsName = ""
    let collection = collectionCap.borrow()!
    let ids = collection.getIDs()
    flownsName = collection.borrowDomain(id: ids[0])!.getDomainName()
    for id in ids {
      let domain = collection.borrowDomain(id: id)!
      let isDefault = domain.getText(key: "isDefault")
      if isDefault == "true" {
        flownsName = domain.getDomainName()
        break
      }
    }
  
    return flownsName
  }`


const query_ft_balance = (opt) => {
  const { tokenConfig } = opt
  const { type, publicBalPath } = tokenConfig
  const typeArr = type.split('.')
  const contractAddr = typeArr[1]
  const contractName = typeArr[2]

  return fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import ${contractName} from 0x${contractAddr}
  
  pub fun main(address: Address): UFix64? {
    let account = getAccount(address)
    var balance :UFix64? = nil
    if let vault = account.getCapability(${publicBalPath}).borrow<&{FungibleToken.Balance}>() {
      balance = vault.balance
    }
    return balance
  }`
}

const query_sign_info_by_address = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains

 pub fun main(address: Address): String? {
      
    let account = getAccount(address)
    let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
  
    if collectionCap.check() != true {
      return nil
    }
  
    var defaultDomain: &{Domains.DomainPublic}? = nil
    let collection = collectionCap.borrow()!
    let ids = collection.getIDs()
    defaultDomain = collection.borrowDomain(id: ids[0])!
    for id in ids {
      let domain = collection.borrowDomain(id: id)!
      let isDefault = domain.getText(key: "isDefault")
      if isDefault == "true" {
        defaultDomain = domain
        break
      }
    }

    let ethSigStr = defaultDomain!.getText(key: "_ethSig") ?? ""
  
    return ethSigStr
  }
  `
  const query_sign_info_by_hash = fcl.cdc`
  import Domains from 0xDomains

  pub fun main(nameHash: String): String? {

    let address = Domains.getRecords(nameHash) ?? panic("Domain not exist")
    let account = getAccount(address)
    let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
    let collection = collectionCap.borrow()!
    var signInfo: String? = nil
  
    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      let domain = collection.borrowDomain(id: id!)
      signInfo = domain.getText(key:"_ethSig")
    }
    return signInfo
  }
  
    `
  


export const scripts = {
  check_domain_collection,
  query_root_domains_by_id,
  query_root_domains,
  query_domain_rent_prices,
  query_domain_available,
  query_flow_balance,
  query_ft_balance,
  query_domain_record,
  query_domain_is_expired,
  query_domain_info,
  query_user_domains_info,
  query_root_vault_balance,
  query_domain_deprecated,
  get_block_timestamp,
  calc_hash,
  get_flowns_root_num,
  get_flowns_domain_num,
  get_domain_price,
  get_domain_length,
  get_user_domain_ids,
  query_domain_info_with_raw,
  query_domain_available_with_raw,
  query_domain_page_info,
  query_domain_deprecated_info,
  get_default_flowns_name,
  query_sign_info_by_address,
  query_sign_info_by_hash
}

export const buildAndExecScript = async (key, args = [], opt = {}) => {
  let script = scripts[key]
  if (typeof script == 'function') {
    script = script(opt)
  }
  const result = await execScript(script, args)
  return result
}
