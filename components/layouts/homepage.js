import Head from 'next/head'
import {
  Container,
  Divider,
  Box,
  Flex,
  Text,
  Center,
  useMediaQuery,
  useColorMode,
  useTheme,
  Alert,
  AlertIcon,
  Link,
} from '@chakra-ui/react'
import { fclinit } from '../../utils'
import Header from '../../components/homePage/header'
import Footer from '../../components/homePage/footer'
import Links from '../linkList'
import { partners } from '../../config/constants'
import { useTranslation } from 'next-i18next'

export default function Layout({ children }) {
  fclinit()
  const { t } = useTranslation()
  const [isPC = true] = useMediaQuery('(min-width: 48em)')
  const { colorMode } = useColorMode()
  const theme = useTheme()
  const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary

  return (
    <>
      <Head>
        <title>Flowns</title>
      </Head>
      <main>
        <Container w='100%' maxW='1440px' maxH='1600px'>
          <Header />
          <Divider
            h='1px'
            pos='absolute'
            top={['98px', '98px', '144px']}
            left='0'
            w='100vw'
            border='1px solid'
            opacity='0.12'
          />
          {children}
          <Divider
            h='1px'
            pos='absolute'
            bottom='256'
            left='0'
            w='100vw'
            border='1px solid'
            opacity='0.12'
          />
          <Footer />
        </Container>
        {/* <Center pos='fixed' bottom={0} w='100%' h='48px' bgColor={primary}>
          <Flex w='100%' p={2} alignItems='center' overflowX='scroll'>
            <Text as='div' minW='80px' textStyle='label' textColor='textPrimary' opacity='1'>
              {t('partners')}:
            </Text>
          </Flex>
        </Center> */}
      </main>
    </>
  )
}
