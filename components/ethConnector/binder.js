import { useEffect } from 'react'
import { Box, Center, Text, Button } from '@chakra-ui/react'
import { useSignMessage, useAccount } from 'wagmi'
import { setEthAddrOnDomain } from 'api'
import { ethers } from 'ethers'

export default function Comp(props) {
  const { flowAddr, domainName, nameHash, reFetch = () => {} } = props
  const { address } = useAccount()
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: flowAddr,
  })

  const handleSign = async () => {
    const res = await signMessage()

    console.log(res)
  }

  const handleBind = async (signature) => {
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

    console.log(res, 'res')
  }

  useEffect(() => {
    if (isSuccess && data) {
      handleBind(data)
    }
  }, [isSuccess])

  return (
    <>
      <Button
        isLoading={isLoading}
        onClick={() => {
          handleSign()
        }}
      >
        Binding with Flowns
      </Button>
      {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </>
  )
}
