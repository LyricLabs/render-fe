import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'

import {
  Center,
  Box,
  Text,
  Stack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorMode,
  useTheme,
  IconButton,
  Link,
  Tooltip,
} from '@chakra-ui/react'
import { AiOutlineArrowsAlt } from 'react-icons/ai'

import Spinner from 'react-cli-spinners'
import { SmallCloseIcon } from '@chakra-ui/icons'
import ProfileLabel from '../profileLabel'
import EmptyPanel from '../empty'
import { setDomainText } from '../../api'
import { toast, validateUrl, ellipseStr } from '../../utils'
import { useDomainInfo } from '../../api/query'
import { setDetailModal } from '../../stores/detailModal'

export default function Comp(props) {
  const { t } = useTranslation()
  const theme = useTheme()
  const { colorMode } = useColorMode()
  const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary


  const { domain, styles = null, field = 'profile', isOwner = false } = props
  const [loadingIdx, setLoadingIdx] = useState(-1)

  const { texts = {}, nameHash, name } = domain
  const { refetch } = useDomainInfo(name)
  let profile = texts[field] || '{}'
  profile = JSON.parse(profile)
  const keys = Object.keys(profile)
  
  const len = keys.length

  const renderEmpty = () => {
    const tip = t('empty')
    return <EmptyPanel h={20} tip={tip} />
  }

  const reomveLabel = async (label) => {
    let obj = { ...profile }
    delete obj[label]
    const res = await setDomainText(nameHash, field, obj)
    if (res != null) {
      const { status = 0 } = res
      if (status === 4) {
        toast({
          title: t('remove.success', { type: t(field) }),
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        refetch()
      }
    } else {
      toast({
        title: t('remove.error', { type: t(field) }),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    setLoadingIdx(-1)
  }

  const showTextDetail = (value, label) => {
    setDetailModal({
      value,
      label,
      isOpen: true,
    })
  }

  const renderValue = (value, label) => {
    const isUrl = validateUrl(value)

    if (isUrl) {
      return (
        <Link href={value} isExternal>
          <Text textDecoration='underline'>
            {value.length > 40 ? ellipseStr(value, 15) : value}
          </Text>
        </Link>
      )
    }
    if (value.length > 50) {
      return (
        <Box variant='outline' colorScheme='green'>
          {value.substr(0, 10)}...
          <IconButton
            p={1}
            size='xs'
            variant='ghost'
            as={AiOutlineArrowsAlt}
            onClick={() => showTextDetail(value, label)}
          />
        </Box>
      )
    }

    return <Box>{value}</Box>
  }

  return (
    <Box w='100%' {...styles}>
      {len == 0 ? (
        renderEmpty()
      ) : (
        <Table size='xs' variant='unstyle' opacity='0.8'>
          <Thead fontSize='12px'>
            <Tr>
              <Th px={4}>{t('label')}</Th>
              <Th px={4} textAlign='right'>
                {t('value')}
              </Th>
            </Tr>
          </Thead>
          <Tbody fontSize='10px'>
            {keys.map((label, idx) => {
              const value = profile[label]
              return (
                <Tr key={idx} px={2}>
                  <Td textAlign='left' px={4}>
                    <ProfileLabel label={label} size={18} />
                  </Td>
                  <Td textAlign='right' px={4}>
                    {renderValue(value, label)}
                  </Td>
                  <Td>
                    {isOwner && (
                      <Tooltip hasArrow label={t('remove.record')}>
                        <IconButton
                          opacity='1'
                          size='xs'
                          variant='ghost'
                          isLoading={idx == loadingIdx}
                          textColor='error'
                          icon={<SmallCloseIcon />}
                          spinner={<Spinner type='dots' />}
                          onClick={() => {
                            setLoadingIdx(idx)
                            reomveLabel(label)
                          }}
                        />
                      </Tooltip>
                    )}
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      )}
    </Box>
  )
}
