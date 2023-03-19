import React, { useEffect, useState } from 'react'
import { useContract, useContractRead, useContractReads } from 'wagmi'

import { SimpleGrid, Box } from '@chakra-ui/react'

import { useTranslation } from 'next-i18next'
import LoadingPanel from 'components/loadingPanel'
import Empty from 'components/empty'
import NFT from './nft'

const Component = ({
  nft,
  addr,
  abi,
  collectionName,
  baseURI,
  cid = '',
  mediaType = 'image',
  onChange = () => {},
}) => {
  const { t } = useTranslation('common')
  //   const { colorMode } = useColorMode()
  //   const [isPC = true] = useMediaQuery('(min-width: 48em)')
  //   const {
  //     data: ownedNFTs = [],
  //     isLoading,
  //     error,
  //   } = useOwnedNFTs(contract, addr)
  const [selected, setSelect] = useState([])
  const contractOpt = {
    address: nft,
    abi: abi,
    functionName: 'balanceOf',
    args: [addr],
  }
  const { data: balance = 0 } = useContractRead(contractOpt)

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
  const { data: ids = [], isLoading } = useContractReads({ contracts: opts })

  //   console.log(ids, isLoading)
  useEffect(() => {
    onChange(selected)
  }, [selected])

  return (
    <>
      {isLoading ? (
        <LoadingPanel />
      ) : (
        <Box borderRadius="30px" borderColor="gray.200" py={4} px={4}>
          {ids.length > 0 ? (
            <SimpleGrid columns={[2]} spacing={6}>
              {ids.map((id, idx) => {
                const idNum = id.toNumber()
                return (
                  <Box
                    key={idx}
                    p="10px"
                    cursor="pointer"
                    borderRadius="20px"
                    bgColor={
                      selected.id == idNum ? 'rgba(133, 90, 255, 0.1)' : ''
                    }
                    border={selected.id == idNum ? '2px solid #855AFF' : 'none'}
                  >
                    <NFT
                      key={idx}
                      cid={cid}
                      id={id.toNumber()}
                      mediaType={mediaType}
                      collectionName={collectionName}
                      baseURI={baseURI}
                      onClick={(imgUrl) => {
                        const data = { collectionName, id: idNum, imgUrl }
                        setSelect(data)
                        // console.log(data)
                      }}
                    />
                  </Box>
                )
              })}
            </SimpleGrid>
          ) : (
            <Empty minH="400px" tip={t('empty')} />
          )}
        </Box>
      )}
    </>
  )
}
export default Component
