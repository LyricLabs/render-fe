import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Router from 'next/router'
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
  Tooltip,
} from '@chakra-ui/react'
import Spinner from 'react-cli-spinners'
import { SmallCloseIcon } from '@chakra-ui/icons'
import ChainLogo from '../chainLogo'
import EmptyPanel from '../empty'
import Address from '../address'
import { setDomainAddress, removeDomainAddress } from '../../api'
import { setInfoModalType, setInfoModalStatus } from '../../stores/modal'
import { toast } from '../../utils'
import { useDomainInfo } from '../../api/query'

export default function Comp(props) {
  const { t } = useTranslation()
  const theme = useTheme()
  const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary
  const { colorMode } = useColorMode()

  const { domain, styles = null, isOwner } = props
  const [loading, setLoading] = useState(false)
  const [loadingIdx, setLoadingIdx] = useState(-1)

  const { addresses = {}, owner, nameHash, name } = domain
  const keys = Object.keys(addresses)
  const len = keys.length

  const { refetch } = useDomainInfo(name)

  const renderInitAddr = () => {
    const handleAddrInit = async () => {
      setLoading(true)
      const res = await setDomainAddress(nameHash, 0, owner)
      if (res != null) {
        const { status = 0 } = res
        if (status === 4) {
          toast({
            title: t('init.success'),
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          refetch()
        }
      }
      setLoading(false)
    }
    let tip = ''
    if (isOwner) {
      tip = (
        <Center w='100%'>
          <Stack w='100%' opacity='0.8' fontSize='14px'>
            <Text align='center' mb={2} as='div'>
              {t('address.init.tip')}
            </Text>
            <Button
              mx={2}
              size='sm'
              // w={{ base: '240px', md: '240px' }}
              // h={{ base: '36px', md: '36px' }}
              fontSize='10px'
              variant='ghost'
              border='1px'
              borderStyle='dashed'
              isLoading={loading}
              loadingText={t('init.loading')}
              borderColor={primary}
              textColor={primary}
              onClick={handleAddrInit}
              spinner={<Spinner type='dots' />}
            >
              {t('address.init')}
            </Button>
          </Stack>
        </Center>
      )
    } else {
      tip = t('empty')
    }

    return <EmptyPanel h={20} tip={tip} />
  }

  const reomveAddress = async (chainType) => {
    const res = await removeDomainAddress(nameHash, Number(chainType))
    if (res != null) {
      const { status = 0 } = res
      if (status === 4) {
        toast({
          title: t('remove.success', { type: t('address') }),
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        refetch()
      }
    } else {
      toast({
        title: t('remove.error', { type: t('address') }),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    setLoadingIdx(-1)
  }

  return (
    <Box w='100%' {...styles}>
      {len == 0 ? (
        renderInitAddr()
      ) : (
        <Table size='xs' variant='unstyle' opacity='0.8'>
          <Thead fontSize='12px'>
            <Tr>
              <Th px={4}>{t('chain.type')}</Th>
              <Th px={4} textAlign='right'>
                {t('address')}
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody fontSize='10px'>
            {keys.map((label, idx) => {
              const value = addresses[label]
              return (
                <Tr key={idx} px={2}>
                  <Td textAlign='left' px={4}>
                    <ChainLogo chainType={label} size={18} />
                  </Td>
                  <Td textAlign='right' px={4}>
                    <Address chainType={label} address={value} />
                  </Td>
                  <Td>
                    {isOwner && (
                      <Tooltip hasArrow label={t('set.records')}>
                        <IconButton
                          opacity='1'
                          size='xs'
                          variant='ghost'
                          isLoading={idx == loadingIdx}
                          borderStyle='dashed'
                          textColor='error'
                          icon={<SmallCloseIcon />}
                          spinner={<Spinner type='dots' />}
                          onClick={() => {
                            setLoadingIdx(idx)
                            reomveAddress(label)
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
