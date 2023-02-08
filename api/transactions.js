import * as fcl from '@onflow/fcl'
import { sendTrx } from '../utils'
import { getSupportTokenConfig, network } from '../config/constants'
const register_domain = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(domainId: UInt64, name: String, duration: UFix64, amount: UFix64, refer: Address) {
  let collectionCap: Capability<&{NonFungibleToken.Receiver}>
  let vault: @FungibleToken.Vault
  prepare(account: AuthAccount) {
    if account.getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath).check() == false {
      if account.borrow<&Domains.Collection>(from: Domains.CollectionStoragePath) !=nil {
        account.unlink(Domains.CollectionPublicPath)
        account.link<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.CollectionPublicPath, target: Domains.CollectionStoragePath)
      } else {
        account.save(<- Domains.createEmptyCollection(), to: Domains.CollectionStoragePath)
        account.link<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.CollectionPublicPath, target: Domains.CollectionStoragePath)
      }
    }
    self.collectionCap = account.getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath)
    let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow owner's Vault reference")
    self.vault <- vaultRef.withdraw(amount: amount)
  }

  execute {
    Flowns.registerDomain(domainId: domainId, name: name, duration: duration, feeTokens: <- self.vault, receiver: self.collectionCap, refer: refer)
  }
}`

const register_domain_with_fusd = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(domainId: UInt64, name: String, duration: UFix64, amount: UFix64, refer: Address) {
  let collectionCap: Capability<&{NonFungibleToken.Receiver}>
  let vault: @FungibleToken.Vault
  prepare(account: AuthAccount) {

    if account.getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath).check() == nil {
      if account.borrow<&Domains.Collection>(from: Domains.CollectionStoragePath) !=nil {
         account.link<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.CollectionPublicPath, target: Domains.CollectionStoragePath)
      } else {
        account.save(<- Domains.createEmptyCollection(), to: Domains.CollectionStoragePath)
        account.link<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.CollectionPublicPath, target: Domains.CollectionStoragePath)
      }
    }
    self.collectionCap = account.getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath)
    
    let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/fusdVault)
          ?? panic("Could not borrow owner's Vault reference")
    self.vault <- vaultRef.withdraw(amount: amount)
  }

  execute {
    Flowns.registerDomain(domainId: domainId, name: name, duration: duration, feeTokens: <- self.vault, receiver: self.collectionCap, refer: refer)
  }
}`

const renew_domain = fcl.cdc`import Flowns from 0xFlowns
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(domainId: UInt64, nameHash: String, duration: UFix64, amount: UFix64) {
  let vault: @FungibleToken.Vault
  var domain: &Domains.NFT
  prepare(account: AuthAccount) {
    let collectionRef = account.borrow<&{Domains.CollectionPublic}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")
    var domain: &Domains.NFT? = nil
    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")
    
    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domain = collectionPrivate.borrowDomainPrivate(id!)
    }

    self.domain = domain!
    let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow owner's Vault reference")
    
    self.vault <- vaultRef.withdraw(amount: amount)
  }

  execute {
    Flowns.renewDomain(domainId: domainId, domain: self.domain, duration: duration, feeTokens: <- self.vault)
  }
}`

const renew_domain_with_hash = fcl.cdc`import Flowns from 0xFlowns
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(nameHash: String, duration: UFix64, amount: UFix64, refer: Address) {
  let vault: @FungibleToken.Vault
  prepare(account: AuthAccount) {
    
    let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow owner's Vault reference")
    
    self.vault <- vaultRef.withdraw(amount: amount)
  }

  execute {
    Flowns.renewDomainWithNameHash(nameHash: nameHash, duration: duration, feeTokens: <- self.vault, refer: refer)
  }
}`

const mint_subdomain = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(nameHash: String, subdomainName: String) {
  var domain: &{Domains.DomainPrivate}
  prepare(account: AuthAccount) {
    var domain: &{Domains.DomainPrivate}? = nil
    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection private cap")
    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domain = collectionPrivate.borrowDomainPrivate(id!)
    }
    self.domain = domain!
  }
  execute {
    self.domain.createSubDomain(name: subdomainName)
  }
}`

const remove_subdomain = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(nameHash: String, subdomainNameHash: String) {
  var domain: &{Domains.DomainPrivate}
  prepare(account: AuthAccount) {
    let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
    let collection = collectionCap.borrow()!
    var domain: &{Domains.DomainPrivate}? = nil
    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")
    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domain = collectionPrivate.borrowDomainPrivate(id!)
    }
    self.domain = domain!
  }
  execute {
    self.domain.removeSubDomain( nameHash: subdomainNameHash)
  }
}`

