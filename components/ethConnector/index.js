import { Button } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ellipseAddress } from 'utils'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'

export default function Comp(props) {
  //   const { domainInfo, defaultDomain = '' } = props
  const { t } = useTranslation()

  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading'
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated')

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      colorScheme="purple"
                      borderRadius="full"
                      onClick={openConnectModal}
                      type="button"
                    >
                      {t('connect.eth.tip')}
                    </Button>
                  )
                }

                if (chain.unsupported) {
                  return (
                    <Button
                      colorScheme="purple"
                      borderRadius="full"
                      onClick={openChainModal}
                      type="button"
                    >
                      {t('wrong.network')}
                    </Button>
                  )
                }

                return (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Button onClick={openChainModal} type="button">
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: '16px',
                            height: '16px',
                            borderRadius: 999,
                            overflow: 'hidden',
                          }}
                        >
                          {chain.iconUrl && (
                            <Image
                              width="12px"
                              height="12px"
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {/* {chain.name} */}
                    </Button>

                    <Button
                      colorScheme="gray"
                      onClick={openAccountModal}
                      type="button"
                    >
                      {ellipseAddress(account.address, 5)}
                      {/* {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''} */}
                    </Button>
                  </div>
                )
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>
    </>
  )
}
