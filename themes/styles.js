// import colors from './colors';
import { mode } from '@chakra-ui/theme-tools'

const obj = {
  global: (props) => ({
    // font
    'html, body': {
      fontFamily: 'Roboto',
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
    '.Typewriter__cursor': {
      color: mode('#17233A', '#ffffff')(props),
    },
    '.roadmap': {
      scrollbarWidth: 'none' /* firefox */,
      overflowX: 'hidden',
      overflowY: 'auto',
      '::-webkit-scrollbar': {
        display: 'none' /* Chrome Safari */,
      },
    },
    '.markdown': {
      a: {
        color: 'primary',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontWeight: 900,
      },
      blockquote: {
        padding: '10px 5px',
        fontStyle: 'italic',
      },
      p: {
        marginBottom: '10px',
      },
    },
  }),
}

export default obj
