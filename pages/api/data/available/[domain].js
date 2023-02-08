import * as fcl from '@onflow/fcl'
import { String, UInt64 } from '@onflow/types'

import { validateDomain, validateEmoji, fclinit } from 'utils'
import { buildAndExecScript } from 'api/scripts'
import { fnId, flownsAppUrl, oneYear } from 'config/constants'
import { cors } from 'utils/middleware'

const checkAvailable = async (req, res) => {
  await cors(req, res)

  try {
    fclinit()
    const { domain = '' } = req.query
    const nameSplited = domain.split('.')

    if (!validateDomain(domain) || !validateEmoji(domain) || nameSplited.length > 2) {
      if (domain.indexOf('_') === -1) {
        res.status(404).json({ error: 'Domain name invalid' })
        return
      }
    }

    let label = nameSplited[0]
    let root = nameSplited[1]
    var avaliable = false
    if (!root) {
      root = 'fn'
      avaliable = await buildAndExecScript('query_domain_available_with_raw', [
        fcl.arg(label, String),
        fcl.arg(root, String),
      ])
    } else if (root == 'fn' || root == 'meow') {
      avaliable = await buildAndExecScript('query_domain_available_with_raw', [
        fcl.arg(label, String),
        fcl.arg(root, String),
      ])
    } else {
      return res.status(500).json({ error: 'Root name invalid' })
    }

    if (avaliable) {
      let price = await buildAndExecScript('get_domain_price', [
        fcl.arg(Number(fnId), UInt64),
        fcl.arg(label, String),
      ])

      const name = `${label}.${root}`

      res.status(200).json({
        name,
        avaliable,
        price: root === 'fn' ? (oneYear * price).toFixed(4) : '0',
        registerUrl: `${flownsAppUrl}/search?fns=${name}&openRegister=true`,
      })
    } else {
      const domainDetial = await buildAndExecScript('query_domain_info_with_raw', [
        fcl.arg(label, String),
        fcl.arg(root, String),
      ])
      res.status(200).json({ avaliable: false, domain: domainDetial })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.toString(), msg: 'error' })
  }
}

export default checkAvailable
