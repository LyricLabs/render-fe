import { Text, Flex, Box, VStack, Divider, useColorMode, useTheme } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

export default function Layout(props) {
  const { t } = useTranslation()
  // const settings = {
  //   dots: true,
  //   infinite: false,
  //   slidesToShow: 4,
  //   centerMode: true,
  //   centerPadding: '60px',
  //   slidesToScroll: 3,
  // }
  const { colorMode } = useColorMode()
  const theme = useTheme()
  const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary

  const renderItem = (time, desc, color = '#FFFFFF', opacity = 1) => {
    return (
      <VStack
        key={time}
        mt={3}
        mr={2}
        minW={['120px', '120px', '180px']}
        w={['120px', '120px', '180px']}
        h={['100px', '100px', '140px']}
        opacity={opacity}
      >
        <Divider w='100%' variant='dashed' borderColor={`${color}`} />
        <Text w='100%' textStyle='label' align='left' color={`${color}`}>
          * {time}
        </Text>
        <Text w='100%' textStyle='desc' align='left'>
          {desc}
        </Text>
      </VStack>
    )
  }

  return (
    <Box pos='relative'>
      <Flex overflow='scroll' className='roadmap'>
        {renderItem('2021/05', t('roadmap.2021.5'), 'secondary')}
        {renderItem('2021/06', t('roadmap.2021.6'), 'secondary')}
        {renderItem('2021/07', t('roadmap.2021.7'), 'secondary')}
        {renderItem('2021/08', t('roadmap.2021.8'), 'secondary')}
        {renderItem('2021/09', t('roadmap.2021.9'), 'secondary')}
        {renderItem('2021/10', t('roadmap.2021.10'), 'secondary')}
        {renderItem('2021/11', t('roadmap.2021.11'), 'secondary')}
        {renderItem('2022/Q1', t('roadmap.2022.q1'), 'secondary')}
        {renderItem('2022/Q2', t('roadmap.2022.q2'), 'primary')}
        {renderItem('2022/Q3', t('roadmap.2022.q3'), 'textprimary')}
      </Flex>
    </Box>
  )
}
