import {
  Flex,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Text,
  Portal,
  IconButton,
  useClipboard,
  Link,
} from '@chakra-ui/react'

import {
  EmailShareButton,
  FacebookMessengerShareButton,
  InstapaperShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WeiboShareButton,
  WhatsappShareButton,
  EmailIcon,
  RedditShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  InstapaperIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WeiboIcon,
  WhatsappIcon,
  RedditIcon,
} from 'react-share'
import { useTranslation } from 'next-i18next'
import { MdOutlineFileCopy } from 'react-icons/md'
import { toast } from '../../utils'

export default function Comp({ children, btnStyle, content, baseUrl }) {
  const { t } = useTranslation()
  const url = content ? content() : 'https://flowns.org'
  const title = t('share.title')
  const { onCopy } = useClipboard(`${title}  ${url}`)

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton {...btnStyle} border='none' variant='gohst'>
          {children}
        </IconButton>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>{t('share.my')}</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <TwitterShareButton url={url} title={title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <FacebookMessengerShareButton url={url} appId='521270401588372'>
              <FacebookMessengerIcon size={32} round />
            </FacebookMessengerShareButton>
            <TelegramShareButton url={title} title={url}>
              <TelegramIcon size={32} round />
            </TelegramShareButton>
            <WhatsappShareButton url={url} title={title} separator=':: '>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <LinkedinShareButton url={url}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <RedditShareButton url={url} title={title} windowWidth={660} windowHeight={460}>
              <RedditIcon size={32} round />
            </RedditShareButton>
            <EmailShareButton url={url} subject={title} body='body'>
              <EmailIcon size={32} round />
            </EmailShareButton>
            <WeiboShareButton
              url={url}
              title={title}
              // image={`${String(window.location)}/${exampleImage}`}
            >
              <WeiboIcon size={32} round />
            </WeiboShareButton>
            <InstapaperShareButton url={url} title={title}>
              <InstapaperIcon size={32} round />
            </InstapaperShareButton>
            <Flex alignItems='center' justifyContent='space-between' mt={2}>
              <Text>{t('share.copy')}</Text>
              <IconButton
                size='xs'
                variant='ghost'
                color='primary'
                onClick={() => {
                  onCopy()
                  toast({
                    title: t('copied'),
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                }}
                icon={<MdOutlineFileCopy />}
              />
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
