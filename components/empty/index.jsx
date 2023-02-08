import { Center, Text } from '@chakra-ui/react'

export default function Comp(props) {
  const { icon, tip, textStyle = {}, ...rest } = props

  const renderIcon = () => {
    if (icon) {
      return <>{icon}&nbsp;&nbsp;</>
    }
    return ''
  }
  return (
    <Center {...rest}>
      <Text {...textStyle}>
        {renderIcon()}

        {tip}
      </Text>
    </Center>
  )
}
