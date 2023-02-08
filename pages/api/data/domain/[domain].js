import * as fcl from '@onflow/fcl'
import { String } from '@onflow/types'
import moment from 'moment'

import { normalize } from 'utils/hash'
import { validateDomain, fclinit } from 'utils'
import { buildAndExecScript } from 'api/scripts'
import { flownsAppUrl } from 'config/constants'
import { cors } from 'utils/middleware'

const domainDetail = async (req, res) => {
  await cors(req, res)

  try {
    fclinit()
    const { domain = '', onlyOwner = false } = req.query
    if (!validateDomain(domain) && domain.indexOf('_') === -1) {
      res.status(404).json({ error: 'Can not find domain' })
      return
    }
    // skip meow domain with 「-」 char
    if (domain.indexOf('_') === -1) {
      normalize(domain)
    }
    const nameSplited = domain.split('.')
    if (nameSplited.length > 2) {
      res.status(404).json({ error: 'Can not find domain' })
    }
    const domainDetial = await buildAndExecScript('query_domain_info_with_raw', [
      fcl.arg(nameSplited[0], String),
      fcl.arg(nameSplited[1], String),
    ])

    if (domainDetial) {
      domainDetial.isExpired = moment(Number(domainDetial.expiredAt)).subtract(moment()) < 0
      domainDetial.mediaUrl = `${flownsAppUrl}/api/data/image/${domainDetial.name}`
      domainDetial.isDefault = domainDetial.texts && domainDetial.texts.isDefault == 'true'

      // let domainres = JSON.stringify(domainDetial)
      if (onlyOwner) {
        res.status(200).json({ owner: domainDetial.owner })
      } else {
        res.status(200).json(domainDetial)
      }
    } else {
      res.status(200).json({})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.toString(), msg: 'domain not exsit' })
  }
}

export default domainDetail
