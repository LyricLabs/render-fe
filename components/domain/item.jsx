import { useState } from 'react'
import {
  Box,
  VStack,
  Flex,
  Text,
  Center,
  useMediaQuery,
  Button,
  AvatarGroup,
  Avatar,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Atropos } from 'atropos/react'

import moment from 'moment'

import accountStore from '../../stores/account'
import { timeformater } from '../../utils/index'
import { hostSuffix } from '../../config/constants'

import icon from '../../public/assets/flowns_icon_gray_dark.svg'

const oneWeek = 60 * 60 * 24 * 7
const currentTime = moment().unix()

export default function Comp(props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [isPC = true] = useMediaQuery('(min-width: 48em)')

  const { user } = accountStore.useState('user')
  const { domain, defaultDomain = '', isDetail = false } = props

  let { avatarObj = {}, bgObj = {}, items = [] } = props

  const [isHover, setHover] = useState(false)
  const {
    name,
    owner,
    // nameHash,
    id,
    expiredAt,
    // parentName,
    // createdAt,
    // vaultBalances,
    // collections,
    // receivable,
    deprecated,
    deprecatedAt,
    texts = {},
  } = domain

  // const isOwner = user.addr === owner

  const nameArr = name.split('.')
  const domainName = nameArr[0]
  const length = domainName.length
  const duration = expiredAt - currentTime
  const isExpired = currentTime - expiredAt > 0
  const willExpired = !isExpired && duration < oneWeek && duration > 0

  const showWarning = deprecated || willExpired || isExpired
  const showBtns = (!isPC || isHover) && !isDetail

  const renderConfigStr = texts['_render'] || '{}'
  const renderConfig = JSON.parse(renderConfigStr)

  const doodleRender = renderConfig.doodlesRender || null

  if (!isDetail && doodleRender) {
    avatarObj = doodleRender['Doodles'] || {}
    bgObj = doodleRender['Dooplicator'] || {}
    items = doodleRender['Wearables'] || []
  }

  let backgroundColor = 'gray'
  if (bgObj && bgObj.id) {
    backgroundColor =
      'conic-gradient(from 180deg at 50% 50%, #FFAC99 0deg, #FFD373 56.25deg, #FFE780 121.87deg, #83FFC1 187.5deg, #99E2FF 251.25deg, #DEBEF8 305.62deg, #FFAC99 360deg);'
  }

  // switch (length) {
  //   case 5:
  //     backgroundColor =
  //       'linear-gradient(117.2deg, rgba(67, 244, 255, 0.2) 41.23%, rgba(23, 35, 58, 0) 83.5%), linear-gradient(180deg, #9CB7FF 0%, #1F2545 100%);'
  //     break
  //   case 4:
  //     backgroundColor =
  //       'linear-gradient(117.2deg, rgba(67, 244, 255, 0.2) 41.23%, rgba(23, 35, 58, 0) 83.5%), linear-gradient(180deg, #00E075 0%, #17233A 100%);'
  //     break
  //   case 3:
  //     backgroundColor =
  //       'linear-gradient(117.2deg, rgba(255, 255, 255, 0.2) 41.23%, rgba(23, 35, 58, 0) 83.5%), linear-gradient(180deg, #0EDB8D 0%, #4313AB 100%);'
  //     break
  //   case 2:
  //     backgroundColor =
  //       'linear-gradient(117.2deg, rgba(198, 54, 210, 0.2) 41.23%, rgba(23, 35, 58, 0) 83.5%), linear-gradient(180deg, #FF5F49 0%, #003DCA 100%);'
  //     break
  //   default:
  //     backgroundColor =
  //       'linear-gradient(117.2deg, rgba(97, 137, 207, 0.2) 41.23%, rgba(23, 35, 58, 0) 83.5%), linear-gradient(180deg, #1E4C6F 0%, #072342 100%);'
  // }

  const width = 300
  const height = 400

  // const renderLabel = (text, link = '', extra = false) => {
  //   let Container = Box
  //   const isLink = link.length > 0
  //   if (isLink) {
  //     Container = Link
  //   }

  //   return (
  //     <Box
  //       px={4}
  //       height="24px"
  //       borderRadius={4}
  //       bg="rgba(23, 35, 58, 0.6)"
  //       cursor={isLink ? 'pointer' : ''}
  //       fontSize={14}
  //       lineHeight="24px"
  //     >
  //       <Container href={link} extra={extra}>
  //         <Text textDecoration={isLink ? 'underline' : ''}>{text}</Text>
  //       </Container>
  //     </Box>
  //   )
  // }

  // const renderBottom = (time, id) => {
  //   const dateStr = timeformater(time, 'DD MMM YYYY')

  //   return (
  //     <Flex
  //       justifyContent="space-between"
  //       color="rgba(255, 255, 255, 0.4)"
  //       fontWeight={500}
  //       fontSize="10px"
  //     >
  //       <Box>
  //         <Text>Exp: {dateStr}</Text>
  //       </Box>
  //       <Box>
  //         <Text fontWeight={500} fontStyle="italic">
  //           No.{id}
  //         </Text>
  //       </Box>
  //     </Flex>
  //   )
  // }

  return (
    <Atropos
      className="my-atropos"
      activeOffset={40}
      onEnter={() => {
        setHover(true)
      }}
      onLeave={() => {
        setHover(false)
      }}
    >
      <Box
        pos="relative"
        p={4}
        w={width}
        h={(height / 4, height / 3, height)}
        bg={backgroundColor}
        overflow="hidden"
        borderRadius={6}
        cursor="pointer"
        boxShadow="0px 24px 40px rgba(23, 35, 58, 0.12);"
      >
        <VStack
          h="100%"
          border="1px dashed rgba(255, 255, 255, 0.2)"
          pos="relative"
          borderRadius={6}
        >
          <Box
            pos="absolute"
            w="32px"
            h="32px"
            right="10px"
            borderRadius={4}
            bg="rgba(23, 35, 58, 0.6)"
            cursor="pointer"
            opacity={0.6}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              window.open(`https://${domainName}.${hostSuffix}`, '_blank')
            }}
          >
            <Image
              height="32px"
              width="32px"
              src={icon}
              alt="go to domain page"
            />
          </Box>

          <Box pt={10}>
            {avatarObj && avatarObj.id ? (
              <Box border="5px solid white" borderRadius="10px">
                <Box
                  w="185px"
                  height="185px"
                  size="xl"
                  bgImage={avatarObj.imgUrl}
                  bgSize="contain"
                />
              </Box>
            ) : (
              <Box h="100px" />
            )}
          </Box>
          <Box px={4}>
            <Text
              w="100%"
              wordBreak="break-word"
              noOfLines={2}
              fontSize="20px"
              fontWeight={900}
              color="white"
            >
              {name}
            </Text>
          </Box>

          <Box pt={2}>
            {items.length > 0 ? (
              <Box>
                <AvatarGroup size="md" max={5}>
                  {items.map((nft, idx) => {
                    const { name, imgUrl } = nft
                    return <Avatar key={idx} name={name} src={imgUrl} />
                  })}
                </AvatarGroup>
              </Box>
            ) : (
              <Box h="100px" />
            )}
          </Box>
          {/* {renderLabel(
          isOwner ? `Owner: ${t('domain.owner')}` : `Owner: ${owner}`,
          `/account/${owner}`,
        )} */}
          {/* <Box color="white">
            {defaultDomain.length == 0
              ? renderLabel(`Owner: ${owner}`, `/account/${owner}`)
              : renderLabel(
                  `Owner: ${defaultDomain}`,
                  `/domain/${defaultDomain}`,
                )}
          </Box> */}

          {showBtns && (
            <Box pos="absolute" h="100%" top="50%">
              <Button
                colorScheme="purple"
                borderRadius="full"
                onClick={() => {
                  router.push(`/doodles/${name}`)
                }}
              >
                Render
              </Button>
            </Box>
          )}
          {/* <Box w="100%" p={4} pos="absolute" bottom={0}>
            {renderBottom(expiredAt, id)}
          </Box> */}
        </VStack>
      </Box>
    </Atropos>
  )
}
