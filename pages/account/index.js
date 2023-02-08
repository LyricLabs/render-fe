import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ReactGA from 'react-ga'
import { useRouter } from 'next/router'

import Layout from '../../components/layouts/app'
import { gaCode } from '../../config/constants'
import accountStore from '../../stores/account'

export default function Home() {
  const router = useRouter()
  const { user } = accountStore.useState('user')

  useEffect(() => {
    ReactGA.initialize(gaCode)
    ReactGA.pageview(window.location.pathname)
  }, [])

  useEffect(() => {
    if (user.addr) {
      router.push(`/account/${user.addr}`)
    }
  }, [user, router])

  return <></>
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})
