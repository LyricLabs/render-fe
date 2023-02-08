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

import graffleImg from './graffle.png'

export default function Datas(props) {
  const { t } = useTranslation()
  const { data = {}, isLoading } = useRegisterHistory('fn')
  const { history = [] } = data
  const [isPC = true] = useMediaQuery('(min-width: 48em)')

  const convertEventDatas = (datas = []) => {
    const records = datas.map((d) => {
      const { flowTransactionId, blockEventData, eventDate } = d
      const {
        id = -1,
        name = '',
        receiver = '',
        parentName,
        expiredAt = 0,
        nameHash,
      } = blockEventData

      return {
        days: moment
          .duration(moment(expiredAt * 1000).diff(moment(eventDate)))
          .asDays()
          .toFixed(0),
        date: timeformater(moment(eventDate).unix()),
        txid: flowTransactionId,
        parentName: parentName,
        owner: receiver,
        name,
        id,
        origin: d,
      }
    })
    return records
  }

  const showTextDetail = (value, title) => {
    setDetailModal({
      value,
      title,
      isOpen: true,
    })
  }

  return (
    <Box h='calc(100vh - 280px)' px={[4, 8]}>
      {isLoading ? (
        <Center h='400px'>
          <Spinner type='dots' />
        </Center>
      ) : (
        <Box mt={isPC ? '-70px' : '0px'} w='100%' h='calc(100vh - 230px)' overflow='scroll'>
          <Table size={['xs', 'xs', 'sm', 'sm']} fontSize='10px' variant='striped' opacity={0.8}>
            <Thead>
              <Tr>
                {isPC && <Th>{t('id')}</Th>}
                <Th>{t('name')}</Th>
                {isPC && <Th>{t('days')}</Th>}
                <Th>{t('owner')}</Th>
                {isPC && <Th>{t('date')}</Th>}
                <Th>{t('txid')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {convertEventDatas(history).map((record, idx) => {
                const { id, date, txid, owner, name, days, parentName } = record
                return (
                  <Tr key={idx}>
                    {isPC && <Td>{id}</Td>}
                    <Td>
                      <Link href={`domain/${name}.${parentName}`}>{`${
                        name.length >= 16 ? ellipseAddress(name, 2) : name
                      }.${parentName}`}</Link>
                    </Td>
                    {isPC && <Td>{days}</Td>}
                    <Td>
                      <Link href={`account/${owner}`}>{isPC ? owner : ellipseAddress(owner)}</Link>
                    </Td>
                    {isPC && <Td>{date}</Td>}
                    <Td>
                      <Link isExternal href={getExplorerTxUrl() + txid}>
                        {ellipseAddress(txid, isPC ? 5 : 3)}
                        <IconButton
                          p={1}
                          size='xs'
                          variant='unstyle'
                          as={AiOutlineLink}
                          onClick={() => {}}
                        />
                      </Link>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>
      )}
      <Flex
        mt={6}
        justifyContent='center'
        cursor='pointer'
        onClick={() => {
          window.open('https://docs.graffle.io/', '_blank')
        }}
      >
        <Text
          textDecoration='underline'
          fontStyle='italic'
          textStyle='desc'
          fontSize='16px'
          fontWeight={500}
        >
          {t('graffle.tips')}
        </Text>
        <Image ml={2} w='20px' h='20px' src={graffleImg.src} />
      </Flex>
    </Box>
  )
}

Datas.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})
