import * as React from 'react'
import { Flex, Text, Image } from '@chakra-ui/react'

import flowIcon from './imgs/FLOW.svg'
import fusdIcon from './imgs/FUSD.png'
import bltIcon from './imgs/BLT.png'
import usdcIcon from './imgs/USDC.png'
import myIcon from './imgs/MY.svg'

export const tokenImgs = {
  FLOW: flowIcon,
  FUSD: fusdIcon,
  BLT: bltIcon,
  USDC: usdcIcon,
  MY: myIcon,
}

const Comp = (props) => {
  const { symbol, size } = props
  const img = tokenImgs[symbol]
  return (
    <Flex>
      <Image borderRadius='50%' width={size} height={size} src={img.src} alt={symbol} />
      <Text pl={2} fontSize={10}>
        {symbol}
      </Text>
    </Flex>
  )
}

export default Comp
