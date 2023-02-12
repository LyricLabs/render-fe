import { QueryClientProvider } from 'react-query'
import { Chakra } from '../components/chakra'
import { appWithTranslation } from 'next-i18next'
import ETHProvider from '../components/ethConnector/provider'
import 'atropos/css'

import themes from '../themes'

import { queryClient } from '../api/query'

import Fonts from '../themes/Fonts'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <Fonts />
      <Chakra theme={themes}>
        <ETHProvider>{getLayout(<Component {...pageProps} />)}</ETHProvider>
      </Chakra>
    </QueryClientProvider>
  )
}
export default appWithTranslation(MyApp)
