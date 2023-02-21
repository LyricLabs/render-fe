import Head from 'next/head'
import { useState } from 'react'
import { Container, Divider, Box, useMediaQuery } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { fclinit } from '../../utils'
import Header from '../../components/header'
import { useUserCollection } from '../../api/query'
import accountStore from '../../stores/account'
import TransferModal from '../../components/transferModal'
import DetailModal from '../../components/detailModal'

export default function Layout({ children }) {
  fclinit()
  const { t } = useTranslation()
  const router = useRouter()
  // const { pathname } = router
  const { user = {} } = accountStore.useState('user')
  const { addr = '' } = user

  const { refetch } = useUserCollection(addr, true)
  let pathname = router.pathname
  const pathArr = pathname.split('/')
  
  const [isPC = true] = useMediaQuery('(min-width: 48em)')
  let className = 'none'

  if (pathname == '/') {
    className = 'home'
  }

  if (pathArr.indexOf('account') > 0) {
    className = 'grid'
  }

  const renderChildren = () => {
    return <Box>{children}</Box>
  }

  return (
    <>
      <Head>
        <title>Flowns</title>
      </Head>
      <main>
        <Header />
        <Container
          w="100%"
          h="calc(100vh - 81px)"
          maxW="1440px"
          overflow="scroll"
          className={className}
        >
          {renderChildren()}
        </Container>
        <TransferModal cb={refetch} />
        <DetailModal />
      </main>
    </>
  )
}
