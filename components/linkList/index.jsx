import { Text, Flex, Box, Stack, Link } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

export default function Comp(props) {
  // const { t } = useTranslation()
  const { links = [], styles, linkStyle } = props

  const renderItem = ({ name, url }) => {
    return (
      <Link key={name} href={url} isExternal textDecoration='underline' {...linkStyle}>
        {`<${name}>`}
      </Link>
    )
  }

  return (
    <Stack {...styles}>
      {links.map((link) => {
        return renderItem(link)
      })}
    </Stack>
  )
}
