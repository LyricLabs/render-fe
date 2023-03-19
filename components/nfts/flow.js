import React, { useEffect, useState } from 'react'
import { Box, SimpleGrid, Center, Button } from '@chakra-ui/react'

import { useTranslation } from 'next-i18next'
import { useFlowNFTs } from 'api/query'
import LoadingPanel from '../loadingPanel'
import NFT from './nft'
import Empty from '../../components/empty'

const Component = ({ addr, path, maxSelect = 5, onChange = () => {} }) => {
  const { t } = useTranslation('common')
  //   const { colorMode } = useColorMode()
  //   const [isPC = true] = useMediaQuery('(min-width: 48em)')
  const {
    data = { pages: [] },
    isFetching,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFlowNFTs(path, addr)
  let { pages = [] } = data
  const [selected, setSelect] = useState([])

  const hasData = pages[0] && !!pages[0].hasOwnProperty('nfts')

  useEffect(() => {
    onChange(selected)
  }, [selected])

  const hasSelected = (id) => {
    var idx = -1
    let index = -1
    selected.map((nft) => {
      idx++
      if (nft.id == id) {
        // console.log(index, nft, '=======')
        index = idx
        return
      }
    })

    return index
  }
  // console.log(pages, 'pages===')
  return (
    <>
      {isLoading ? (
        <LoadingPanel />
      ) : (
        <Box borderRadius="30px" py={4} px={4}>
          {hasData ? (
            <SimpleGrid columns={[2]} spacing={6}>
              {pages.map((page) => {
                return page.nfts?.map((nft, idx) => {
                  const { id } = nft
                  const selectedIdx = hasSelected(id)
                  return (
                    <Box
                      key={idx}
                      p="10px"
                      cursor="pointer"
                      borderRadius="20px"
                      bgColor={
                        selectedIdx >= 0 ? 'rgba(133, 90, 255, 0.1)' : ''
                      }
                      border={selectedIdx >= 0 ? '2px solid #855AFF' : 'none'}
                    >
                      <NFT
                        key={idx}
                        metadata={nft}
                        onClick={async (imgUrl) => {
                          const { id, name } = nft
                          const data = { id, name, imgUrl }
                          const selectIdx = hasSelected(id)
                          if (selectIdx >= 0) {
                            const arr = selected.filter((i) => {
                              return i.id != id
                            })
                            console.log(arr)
                            await setSelect(arr)

                            return
                          }
                          if (selected.length < maxSelect) {
                            await setSelect([...selected, data])
                          } else {
                            return
                          }
                        }}
                      />
                    </Box>
                  )
                })
              })}
            </SimpleGrid>
          ) : (
            <Empty minH="400px" tip={'Empty'} />
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
