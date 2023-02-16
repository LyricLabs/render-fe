import React, { useEffect, useState } from 'react'
import {
  Box,
  VStack,
  Flex,
  Text,
  Image,
  Tooltip,
  useColorMode,
  Center,
} from '@chakra-ui/react'

import { useTranslation } from 'next-i18next'

import { useNFTInfo } from 'api/query'

const Component = ({
  cid = '',
  metadata = {},
  id,
  collectionName,
  width = '312px',
  mediaType = '',
  baseURI = '',
  onClick = () => {},
}) => {
  const { t } = useTranslation('common')
  //   const { colorMode } = useColorMode()
  //   const [isPC = true] = useMediaQuery('(min-width: 48em)')

  let { data = {}, isLoading } = useNFTInfo(cid, id, baseURI)
  // console.log(data, '===data====')
  if (!data || !data.name) {
    data = metadata
  }
  let { mediaUrl = '', description, previewUrl = null, name, thumbnail } = data

  if (thumbnail) {
    mediaUrl = `https://gateway.pinata.cloud/ipfs/${thumbnail.cid}`
  }

  return (
    <Box
      minW="200px"
      w="100%"
      maxW={width}
      borderRadius={6}
      // border={colorMode == 'light' ? 'none' : '1px solid gray'}
      // bgColor={colorMode == 'light' ? '' : '#253045'}
      boxShadow="0px 24px 40px rgba(23, 35, 58, 0.12);"
      onClick={() => {
        onClick(mediaUrl)
      }}
    >
      <VStack w="100%" h="100%" pos="relative" spacing={1}>
        <Box
          h="100%"
          w="100%"
          bgColor="#010001"
          overflow="hidden"
          borderRadius="10px"
        >
          {/* {mediaType == 'video/mp4' && (
            <Box
              as="video"
              controls
              playsInline
              width="100%"
              height="200px"
              src={`${mediaUrl}`}
              objectFit="cover"
            />
          )} */}
          {mediaType == 'svg' && (
            <Box
              width="100%"
              height="200px"
              dangerouslySetInnerHTML={{
                __html: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 3000 3000" width='100%' height='100%'>${mediaUrl}</svg>`,
              }}
            ></Box>
          )}
          {(mediaType == 'image' ||
            mediaType == '' ||
            mediaType.indexOf('image') == 0) &&
            mediaUrl && (
              <Image
                w="100%"
                h="100%"
                src={`${previewUrl ? previewUrl : mediaUrl}`}
                objectFit="contain"
              />
            )}
          {!mediaType && (
            <Center h="100%" w="100%">
              {t('media.not.found')}
            </Center>
          )}
        </Box>

        {/* <VStack w="100%" h="70px" py={2} px={4}>
          <Text w="100%" wordBreak="break-word" noOfLines={2} fontSize="10px">
            {name}
          </Text>
          <Text w="100%" maxH="30px" overflow="scroll" fontSize="10px">
            {description}
          </Text>
        </VStack> */}
        {/* <Flex
          px={2}
          w="100%"
          h="30px"
          justifyContent="space-between"
          opacity="0.6"
          alignItems="center"
          pb={2}
        >
          {collectionName.length < 10  ? (
            <Flex fontSize="12px">
              {Number(editionNum) >= 0 && Number(maxEditionNum) > 0 ? (
                <Text>
                  {editionNum}
                  {Number(maxEditionNum) < 1000 ? <>/{maxEditionNum}</> : ''}
                </Text>
              ) : (
                <Text>{id}</Text>
              )}
            </Flex>
          ) : (
            <Box></Box>
          )}
          <Tooltip label={originUrl ? t(tips) : null}>
            <Flex
              cursor="pointer"
              fontSize={collectionName.length > 10 ? '10px' : '14px'}
              onClick={() => {
                originUrl && window.open(originUrl, '_blank')
              }}
            >
              <Text>{collectionName}</Text>
              {collectionLogoUrl && collectionLogoUrl.length > 1 && (
                <Image
                  bg="white"
                  border="2px solid white"
                  borderRadius="full"
                  w="20px"
                  h="20px"
                  src={collectionLogoUrl}
                  ml={2}
                />
              )}
            </Flex>
          </Tooltip>
        </Flex> */}
      </VStack>
    </Box>
  )
}
export default Component
