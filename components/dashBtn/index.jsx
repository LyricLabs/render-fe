import { Button, useTheme, useColorMode } from '@chakra-ui/react'
import Spinner from 'react-cli-spinners'

export default function Comp(props) {
  const { onClick, children, styles, ...rest } = props

  const { colorMode } = useColorMode()
  const theme = useTheme()
  const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary

  return (
    <Button
      variant='ghost'
      border='1px'
      borderStyle='dashed'
      borderColor={primary}
      textColor={primary}
      {...rest}
      onClick={onClick}
      spinner={<Spinner type='dots' />}
    >
      {children}
    </Button>
  )
}
