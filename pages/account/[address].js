import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ReactGA from 'react-ga'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Box, Text, Flex, Divider, Button, Stack } from '@chakra-ui/react'

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
      <Stack h="100%" mt="50%" spacing={4}>
        <Text textAlign="center" textStyle="label">
          {t('no.domain')}
        </Text>{' '}
        &nbsp;&nbsp;
        <Button
          h="48px"
          borderRadius="full"
          px={6}
          colorScheme="purple"
          onClick={() => {
            window.open('https://flowns.org/search')
          }}
        >
          Register
        </Button>
      </Stack>
    )
  }
  return (
    <>
      {isLoading ? (
        <LoadingPanel />
      ) : (
        <Box px={{ md: '5%', base: '15%', lg: '8%', xl: '16%' }} mt="60px">
          <Box mb={4}>
            <Text fontSize="32px" fontWeight={600}>
              {defaultDomain ? defaultDomain : user.addr}
            </Text>
            <Text fontSize="16px" fontWeight={400} color="textSecondary">
              {defaultDomain ? user.addr : ''}
            </Text>
          </Box>
          <Divider my={8} />
          {hasDomain ? (
            <DomainList domains={domains} defaultDomain={defaultDomain} />
          ) : (
            <EmptyList h="100%" tip={renderTip()} />
          )}
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
