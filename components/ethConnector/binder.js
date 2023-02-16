import { useEffect, useState } from 'react'
import { Box, Center, Text, Button } from '@chakra-ui/react'
import { useSignMessage, useAccount } from 'wagmi'
import { setEthAddrOnDomain } from 'api'
import { ethers } from 'ethers'
import { useTranslation } from 'next-i18next'
import { toast } from 'utils'

export default function Comp(props) {
  const { t } = useTranslation()

  const { flowAddr, domainName, nameHash, reFetch = () => {} } = props
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)
  const { data, isError, isSuccess, signMessage } = useSignMessage({
    message: flowAddr,
  })

  const handleSign = async () => {
    setLoading(true)
    await signMessage()
  }

  const handleBind = async (signature) => {
    setLoading(true)
    try {
      const msgWithPrefix =
        '\x19Ethereum Signed Message:\n' + flowAddr.length + flowAddr
      const digest = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(msgWithPrefix),
      )
      const publicKey = ethers.utils.recoverPublicKey(digest, signature)

      const recoveredAddress = ethers.utils.computeAddress(publicKey)
      console.log(recoveredAddress)
      if (address != recoveredAddress) {
        throw new Error('Invalid recoveredAddress')
      }

      const res = await setEthAddrOnDomain(
        nameHash,
        flowAddr,
        publicKey.replace('0x04', ''), // 04 is the prefix of uncompressed public key in bitcon/ethereum's ecdsa, delete it.
        signature.replace('0x', '').slice(0, -2), // ethereum's signature contains v value in the last byte, delete it.
      )

      if (res && res.status == 4) {
        toast({
          title: t(`bind.success`, { name: subdomainName }),
          status: 'success',
        })
      } else {
        toast({
          title: t(`bind.failed`, { name: subdomainName }),
          status: 'error',
        })
      }

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSuccess && data && !isError) {
      handleBind(data)
    }
  }, [isSuccess, data, isError])

  useEffect(() => {
    if (isError) {
      setLoading(false)
    }
  }, [isError])

  return (
    <>
      <Button
        isLoading={loading}
        onClick={() => {
          handleSign()
        }}
      >
        {t('bind.flowns')}
      </Button>
      {/* {isSuccess && <div>Signature: {data}</div>} */}
      {isError && <Text>{t('sign.error')}</Text>}
    </>
  )
}
