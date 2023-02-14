import React, { useEffect, useState } from 'react'
import { MediaRenderer } from '@thirdweb-dev/react'
import { useContract, useContractRead, useContractReads } from 'wagmi'

import { SimpleGrid, Box } from '@chakra-ui/react'

import { useTranslation } from 'next-i18next'
import LoadingPanel from 'components/loadingPanel'
import NFT from './nft'

const Component = ({
  nft,
  addr,
  abi,
  collectionName,
  baseURI,
  cid = '',
  mediaType = 'image',
}) => {
  const { t } = useTranslation('common')
  //   const { colorMode } = useColorMode()
  //   const [isPC = true] = useMediaQuery('(min-width: 48em)')
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
  const { data: balance = 0, isLoading } = useContractRead(contractOpt)

  //   console.log(id)
  const opts = []
  //   console.log(balance, addr)
  const balNum = balance ? balance.toNumber() : 0
  for (var i = 0; i < balNum; i++) {
    opts.push({
      ...contractOpt,
      functionName: 'tokenOfOwnerByIndex',
      args: [addr, i],
    })
  }
  const { data: ids = [] } = useContractReads({ contracts: opts })

  console.log(ids, isLoading)

  return (
    <>
      {isLoading ? (
        <LoadingPanel />
      ) : (
        <Box
          borderRadius="30px"
          border="1px solid"
          borderColor="gray.200"
          py={4}
          px={4}
        >
          <SimpleGrid columns={[4]} spacing={6}>
            {ids.map((id, idx) => {
              return (
                <>
                  <NFT
                    key={idx}
                    cid={cid}
                    id={id.toNumber()}
                    mediaType={mediaType}
                    collectionName={collectionName}
                    baseURI={baseURI}
                  />
                </>
              )
            })}
          </SimpleGrid>
        </Box>
      )}
    </>
  )
}
export default Component
