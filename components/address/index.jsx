import { Box, Text, Link } from '@chakra-ui/react'
// import Link from 'next/link'

import { chainAddressExploreLink } from '../../config/constants'

export default function Comp(props) {
  const { chainType, address, styles = {} } = props
  let addressUrl = `${chainAddressExploreLink[chainType]}${address}`

  return (
    <Box cursor='pointer' textDecoration='underline' {...styles}>
      <Text>
        <Link href={addressUrl} isExternal>
          {address}
        </Link>
      </Text>
    </Box>
  )
}