const set_domain_address = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains

transaction(nameHash: String, chainType: UInt64, address: String) {
  var domain: &{Domains.DomainPrivate}
  prepare(account: AuthAccount) {
    let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
    let collection = collectionCap.borrow()!
    var domain: &{Domains.DomainPrivate}? = nil
    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")

    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domain = collectionPrivate.borrowDomainPrivate(id!)
    }
    self.domain = domain!
  }
  execute {
    self.domain.setAddress(chainType: chainType, address: address)
  }
}`

const set_domain_text = fcl.cdc`
import Domains from 0xDomains

transaction(nameHash: String, key: String, value: String) {
  var domain: &{Domains.DomainPrivate}
  prepare(account: AuthAccount) {
    let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
    let collection = collectionCap.borrow()!
    var domain: &{Domains.DomainPrivate}? = nil
    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")
    
    
    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domain = collectionPrivate.borrowDomainPrivate(id!)
    }
    self.domain = domain!
  }
  execute {
    self.domain.setText(key: key, value: value)
  }
}
`

const remove_domain_text = fcl.cdc`

import Domains from 0xDomains

transaction(nameHash: String, key: String) {
  var domain: &{Domains.DomainPrivate}
  prepare(account: AuthAccount) {
    
    var domain: &{Domains.DomainPrivate}? = nil
    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")
    
    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domain = collectionPrivate.borrowDomainPrivate(id!)
    }
    self.domain = domain!
  }
  execute {
    self.domain.removeText(key: key)
  }
}`

const remove_domain_address = fcl.cdc`
import Domains from 0xDomains

transaction(nameHash: String, chainType: UInt64) {
  var domain: &{Domains.DomainPrivate}
  prepare(account: AuthAccount) {
    var domain: &{Domains.DomainPrivate}? = nil
    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")
    
    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domain = collectionPrivate.borrowDomainPrivate(id!)
    }
    self.domain = domain!
  }
  execute {
    self.domain.removeAddress(chainType: chainType)
  }
}`

const set_subdomain_text = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains

transaction(nameHash: String, subdomainNameHash: String, key: String, value: String) {
  var domain: &{Domains.DomainPrivate}
  prepare(account: AuthAccount) {
    var domain: &{Domains.DomainPrivate}? = nil
    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")

    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domain = collectionPrivate.borrowDomainPrivate(id!)
    }
    self.domain = domain!
  }
  execute {
    self.domain.setSubdomainText(nameHash: subdomainNameHash, key: key, value: value)
  }
}`

const remove_subdomain_text = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(nameHash: String, subdomainNameHash: String, key: String) {
  var domain: &{Domains.DomainPrivate}
  prepare(account: AuthAccount) {
    let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
    let collection = collectionCap.borrow()!
    var domain: &{Domains.DomainPrivate}? = nil
    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")
    
    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domain = collectionPrivate.borrowDomainPrivate(id!)
    }
    self.domain = domain!
  }
  execute {
    self.domain.removeSubdomainText(nameHash: subdomainNameHash, key: key)
  }
}`

const set_subdomain_address = fcl.cdc`import Flowns from 0xFlowns
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(nameHash: String, subdomainNameHash: String, chainType: UInt64, address: String) {
  var domain: &{Domains.DomainPrivate}
  prepare(account: AuthAccount) {
    var domain: &{Domains.DomainPrivate}? = nil
    let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
    let collection = collectionCap.borrow()!
    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")
    
    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domain = collectionPrivate.borrowDomainPrivate(id!)
    }
    self.domain = domain!
  }
  execute {
    self.domain.setSubdomainAddress(nameHash: subdomainNameHash, chainType: chainType, address: address)
  }
}`

const remove_subdomain_address = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(nameHash: String, subdomainNameHash: String, chainType: UInt64) {
  var domain: &{Domains.DomainPrivate}
  prepare(account: AuthAccount) {
    let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
    let collection = collectionCap.borrow()!
    var domain: &{Domains.DomainPrivate}? = nil
    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")

    let id = Domains.getDomainId(nameHash)
    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domain = collectionPrivate.borrowDomainPrivate(id!)
    }
    self.domain = domain!
  }
  execute {
    self.domain.removeSubdomainAddress(nameHash: subdomainNameHash, chainType: chainType)
  }
}`

