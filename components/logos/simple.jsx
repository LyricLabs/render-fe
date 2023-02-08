import React from 'react'
import Image from 'next/image'
import { Center } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useColorMode } from '@chakra-ui/react'

const Components = ({ children }) => {
  const { colorMode } = useColorMode()
  const router = useRouter()

  const logo =
    colorMode == 'light' ? '/assets/flowns_icon_light.svg' : '/assets/flowns_icon_dark.svg'
  return (
    <Center cursor='pointer' width={{ base: '25px', md: '25px' }}>
      <Image
        src={logo}
        width='100%'
        height='100%'
        alt='flowns'
        onClick={() => router.push('/')}
      ></Image>
    </Center>
  )
}
export default Components
