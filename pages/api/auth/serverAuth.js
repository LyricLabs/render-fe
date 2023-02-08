import * as fcl from '@onflow/fcl'
import { Address } from '@onflow/types'
import moment from 'moment'

import { whitelist, whitelistFunc } from 'config/whitelist'
import { network } from 'config/constants'
import { scripts } from 'api/scripts'
import { transactions } from 'api/transactions'

import { fclinit } from 'utils'
import { sign } from 'utils/authorization'

const serverAuth = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  try {
    // console.log(req.body)
    const body = JSON.parse(req.body.body)

    fclinit()
    const { scriptName, type = 'transaction', user, signable, orgName = 'lilico' } = body
    let script = null
    let scriptCode = scripts[scriptName]
    let trxCode = transactions[scriptName]
    if (scriptCode && type === 'script') {
      script = scriptCode()
    }
    if (trxCode && type === 'transaction') {
      script = trxCode()
    }

    // validate user data with blocto
    // const isValid = await verifyUserDataWithBlocto(user)
    // if (!isValid) return res.status(500).json({ mesage: 'User data validate failed' })
    console.log(signable, 'signable====')
    const { voucher = {}, message } = signable
    const { cadence = '' } = voucher

    // if (script !== cadence) {
    //   return res.status(500).json({ message: 'Script code not supported' })
    // }

    if (whitelistFunc[orgName].indexOf(scriptName) < 0) {
      return res.status(500).json({ message: `${scriptName} not allow` })
    }
    let whitelistConfig = whitelist[orgName]
    let whitelistAddrs = whitelist[orgName][network]

    if (!whitelistConfig || !whitelistAddrs || whitelistAddrs.length == 0) {
      return res
        .status(500)
        .json({ message: `No access account addr found with ${orgName} ${network}` })
    }
    console.log(user)
    if (whitelistAddrs.indexOf(user.addr) < 0) {
      return res.status(500).json({ message: `Address not in whitelist` })
    }

    const signature = sign(message)
    res.json({ signature })
  } catch (error) {
    // res.status(200).json([])
    console.log(error)
    res.status(500).json({ error: error.toString(), msg: error })
  }
}

export default serverAuth
