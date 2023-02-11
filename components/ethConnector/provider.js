import '@rainbow-me/rainbowkit/styles.css'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
// import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react'

export default function Comp(props) {
  const { chains, provider } = configureChains(
    [mainnet, polygon, optimism, arbitrum],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()],
  )

  const { connectors } = getDefaultWallets({
    appName: 'Render',
    chains,
  })

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  })

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        appInfo={{
          appName: 'Render',
          learnMoreUrl: 'https://render.flowns.app',
        }}
      >
        {/* <ThirdwebProvider desiredChainId={ChainId.Mainnet}> */}
          {props.children}
        {/* </ThirdwebProvider> */}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
