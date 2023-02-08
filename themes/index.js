// theme.js
import { extendTheme, ThemeOverride } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

// Global style overrides
import styles from './styles'

// Foundational style overrides
import borders from './foundations/borders'

import colors from './colors'
// Component style overrides
import Button from './components/button'

const overrides = {
  colors: colors,
  // colors: (props) => {
  //   return {
  //     ...colors,
  //     primary: mode('#17233A', '#ffffff')(props),
  //   }
  // },
  // colorMode config
  fonts: {
    body: 'Arial',
    Eurostile: 'Eurostile',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles, // global style
  borders,
  // Other foundational style overrides go here
  components: {
    Button,
  },
  textStyles: {
    h1: {
      // you can also use responsive styles
      fontSize: ['18px', '18px', '24px'],
      fontWeight: 500,
      letterSpacing: '-2%',
    },
    h2: {
      fontSize: '20px',
      fontWeight: 400,
      letterSpacing: '-2%',
    },
    h3: {
      fontSize: ['12.5px', '12.5px', '14px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    link: {
      fontSize: ['12px', '12px', '16px'],
      fontWeight: 300,
    },
    desc: {
      fontSize: '12px',
      fontWeight: 300,
      opacity: 0.8,
    },
    label: {
      fontSize: ['10px', '10px', '14px'],
      fontWeight: 400,
      opacity: 0.8,
    },
    normal: {
      fontSize: '16px',
    },
    text: {
      fontSize: '14px',
    },
  },
}

export default extendTheme(overrides)
