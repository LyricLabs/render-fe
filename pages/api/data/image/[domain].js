import * as fcl from '@onflow/fcl'
import { String } from '@onflow/types'
import { namehash } from 'utils/hash'

import { validateDomain, fclinit } from 'utils'
import { buildAndExecScript } from 'api/scripts'
import { cors } from 'utils/middleware'
import { renderToStaticMarkup } from 'react-dom/server'
import { Template } from '../../_lib/template'

const domainImg = async (req, res) => {
  await cors(req, res)

  try {
    fclinit()
    const { domain = '', fileType = 'svg+xml' } = req.query
    if (!validateDomain(domain)) {
      res.status(404).json({ error: 'Can not find domain' })
      return
    }

    const domainNameHash = namehash(domain)
    const domainDetial = await buildAndExecScript('query_domain_page_info', [
      fcl.arg(domainNameHash, String),
    ])
    domainDetial.name = domain
    const svg = renderToStaticMarkup(Template(domainDetial))
    res.writeHead(200, {
      'Content-Type': `image/${fileType}`,
      'Content-Length': svg.length,
    })
    res.end(svg, 'binary')
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.toString(), msg: 'domain not exsit' })
  }
}

export default domainImg
