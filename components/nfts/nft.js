import React, { useEffect, useState } from 'react'
import {} from '@chakra-ui/react'

import { useTranslation } from 'next-i18next'

import { useNFTInfo } from 'api/query'

const Component = ({ cid = '', metadata = null, id }) => {
  const { t } = useTranslation('common')
  //   const { colorMode } = useColorMode()
  //   const [isPC = true] = useMediaQuery('(min-width: 48em)')
  const { data, isLoading } = useNFTInfo(cid, id)

  console.log(data)

  return <></>
}
export default Component
