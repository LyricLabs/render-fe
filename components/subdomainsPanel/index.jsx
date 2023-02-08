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
  Flex,
  Tooltip,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  FormControl,
  FormLabel,
  Input,
  ButtonGroup,
} from '@chakra-ui/react'
import { AiOutlineArrowsAlt, AiOutlineAppstoreAdd } from 'react-icons/ai'

import Spinner from 'react-cli-spinners'
import { SmallCloseIcon } from '@chakra-ui/icons'
import ProfileLabel from '../profileLabel'
import EmptyPanel from '../empty'
import {
  setSubdomainText,
  removeSubdomainText,
  setSubdomainAddress,
  removeSubdomainAddress,
  createSubdomain,
  removeSubdomain,
} from '../../api'
import {
  toast,
  alert,
  ellipseStr,
  conpareKeys,
  validateAddress,
  validateDomain,
} from '../../utils'
import { namehash } from '../../utils/hash'
import { useDomainInfo } from '../../api/query'
import {
  setDetailModal,
  setDisable,
  updateDetailValue,
} from '../../stores/detailModal'

export default function Comp(props) {
  const { t } = useTranslation()
  const theme = useTheme()
  const primary =
    colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary
  const { colorMode } = useColorMode()

  const { onOpen, onClose, isOpen } = useDisclosure()
  const { domain, styles = null, isOwner = false } = props
  const [loadingIdx, setLoadingIdx] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [subdomainName, setSubdomainName] = useState(false)
  const [currentHash, setCurrentHash] = useState(false)

  const { texts = {}, nameHash, name, subdomains = {}, domainCount } = domain
  const { refetch } = useDomainInfo(name)
  const hashs = Object.keys(subdomains)

  const len = hashs.length

  useEffect(() => {
    let subdomain = subdomains[currentHash]
    if (currentHash) {
      updateDetailValue({
        nameHash: subdomain.nameHash,
        createdAt: subdomain.createdAt,
        addresses: subdomain.addresses,
        texts: subdomain.texts,
      })
    }
  }, [currentHash, domain])

  const renderCreateBtn = (type = 'btn') => {
    return (
      <Popover
        placement="top-start"
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        closeOnBlur={false}
      >
        <PopoverTrigger>
          {type == 'init' ? (
            <Button
              mx={2}
              size="sm"
              // w={{ base: '240px', md: '240px' }}
              // h={{ base: '36px', md: '36px' }}
              fontSize="10px"
              variant="ghost"
              border="1px"
              borderStyle="dashed"
              isLoading={loading}
              loadingText={t('loading')}
              borderColor={primary}
              textColor={primary}
              spinner={<Spinner type="dots" />}
            >
              {t('mint.subdomain')}
            </Button>
          ) : (
            <IconButton
              w="100px"
              opacity="1"
              size="sm"
              variant="outline"
              borderStyle="dashed"
              borderColor="primary"
              textColor="primary"
              icon={<AiOutlineAppstoreAdd />}
              spinner={<Spinner type="dots" />}
            />
          )}
        </PopoverTrigger>
        <PopoverContent p={2}>
          <PopoverHeader fontWeight="semibold">
            {t('mint.subdomain')}
          </PopoverHeader>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody p={2}>
            <FormControl mb={4}>
              <FormLabel>{t('subdomain.name')}</FormLabel>
              <Input
                id={'subdomainName'}
                placeholder={t('subdomain.placeholder')}
                onChange={(e) => {
                  setSubdomainName(e.target.value)
                }}
              />
            </FormControl>
            <ButtonGroup display="flex" justifyContent="flex-end">
              <Button variant="outline" onClick={onClose} isDisabled={loading}>
                {t('cancel')}
              </Button>
              <Button
                isDisabled={loading || !validateDomain(subdomainName)}
                borderColor={primary}
                textColor={primary}
                variant="ghost"
                border="1px"
                borderStyle="dashed"
                isLoading={loading}
                loadingText={t('loading')}
                spinner={<Spinner type="dots" />}
                onClick={() => {
                  setLoading(true)
                  changeRecords('create', null, null, subdomainName)
                }}
              >
                {t('confirm')}
              </Button>
            </ButtonGroup>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    )
  }

  const renderEmpty = () => {
    const tip = t('empty')
    return (
      <>
        {isOwner ? (
          <Center h="150px">
            <Stack w="50%" opacity="0.8" fontSize="14px">
              <Text align="center" mb={2} as="div">
                {t('mint.subdomain.tip')}
              </Text>
            </Stack>
          </Center>
        ) : (
          <EmptyPanel h="100px" tip={tip} />
        )}
      </>
    )
  }

  // todo
  const changeRecords = async (type = 'removeText', hash, field, value) => {
    try {
      let req = null

      switch (type) {
        case 'removeText':
          req = removeSubdomainText(nameHash, hash, field)
          break
        case 'setText':
          req = setSubdomainText(nameHash, hash, field, value)
          break
        case 'removeAddr':
          req = removeSubdomainAddress(nameHash, hash, field)
          break
        case 'setAddr':
          req = setSubdomainAddress(nameHash, hash, field, value)
          break
        case 'create':
          req = createSubdomain(`${value}.${name}`)
          break
        case 'removeSub':
          req = removeSubdomain(nameHash, hash)
          break
      }

      let res = await req
      if (res != null) {
        const { status = 0 } = res
        if (status === 4) {
          toast({
            title: t(`${type}.success`, { type: t(field) }),
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          await refetch()
          if (type == 'create') {
            onClose()
          }
        }
      } else {
        toast({
          title: t(`${type}.failed`, { type: t(field) }),
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        setDetailModal({
          isOpen: false,
        })
      }
      setDisable(false)
      setLoading(false)
      setLoadingIdx(-1)
    } catch (error) {
      console.log(error)
      toast({
        title: t(`trx.failed`),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setDisable(false)
      setLoading(false)
      setLoadingIdx(-1)
      setDetailModal({
        isOpen: false,
      })

      if (type == 'create') {
        onClose()
      }
    }
  }

  const handleChange = (type, props) => {
    console.log(type, props)
    if (!isOwner) {
      return false
    }
    const {
      namespace,
      name,
      new_value,
      existing_value,
      existing_src,
      updated_src,
    } = props
    if (namespace.length == 0 && name == null) {
      alert(t('change.alert'))
      return false
    }
    // delete
    if (type === 'del') {
      const field = namespace[0] || ''
      if (field == 'texts') {
        let oldText = existing_src[field]
        let newText = updated_src[field]
        let keys = conpareKeys(oldText, newText)
        if (existing_src[field][name] !== null) {
          setDisable(true)
          changeRecords('removeText', existing_src.nameHash, keys[0])
        }
      } else if (field == 'addresses') {
        let idx = Number(name)
        if (existing_src[field][name] !== null) {
          setDisable(true)
          changeRecords('removeAddr', existing_src.nameHash, idx)
        }
      } else {
        alert(t('change.alert'))
        return false
      }
    }

    if (type === 'edit') {
      const field = namespace[0] || ''
      if (field === 'addresses') {
        let idx = Number(name)
        let addr = new_value
        let valid = validateAddress(idx, addr)
        if (!valid) {
          return false
        }
        setDisable(true)
        changeRecords('setAddr', existing_src.nameHash, idx, addr)
      }
      if (field === 'texts') {
        setDisable(true)
        let value = new_value
        console.log(value)
        changeRecords('setText', existing_src.nameHash, name, value)
      }
    }
  }

  const showTextDetail = (value, label) => {
    setDetailModal({
      title: t('edit.subdomain.record', { domain: label }),
      value,
      label,
      isOpen: true,
      onChange: handleChange,
    })
  }

  const renderValue = (value, label) => {
    return (
      <Box variant="outline" colorScheme="green">
        {value.substr(0, 10)}...
        <IconButton
          p={1}
          size="xs"
          variant="ghost"
          as={AiOutlineArrowsAlt}
          onClick={() => {
            showTextDetail(value, label)
            setCurrentHash(namehash(label))
          }}
        />
      </Box>
    )
  }

  const updateDetail = () => {}

  return (
    <Box w="100%" {...styles}>
      {len == 0 ? (
        renderEmpty()
      ) : (
        <Table size="xs" variant="unstyle" opacity="0.8">
          <Thead fontSize="12px">
            <Tr>
              <Th px={4}>{t('subdomain.name')}</Th>
              <Th px={4} textAlign="right">
                {t('records')}
              </Th>
            </Tr>
          </Thead>
          <Tbody fontSize="10px">
            {hashs.map((hash, idx) => {
              const subDomain = subdomains[hash]
              const { name, texts, addresses, nameHash, createdAt } = subDomain
              const data = {
                nameHash,
                createdAt,
                addresses,
                texts,
              }
              return (
                <Tr key={idx} px={2}>
                  <Td textAlign="left" px={4}>
                    <ProfileLabel label={name} size={18} upper={false} />
                  </Td>
                  <Td textAlign="right" px={4}>
                    {renderValue(JSON.stringify(data), name)}
                  </Td>
                  <Td>
                    {isOwner && (
                      <Tooltip hasArrow label={t('remove.subdomain')}>
                        <IconButton
                          opacity="1"
                          size="xs"
                          variant="ghost"
                          isLoading={idx == loadingIdx}
                          textColor="error"
                          icon={<SmallCloseIcon />}
                          spinner={<Spinner type="dots" />}
                          onClick={() => {
                            setLoadingIdx(idx)
                            changeRecords('removeSub', nameHash)
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
      {isOwner && (
        <Flex w="100%" mt={2} align="center" justify="center">
          {renderCreateBtn(hashs.length > 0 ? 'btn' : 'init')}
        </Flex>
      )}
    </Box>
  )
}
