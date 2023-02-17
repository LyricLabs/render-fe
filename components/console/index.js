import React, { useRef, useEffect } from 'react'
import * as fcl from '@onflow/fcl'
import { String } from '@onflow/types'
import { Box, useColorMode, useTheme } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import ReactGA from 'react-ga'
import { namehash, normalize } from '../../utils/hash'
import { rootNames, oneYear, isBrowser } from '../../config/constants'
import { getDomainLength, queryDomainAvailable } from '../../api'
import domainStore from '../../stores/domains'

export default function Console() {
  const theme = useTheme()
  const { colorMode } = useColorMode()
  const bgColor = colorMode === 'light' ? '#fbfbfb' : '#17233A'
  const textPrimary = colorMode === 'light' ? '#17233A' : '#fbfbfb'
  const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary

  const { t } = useTranslation('common')
  let progressTerminalRef = useRef()
  const { rootDomains } = domainStore.useState('rootDomains')
  // const [locking, setLocking] = useState(false)


  const queryDomain = async (rootName, args) => {
    const terminal = progressTerminalRef.current
    let name = args[0]
    let domainName = `${name}.${rootName}`
    ReactGA.event({
      category: `Query domain with ${rootName}`,
      action: `User query ${name}`,
    })
    try {
      name = normalize(name)
      const nameArr = name.split('.')
      if (nameArr.length > 1) {
        terminal.pushToStdout(`${name} - ${t('cmd.domain.name.invalid')}`)
      } else {
        const rootDomain = rootDomains[rootName]
        const { prices } = rootDomain
        const len = await getDomainLength(name)
        let price = prices[len]
        if (!price) {
          terminal.pushToStdout(`${domainName} - ${t('not.open')}`)
          return Promise.resolve(false)
        }
        const hashName = namehash(domainName)
        const res = await queryDomainAvailable(hashName)
        terminal.pushToStdout(
          `${domainName} - ${t(res ? 'available' : 'not.available')}  ${
            res ? ` ${t('price')}: ₣ ${(price * oneYear).toFixed(2)} ` : ``
          } - ${res ? renderLinks(domainName, res) : ''}`,
        )
      }
    } catch (error) {
      console.log(error)
      terminal.pushToStdout(`${domainName} ${t('cmd.domain.name.invalid')}`)
    }
  }

  const renderLinks = (name, available) => {
    const link = available ? `/search?fns=${name}` : ''
    name = `${t(available ? t('take') : t('view'))} ${name}`
    return `<a style="color:${theme.colors.secondary}; font-style:italic; text-decoration: underline; font-weight: 900; " href='${link}'><<span>${name}</span>></a>`
  }

  const commands = {
    f: {
      description: t('cmd.domain.query.desc'),
      usage: 'f <name>',
      fn: async (...args) => {
        const terminal = progressTerminalRef.current
        let name = args[0]
        ReactGA.event({
          category: `Query domain with f`,
          action: `User query ${name}`,
        })
        try {
          name = normalize(name)
          const nameArr = name.split('.')
          if (nameArr.length > 2) {
            terminal.pushToStdout(`${name} - ${t('cmd.domain.name.invalid')}`)
          } else if (nameArr.length === 1) {
            // const reqArr = []
            const names = []
            const fees = []
            const len = await getDomainLength(name)

            const reqArr = ['fn'].map((root) => {
              const rootDomain = rootDomains[root]
              const { prices } = rootDomain
              const domainName = `${name}.${root}`
              names.push(domainName)
              let price = prices[len]
              if (!price) {
                return Promise.resolve(null)
              }
              fees.push(parseFloat(price))
              const hashName = namehash(domainName)

              return queryDomainAvailable(hashName)
            })

            const resArr = await Promise.all(reqArr)

            resArr.map((res, idx) => {
              terminal.pushToStdout(
                `${names[idx]} - ${t(
                  res == null ? 'not.open' : res ? 'available' : 'not.available',
                )} ${res ? ` Price: ₣ ${(fees[idx] * oneYear).toFixed(2)}` : ``} ${
                  res ? `- ${renderLinks(names[idx], res)}` : ''
                }`,
              )
            })
            return
          } else if (nameArr.length === 2 && rootNames.indexOf(nameArr[1]) >= 0) {
            const rootDomain = rootDomains[nameArr[1]] || {}
            const { prices = {} } = rootDomain
            const len = await getDomainLength(nameArr[0])
            let price = prices[len]
            if (!price) {
              terminal.pushToStdout(`${name} - domain ${t('not.open')}`)
              return
            }
            const res = await queryDomainAvailable(namehash(name))
            terminal.pushToStdout(
              `${name} - domain ${t(res ? 'available' : 'not.available')} ${
                res ? ` Price: ₣ ${price * oneYear} - ${renderLinks(name, res)} ` : ``
              } - ${res ? renderLinks(name, res) : ''}`,
            )
          } else {
            // console.log(nameArr.length === 2 && rootNames.indexOf(nameArr[1] >= 0))
            terminal.pushToStdout(`${t('root.not.exist', { name: nameArr[1] })}`)
          }
        } catch (error) {
          console.log(error)
          terminal.pushToStdout(`${name} ${t('cmd.domain.name.invalid')}`)
        }
      },
    },
    // nft: {
    //   description: t('cmd.domain.query.nft'),
    //   usage: 'nft <name>',
    //   fn: async (...args) => {
    //     await queryDomain('nft', args)
    //   },
    // },
    fn: {
      description: t('cmd.domain.query.flow'),
      usage: 'fn <name>',
      fn: async (...args) => {
        await queryDomain('fn', args)
      },
    },
  }

  return (
    <Box
      w='100%'
      h={['240px', '240px', 'calc(100vh - 730px)']}
      border='1px dashed'
      borderColor='rgb(0, 224, 117, 0.4)'
      p={4}
    >
    
    </Box>
  )
}
