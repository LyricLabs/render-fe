import React from 'react'
import Image from 'next/image'
import { useColorMode } from '@chakra-ui/react'

const Components = ({ children, ...rest }) => {
  const { colorMode } = useColorMode()

  const logo =
    colorMode == 'light' ? '/assets/flowns_v_logo_light.svg' : '/assets/flowns_v_logo_dark.svg'
  return <Image src={logo} width='100%' height='100%' alt='flowns' {...rest}></Image>
}
export default Components
