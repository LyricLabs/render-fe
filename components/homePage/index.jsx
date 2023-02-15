import React, { useEffect, useState } from 'react'
import {
  Divider,
  Stack,
  Box,
  Center,
  Button,
  Text,
  Flex,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

import useCurrentUser from 'hooks/currentUser'
import { fclinit } from '../../utils'

import { useTranslation } from 'next-i18next'
import { useRootDomains } from '../../api/query'

const Component = ({ children }) => {
  fclinit()
  const { t } = useTranslation('common')
  const router = useRouter()

  const [isPC = true] = useMediaQuery('(min-width: 48em)')

  const [user, isLogin, fcl] = useCurrentUser()
  useEffect(() => {
    if (isLogin) {
      router.push(`/account/${user.addr}`)
    }
  }, [isLogin, router])

  return (
    <>
      <Stack
        direction={['column', 'column', 'row']}
        h={['100%', '100%', 'calc(100vh - 400px)']}
      >
        {isPC && (
          <Divider
            w="1px"
            height="100%"
            orientation="vertical"
            border="1px solid"
            opacity="0.12"
          />
        )}
        <Center w="100%" h={['520px', '520px', '100%']} pt={[4, 4, 10]}>
          <Box>
            <Text mb={12} fontSize="64px" fontWeight={700} textAlign="center">
              {t('home.welcome')}
              <br />
              {t('home.render')}
            </Text>
            <Flex justify="center">
              {isLogin ? (
                <Button boxShadow="null" borderRadius="full">
                  {t('account')}
                </Button>
              ) : (
                <Button
                  color="white"
                  boxShadow="null"
                  borderRadius="full"
                  colorScheme="purple"
                  onClick={() => {
                    fcl.logIn()
                  }}
                >
                  {t('connect.tip')}
                </Button>
              )}
            </Flex>
          </Box>
        </Center>
      </Stack>
    </>
  )
}
export default Component
