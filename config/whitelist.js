import Sha3 from 'js-sha3'
import { network, flownsAddr, flowNonFungibleAddr, flowFungibleAddr } from 'config/constants'
const sha3 = Sha3.sha3_256

export const whitelist = {
  testnet: {
    '0xcb1cf3196916f9e2': ['mintLilicoDomain'],
  },
  mainnet: {
    '0x319e67f2ef9d937f': ['mintLilicoDomain'],
  },
}

export const authorizor = {
  testnet: {
    mintLilicoDomain: '0x5e0b3939f5fe2c69',
  },
  mainnet: {
    mintLilicoDomain: '0xa9de7c3f7139b65b',
  },
}

export const checkAuth = (transaction) => {
  const { payer, authorizers, payloadSigs, cadence } = transaction
  let whiteList = whitelist[network]
  let scriptList = whiteList[payer]
  if (!scriptList || scriptList.len == 0) return false

  let scriptHash = sha3(cadence)
  let scriptKey = null
  scriptList.map((key) => {
    let script = getScripts(key)
    let hashStr = sha3(script)
    if (scriptHash === hashStr) {
      scriptKey = key
    }
    return null
  })

  let verified = true
  const author = authorizor[network][scriptKey]
  console.log(author, scriptKey, '====')
  if (!author || !scriptKey) {
    return false
  }

  verified = authorizers.indexOf(author) >= 0
  console.log(verified)
  verified = payloadSigs.findIndex((sig) => sig.address === author) >= 0
  console.log(verified)

  return verified
}
export const getScriptByAddressAndName = (address, scriptName) => {
  let whiteList = whitelist[network]
  let scriptList = whiteList[address]

  let name = scriptList.find((name) => scriptName === name)
  return getScripts(name)
}
export const whitelistFunc = {
  lilico: ['mint_lilico_domain'],
}

export const verifyTrx = (script, address) => {
  let whiteList = whitelist[network]
  let scriptList = whiteList[address]
  if (!scriptList || scriptList.len == 0) return false

  let scriptHash = sha3(script)
  console.log(scriptHash, 'input script hash')
  var flag = false
  scriptList.map((key) => {
    let script = getScripts(key)
    let hashStr = sha3(script)
    console.log(hashStr, 'auth script hash')
    if (scriptHash === hashStr) {
      flag = true
      return
    }
    return null
  })
  return flag
}

export const getScripts = (key) => {
  const scriptFunc = scripts[key]
  const script = scriptFunc ? scriptFunc() : ''
  return script
}

const scripts = {
  mintLilicoDomain: () => {
    const script = `import Domains from ${flownsAddr}
    import Flowns from ${flownsAddr}
    import NonFungibleToken from ${flowNonFungibleAddr}
    import FungibleToken from ${flowFungibleAddr}

    transaction(name: String) {
      let client: &{Flowns.AdminPrivate}
      let receiver: Capability<&{NonFungibleToken.Receiver}>
      prepare(user: AuthAccount, lilico: AuthAccount, flowns: AuthAccount) {
        let userAcc = getAccount(user.address)

        if user.getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath).check() == false {
          if user.borrow<&Domains.Collection>(from: Domains.CollectionStoragePath) != nil {
            user.unlink(Domains.CollectionPublicPath)
            user.link<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.CollectionPublicPath, target: Domains.CollectionStoragePath)
          } else {
            user.save(<- Domains.createEmptyCollection(), to: Domains.CollectionStoragePath)
            user.link<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.CollectionPublicPath, target: Domains.CollectionStoragePath)
          }
        }
        self.receiver = userAcc.getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath)
        self.client = flowns.borrow<&{Flowns.AdminPrivate}>(from: Flowns.FlownsAdminStoragePath) ?? panic("Could not borrow admin client")
      }
      execute {
        self.client.mintDomain(domainId: ${
          network == 'testnet' ? 3 : 1
        }, name: name, duration: 31536000.00, receiver: self.receiver)
      }
    }
    `
    return script
  },
}
