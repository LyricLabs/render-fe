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

  const { refetch } = useUserCollection(addr)

  // const path = pathname.slice(1)
  const [isPC = true] = useMediaQuery('(min-width: 48em)')

  const renderChildren = () => {
    return <Box>{children}</Box>
  }

  return (
    <>
      <Head>
        <title>Flowns</title>
      </Head>
      <main>
        <Container w='100%' h='100%' maxW='1440px'>
          <Header />
          {isPC && (
            <Divider
              h='1px'
              pos='absolute'
              top='144'
              left='0'
              w='100vw'
              border='1px solid'
              opacity='0.12'
            />
          )}
          <Box py={[2, 2, 3]} pr={18}></Box>
          {renderChildren()}
        </Container>
        <TransferModal cb={refetch}/>
        <DetailModal />
      </main>
    </>
  )
}
