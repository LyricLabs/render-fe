import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ReactGA from 'react-ga'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Box, Text, Flex } from '@chakra-ui/react'

import Layout from '../../components/layouts/appBase'
import { gaCode } from '../../config/constants'
import { useUserCollection } from '../../api/query'
import accountStore from '../../stores/account'

import LoadingPanel from '../../components/loadingPanel'
import EmptyList from '../../components/empty'
import DomainList from '../../components/domains'

export default function Home() {
  const router = useRouter()
  const { t } = useTranslation()
  const { address = '' } = router.query
  const { user } = accountStore.useState('user')
  const isUser = user.addr === address
  const { data = {}, isLoading } = useUserCollection(address)
  const { domains = [], flowBalance = 0, defaultDomain } = data

  const hasDomain = domains.length > 0
  useEffect(() => {
    ReactGA.initialize(gaCode)
    ReactGA.pageview(window.location.pathname)
  }, [])

  const renderTip = () => {
    return (
      <Flex>
        <Text textStyle='label'>{t('empty.domain')}</Text> &nbsp;&nbsp;
        {isUser ? (
          <Link href={`/search`} passHref>
            <Text color='secondary' cursor='pointer' textStyle='link'>
              {t('take.one')}
            </Text>
          </Link>
        ) : (
          ''
        )}
      </Flex>
    )
  }
  return (
    <>
      {isLoading ? (
        <LoadingPanel />
      ) : (
        <Box>
          {isUser && <Flex px={8} justifyContent='flex-end' alignItems='center' mb={2} fontStyle='italic'>
            <Link href={`/batch/renew`} passHref mr={4}>
              <Text textColor='primary' textDecor='underline' cursor='pointer' textStyle='link'>
                {t('batch.renew')}
              </Text>
            </Link>
            &nbsp; &nbsp;
            {/* <Link href={`/batch/register`} passHref>
              <Text textColor='primary' textDecor='underline' cursor='pointer' textStyle='link'>
                {t('batch.register')}
              </Text>
            </Link> */}
          </Flex>}
          {hasDomain ? <DomainList domains={domains} defaultDomain={defaultDomain}  /> : <EmptyList tip={renderTip()} />}
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
