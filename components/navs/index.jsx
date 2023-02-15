import React from 'react'
import Link from 'next/link'
import {
  Box,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

const Components = ({ links }) => {
  const { t } = useTranslation('common')
  const { asPath } = useRouter()

  const menus = Object.keys(links)
  const renderLink = (key, idx) => {
    const needSplit = idx !== menus.length - 1
    const link = links[key]

    if (typeof link === 'string') {
      const extral = link.indexOf('http') >= 0
      return (
        <Flex key={key} lineHeight="24px">
          {extral ? (
            <Box
              cursor="pointer"
              as="a"
              href={link}
              target="_blank"
              opacity="0.6"
            >
              <Text textStyle="link">{t(key)}</Text>
            </Box>
          ) : (
            <Link href={link}>
              <Box
                cursor="pointer"
                as="a"
                opacity={asPath.split('/')[1] === key ? '100%' : '60%'}
              >
                <Text textStyle="link">{t(key)}</Text>
              </Box>
            </Link>
          )}
          {needSplit && (
            <Text mx={1} opacity="12%">
              &nbsp;&nbsp;
            </Text>
          )}
        </Flex>
      )
    } else {
      const menuConfig = links[key]
      const keys = Object.keys(menuConfig)
      return (
        <Flex key={key} lineHeight="24px">
          <Menu isLazy>
            <MenuButton id="1" opacity="0.6">
              <Flex alignItems="center">
                <Text textStyle="link"> {t(key)}*</Text>
              </Flex>
            </MenuButton>
            <MenuList>
              {keys.map((key, idx) => {
                const href = menuConfig[key]
                const extral = href.indexOf('http') >= 0
                if (extral) {
                  return (
                    <MenuItem
                      as="a"
                      textStyle="link"
                      href={href}
                      target="_blank"
                      key={idx}
                    >
                      {t(key)}
                    </MenuItem>
                  )
                }
                return (
                  <MenuItem key={idx}>
                    <Link href={href}>
                      <Box cursor="pointer" as="a">
                        <Text textStyle="link">{t(key)}</Text>
                      </Box>
                    </Link>
                  </MenuItem>
                )
              })}
            </MenuList>
          </Menu>
          {needSplit && (
            <Text mx={1} opacity="12%">
              {'//'}
            </Text>
          )}
        </Flex>
      )
    }
  }

  return (
    <Flex justify="flex-start" w="100%">
      {menus.map((key, idx) => renderLink(key, idx))}
    </Flex>
  )
}
export default Components
