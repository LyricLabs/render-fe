import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import Router from 'next/router'
import ReactGA from 'react-ga'

import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ButtonGroup,
  useColorMode,
  useTheme,
} from '@chakra-ui/react'
import { InputControl, SelectControl, SubmitButton, ResetButton } from 'formik-chakra-ui'
import * as Yup from 'yup'
import Spinner from 'react-cli-spinners'

import { useTranslation } from 'next-i18next'
import infoModalStore, { setInfoModalStatus } from '../../stores/modal'
import {
  toast,
  validateAddress,
  validateUrl,
  validateKey,
  firstUpperCase,
  validateEmail,
} from '../../utils'
import { setDomainAddress, setDomainText } from '../../api'

export const recordsType = {
  address: { FLOW: 0, ETH: 1 },
  profile: {
    twitter: 'twitter',
    facebook: 'facebook',
    github: 'github',
    linkedin: 'linkedin',
    avatar: 'avatar',
    banner: 'banner',
    discord: 'discord',
    instagram: 'instagram',
    youtube: 'youtube',
    website: 'website',
    email: 'email',
    location: 'location',
    description: 'description',
  },
  custom: 'flowns_custom',
}

const Comp = (props) => {
  const theme = useTheme()
  const { colorMode } = useColorMode()
  const bgColor = colorMode === 'light' ? '#ffffff' : '#17233A'
  // const textPrimary = colorMode === 'light' ? '#17233A' : '#ffffff'
  const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary

  const [loading, setLoading] = useState(false)

  const { t } = useTranslation()
  const { domain, onClose, size = 'md', cb } = props

  const { texts, nameHash, name } = domain

  let { profile = '{}', flowns_custom = '{}' } = texts

  profile = JSON.parse(profile)

  let custom = JSON.parse(flowns_custom)

  const { setModalType, showInfoSetModal, key } = infoModalStore.useState(
    'setModalType',
    'showInfoSetModal',
    'key',
  )

  useEffect(() => {
    ReactGA.event({
      category: showInfoSetModal ? 'openSetting' : 'closeSetting',
      action: `${name} setting ${showInfoSetModal ? 'open' : 'close'}`,
    })
  }, [showInfoSetModal])

  const handleClose = async () => {
    setInfoModalStatus(false)
    if (onClose) {
      onClose()
    }
  }

  const onSubmit = async (values) => {
    const { type, key, value } = values
    setLoading(true)

    ReactGA.event({
      category: 'changeRecord',
      action: `${name} submit ${key} change`,
    })
    try {
      let req = null

      switch (type) {
        case 'address':
          req = setDomainAddress(nameHash, Number(key), value)
          break
        case 'profile':
          let obj = { ...profile }
          obj[key] = value
          req = setDomainText(nameHash, 'profile', obj)
          break
        case 'custom':
          let customObj = { ...custom }
          customObj[key] = value
          req = setDomainText(nameHash, 'flowns_custom', customObj)
          break
      }
      const res = await req

      const { status = 0 } = res
      if (status === 4) {
        toast({
          title: t('set.success', { type: t(type) }),
          status: 'success',
        })
        ReactGA.event({
          category: 'changeRecord',
          action: `${name} submit ${key} change success`,
        })
        if (cb) {
          cb()
        } else {
          Router.reload()
        }
        handleClose()
      }
    } catch (error) {
      toast({
        title: t('set.error', { type: t(type) }),
        status: 'error',
      })
      ReactGA.event({
        category: 'changeRecord',
        action: `${name} submit ${key} change falied`,
      })
      setLoading(false)
    }
    setLoading(false)
    // handleClose()
  }

  const initialValues = {
    type: setModalType,
    key,
  }

  const notUrl = ['email', 'description', 'location', 'discord']

  const validationSchema = Yup.object({
    type: Yup.string().required(t('required')),
    key: Yup.string()
      .required(t('required'))
      .test('isValideCustomKey', t('key.invalid'), (value, context) => {
        const { parent } = context
        const { type, key } = parent
        if (type === 'custom') return validateKey(key)
        return true
      }),
    value: Yup.string()
      .required(t('required'))
      .test('isAddress', t('address.invalid'), (value, context) => {
        const { parent } = context
        const { type, key } = parent
        if (type === 'address') return validateAddress(key, value)
        return true
      })
      .test('isUrl', t('url.invalid'), (value, context) => {
        const { parent } = context
        const { type, key } = parent
        if (type === 'profile' && notUrl.indexOf(key) < 0) return validateUrl(value)
        return true
      })
      .test('isEmail', t('email.invalid'), (value, context) => {
        const { parent } = context
        const { type, key } = parent
        if (key === 'email') return validateEmail(value)
        return true
      }),
  })

  return (
    <>
      <Modal onClose={handleClose} size={size} isOpen={showInfoSetModal}>
        <ModalOverlay />
        <ModalContent bgColor={bgColor}>
          <ModalHeader py={4}>{t('set.records')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody opacity={0.8} py={0} mt={0}>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ handleSubmit, values, errors }) => (
                <Box
                  border='1px dashed rgba(0, 224, 117, 0.5)'
                  rounded='md'
                  minH='400px'
                  p={6}
                  mb={6}
                  as='form'
                  onSubmit={handleSubmit}
                >
                  <Box h='350px'>
                    <SelectControl
                      mb={4}
                      label={t('record.type')}
                      name='type'
                      selectProps={{ placeholder: t('select.record.type'), variant: 'flushed' }}
                    >
                      {Object.keys(recordsType).map((type, idx) => {
                        return (
                          <option key={idx} value={type}>
                            {t(type)}
                          </option>
                        )
                      })}
                    </SelectControl>

                    {values.type && values.type != 'custom' && (
                      <SelectControl
                        mb={4}
                        label={t('key')}
                        name='key'
                        selectProps={{ placeholder: t('select.record.key'), variant: 'flushed' }}
                      >
                        {Object.keys(recordsType[values.type]).map((type, idx) => {
                          return (
                            <option key={idx} value={recordsType[values.type][type]}>
                              {firstUpperCase(type)}
                            </option>
                          )
                        })}
                      </SelectControl>
                    )}

                    {values.type && values.type === 'custom' && (
                      <InputControl
                        mb={4}
                        name='key'
                        label={t('key')}
                        inputProps={{
                          variant: 'flushed',
                        }}
                      />
                    )}

                    {values.type && (
                      <InputControl
                        mb={4}
                        name='value'
                        label={t('value')}
                        inputProps={{
                          variant: 'flushed',
                        }}
                      />
                    )}
                  </Box>
                  <ButtonGroup w='100%'>
                    <SubmitButton
                      variant='ghost'
                      border='1px'
                      borderStyle='dashed'
                      isLoading={loading}
                      disabled={Object.keys(errors).length}
                      w='50%'
                      borderColor={primary}
                      textColor={primary}
                      spinner={<Spinner type='dots' />}
                    >
                      {t('submit')}
                    </SubmitButton>
                    <ResetButton
                      w='50%'
                      color='secondary'
                      variant='ghost'
                      border='1px'
                      disabled={loading}
                      borderStyle='dashed'
                    >
                      {t('reset')}
                    </ResetButton>
                  </ButtonGroup>

                  {/* <Box as='pre' marginY={10}>
                    {JSON.stringify(values, null, 2)}
                    <br />
                    {JSON.stringify(errors, null, 2)}
                  </Box> */}
                </Box>
              )}
            </Formik>
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
