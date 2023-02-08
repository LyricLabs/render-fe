import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import Big from 'big.js'
import ReactGA from 'react-ga'

import {
  Flex,
  Text,
  Input,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorMode,
  useTheme,
  useNumberInput,
  HStack,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react'

import infoModalStore, { setRenewerPanelStatus } from '../../stores/modal'
import { useTranslation } from 'next-i18next'
import { toast } from '../../utils'
import { renewDomain, getDomainPrice, registerDomain } from '../../api'
import { oneYear, fnId } from '../../config/constants'
import DashBtn from '../dashBtn'

const Comp = (props) => {
  const theme = useTheme()
  const { colorMode } = useColorMode()
  const bgColor = colorMode === 'light' ? '#ffffff' : '#17233A'
  const textPrimary = colorMode === 'light' ? '#17233A' : '#ffffff'
  const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary

  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [disable, setDisable] = useState(false)

  const [price, setPrice] = useState(0.0)

  const { t } = useTranslation()
  const { domain, onClose, size = 'md', cb, isRenew = true } = props

  const { nameHash, name } = domain

  const domainArr = name.split('.')
  const label = domainArr[0]

  const { domainRenewerShow } = infoModalStore.useState('domainRenewerShow')

  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    value: year,
  } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: 30,
    precision: 0,
  })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps({ isReadOnly: true })

  const handleClose = async () => {
    setRenewerPanelStatus(false)
    if (onClose) {
      onClose()
    }
  }

  const calcPrice = async () => {
    setDisable(true)
    const calc = async () => {
      const res = await getDomainPrice(fnId, label)
      if (res == null) {
        toast({
          title: t(`get.price.fail`),
          status: 'info',
          duration: 3000,
          isClosable: true,
        })
      } else {
        const price = Big(oneYear).mul(year).mul(res)
        setPrice(price.toString())
      }
      setDisable(false)
    }
    if (!timer) {
      setTimer(setTimeout(calc, 2000))
    } else {
      clearTimeout(timer)
      setTimer(setTimeout(calc, 2000))
    }
  }

  useEffect(() => {
    calcPrice()
  }, [year])

  const handleSubmit = async () => {
    if (disable) {
      return
    }
    const eventType = isRenew ? 'renew' : 'register'

    ReactGA.event({
      category: eventType,
      action: `${eventType} ${name} submit`,
      value: Number(price),
    })
    setLoading(true)
    try {
      const duration = Big(oneYear).mul(year).toFixed(2)
      const transaction = isRenew ? renewDomain : registerDomain
      const res = await transaction(fnId, isRenew ? nameHash : label, duration, price)

      const { status = 0 } = res
      if (status === 4) {
        toast({
          title: t(isRenew ? 'renew.success' : 'register.success'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        if (cb) {
          cb()
        } else {
          Router.reload()
        }
        ReactGA.event({
          category: eventType,
          action: `${eventType} ${name} submit success`,
          value: Number(price),
        })
        handleClose()
      }
    } catch (error) {
      console.log(error)
      toast({
        title: t(isRenew ? 'renew.error' : 'register.error'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      ReactGA.event({
        category: eventType,
        action: `${eventType} ${name} submit failed`,
        value: Number(price),
      })
      setLoading(false)
    }
    setLoading(false)
    handleClose()
  }

  return (
    <>
      <Modal onClose={handleClose} size={size} isOpen={domainRenewerShow}>
        <ModalOverlay />
        <ModalContent bgColor={bgColor}>
          <ModalHeader>{t(isRenew ? 'renew.title' : 'register.title', { name: name })}</ModalHeader>
          <ModalCloseButton />
          <ModalBody opacity={0.8}>
            <Box
              border='1px dashed rgba(0, 224, 117, 0.5)'
              rounded='xs'
              minH='100px'
              p={6}
              m='20px auto'
            >
              <Box>
                <HStack w='100%'>
                  <DashBtn {...inc}>+</DashBtn>
                  <InputGroup size='sm'>
                    <Input {...input} variant='flushed' px={4} />
                    <InputRightAddon border='none' bg={'transparent'}>
                      <Text>{t('year')}</Text>
                    </InputRightAddon>
                  </InputGroup>
                  <DashBtn {...dec}>-</DashBtn>
                </HStack>
                <Flex
                  h='50px'
                  w='100%'
                  lineHeight='50px'
                  fontWeight={500}
                  justifyContent='space-around'
                >
                  <Text>{t('price')}</Text>
                  <Text fontStyle='italic' fontWeight={800} textColor={primary}>
                    ₣ {price}
                  </Text>
                </Flex>
              </Box>
              <DashBtn
                variant='ghost'
                border='1px'
                borderStyle='dashed'
                isLoading={loading}
                isDisabled={disable}
                onClick={handleSubmit}
                w='100%'
                borderColor={primary}
                textColor={primary}
              >
                {t(isRenew ? 'renew' : 'register')}
              </DashBtn>
            </Box>
          </ModalBody>
          {/* <ModalFooter>
            <Button onClick={handleClose}>Close</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  )
}

export default Comp
