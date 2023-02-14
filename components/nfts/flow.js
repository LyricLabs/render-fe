import React, { useEffect, useState } from 'react'
import { Box, SimpleGrid, Center, Button } from '@chakra-ui/react'

import { useTranslation } from 'next-i18next'
import { useFlowNFTs } from 'api/query'
import LoadingPanel from '../loadingPanel'
import NFT from './nft'

const Component = ({ path }) => {
  const { t } = useTranslation('common')
  //   const { colorMode } = useColorMode()
  //   const [isPC = true] = useMediaQuery('(min-width: 48em)')
  const {
    data = { pages: [] },
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFlowNFTs(path, '0x9b2e947ba56602f8')
  let { pages = [] } = data
  const hasData = pages[0] && !!pages[0].hasOwnProperty('nfts')

  console.log(pages, 'pages===')
  return (
    <>
      {isFetching ? (
        <LoadingPanel />
      ) : (
        <Box
          borderRadius="30px"
          border="1px solid"
          borderColor="gray.200"
          py={4}
          px={4}
        >
          {hasData ? (
            <SimpleGrid columns={[2, 2, 3, 4, 5, 6]} spacing={6}>
              {/* {domains?.map((nft: NFTItem, idx: number) => {
          return <NFT key={idx} nft={nft} />
        })} */}

              {pages.map((page) => {
                return page.nfts?.map((nft, idx) => {
                  return <NFT key={idx} metadata={nft} />
                })
              })}
            </SimpleGrid>
          ) : (
            <Empty styles={{ h: '450px' }} tip={'Empty'} />
          )}
          {(hasData || hasNextPage) && (
            <Center m={4} w="100%">
              <Button
                disabled={!hasNextPage}
                variant="outline"
                isLoading={isFetching && hasData}
                onClick={() => {
                  fetchNextPage()
                }}
              >
                {'Load more'}
              </Button>
            </Center>
          )}
        </Box>
      )}
    </>
  )
}
export default Component
