import React from 'react'
import {
  Box,
  Flex,
  Stack,
  Center,
  Button,
  useMediaQuery,
  useColorMode,
  useTheme,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Logo from '../logos/logo'
import Navs from '../navs'
import SwitchTheme from '../colorSwitch/'
import { navLinks } from '../../config/constants'
// import { toast } from '../../utils'
import { useTranslation } from 'next-i18next'

const Components = ({ children }) => {
  const [isPC = true] = useMediaQuery('(min-width: 48em)')
  const { colorMode } = useColorMode()
  const { t } = useTranslation()
  const theme = useTheme()
  // const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary
  // const router = useRouter()
  const renderAppBtn = () => {
    return (
      <Center>
        {/* <SwitchTheme /> */}
      </Center>
    )
  }

  return (
    <>
      <Stack
        direction={['column', 'column', 'row']}
        w='100%'
        h={{ base: '98px', md: '144px' }}
        spacing={[2, 2, 10]}
        p={[2, 2, 0]}
      >
        <Flex w={['100%', '100%', '20%']} h={{ base: '38px', md: '144px' }} justify='space-between'>
          <Logo />
          {!isPC && renderAppBtn()}
        </Flex>
        <Center w={['100%', '100%', '60%']} h='100%'>
          <Navs links={navLinks} />
        </Center>
        {isPC && renderAppBtn()}
      </Stack>
    </>
  )
}
export default Components
