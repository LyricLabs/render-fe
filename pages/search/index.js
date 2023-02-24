import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Center, Stack, Box, Input, Flex, Text, Button } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ReactGA from 'react-ga'
import { useRouter } from 'next/router'
import Spinner from 'react-cli-spinners'

import {
  validateAddress,
  validateDomain,
  validateEmoji,
  toast,
} from '../../utils'
import { calcHash, getDomainAvaliableWithRaw, getDomainPrice } from '../../api'
import { setRenewerPanelStatus } from '../../stores/modal'
import { chineseReg } from '../../utils/hash'

import RenewModal from '../../components/renewModal'
import Layout from '../../components/layouts/appBase'
import { fnId, gaCode, isBrowser } from '../../config/constants'
import Logo from '../../components/logos/logoV'

export default function Home() {
  const { t } = useTranslation()
  const router = useRouter()
  const [timer, setTimer] = useState(0)

  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [error, setError] = useState(false)
  const [domain, setDomain] = useState({})
  const { fns, openRegister = false } = router.query
  const [value, setValue] = useState('')

  useEffect(() => {
    ReactGA.initialize(gaCode)
    ReactGA.pageview(window.location.pathname)
  }, [])

  useEffect(() => {
    if (fns) {
      setValue(fns.toLowerCase())
      setTimeout(() => {
        document.getElementById('search').click()
      }, 1000)
    }
  }, [fns])

  const setInvalidError = (error) => {
    setInvalid(true)
    setError(error)
  }

  const checkDomain = async (searchStr) => {
    setLoading(true)

    if (searchStr.split('.').length > 2) {
      setInvalidError(t('name.invalid'))
      return
    }
    let name = ''
    let root = ''
    if (searchStr.indexOf('.') == -1) {
      name = searchStr.toLowerCase()
      root = 'fn'
    } else {
      const nameArr = searchStr.toLowerCase().split('.')
      name = nameArr[0]
      root = nameArr[1]
      if (root !== 'fn') {
        if (root === 'meow') {
          setInvalidError(t('not.open'))
          return
        }
        // todo multi root support
        setInvalidError(t('root.invalid'))
        return
      }
    }

    const flag = validateEmoji(searchStr)
    if (!flag) {
      setInvalidError(t('emoji.notsupport'))
    }

    if (flag && !validateDomain(name)) {
      setInvalidError(t('name.invalid'))
      return false
    }

    if (
      name.indexOf('-') >= 0 ||
      name.indexOf('_') >= 0 ||
      chineseReg.test(name)
    ) {
      setInvalidError(t('name.not.open'))
      return false
    }

    const price = await getDomainPrice(fnId, name)
    if (!price) {
      setInvalidError(t('name.not.open'))
      return false
    }
    const available = await getDomainAvaliableWithRaw(name, root)
    const hash = await calcHash(name, root)
    setLoading(false)

    setDomain({ name: `${name}.${root}`, nameHash: hash, available })
  }

  const handleSearch = async (duration = 2000) => {
    setDisable(true)

    const calc = async (val) => {
      setDomain({})

      if (val == '') {
        setInvalid(true)
        setError(t('cannot.empty'))
        setDisable(false)
        return
      }

      if (val.indexOf('0x') == 0) {
        const valid = validateAddress(0, val)
        if (valid) {
          router.push(`/account/${val}`)
          return
        }
        setInvalid(!valid)
        setError(t('address.invalid'))
      }

      await checkDomain(value)

      ReactGA.event({
        category: `searchDomain`,
        action: `search ${value}`,
      })
      setDisable(false)
      setLoading(false)
      if (openRegister) {
        setRenewerPanelStatus(true)
      }
    }

    if (!timer) {
      setTimer(setTimeout(() => calc(value), duration))
    } else {
      clearTimeout(timer)
      setTimer(setTimeout(() => calc(value), duration))
    }
  }

  return (
    <Box h="100%" w="100%" pt="60px">
      <Stack w="100%" spacing={4}>
        <Center>
          <Logo width="250px" height="240px" opacity="0.8" />
        </Center>
        <Center w="100%">
          <Flex w={['95%', '80%', '40%', '40%']} mx={[0, 2, 4, 0]} size="lg">
            <Input
              value={value}
              isInvalid={invalid}
              variant="flushed"
              errorBorderColor="secondary"
              mx={1}
              placeholder={t('search.placeholder')}
              onChange={(e) => {
                const inputVal = e.target.value
                setInvalid(false)
                setValue(inputVal.toLowerCase())
              }}
            ></Input>
            <Button
              id="search"
              colorScheme="purple"
              isLodaing={loading}
              isDisabled={disable}
              size="md"
              onClick={handleSearch}
            >
              {t('search')}
            </Button>
          </Flex>
        </Center>
        <Center>
          {invalid && (
            <Text opacity="0.6" textAlign="left">
              {error}
            </Text>
          )}
        </Center>
        {loading && (
          <Center>
            <Spinner type="dots" />
          </Center>
        )}
        {domain && domain.name && (
          <Center w="100%">
            <Flex
              w={['95%', '80%', '40%', '40%']}
              px={4}
              h="40px"
              justifyContent="space-between"
            >
              <Text lineHeight="40px">{domain.name}</Text>
              <Box>
                {domain.available ? (
                  <Button
                    color="primary"
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setRenewerPanelStatus(true)
                      ReactGA.modalview(`/register/${domain.name}/`)
                    }}
                  >
                    {t('register')}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="link"
                    size="xs"
                    lineHeight="38px"
                    onClick={() => {
                      router.push(`/doodles/${domain.name}`)
                    }}
                  >
                    {t('show.doodle.render')}
                    {'->'}
                  </Button>
                )}
              </Box>
            </Flex>
          </Center>
        )}
        {domain && domain.name && (
          <RenewModal
            domain={domain}
            isRenew={false}
            cb={() => {
              router.push(`/domain/${domain.name}`)
            }}
          />
        )}
      </Stack>
    </Box>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})
