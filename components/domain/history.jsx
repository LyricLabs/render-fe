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
} from '@chakra-ui/react'
import Spinner from 'react-cli-spinners'
import { AiOutlineArrowsAlt, AiOutlineLink } from 'react-icons/ai'

import moment from 'moment'
import { useTranslation } from 'next-i18next'

import { setDetailModal } from '../../stores/detailModal'
import { timeformater } from '../../utils/index'
import { useDomainHistory } from '../../api/query'
import { ellipseAddress, ellipseStr } from '../../utils'
import { getExplorerTxUrl, oneYear } from '../../config/constants'

import graffleImg from './graffle.png'

export default function Comp(props) {
  const { t } = useTranslation()

  const { domain, styles } = props
  const { nameHash } = domain
  const { data = {}, isLoading } = useDomainHistory(nameHash)
  const { history = [] } = data
  const convertEventDatas = (datas = []) => {
    const records = datas.map((d) => {
      const { flowTransactionId, blockEventData, eventDate } = d
      const {
        chainType = -1,
        key = '',
        address = '',
        value = '',
        duration = 0,
        price,
        expiredAt = 0,
      } = blockEventData
      let type = ''
      let recordVal = ''
      if (chainType >= 0) {
        type = t('address.change')
        recordVal = address
      } else if (duration > 0) {
        type = t('domain.renew')
        recordVal = `${duration / oneYear}${t('year')}(₣ ${price.toFixed(2)})`
      } else if (expiredAt > 0) {
        type = t('domain.minted')
        let days = moment.duration(moment(expiredAt * 1000).diff(moment(eventDate))).asDays()
        recordVal = days > 1 ? days.toFixed(0) + ' ' + t('days') : t('less.day')
      } else {
        let keyStr = key
        if (key == 'flowns_custom') {
          keyStr = t('custom.key')
        }
        type = t('record.change', { key: keyStr })
        recordVal = value
      }
      return {
        type: type,
        date: timeformater(moment(eventDate).unix()),
        txid: flowTransactionId,
        value: recordVal,
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
    <Box px={[4, 8]}>
      {isLoading ? (
        <Center h='400px'>
          <Spinner type='dots' />
        </Center>
      ) : (
        <Box w='100%' {...styles}>
          <Table size={['xs', 'xs', 'xs', 'sm']} fontSize='10px' variant='simple' opacity={0.8}>
            <Thead>
              <Tr>
                <Th>{t('type')}</Th>
                <Th>{t('date')}</Th>
                <Th>{t('value')}</Th>
                <Th>{t('txid')}</Th>

                {/* <Th>{t('value')}</Th> */}
              </Tr>
            </Thead>
            <Tbody>
              {convertEventDatas(history).map((record, idx) => {
                const { type, date, txid, value } = record
                return (
                  <Tr key={idx}>
                    <Td>{type}</Td>
                    <Td>{date}</Td>
                    <Td>
                      {value.length > 15 ? (
                        <>
                          {value.substr(0, 15)}
                          <IconButton
                            p={1}
                            size='xs'
                            variant='unstyle'
                            as={AiOutlineArrowsAlt}
                            onClick={() => showTextDetail(value, type)}
                          />
                        </>
                      ) : (
                        value
                      )}
                    </Td>
                    <Td>
                      <Link isExternal href={getExplorerTxUrl() + txid}>
                        {ellipseAddress(txid)}
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
        mt={4}
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
