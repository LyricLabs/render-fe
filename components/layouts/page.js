import Head from 'next/head'
import { Container, Divider, Text, Box, useMediaQuery } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { fclinit } from '../../utils'

import Header from '../../components/homePage/header'
import { camelize } from '../../utils'

export default function Layout({ children }) {
  fclinit()
  const router = useRouter()
  const { pathname } = router
  const path = pathname.slice(1)
  const [isPC = true] = useMediaQuery('(min-width: 48em)')

  return (
    <>
      <Head>
        <title>Render</title>
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
          <Box py={[5, 5, 10]} pr={18}>
            <Text textStyle='normal'>
              {'//'} {path === 'faq' ? 'FAQ' : camelize(path)}
            </Text>
          </Box>
          <Box>{children}</Box>
        </Container>
      </main>
    </>
  )
}
