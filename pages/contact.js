import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import ReactGA from 'react-ga'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Box, SimpleGrid, Text, Stack, useTheme } from '@chakra-ui/react'
import Layout from '../components/layouts/page'
import Subscriber from '../components/subscriber'
import { gaCode } from '../config/constants'

export default function Stats() {

  useEffect(() => {
    ReactGA.initialize(gaCode)
    ReactGA.pageview(window.location.pathname)
  }, [])

  const onSub = (input) => {
    ReactGA.event({
      category: `Subscribe`,
      action: `User subscribe with ${input}`,
    });
  }

  return (
    <>
      <Box>
        <Subscriber onSub={onSub} />
      </Box>
    </>
  )
}

Stats.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})
