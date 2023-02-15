import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next'
import {
  Box,
  Text,
  Stack,
  Grid,
  GridItem,
  Center,
  useColorMode,
  useTheme,
  useMediaQuery,
  Divider,
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
        <Box px={{ md: '5%', lg: '8%', xl: '16%' }}>
          <Box mb={4}>
            <Text fontSize="32px" fontWeight={600}>
              {defaultDomain ? defaultDomain : user.addr}
            </Text>
            <Text fontSize="16px" fontWeight={400} color="textSecondary">
              {defaultDomain ? user.addr : ''}
            </Text>
          </Box>
          <Divider my={4} />
          <Grid
            pt={8}
            w="100%"
            h="100%"
            gap={4}
            templateRows="repeat(1, 1fr)"
            templateColumns={{ md: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
          >
            <GridItem>
              <Center>
                <Box width="300px">
                  <DommainItem
                    isDetail={true}
                    domain={domainInfo}
                    defaultDomain={defaultDomain}
                  />
                </Box>
              </Center>
            </GridItem>

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
            <GridItem colSpan={{ sm: 1, lg: 2 }}>
              {ethAddr ? (
                <>
                  <DoodlesPanel domainInfo={domainInfo} />
                </>
              ) : (
                <>
                  <Center py={10}>
                    <Stack spacing={4}>
                      <Connector />
                      {address && isConnected && (
                        <Binder
                          w="20%"
                          flowAddr={user.addr}
                          domainName={name}
                          nameHash={nameHash}
                        />
                      )}
                    </Stack>
                  </Center>
                </>
              )}
            </GridItem>
          </Grid>
        </Box>
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
