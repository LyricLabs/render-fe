import { Text, Center, VStack, SimpleGrid, useColorMode, useTheme } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

export default function Layout(props) {
  const { t } = useTranslation()
  const theme = useTheme()
  const { colorMode } = useColorMode()
  const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary

  const panelStyle = {
    bgColor: primary,
    w: '160px',
    h: '160px',
    borderRadius: '50%',
    opacity: 0.8,
    align: 'center',
    px: 5,
  }
  const titleStyle = {
    fontWeight: 800,
    color: '#17233A',
    align: 'center',
    opacity: 1,
  }
  const descStyle = {
    fontWeight: 400,
    color: '#17233A',
    align: 'center',
    opacity: 1,
  }

  return (
    <Center height='100%'>
      <SimpleGrid w='320px' h='300px' columns={2}>
        <Center {...panelStyle}>
          <VStack>
            <Text textStyle='h3' {...titleStyle}>
              {t('feature.ownership')}
            </Text>
            <Text textStyle='desc' {...descStyle}>
              {t('feature.ownership.desc')}
            </Text>
          </VStack>
        </Center>
        <Center ml={-5} {...panelStyle}>
          <VStack>
            <Text textStyle='h3' {...titleStyle}>
              {t('feature.composable')}
            </Text>
            <Text textStyle='desc' {...descStyle}>
              {t('feature.composable.desc')}
            </Text>
          </VStack>
        </Center>
        <Center mr={-5} mt={-5} {...panelStyle}>
          <VStack>
            <Text textStyle='h3' {...titleStyle}>
              {t('feature.multi')}
            </Text>
            <Text textStyle='desc' {...descStyle}>
              {t('feature.multi.desc')}
            </Text>
          </VStack>
        </Center>
        <Center ml={-5} mt={-5} {...panelStyle} bg='secondary'>
          <VStack>
            <Text textStyle='h3' {...titleStyle} color='white'>
              {t('feature.community')}
            </Text>
            <Text textStyle='desc' {...descStyle} color='white'>
              {t('feature.community.desc')}
            </Text>
          </VStack>
        </Center>
      </SimpleGrid>
    </Center>
  )
}
