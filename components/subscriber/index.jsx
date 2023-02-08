import React, { useState } from 'react'
import {
  Text,
  Flex,
  Button,
  Box,
  Input,
  InputGroup,
  useColorMode,
  useTheme,
  useMediaQuery,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useMailChimp } from 'react-use-mailchimp-signup'
import { mailURL } from '../../config/constants'
import Spinner from 'react-cli-spinners'

export default function Comp(props) {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const [isPC = true] = useMediaQuery('(min-width: 48em)')

  const theme = useTheme()
  const bgColor = colorMode === 'light' ? '#ffffff' : '#17233A'
  const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary
  const { onSub } = props
  const { error, loading, status, subscribe, message } = useMailChimp({
    action: mailURL,
  })
  const [inputs, setInputs] = useState({})
  const handleInputChange = (event) => {
    event.persist()
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault()
    }
    if (inputs) {
      subscribe(inputs)
      onSub(inputs)
    }
  }

  const renderBtn = () => {
    return (
      <Button
        cursor='pointer'
        as='a'
        mt={1}
        variant='unstyled'
        type='submit'
        size='sm'
        color={primary}
        onClick={handleSubmit}
      >
        {`<${t('subscribe')}>`}
      </Button>
    )
  }

  const renderTitle = () => {
    return (
      <Text w='140px' mt={1} mr={4} lineHeight='22px' h='24px' textStyle='h3'>
        {t('subscribe.label')}
      </Text>
    )
  }
  return (
    <Box w={['100%', '100%', '500px']}>
      <Text mb={4} textStyle='h3'>
        * {t('subscribe.title')}
      </Text>
      <Text h='80px' textStyle='desc'>
        {t('subscribe.desc')}
      </Text>

      <form onSubmit={handleSubmit}>
        {!isPC && renderTitle()}
        <InputGroup size='md'>
          {isPC && renderTitle()}

          <Input
            bgColor={bgColor}
            size='xs'
            variant='flushed'
            placeholder='email'
            name='email'
            id='mchimpEmail'
            onChange={handleInputChange}
            _focus={{ borderColor: primary, boxShadow: 'box-shadow: 0px 1px 0px 0px primary' }}
          />
          {isPC && renderBtn()}
        </InputGroup>
        {!isPC && renderBtn()}
      </form>
      <Flex>
        {loading && (
          <Text color={primary}>
            <Spinner type='dots' />
          </Text>
        )}
        &nbsp;
        {status && <Text textStyle='desc'>{t(status)}</Text>}
      </Flex>
    </Box>
  )
}
