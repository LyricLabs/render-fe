import * as fcl from '@onflow/fcl'
import { String } from '@onflow/types'

import { fclinit, getQuery, putReq, postReq, validateEmail, validateUrl } from 'utils'
import { buildAndExecScript } from 'api/scripts'
import { improvmxKey, improvmxUrl, cfEmail, cfAPIKey, cfZoneId } from 'config/constants'

const textChangedEventHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ msg: 'Only POST requests allowed' })
    return
  }
  try {
    fclinit()

    if (!req.body) {
      res.status(400).send({ msg: 'Request invalid' })
      return
    }

    let body = req.body || {}
    if (typeof body == 'string') {
      body = JSON.parse(body)
    }
    const { blockEventData = null } = body
    if (blockEventData && blockEventData.nameHash && blockEventData.key == 'profile') {
      const domainDetial = await buildAndExecScript('query_domain_info', [
        fcl.arg(blockEventData.nameHash, String),
      ])

      if (domainDetial) {
        const { texts = {}, name } = domainDetial
        let profile = texts['profile'] || '{}'
        profile = JSON.parse(profile) || {}

        const { email } = profile

        if (email && validateEmail(email)) {
          // query improvmx record
          const nameArr = name.split('.')
          const subName = nameArr[0]
          const queryRes = await getQuery(`${improvmxUrl}/${subName}`, undefined, {
            Authorization: `Basic api:${improvmxKey}`,
          })
          const { success } = queryRes
          if (success == true) {
            const putRes = await putReq(
              `${improvmxUrl}/${subName}`,
              { forward: email },
              { Authorization: `Basic api:${improvmxKey}` },
            )
            if (putRes.success) {
              res.status(200).json(putRes)
              return
            } else {
              res.status(500).json(putRes)
            }
          } else {
            // add new alias
            const postRes = await postReq(
              `${improvmxUrl}/`,
              { forward: email, alias: subName },
              { Authorization: `Basic api:${improvmxKey}` },
            )
            if (postRes.success) {
              res.status(200).json(postRes)
              return
            } else {
              res.status(500).json(postRes)
              return
            }
          }
        }

        res.status(200).json(domainDetial)
        return
      } else {
        res.status(200).json({})
        return
      }
    } else if (blockEventData && blockEventData.nameHash && blockEventData.key == 'flowns_custom') {
      const domainDetial = await buildAndExecScript('query_domain_info', [
        fcl.arg(blockEventData.nameHash, String),
      ])

      if (domainDetial) {
        const { texts = {}, name } = domainDetial
        let custom = texts['flowns_custom'] || '{}'
        custom = JSON.parse(custom) || {}

        const { redirection = '' } = custom

        if (validateUrl(redirection)) {
          const cf = require('cloudflare')({
            email: cfEmail,
            key: cfAPIKey,
          })

          const response = await cf.dnsRecords.browse(cfZoneId)
          const { result: records } = response
          console.log(records)
          const recordName = `${name}.pub`
          let record = null
          records.map((rec) => {
            if (rec.name === recordName) {
              record = rec
              return
            }
          })

          if (!record) {
            const response = await cf.dnsRecords.add(cfZoneId, {
              type: 'CNAME',
              name: recordName,
              content: 'cname.vercel-dns.com',
              ttl: 3600,
              proxied: true,
            })

            console.log(response)
            if (response.success) {
              res.status(200).send({ msg: 'DNS record add success' })
              return
            }
          } else {
            res.status(200).send({ msg: 'Already config', record })
            console.log('Already config')
            return
          }
        }
      }

      res.status(200).send({ msg: 'DNS add failed' })

      return
    } else {
      res.status(200).send({ msg: 'Event data invalid' })
      console.log('Event data invalid')
      return
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.toString(), msg: 'domain not exsit' })
  }
}

export default textChangedEventHandler
