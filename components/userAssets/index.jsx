import React, { useState } from 'react'
import Link from 'next/link'
import ReactGA from 'react-ga'

import {
  Box,
  Text,
  Flex,
  List,
  ListItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
  IconButton,
  Badge,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { BsArrowUpRight, BsCheck, BsFileEarmarkPlus } from 'react-icons/bs'

import TokenLogo from '../tokenLogo'
import { setTransferModalConf } from '../../stores/transferModal'
import { changeDefault, removeDefault, initTokenVault } from '/api'
import { toast } from '/utils'

const Comp = ({ domains = [], bals = {}, show = [], cb }) => {
  const { t } = useTranslation()

  const domainNum = domains.length
  const vaultKeys = Object.keys(bals)

  const [loading, setLoading] = useState(false)

  const [tokenLoading, setTokenLoading] = useState(false)

  const handleSetDefault = async (name, isRemove = false) => {
    let defaultName = ''
    domains.map((d) => {
      if (d.texts && d.texts.isDefault == 'true') {
        defaultName = d.name
        return
      }
    })

    try {
      setLoading(true)
      let res
      if (isRemove) {
        res = await removeDefault(defaultName, name)
      } else {
        res = await changeDefault(defaultName, name)
      }

      const { status = 0 } = res

      if (status === 4) {
        toast({
          title: isRemove
            ? t('remove.default.success')
            : t('set.success', { type: t('default.name') }),
          status: 'success',
        })
        ReactGA.event({
          category: 'changeDefaultName',
          action: isRemove
            ? `Remove default of ${name} success`
            : defaultName.length > 0
            ? `Set default name to ${name} success`
            : `Change default name ${defaultName} to ${name} success`,
        })
      } else {
        toast({
          title: isRemove
            ? t('remove.default.error')
            : t('set.error', { type: t('default.name') }),
          status: 'error',
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: isRemove
          ? t('remove.default.error')
          : t('set.error', { type: t('default.name') }),
        status: 'error',
      })
      ReactGA.event({
        category: 'changeDefaultName',
        action: isRemove
          ? `Remove default of ${name} failed`
          : defaultName.length > 0
          ? `Set default name to ${name} failed`
          : `Change default name ${defaultName} to ${name} failed`,
      })
      setLoading(false)
    }
    setLoading(false)
  }

  const handleInit = async (token) => {
    try {
      setTokenLoading(true)

      const res = await initTokenVault(token)

      const { status = 0 } = res
      if (status === 4) {
        toast({
          title: t('init.success'),
          status: 'success',
        })
        cb && cb()
      } else {
        toast({
          title: t('init.failed'),
          status: 'error',
        })
      }
    } catch (error) {
      setTokenLoading(false)
      toast({
        title: t('init.failed'),
        status: 'error',
      })
    }
    setTokenLoading(false)
  }

  return (
    <>
      <Accordion
        allowMultiple
        allowToggle
        variant="unstyle"
        defaultIndex={[0, 1]}
      >
        {vaultKeys.length > 1 && (
          <AccordionItem>
            <AccordionButton px={0}>
              <Box flex="1" textAlign="left">
                {t('other.tokens')}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <List spacing={2}>
                {vaultKeys.map((key, idx) => {
                  const bal = bals[key]

                  return (
                    <ListItem key={idx} fontWeight={500}>
                      <Flex justifyContent="space-between" alignItems="center">
                        <TokenLogo symbol={key} size={4} />
                        <Text
                          as="Flex"
                          fontStyle="italic"
                          fontWeight="bold"
                          alignItems="center"
                        >
                          {bal || '0.00000'}

                          {bal == null ? (
                            <Tooltip label={t('init.token', { token: key })}>
                              <IconButton
                                ml={2}
                                color="primary"
                                size="xs"
                                variant="ghost"
                                aria-label="Init token vault"
                                isLoading={tokenLoading}
                                onClick={() => {
                                  // setTransferModalConf({
                                  //   type: 'FT',
                                  //   token: key,
                                  //   isOpen: true,
                                  // })
                                  handleInit(key)
                                }}
                                icon={<BsFileEarmarkPlus />}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip
                              label={t('transfer.token', { token: key })}
                            >
                              <IconButton
                                ml={2}
                                color="primary"
                                size="xs"
                                variant="ghost"
                                isLoading={tokenLoading}
                                aria-label="Transfer you domain"
                                onClick={() => {
                                  setTransferModalConf({
                                    type: 'FT',
                                    token: key,
                                    isOpen: true,
                                  })
                                }}
                                icon={<BsArrowUpRight />}
                              />
                            </Tooltip>
                          )}
                        </Text>
                      </Flex>
                    </ListItem>
                  )
                })}
              </List>
            </AccordionPanel>
          </AccordionItem>
        )}

        {domainNum >= 1 && (
          <AccordionItem>
            <AccordionButton px={0}>
              <Flex flex="1">
                <Text>{t('owned.domains')}</Text>
                {/* <Text>{domainNum}</Text> */}
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0} maxh="500px" overflow="scroll">
              <List spacing={2}>
                {domains.map((domain, idx) => {
                  const { name, texts = {} } = domain
                  const { isDefault = false } = texts

                  return (
                    <ListItem key={idx} color="primary" fontWeight={500}>
                      <Flex justifyContent="space-between">
                        <Link href={`/domain/${name}`}>
                          <Text cursor="pointer" textDecoration="underline">
                            {name}
                          </Text>
                        </Link>
                        {isDefault ? (
                          <Tooltip hasArrow label={t('remove.default')}>
                            <Badge
                              py={0.5}
                              textTransform="inherit"
                              fontSize="12px"
                              colorScheme="purple"
                              cursor="pointer"
                              onClick={() => {
                                handleSetDefault(name, true)
                              }}
                            >
                              Default
                            </Badge>
                          </Tooltip>
                        ) : (
                          <Tooltip hasArrow label={t('set.default')}>
                            <IconButton
                              ml={2}
                              color="primary"
                              size="xs"
                              variant="ghost"
                              aria-label="Set to default"
                              isLoading={loading}
                              onClick={() => {
                                handleSetDefault(name)
                              }}
                              icon={<BsCheck />}
                            />
                          </Tooltip>
                        )}
                      </Flex>
                    </ListItem>
                  )
                })}
              </List>
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </>
  )
}

export default Comp
