import { useTranslation } from 'next-i18next'
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Tooltip,
  Link,
  Icon,
} from '@chakra-ui/react'
import ReactGA from 'react-ga'

import { BsFillAlarmFill } from 'react-icons/bs'
import { AiOutlineLink } from 'react-icons/ai'

import accountStore from '../../stores/account'
import { timeformater, ellipseAddress } from '../../utils'
import { setRenewerPanelStatus } from '../../stores/modal'

import { hostSuffix } from '../../config/constants'

export default function Comp(props) {
  const fontStyle = { fontStyle: 'italic', fontWeight: 500 }
  const { t } = useTranslation()

  const {
    domain,
    labelArr = [
      // 'name',
      'owner',
      'parentName',
      'nameHash',
      'createdAt',
      'expiredAt',
      // 'id',
      'PersonalPage',
    ],
    styles = null,
    defaultDomain = '',
  } = props

  const isFnDomain = (parentName) => {
    return parentName === 'fn'
  }

  if (domain && domain.parentName) {
    if (domain.parentName == 'meow') {
      labelArr.splice(5, 1) // remove personal page while meow domain
    }
  }
  const { user } = accountStore.useState('user')

  const isOwner = user.addr === domain.owner

  const getValue = (label, value) => {
    let valueNode = <>{value}</>

    switch (label) {
      case 'expiredAt':
        valueNode = renderTime(value, isFnDomain(domain.parentName))
        break
      case 'createdAt':
        valueNode = renderTime(value)
        break
      case 'owner':
        valueNode = defaultDomain
          ? renderAddrLink(value, defaultDomain)
          : renderAddress(value)
        break
      case 'nameHash':
        valueNode = renderHash(value)
        break
      case 'PersonalPage':
        valueNode = renderPageUrl(value)
    }

    return valueNode
  }

  const showDomainRenewer = () => {
    ReactGA.modalview(`/renew/${domain.name}`)
    setRenewerPanelStatus(true)
  }

  const renderTime = (value, withRenew = false) => {
    if (!withRenew) {
      return <Text {...fontStyle}>{timeformater(value, 'DD MMM YYYY')}</Text>
    } else {
      return (
        <Flex
          justifyContent="flex-end"
          cursor="pointer"
          onClick={() => {
            showDomainRenewer()
          }}
          {...fontStyle}
        >
          <Text textStyle="italic" textDecoration="underline">
            {timeformater(value, 'DD MMM YYYY')}
          </Text>

          <Tooltip hasArrow label={t('renew.tips')}>
            <IconButton
              size="xs"
              fontSize="lg"
              variant="ghost"
              color="primary"
              ml="2"
              icon={<BsFillAlarmFill />}
              aria-label={t('renew.tips')}
            />
          </Tooltip>
        </Flex>
      )
    }
  }
  const renderAddrLink = (addr, text) => {
    const name = text.split('.')[0]
    const url = `https://${name}.${hostSuffix}`
    return (
      <Box>
        {/* <Text>{addr}</Text> */}
        <Link href={url} isExternal textDecoration="underline">
          {addr}
        </Link>
        <Icon ml="1" as={AiOutlineLink} />
      </Box>
    )
  }
  const renderAddress = (value) => {
    return <Text fontWeight={500}>{value}</Text>
  }
  const renderPageUrl = (value) => {
    const name = domain.name.split('.')[0]
    const url = `https://${name}.${hostSuffix}`
    return (
      <Tooltip label={t('jump.to.page')}>
        <Text>
          <Link href={url} isExternal textDecoration="underline">
            {`${
              name.length >= 10 ? ellipseAddress(name, 2) : name
            }.${hostSuffix}`}
          </Link>

          <Icon ml="1" as={AiOutlineLink} />
        </Text>
      </Tooltip>
    )
  }

  const renderHash = (value) => {
    return <Text>{ellipseAddress(value, 8)}</Text>
  }

  return (
    <Box w="100%" {...styles}>
      <Table size="xs" variant="unstyle">
        <Thead></Thead>
        <Tbody>
          {labelArr.map((label, idx) => {
            const value = domain[label]
            return (
              <Tr key={idx} px={4}>
                <Td isNumeric textAlign="left" px={4}>
                  {t(label)}
                </Td>
                <Td isNumeric textAlign="right" px={2}>
                  {getValue(label, value)}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Box>
  )
}
