import { Box, Center, Text, SimpleGrid } from '@chakra-ui/react'

import Domain from '../domain/item'

export default function Comp(props) {
  const { domains = [], defaultDomain = '' } = props

  return (
    <Box>
      <SimpleGrid
        columns={[1, 1, 2, 3]}
        spacing={5}
        overflowY="scroll"
      >
        {domains.map((domain, idx) => {
          // if(domain.deprecated) {
          //   return null
          // }
          return (
            <Center key={idx}>
              <Domain domain={domain} defaultDomain={defaultDomain} />
            </Center>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}