const transfer_domain_with_id = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains
import NonFungibleToken from 0xNonFungibleToken

transaction(itemId: UInt64, receiver: Address) {
  var senderCollection: &Domains.Collection
  var receiverCollection: &{NonFungibleToken.Receiver}
  prepare(account: AuthAccount) {
    self.senderCollection = account.borrow<&Domains.Collection>(from: Domains.CollectionStoragePath)!
    let receiverCollectionCap = getAccount(receiver).getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath)
    self.receiverCollection = receiverCollectionCap.borrow()?? panic("Canot borrow receiver's collection")
  }
  execute {
    self.receiverCollection.deposit(token: <- self.senderCollection.withdraw(withdrawID: itemId))
  }
}
`
const transfer_domain_with_hash_name = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains
import NonFungibleToken from 0xNonFungibleToken

transaction(nameHash: String, receiver: Address) {
  var senderCollection: &Domains.Collection
  var receiverCollection: &{NonFungibleToken.Receiver}
  var domainId: UInt64
  prepare(account: AuthAccount) {
    self.senderCollection = account.borrow<&Domains.Collection>(from: Domains.CollectionStoragePath)!
    let receiverCollectionCap = getAccount(receiver).getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath)
    self.receiverCollection = receiverCollectionCap.borrow()?? panic("Canot borrow receiver's collection")

    var domainId: UInt64? = nil
    
    let id = Domains.getDomainId(nameHash)

    self.domainId = id!
  }
  execute {
    self.receiverCollection.deposit(token: <- self.senderCollection.withdraw(withdrawID: self.domainId))
  }
}`

const init_domain_collection = fcl.cdc`
import Domains from 0xDomains
import NonFungibleToken from 0xNonFungibleToken

transaction() {
    prepare(account: AuthAccount) {
        account.save<@NonFungibleToken.Collection>(<- Domains.createEmptyCollection(), to: Domains.CollectionStoragePath)
        account.link<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.CollectionPublicPath, target: Domains.CollectionStoragePath)
        account.link<&Domains.Collection>(Domains.CollectionPrivatePath, target: Domains.CollectionStoragePath)
    }
}`
const change_default_domain_name = fcl.cdc`
import Domains from 0xDomains

transaction(oldNameHash: String, nameHash: String) {
  var oldDomain: &{Domains.DomainPrivate}?
  var domain: &{Domains.DomainPrivate} 
  prepare(account: AuthAccount) {
    var oldDomainRef:&{Domains.DomainPrivate}? = nil
    var domainRef:&{Domains.DomainPrivate}? = nil

    let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")
    let oldId = Domains.getDomainId(oldNameHash)
    let id = Domains.getDomainId(nameHash)

    if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
      domainRef = collectionPrivate.borrowDomainPrivate(id!)
    }

    if oldId != nil {
      oldDomainRef = collectionPrivate.borrowDomainPrivate(oldId!)
    } else {
      oldDomainRef = nil
    }
    self.domain = domainRef!
    self.oldDomain = oldDomainRef
  }
  execute {
    if self.oldDomain != nil {
        self.oldDomain!.removeText(key: "isDefault")
    }
    self.domain.setText( key: "isDefault", value: "true")
  }
}
`
const mint_lilico_domain = fcl.cdc`
  import Domains from 0xDomains
  import Flowns from 0xFlowns
  import NonFungibleToken from 0xNonFungibleToken

  transaction(name: String, receiverAddr: Address) {
    let client: &{Flowns.AdminPrivate}
    let receiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(account: AuthAccount) {
      let receiverAccount = getAccount(receiverAddr)
      self.receiver = receiverAccount.getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath)
      self.client = account.borrow<&{Flowns.AdminPrivate}>(from: Flowns.FlownsAdminStoragePath) ?? panic("Could not borrow admin client")
    }
    execute {
      self.client.mintDomain(domainId: 2, name: name, duration: 315360000.00, receiver: self.receiver)
    }
  }
`

