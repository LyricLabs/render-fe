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

import moment from 'moment'
import { useTranslation } from 'next-i18next'
import Layout from '../../components/layouts/appBase'

import { setDetailModal } from '../../stores/detailModal'
import { timeformater } from '../../utils/index'
import { useRegisterHistory } from '../../api/query'
import { ellipseAddress, ellipseStr } from '../../utils'
import { getExplorerTxUrl, oneYear } from '../../config/constants'

export default function Doodles(props) {
  const { t } = useTranslation()
  const { data = {}, isLoading } = useRegisterHistory('fn')
  const { history = [] } = data
  const [isPC = true] = useMediaQuery('(min-width: 48em)')

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
