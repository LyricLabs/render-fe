import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next'
import {
  Box,
  Text,
  Stack,
  SimpleGrid,
  Center,
  useColorMode,
  useTheme,
  useMediaQuery,
  useBoolean,
} from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ReactGA from 'react-ga'
import { useRouter } from 'next/router'
import { useSignMessage, useAccount } from 'wagmi'

import { useDomainInfo } from '../../../api/query'
import { validateDomain, fclinit, toast } from '../../../utils'

import Layout from '../../../components/layouts/appBase'
import { gaCode, flownsAppUrl, hostSuffix } from '../../../config/constants'
import Empty from '../../../components/empty'
import DommainItem from '../../../components/domain/item'
import DoodlesPanel from '../../../components/doodles/panel'
import LoadingPanel from '../../../components/loadingPanel'
import SetInfoModal from '../../../components/setInfoModal'
import RenewModal from '../../../components/renewModal'
import Connector from '../../../components/ethConnector'
import Binder from '../../../components/ethConnector/binder'
// const Binder = dynamic(() => import('components/ethConnector/binder'), {
//   ssr: false,
// })
// const Connector = dynamic(() => import('components/ethConnector'), {
//   ssr: false,
// })
import accountStore from '../../../stores/account'

export default function Home() {
  const router = useRouter()
  const { t } = useTranslation()
  const [isPC = true] = useMediaQuery('(min-width: 48em)')
  const { domain } = router.query
  const { address, isConnected } = useAccount()

  const { colorMode } = useColorMode()
  const theme = useTheme()
  const primary =
    colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary

  useEffect(() => {
    ReactGA.initialize(gaCode)
    ReactGA.pageview(window.location.pathname)
  }, [])

  fclinit()

  const { data = {}, isLoading, refetch } = useDomainInfo(domain)

  const { domainInfo = undefined, defaultDomain = '' } = data

  const { owner = '', texts = {}, name, nameHash } = domainInfo || {}

  const { user } = accountStore.useState('user')

  const ethSignStr = texts['_ethSig'] || '{}'

  const ethSignInfo = JSON.parse(ethSignStr)

  const ethAddr = ethSignInfo.ethAddr

  const isOwner = user.addr === owner

  console.log(ethAddr, 'ethAddr')

  if (domain === undefined) {
    return ''
  }

  if (domain && !validateDomain(domain) && !isLoading) {
    return <Empty tip={t('domain.invalid')} />
  }

  if (domainInfo == null && !isLoading) {
    return (
      <Empty
        tip={
          <Center h="100%">
            <Text>{t('domain.not.exist')}</Text>
          </Center>
        }
      />
    )
  }

  // const handleRefresh = async () => {
  //   setLoading(true)
  //   await refetch()

  //   setTimeout(() => {
  //     setLoading(false)
  //     toast({
  //       title: t('refresh.success'),
  //       position: 'bottom',
  //     })
  //   }, 2000)
  // }

  // const setToggle = (type) => {
  //   if (type == 'history') {
  //     beamShow && setBeam.toggle()
  //     setHistory.toggle()
  //   } else if (type == 'beam') {
  //     historyShow && setHistory.toggle()
  //     setBeam.toggle()
  //   }
  // }

  // const dashBtnStyle = {
  //   border: '1px',
  //   borderStyle: 'dashed',
  //   borderColor: primary,
  // }

  return (
    <>
      {isLoading ? (
        <LoadingPanel />
      ) : (
        <SimpleGrid w="100%" h="100%" columns={[1, 1, 1]}>
          <Stack>
            {/* <Center mb={2}>
              <ButtonGroup size="lg" isAttached variant="outline" opacity={0.8}>
                <Tooltip label={t('gift.domain')} hasArrow>
                  <IconButton
                    {...dashBtnStyle}
                    borderRight="none"
                    aria-label="Transfer you domain"
                    disabled={!isOwner}
                    onClick={() => {
                      setTransferModalConf({
                        type: 'Domains',
                        token: domainInfo.name,
                        isOpen: true,
                      })
                    }}
                    icon={<AiOutlineGift />}
                  />
                </Tooltip>
                <Tooltip label={t('refetch.data')} hasArrow>
                  <IconButton
                    {...dashBtnStyle}
                    borderRight="none"
                    isDisabled={loading}
                    aria-label="Refresh domain"
                    onClick={handleRefresh}
                    icon={<HiOutlineRefresh />}
                  />
                </Tooltip>
                <Tooltip
                  label={t(historyShow ? 'show.domain' : 'show.history')}
                  hasArrow
                >
                  <IconButton
                    {...dashBtnStyle}
                    borderRight="none"
                    aria-label="Show history"
                    onClick={() => setToggle('history')}
                    icon={historyShow ? <BiUndo /> : <AiOutlineHistory />}
                  />
                </Tooltip>
                <Tooltip
                  label={t(beamShow ? 'show.domain' : 'show.beam')}
                  hasArrow
                >
                  <IconButton
                    {...dashBtnStyle}
                    borderRight="none"
                    aria-label="Show Beam"
                    onClick={() => setToggle('beam')}
                    icon={beamShow ? <BiUndo /> : <BiFace />}
                  />
                </Tooltip>
                <SharePop
                  btnStyle={dashBtnStyle}
                  baseUrl={`${flownsAppUrl}${router.asPath}`}
                  content={() => {
                    const domainName = router.query?.domain.split('.')[0]
                    const suffixStr = `https://${domainName}.${hostSuffix}`
                    return `${flownsAppUrl}${router.asPath} ${t(
                      'share.content',
                    )} ${suffixStr}`
                  }}
                >
                  <Tooltip label={t('share')} hasArrow>
                    <IconButton
                      {...dashBtnStyle}
                      aria-label="Share your domain page"
                      icon={<AiOutlineShareAlt />}
                    />
                  </Tooltip>
                </SharePop>
              </ButtonGroup>
            </Center> */}
            <>
              {/* {historyShow ? (
                <DomainHistory
                  domain={domainInfo}
                  styles={{
                    minH: ['40px', '400px'],
                    maxH: '400px',
                    overflow: 'scroll',
                  }}
                />
              ) : beamShow ? (
                <DomainBeamAvatar
                  isOwner={isOwner}
                  domain={domainInfo}
                  // styles={{ minH: ['40px', '400px'], maxH: '400px', overflow: 'scroll' }}
                  cb={refetch}
                />
              ) : ( */}
              <Center minH="400px" maxH="400px">
                <DommainItem
                  isDetail={true}
                  domain={domainInfo}
                  defaultDomain={defaultDomain}
                />
                <Box h="100%"></Box>
              </Center>
              {/* )} */}
            </>
          </Stack>

          {/* <Stack mt={[5, 5, 0]} w="100%" h="100%" spacing={4}>
            {isPC && (
              <Center h="48px">
                <Text fontSize="38px" fontWeight={500}>
                  {domainInfo.name}
                </Text>
              </Center>
            )}
            <Box p={2} border="1px dashed rgba(0, 224, 117, 0.5)">
              <DomainInfo
                domain={domainInfo}
                styles={{ opacity: '0.8' }}
                defaultDomain={defaultDomain}
              />
            </Box>
            <Box p={2}>
              <DomainTabPanel domain={domainInfo} isOwner={isOwner} />
            </Box>
          </Stack> */}
          {ethAddr ? (
            <>
              <DoodlesPanel domainInfo={domainInfo} />
            </>
          ) : (
            <>
              <Center py={10}>
                <Connector />
              </Center>
              {address && isConnected && (
                <Binder
                  w="20%"
                  flowAddr={user.addr}
                  domainName={name}
                  nameHash={nameHash}
                />
              )}
            </>
          )}
          <Box></Box>
          <SetInfoModal domain={domainInfo} cb={refetch} />
          <RenewModal domain={domainInfo} cb={refetch} />
        </SimpleGrid>
      )}
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export const getStaticProps = async ({ locale }) => {
  try {
    const res = await serverSideTranslations(locale, ['common'])

    return {
      props: {
        ...res,
      },
    }
  } catch (error) {
    console.log(error)
    return {
      props: {},
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}