const mint_domain = fcl.cdc`
  import Domains from 0xDomains
  import Flowns from 0xFlowns
  import NonFungibleToken from 0xNonFungibleToken

  transaction(domainId: UInt64, name: String, duration: UFix64) {
    let client: &{Flowns.AdminPrivate}
    let receiver: Capability<&{NonFungibleToken.Receiver}>
    prepare(account: AuthAccount) {
      self.receiver = account.getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath)
      self.client = account.borrow<&{Flowns.AdminPrivate}>(from: Flowns.FlownsAdminStoragePath) ?? panic("Could not borrow admin client")
    }
    execute {
      self.client.mintDomain(domainId: domainId, name: name, duration: duration, receiver: self.receiver)
    }
  }
`

const withdraw_domain_vault = (opt) => {
  const { token } = opt

  const tokenConfig = getSupportTokenConfig()[token]
  const { type, storagePath } = tokenConfig
  const typeArr = type.split('.')
  const contractAddr = typeArr[1]
  const contractName = typeArr[2]

  return fcl.cdc`
  import Flowns from 0xFlowns
  import Domains from 0xDomains
  import FungibleToken from 0xFungibleToken
  import ${contractName} from 0x${contractAddr}

  transaction(nameHash: String, key: String, amount: UFix64) {
    var domain: &{Domains.DomainPrivate}
    var vaultRef: &${contractName}.Vault
    prepare(account: AuthAccount) {
      var domain: &{Domains.DomainPrivate}? = nil
      let collectionPrivate = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.CollectionStoragePath) ?? panic("Could not find your domain collection cap")
      
      let id = Domains.getDomainId(nameHash)
      if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
        domain = collectionPrivate.borrowDomainPrivate(id!)
      }

      self.domain = domain!
      self.vaultRef = account.borrow<&${contractName}.Vault>(from: ${storagePath})
      ?? panic("Could not borrow reference to the owner's Vault!")
    }
    execute {
      self.vaultRef.deposit(from: <- self.domain.withdrawVault(key: key, amount: amount))
    }
  }
`
}

const deposit_domain_vault = (opt) => {
  const { token } = opt

  const tokenConfig = getSupportTokenConfig()[token]
  const { type, storagePath, publicReceiverPath } = tokenConfig
  const typeArr = type.split('.')
  const contractAddr = typeArr[1]
  const contractName = typeArr[2]

  return fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import Flowns from 0xFlowns
  import Domains from 0xDomains
  import ${contractName} from 0x${contractAddr}

  transaction(nameHash: String, amount: UFix64) {
    let senderRef: &{FungibleToken.Receiver}
    var domain: &{Domains.DomainPublic}
    var vaultRef: &${contractName}.Vault
    prepare(account: AuthAccount) {
      let address = Domains.getRecords(nameHash) ?? panic("Domain not exsit")
      let collectionCap = getAccount(address).getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
      let collection = collectionCap.borrow()!
      var domain: &{Domains.DomainPublic}? = nil

    
      let id = Domains.getDomainId(nameHash)
      if id != nil && !Domains.isDeprecated(nameHash: nameHash, domainId: id!) {
        domain = collection.borrowDomain(id: id!)
      }
      self.domain = domain!
      self.vaultRef = account.borrow<&${contractName}.Vault>(from: ${storagePath})
        ?? panic("Could not borrow reference to the owner's Vault!")
      self.senderRef = account.getCapability<&{FungibleToken.Receiver}>(${publicReceiverPath}).borrow()!
    }
    execute {
      let sentVault <- self.vaultRef.withdraw(amount: amount)
      self.domain.depositVault(from: <- sentVault, senderRef: self.senderRef)
    }
  }
`
}

const init_ft_token = (opt) => {
  const { token } = opt

  const tokenConfig = getSupportTokenConfig()[token]
  const { type, storagePath, publicReceiverPath, publicBalPath } = tokenConfig
  const typeArr = type.split('.')
  const contractAddr = typeArr[1]
  const contractName = typeArr[2]
  return fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import ${contractName} from 0x${contractAddr}

  transaction {

    prepare(signer: AuthAccount) {

        // It's OK if the account already has a Vault, but we don't want to replace it
        if(signer.borrow<&${contractName}.Vault>(from: ${storagePath}) != nil) {
            return
        }
        // Create a new Token Vault and put it in storage
        signer.save(<- ${contractName}.createEmptyVault(), to: ${storagePath})

        // Create a public capability to the Vault that only exposes
        // the deposit function through the Receiver interface
        signer.link<&${contractName}.Vault{FungibleToken.Receiver}>(
            ${publicReceiverPath},
            target: ${storagePath}
        )

        // Create a public capability to the Vault that only exposes
        // the balance field through the Balance interface
        signer.link<&${contractName}.Vault{FungibleToken.Balance}>(
            ${publicBalPath},
            target: ${storagePath}
        )
    }
  }
`
}

