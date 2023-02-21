// import colors from './colors';
import { mode } from '@chakra-ui/theme-tools'

const bgConfig = {
  backgroundRepeat: 'no-repeat',
  // backgroundSize: 'cover',
}

const obj = {
  global: (props) => ({
    // font
    'html, body': {
      fontFamily: 'Poppins',
      width: '100vw',
      height: '100vh',
      color: mode('#17233A', '#fbfbfb')(props),
      bg: mode('#fbfbfb', '#17233A')(props),
      // border: mode('1px solid rgba(0, 0, 0, 0.12)', '1px solid rgba(255, 255, 255, 0.12)')(props),
    },
    main: {
      height: '100vh',
      with: '100vw',
    },
    '.home': {
      backgroundImage: 'url(/assets/home.svg)',
      ...bgConfig,
    },
    '.grid': {
      backgroundImage: 'url(/assets/grid.svg)',
      ...bgConfig,
    },
  }),
}

export default obj
