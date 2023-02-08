import * as React from 'react'
import Image from 'next/image'
import { useColorMode, Flex, Text } from '@chakra-ui/react'

import flowIcon from '../../public/assets/flow.svg'
import ethIcon from '../../public/assets/eth.svg'

export const chainTypes = {
  0: 'Flow',
  1: 'Ethereum',
}

export const chainLogoIcon = {
  0: flowIcon,
  1: ethIcon,
}

const Comp = (props) => {
  const { chainType, size } = props
  const chainName = chainTypes[chainType]
  return (
    <Flex>
      <Image width={size} height={size} src={chainLogoIcon[chainType]} alt={chainName}/>
      <Text pl={2} fontSize={10}>{chainName}</Text>
    </Flex>
  )
}

export default Comp
