import React from 'react'
import {
  Flex,
  Stack,
  Center,
  Text,
  useMediaQuery,
  useClipboard,
  Icon,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Tooltip,
  Badge,
  Button,
} from '@chakra-ui/react'

import { useTranslation } from 'next-i18next'
import {
  MdPowerSettingsNew,
  MdOutlineFileCopy,
  MdMenuOpen,
} from 'react-icons/md'
import { FaExchangeAlt } from 'react-icons/fa'
import { useUserCollection } from '../../api/query'

import useCurrentUser from '../../hooks/currentUser'
import Logo from '../logos/logo'
import Navs from '../navs'
import SwitchTheme from '../colorSwitch/'
import { appNavLinks } from '../../config/constants'
import { toast, ellipseAddress } from '../../utils'
import accountStore from '../../stores/account'
import DashBtn from '../dashBtn'
import UserAssets from '../userAssets'

const Components = ({ children }) => {
  const [isPC = true] = useMediaQuery('(min-width: 48em)')
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure()

  const [user, isLogin, fcl] = useCurrentUser()

  const { onCopy } = useClipboard(user?.addr)

  const { refetch } = useUserCollection(user?.addr)

  const { flowBalance, domains, tokenBals } = accountStore.useState(
    'flowBalance',
    'domains',
    'tokenBals',
  )

  const renderDomain = (address) => {
    if (domains.length == 0) {
      return ellipseAddress(address)
    }
    const { name } = domains[0]
    if (domains.length == 1) {
      return name
    }
    if (domains.length > 1) {
      const defaultName = localStorage.getItem('flowns_default_name')
      if (defaultName) {
        return defaultName
      } else {
        localStorage.setItem('flowns_default_name', name)
      }
    }
  }

  const renderDomainList = () => {
    let defaultName = localStorage.getItem('flowns_default_name') || ''

    const handleSetDefault = async (name) => {
      await localStorage.setItem('flowns_default_name', name)
    }

    if (domains.length <= 1) {
      const onlyName = domains[0].name
      handleSetDefault(onlyName)
      return onlyName || ''
    }

    if (defaultName == '') {
      domains.map((d) => {
        if (d.texts && d.texts.isDefault == 'true') {
          defaultName = d.name
          localStorage.setItem('flowns_default_name', defaultName)
        }
      })
    }

    return (
      <Menu isLazy isOpen={isMenuOpen} onClose={onMenuClose}>
        <MenuButton onClick={onMenuOpen}>{defaultName || user.addr}</MenuButton>
        <MenuList>
          {domains.map((d, idx) => {
            const { name, texts = {} } = d
            const { isDefault = false } = texts
            return (
              <MenuItem onClick={() => handleSetDefault(name)} key={idx}>
                <Flex w="100%" justifyContent="space-between">
                  <Text>{name}</Text>
                  {isDefault && (
                    <Badge
                      textTransform="inherit"
                      fontSize="10px"
                      colorScheme="green"
                    >
                      Default
                    </Badge>
                  )}
                </Flex>
              </MenuItem>
            )
          })}
        </MenuList>
      </Menu>
    )
  }

  const renderAccBtn = () => {
    return (
      <Center>
        {/* <SwitchTheme /> */}
        <Button
          mx={2}
          borderRadius="full"
          minW={{ base: '20px', md: '120px' }}
          h={{ base: '36px', md: '36px' }}
          color="primary"
          boxShadow="null"
          colorScheme="gray"
          fontWeight={700}
          onClick={() => {
            if (!isLogin) {
              fcl.logIn()
            } else {
              onOpen()
            }
          }}
        >
          {isLogin ? (
            <>
              {isPC && <>{renderDomain(user.addr)}&nbsp;</>}{' '}
              <Icon as={MdMenuOpen} />
            </>
          ) : (
            t('connect')
          )}
        </Button>
        {isLogin && (
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent opacity="0.8">
              <DrawerCloseButton />
              <DrawerHeader>{t('account')}</DrawerHeader>

              <DrawerBody opacity="0.8">
                <Stack spacing={2}>
                  {domains.length > 0 && (
                    <Flex justifyContent="space-between">
                      <Text>{t('name')}</Text>
                      <Flex alignItems="center">
                        <>{renderDomainList()}</>
                        {domains.length > 1 && (
                          <Tooltip hasArrow label={t('switch.name')}>
                            <IconButton
                              size="xs"
                              variant="ghost"
                              color="primary"
                              onClick={() => {
                                onMenuOpen()
                              }}
                              icon={<FaExchangeAlt />}
                            />
                          </Tooltip>
                        )}
                      </Flex>
                    </Flex>
                  )}
                  <Flex justifyContent="space-between">
                    <Text>{t('address')}</Text>
                    <Flex alignItems="center">
                      <Text fontSize="10px">{user.addr}</Text>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        color="primary"
                        onClick={() => {
                          onCopy()
                          toast({
                            title: t('copied'),
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                          })
                          onClose()
                        }}
                        icon={<MdOutlineFileCopy />}
                      />
                    </Flex>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text fontWeight={500}>FLOW</Text>
                    <Text
                      fontStyle="italic"
                      fontWeight={800}
                      textColor="primary"
                    >
                      ₣ {flowBalance}
                    </Text>
                  </Flex>

                  {/* <Flex justifyContent='space-between'>
                    <Text>{t('owned.domains')}</Text>
                    <Text>{domainIds.length}</Text>
                  </Flex> */}
                  <UserAssets domains={domains} bals={tokenBals} cb={refetch} />
                </Stack>
              </DrawerBody>

              <DrawerFooter>
                <DashBtn
                  size="full"
                  w="100%"
                  h="40px"
                  fontSize="20px"
                  onClick={() => {
                    fcl.logOut()
                    onClose()
                  }}
                  leftIcon={<Icon as={MdPowerSettingsNew} />}
                >
                  {t('logout')}
                </DashBtn>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </Center>
    )
  }

  return (
    <>
      <Stack
        direction={['column', 'column', 'row']}
        w="100%"
        h="81px"
        spacing={[2, 2, 10]}
        p={[2, 2, 0]}
      >
        <Flex
          w={['100%', '100%', '10%']}
          h={{ base: '48px', md: '84' }}
          justify="space-between"
        >
          <Logo />
          {!isPC && renderAccBtn()}
        </Flex>
        <Center w={['100%', '100%', '80%']} h="100%">
          <Navs links={appNavLinks} />
        </Center>
        {isPC && renderAccBtn()}
      </Stack>
    </>
  )
}
export default Components
