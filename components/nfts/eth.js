import React, { useEffect, useState } from 'react'
// import {
//   useOwnedNFTs,
//   useContract,
//   ThirdwebNftMedia,
// } from '@thirdweb-dev/react'
import { useContract, useContractRead, useContractReads } from 'wagmi'

import { SimpleGrid } from '@chakra-ui/react'

import { useTranslation } from 'next-i18next'

const Component = ({ nft, addr, abi }) => {
  const { t } = useTranslation('common')
  //   const { colorMode } = useColorMode()
  //   const [isPC = true] = useMediaQuery('(min-width: 48em)')
  const contract = useContract({
    address: nft,
    abi: abi,
  })
  //   const {
  //     data: ownedNFTs = [],
  //     isLoading,
  //     error,
  //   } = useOwnedNFTs(contract, addr)

  const contractOpt = {
    address: nft,
    abi: abi,
    functionName: 'balanceOf',
    args: [addr],
  }
  const { data: balance = 0 } = useContractRead(contractOpt)
  console.log(balance)
  const opts = []
  const balNum = balance ? balance.toNumber() : 0
  for (var i = 0; i < balNum; i++) {
    opts.push({
      ...contractOpt,
      functionName: 'tokenOfOwnerByIndex',
      args: [addr, i],
    })
  }
  const { data = [], error } = useContractReads({ contracts: opts })

  //   const { data = [], error } = useContractReads({
  //     contracts: [
  //       {
  //         address: nft,
  //         abi: erc721ABI,
  //         functionName: 'tokenOfOwnerByIndex',
  //         args: [addr, i],
  //       },
  //       { address: nft, abi: erc721ABI, functionName: 'balanceOf', args: [addr] },
  //     ],
  //   })
  console.log(data, error)
  return (
    <SimpleGrid columns={[4]} spacing={6}>
      {data.map((nft, idx) => {
        return (
          <>
            {/* <ThirdwebNftMedia key={idx} metadata={nft.metadata} /> */}
            {nft.toString()}
          </>
        )
      })}
    </SimpleGrid>
  )
}
export default Component
