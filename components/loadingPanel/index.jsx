import { Center, Text } from '@chakra-ui/react'
import Spinner from 'react-cli-spinners'

export default function Comp(props) {
  const { tip } = props

  return (
    <Center>
      <Text>
        <Spinner /> &nbsp;&nbsp; {tip}
      </Text>
    </Center>
  )
}