const transfer_ft = (opt) => {
  const { token } = opt

  const tokenConfig = getSupportTokenConfig()[token]
  const { type, storagePath, publicReceiverPath } = tokenConfig
  const typeArr = type.split('.')
  const contractAddr = typeArr[1]
  const contractName = typeArr[2]
  return fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import Domains from 0xDomains
  import ${contractName} from 0x${contractAddr}

  transaction(to: Address, amount: UFix64) {
    let sentVault: @FungibleToken.Vault
    prepare(signer: AuthAccount) {
      let vaultRef = signer.borrow<&${contractName}.Vault>(from: ${storagePath})
      ?? panic("Err owner Vault!")
      self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
      let recipient = getAccount(to)
      let receiverRef = recipient.getCapability(${publicReceiverPath})!.borrow<&{FungibleToken.Receiver}>()
      ?? panic("Err recipient Vault")
      receiverRef.deposit(from: <-self.sentVault)
    }
  }
`
}

const batch_renew_domain_with_hash = fcl.cdc`
import Flowns from 0xFlowns
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(nameHashs: [String], duration: UFix64, refer: Address) {
  let vaultRef: &FungibleToken.Vault
  let prices: {String:{Int: UFix64}}
  let collectionCap: &{Domains.CollectionPublic}
  prepare(account: AuthAccount) {
    self.collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath).borrow()!

    self.vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow owner's Vault reference")
    
    // self.vault <- vaultRef.withdraw(amount: amount)

    self.prices = {}
    let roots: {UInt64: Flowns.RootDomainInfo}? = Flowns.getAllRootDomains()
    let keys = roots!.keys
    for key in keys {
      let root = roots![key]!
      self.prices[root.name] = root.prices
    }
  }

  execute {
    var idx = 1
    for nameHash in nameHashs {
      idx = idx + 1
      let id = Domains.getDomainId(nameHash)
      let address = Domains.getRecords(nameHash)!
      let collectionCap = getAccount(address).getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath).borrow()!
      let domain = collectionCap.borrowDomain(id: id!)
      var len = domain.name.length
      if len > 10 {
        len = 10
      }
      let price = self.prices[domain.parent]![len]!
      if idx != nameHashs.length {
        Flowns.renewDomainWithNameHash(nameHash: nameHash, duration: duration, feeTokens: <- self.vaultRef.withdraw(amount: price * duration), refer: refer)
      } else {
        Flowns.renewDomainWithNameHash(nameHash: nameHash, duration: duration, feeTokens: <- self.vaultRef.withdraw(amount: price * duration), refer: refer)
      }
    }
  }
}
 `

export const transactions = {
  register_domain,
  register_domain_with_fusd,
  renew_domain,
  mint_subdomain,
  remove_subdomain,
  set_domain_address,
  set_domain_text,
  remove_domain_text,
  remove_domain_address,
  set_subdomain_text,
  remove_subdomain_text,
  init_domain_collection,
  set_subdomain_address,
  remove_subdomain_address,
  transfer_domain_with_id,
  transfer_domain_with_hash_name,
  change_default_domain_name,
  mint_domain,
  mint_lilico_domain,
  withdraw_domain_vault,
  deposit_domain_vault,
  transfer_ft,
  init_ft_token,
  renew_domain_with_hash,
  batch_renew_domain_with_hash,
}

export const buildAndSendTrx = async (key, args = [], opt = {}) => {
  try {
    let trxScript = transactions[key]
    if (typeof trxScript == 'function') {
      trxScript = trxScript(opt)
    }
    const trxId = await sendTrx(trxScript, args)
    const txStatus = await fcl.tx(trxId).onceSealed()
    return txStatus
  } catch (error) {
    console.log(error)
    return null
  }
}
