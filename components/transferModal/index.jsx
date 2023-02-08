import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import { useTranslation } from 'next-i18next'

import Spinner from 'react-cli-spinners'
import ReactGA from 'react-ga'

import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ButtonGroup,
  Flex,
} from '@chakra-ui/react'
import { SelectControl, NumberInputControl, SubmitButton, InputControl } from 'formik-chakra-ui'
import * as Yup from 'yup'
import useCurrentUser from '../../hooks/currentUser'
import { getSupportTokenConfig } from '../../config/constants'
import { transferNFT, transferToken, queryDomainRecord } from '../../api'
import { toast, validateAddress, validateDomain, isFlowAddr } from '../../utils'
import accountStore from '../../stores/account'
import modalStore, { setTransferModalConf } from '../../stores/transferModal'

// import TokenLogo from '../../components/tokenLogo'

const Components = ({ cb }) => {
  const { t } = useTranslation()
  const tokenConfigs = getSupportTokenConfig()
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [resolving, setResolving] = useState(false)

  const [resolver, setResolver] = useState('')

  const { transferModalConf = {} } = modalStore.useState('transferModalConf')
  const { type, token, isOpen } = transferModalConf
  const { tokenBals } = accountStore.useState('tokenBals')
  const [user] = useCurrentUser()

  useEffect(() => {
    ReactGA.event({
      category: `tranferModal`,
      action: `${isOpen ? 'open' : 'close'} transfer ${type} ${token}`,
    })
    setResolver('')
  }, [isOpen])

  const validationSchema = Yup.object({
    token: Yup.string().required(t('required')),
    amount: Yup.number()
      .min(0)
      .test('validateBal', t('bal.not.enough'), (value, context) => {
        if (type !== 'FT') {
          return true
        }
        const { token } = context.parent
        const balance = tokenBals[token]
        const bal = Number(balance)
        return bal >= value
      }),
    to: Yup.string()
      .required()
      .test('validateAddr', t('address.invalid'), (value = '', context) => {
        if (value.indexOf('0x') == 0 && value.indexOf('.') == -1) {
          setResolver('')
          return validateAddress(0, value)
        } else {
          return true
        }
      })
      .test('validateDomain', t('domain.invalid'), async (value = '', constext) => {
        if (value.indexOf('.') == -1 && value.indexOf('0x') == 0) {
          return true
        }
        let nameArr = value.split('.')
        setResolver('')
        if (nameArr.length == 2 && nameArr[1].length > 1) {
          await handleValidate(value)
          return validateDomain(value)
        }
        return false
      }),
  })

  const onClose = () => {
    setTransferModalConf({
      type: '',
      token: '',
      isOpen: false,
    })
  }

  const handleValidate = async (value = '') => {
    const delay = 2000
    setResolving(true)
    const validate = async () => {
      if (value.indexOf('.') == -1) {
        return false
      }
      let flag = validateDomain(value)
      if (!flag) {
        return false
      }
      let nameArr = value.split('.')
      if (nameArr.length !== 2) return false
      let res = await queryDomainRecord(nameArr[0], nameArr[1])
      setResolver(res)
      setResolving(false)
    }
    if (!timer) {
      setTimer(setTimeout(validate, delay))
    } else {
      clearTimeout(timer)
      setTimer(setTimeout(validate, delay))
    }
  }

  const onSubmit = async (values) => {
    const { token, amount, to } = values
    const from = user?.addr
    const gaVaule = type == 'NFT' ? 0 : Number(amount)
    ReactGA.event({
      category: `tranferModal`,
      action: `${from} transfer ${token} to ${to} submit`,
      value: gaVaule,
    })
    setLoading(true)
    try {
      let req = null
      if (type == 'FT') {
        req = transferToken(token, Number(amount), to)
      } else {
        req = transferNFT(type, token, to)
      }
      const res = await req

      const { status = 0 } = res
      if (status === 4) {
        ReactGA.event({
          category: `tranferModal`,
          action: `${from} transfer ${token} to ${to} success`,
          value: gaVaule,
        })
        toast({
          title: t(`transfer.success`, { token: token }),
          status: 'success',
        })
        onClose()
        cb && cb()
      }
    } catch (error) {
      ReactGA.event({
        category: `tranferModal`,
        action: `${from} transfer ${token} to ${to} failed`,
        value: gaVaule,
      })
      toast({
        title: t(`transfer.error`, { token: token }),
        status: 'error',
      })
      setLoading(false)
    }
    setLoading(false)
    onclose()
  }

  const initialValues = {
    token: token,
    amount: '',
    to: '',
  }

  // 2. Create the form
  const renderForm = () => {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={true}
      >
        {({ handleSubmit, values, errors, setFieldValue }) => (
          <Box
            border='1px dashed rgba(0, 224, 117, 0.5)'
            rounded='md'
            // minH='300px'
            p={4}
            as='form'
            onSubmit={handleSubmit}
          >
            <Box>
              {type == 'FT' ? (
                <>
                  <SelectControl
                    mb={4}
                    label={t('token')}
                    name='token'
                    selectProps={{
                      placeholder: t('select.token'),
                      variant: 'flushed',
                    }}
                  >
                    {Object.keys(tokenConfigs).map((tk, idx) => {
                      return (
                        <option
                          key={idx}
                          value={tk}
                          onClick={(val) => {
                            // console.log(val, 'click')
                          }}
                        >
                          {/* <TokenLogo symbol={token} size={8} /> */}
                          {tk}
                        </option>
                      )
                    })}
                  </SelectControl>
                  <Flex mb={2} justifyContent='space-between' fontSize='10px' opacity={0.7}>
                    <Text>{t('balance')}</Text>
                    <Text>{tokenBals[values.token]}</Text>
                  </Flex>

                  <NumberInputControl
                    mb={4}
                    name='amount'
                    label={t('amount')}
                    inputProps={{
                      variant: 'flushed',
                    }}
                  />
                </>
              ) : (
                <InputControl
                  mb={4}
                  name={t('token')}
                  label={t('token')}
                  isReadOnly
                  spellCheck='false'
                  inputProps={{ value: token }}
                />
              )}
              <InputControl
                mb={2}
                name={'to'}
                label={t('to')}
                inputProps={{ placeholder: t('to.placeholder') }}
              />
              <Flex mb={2}>
                {resolver && !isFlowAddr(values.to) ? (
                  <Box>
                    <Text fontSize='14px' textStyle='desc'>
                      {t('owner') + ': '}
                      {resolver}
                    </Text>
                  </Box>
                ) : (
                  <Box mb={0}>
                    {resolving && <Spinner type='dots' />}
                    {!resolving && resolver === null && (
                      <Text textStyle='desc'>{t('resolve.failed')}</Text>
                    )}
                  </Box>
                )}
              </Flex>
            </Box>
            <ButtonGroup w='100%'>
              <SubmitButton
                variant='ghost'
                border='1px'
                borderStyle='dashed'
                isLoading={loading}
                disabled={
                  Object.keys(errors).length ||
                  resolving ||
                  (!isFlowAddr(values.to) && !resolving && resolver === null)
                }
                w='50%'
                borderColor='primary'
                textColor='primary'
                spinner={<Spinner type='dots' />}
              >
                {t('transfer')}
              </SubmitButton>
              <Button
                w='50%'
                color='secondary'
                disabled={loading}
                variant='ghost'
                border='1px'
                borderStyle='dashed'
                onClick={onClose}
              >
                {t('cancel')}
              </Button>
            </ButtonGroup>
          </Box>
        )}
      </Formik>
    )
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('transfer.token', { token: token })}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{renderForm()}</ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default Components
