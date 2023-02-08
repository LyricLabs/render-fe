import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Box, Text, Stack, SimpleGrid, Center } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ReactGA from 'react-ga'
import { useRouter } from 'next/router'

import { useDomainInfo } from '../../api/query'
import { validateDomain, fclinit } from '../../utils'

import Layout from '../../components/layouts/appBase'
import { gaCode } from '../../config/constants'
import Empty from '../../components/empty'
import DommainItem from '../../components/domain/item'
import DomainInfo from '../../components/domainInfo'
import DomainTabPanel from '../../components/domainTabPanel'
import LoadingPanel from '../../components/loadingPanel'
import SetInfoModal from '../../components/setInfoModal'
import RenewModal from '../../components/renewModal'
import accountStore from '../../stores/account'

export default function Home() {
  const router = useRouter()
  const { t } = useTranslation()
  const { domain } = router.query

  useEffect(() => {
    ReactGA.initialize(gaCode)
    ReactGA.pageview(window.location.pathname)
  }, [])

  fclinit()

  const { data = {}, isLoading, refetch } = useDomainInfo(domain)

  const { domainInfo = undefined } = data

  const { owner = '' } = domainInfo || {}

  const { user } = accountStore.useState('user')

  const isOwner = user.addr === owner

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
          <Center h='100%'>
            <Text>{t('domain.not.exist')}</Text>
            {/* <Box>
              {t('take')}
              <Link href={`/search/${domain}`} passHref>
                <Text cursor='pointer' textColor='secondary' textDecoration='underline'>
                  {domain}
                </Text>
              </Link>
            </Box> */}
          </Center>
        }
      />
    )
  }

  return (
    <>
      {isLoading ? (
        <LoadingPanel />
      ) : (
        <SimpleGrid w='100%' h='100%' columns={[1, 1, 2]}>
          <Center minH='400px' maxH='400px'>
            <DommainItem domain={domainInfo} />
            <Box h='100%'></Box>
          </Center>
          <Stack mt={[5, 5, 0]} w='100%' h='100%' spacing={4}>
            <Box p={2} border='1px dashed rgba(0, 224, 117, 0.5)'>
              <DomainInfo domain={domainInfo} styles={{ opacity: '0.8' }} />
            </Box>
            <Box p={2}>
              <DomainTabPanel domain={domainInfo} isOwner={isOwner} />
            </Box>
          </Stack>
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
