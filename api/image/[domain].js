import * as fcl from '@onflow/fcl'
import { String } from '@onflow/types'

import html2image from '../../../../html2image'
import generateFnsHtml from 'utils/generateFnsHtml'
import { namehash } from 'utils/hash'
import { validateDomain, fclinit } from 'utils'
import { buildAndExecScript } from 'api/scripts'
import { cors } from 'utils/middleware'

const getImage = async (req, res) => {
  await cors(req, res)
  try {
    fclinit()
    const { domain = '', width = 400, height = 600 } = req.query
    if (!validateDomain(domain)) {
      res.status(404).json({ error: 'Can not find domain' })
      return
    }

    const domainNameHash = namehash(domain)
    const domainDetial = await buildAndExecScript('query_domain_info', [
      fcl.arg(domainNameHash, String),
    ])
    const html = await generateFnsHtml(domain, domainDetial, { width, height })

    const buffer = await html2image(html)
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
    })
    res.end(buffer, 'binary')
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.toString() })
  }
}

export default getImage
