import * as fcl from '@onflow/fcl'
import { Address } from '@onflow/types'
import moment from 'moment'

import { validateAddress, fclinit } from 'utils'
import { buildAndExecScript } from 'api/scripts'
import { flownsAppUrl } from 'config/constants'
import { cors } from 'utils/middleware'

const queryDomain = async (req, res) => {
  await cors(req, res)

  try {
    fclinit()
    const {
      address = '',
      onlyName = false,
      onlyId = false,
      onlyHash = false,
      onlyDefault = false,
    } = req.query
    if (!validateAddress(0, address)) {
      res.status(404).json({ error: 'Address not valid' })
      return
    }

    const domainList = await buildAndExecScript('query_user_domains_info', [
      fcl.arg(address, Address),
    ])

    if (onlyDefault) {
      let defaultName = ''
      domainList.map((domain) => {
        if (domain.texts && domain.texts.isDefault == 'true') {
          defaultName = domain.name
          return
        }
      })
      return res.status(200).json({ defaultName })
    }

    if (domainList.length > 0) {
      res.status(200).json(
        domainList.map((domain) => {
          if (onlyName) {
            return domain.name
          }
          if (onlyId) {
            return domain.id
          }
          if (onlyHash) {
            return domain.nameHash
          }
          domain.expired = moment(Number(domain.expiredAt)).subtract(moment()) > 0
          domain.mediaUrl = `${flownsAppUrl}/api/data/image/${domain.name}`
          domain.isDefault = domain.texts && domain.texts.isDefault == 'true'
          return domain
        }),
      )
    } else {
      res.status(200).json([])
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.toString(), msg: 'Address has no domain resource' })
  }
}

export default queryDomain
