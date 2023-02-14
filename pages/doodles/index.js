import {
  Text,
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
  Link,
  IconButton,
  Image,
  useMediaQuery,
} from '@chakra-ui/react'
import Spinner from 'react-cli-spinners'
import { AiOutlineArrowsAlt, AiOutlineLink } from 'react-icons/ai'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'

import { useTranslation } from 'next-i18next'
import Layout from '../../components/layouts/app'

import { useRegisterHistory } from '../../api/query'
import accountStore from '../../stores/account'
import { useEffect } from 'react'

export default function Doodles(props) {
  const { t } = useTranslation()
  const { data = {}, isLoading } = useRegisterHistory('fn')
  const { history = [] } = data
  const [isPC = true] = useMediaQuery('(min-width: 48em)')
  const router = useRouter()

  const { user, defaultDomain = null } = accountStore.useState(
    'user',
    'defaultDomain',
  )

  useEffect(() => {
    if (defaultDomain) {
      // router.push(`/account/${user.addr}`)
      router.push(`/doodles/${defaultDomain}`)
    }
  }, [defaultDomain])

  return <Box h="calc(100vh - 280px)" px={[4, 8]}></Box>
}

Doodles.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})
