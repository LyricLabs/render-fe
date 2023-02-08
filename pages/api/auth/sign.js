import { encodeTransactionPayload } from '@onflow/sdk'

import { checkAuth, verifyTrx } from 'config/whitelist'
import { flownsAddr } from 'config/constants'

import { fclinit } from 'utils'
import { sign } from 'utils/authorization'
import { cors } from 'utils/middleware'

const serverSign = async (req, res) => {
  await cors(req, res)
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  try {
    const data = req.body
    const { transaction } = data

    // init fcl config
    fclinit()
    const {
      cadence,
      payer,
      refBlock,
      proposalKey,
      computeLimit,
      authorizers,
      payloadSigs,
      arguments: args,
    } = transaction
    // console.log(transaction, 'transaction ====')

    const name = args[0].value
    const isValid = /^.+_[0-9]{3}$/.test(name)

    if (!isValid) {
      return res.json({ error: 'not verified domain name' })
    }

    let verified = verifyTrx(cadence, payer)
    verified = checkAuth(transaction)
    if (verified) {
      let trxMsg = {
        cadence,
        refBlock,
        arguments: transaction.arguments,
        proposalKey: {
          address: proposalKey.address,
          keyId: proposalKey.keyId,
          sequenceNum: proposalKey.sequenceNum,
        },
        payer,
        authorizers,
        payloadSigs,
        computeLimit,
      }
      let msg = encodeTransactionPayload(trxMsg)
      let sig = sign(msg)

      transaction.payloadSigs = transaction.payloadSigs.concat({
        address: flownsAddr,
        keyId: 0,
        sig,
      })
      return res.json(transaction)
    } else {
      return res.json({ error: 'not verified script or address' })
    }
  } catch (error) {
    // res.status(200).json([])
    console.log(error)
    res.status(500).json({ error: error.toString() })
  }
}

export default serverSign
