import * as fcl from '@onflow/fcl'
import { String } from '@onflow/types'
import { namehash } from 'utils/hash'
import { validateDomain, fclinit } from 'utils'
import { buildAndExecScript } from '../../api/scripts'
import { cors } from 'utils/middleware'
// import { network } from '../../config/constants'
import { renderToString } from 'react-dom/server'
import { parse } from 'node-html-parser'
import sharp from 'sharp'

import { Template } from './_lib/template'

const fns = async (req, res) => {
  await cors(req, res)
  try {
    fclinit()
    const { domain = '', width = 400, height = 600, isSvg = false } = req.query
    if (!validateDomain(domain)) {
      res.status(404).json({ error: 'Can not find domain' })
      return
    }
    // let url =
    //   network === 'testnet'
    //     ? `https://testnet.flowns.org/api/data/domain/${domain}`
    //     : `https://www.flowns.org/api/data/domain/${domain}`
    // const { data } = await axios.get(url)g
    const domainNameHash = namehash(domain)
    const domainDetial = await buildAndExecScript('query_domain_page_info', [
      fcl.arg(domainNameHash, String),
    ])
    domainDetial.name = domain
    let htmlStringRoot = renderToString(Template(domainDetial, width, height))
    const svgString = parse(htmlStringRoot).querySelector('svg').toString()

    let str =
      '<?xml version="1.0"?>' +
      svgString.replace(
        '<svg ',
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" ',
      )

    if (isSvg) {
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml',
      })
      res.write(str)
      res.end()
    }

    const buffer = await sharp(Buffer.from(svgString)).png().toBuffer()

    // console.log(png, 'png')

    res.setHeader('Content-Type', `image/png`)
    res.setHeader(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
    )
    res.end(buffer)

    // res.statusCode = 200
    // res.setHeader('Content-Type', `image/${fileType}`)
    // res.setHeader(
    //   'Cache-Control',
    //   `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
    // )
    // res.end(buffer)
    // res.status(200).json({ msg: 'test' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.toString() })
  }
}

export default fns
