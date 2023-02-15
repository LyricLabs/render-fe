import React, { useEffect, useState } from 'react'
import { Divider, Stack, Box, Text, Flex, useColorMode, useMediaQuery } from '@chakra-ui/react'
import Link from 'next/link'

import { useTranslation } from 'next-i18next'
import { useRootDomains } from '../../api/query'

const Component = ({ children }) => {
  const { t } = useTranslation('common')
  const { colorMode } = useColorMode()
  const [isPC = true] = useMediaQuery('(min-width: 48em)')

  const gradientBg =
    colorMode === 'light'
      ? 'linear-gradient(270deg, #6E3CDA 7.86%, #21D27D 100%)'
      : 'linear-gradient(270deg, #FFFFFF 7.86%, #00E075 100%)'
  useRootDomains()
 

  return (
    <>
      <Stack direction={['column', 'column', 'row']} h={['100%', '100%', 'calc(100vh - 400px)']}>
        {isPC && (
          <Divider w='1px' height='100%' orientation='vertical' border='1px solid' opacity='0.12' />
        )}
        <Box h={['520px', '520px', '100%']} pt={[4, 4, 10]} w={['100%', '100%', '50%']}>
          <Text h='108px' textStyle='h1' bgGradient={gradientBg} bgClip='text'>
            {t('title')}
            <span id='title'></span>
          </Text>
          <Text mt={[4, 4, 5]} h={['64px', '64px', '108px']} textStyle='desc'>
            {t('desc')}
          </Text>

        </Box>

        {isPC && (
          <Divider
            w='1px'
            height='100%'
            orientation='vertical'
            border='1px solid'
            opacity='0.12'
            mb={4}
          />
        )}
        <Divider w='1px' height='100%' orientation='vertical' border='1px solid' opacity='0.12' />
      </Stack>
    </>
  )
}
export default Component
