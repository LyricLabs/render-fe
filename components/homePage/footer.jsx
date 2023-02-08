import React from 'react'
import { Box, Stack, Text, Flex } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { links } from '../../config/constants'

const Components = ({ children }) => {
  const { t } = useTranslation()

  return (
    <Box pt={4}>
      {/* <Text mb={3} textStyle='label' opacity='1'>
        {t('roadmap.title')}
      </Text> */}
      <Stack
        direction={['column', 'column', 'row']}
        height={['330px', '330px', '100%']}
        spacing={1}
      >
       
      </Stack>
    </Box>
  )
}
export default Components
