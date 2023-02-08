import * as React from 'react'
import {
  FiTwitter,
  FiGithub,
  FiMapPin,
  FiLinkedin,
  FiInstagram,
  FiAtSign,
  FiSmile,
  FiInfo,
  FiImage,
  FiLink,
} from 'react-icons/fi'
import { FaDiscord } from 'react-icons/fa'
import { AiOutlineFacebook, AiOutlineYoutube } from 'react-icons/ai'
import { firstUpperCase } from '../../utils'

import { Flex, Text, Icon } from '@chakra-ui/react'

export const labelIcon = {
  twitter: FiTwitter,
  github: FiGithub,
  facebook: AiOutlineFacebook,
  linkedin: FiLinkedin,
  avatar: FiSmile,
  discord: FaDiscord,
  description: FiInfo,
  email: FiAtSign,
  instagram: FiInstagram,
  location: FiMapPin,
  banner: FiImage,
  website: FiLink,
}

const Comp = (props) => {
  const { label, size, upper = true } = props
  const icon = labelIcon[label]
  return (
    <Flex>
      {/* <Image width={size} height={size} src={chainLogoIcon[chainType]} alt={chainName}/> */}
      <Flex pl={0} fontSize={10} alignItems="center">
        {icon && <Icon w={4} h={4} mr={2} as={icon} />}
        {upper ? firstUpperCase(label) : label}
      </Flex>
    </Flex>
  )
}

export default Comp
