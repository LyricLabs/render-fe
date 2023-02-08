import * as fcl from '@onflow/fcl'
import { String } from '@onflow/types'
import moment from 'moment'

import { normalize } from 'utils/hash'
import { validateDomain, fclinit } from 'utils'
import { buildAndExecScript } from 'api/scripts'
import { flownsAppUrl } from 'config/constants'
import { cors } from 'utils/middleware'

const data = async (req, res) => {
  await cors(req, res)
  try {
    fclinit()
    const { domain = '' } = req.query
    if (!validateDomain(domain)) {
      res.status(404).json({ error: 'Can not find domain' })
      return
    }

    normalize(domain)
    const nameSplited = domain.split('.')
    if (nameSplited.length > 2) {
      res.status(404).json({ error: 'Can not find domain' })
    }
    const domainDetial = await buildAndExecScript('query_domain_info_with_raw', [
      fcl.arg(nameSplited[0], String),
      fcl.arg(nameSplited[1], String),
    ])

    if (domainDetial) {
      domainDetial.expired = moment(Number(domainDetial.expiredAt)).subtract(moment()) > 0
      domainDetial.mediaUrl = `${flownsAppUrl}/api/data/image/${domainDetial.name}`
      let domainres = JSON.stringify(domainDetial)

      res.status(200).json(domainres)
    } else {
      res.status(200).json({})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.toString(), msg: 'domain not exsit' })
  }
}

export default data
