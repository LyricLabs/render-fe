import { ComponentStyleConfig } from '@chakra-ui/react'
import colors from '../colors'

const Button = {
  baseStyle: {},
  variants: {
    // todo
    // solid: {
    //   background: `linear-gradient(90deg, #00E0B5 0%, #00D392 100%)`,
    //   color: "white",
    //   boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
    //   _hover: {
    //     bg: `linear-gradient(90deg, #05C1C1 0%, #00D3D3 100%)`,
    //   },
    //   _active: {
    //     boxShadow: "none",
    //     background: `linear-gradient(90deg, #00E0B5 0%, #00D392 100%)`,
    //   },
    //   _disabled: {
    //     bg: "white",
    //     color: "#CCCCCC",
    //     border: "1px solid #CCCCCC",
    //   },
    // },

    solid: {
      borderRadius: 'full',
      boxShadow: 'null',
      fontSize: '16px',
    },
  },

  defaultProps: {
    variants: 'default',
  },
}

export default Button
