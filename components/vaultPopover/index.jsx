import React, { useState } from 'react'
import FocusLock from 'react-focus-lock'
import { Formik } from 'formik'
import { useTranslation } from 'next-i18next'
import Router from 'next/router'
import Spinner from 'react-cli-spinners'
import ReactGA from 'react-ga'

import {
  Box,
  Text,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  ButtonGroup,
  Flex,
} from '@chakra-ui/react'
import { SelectControl, NumberInputControl, SubmitButton, InputControl } from 'formik-chakra-ui'
import * as Yup from 'yup'
import { getSupportTokenConfig } from '../../config/constants'
import { widhdrawDomainVault, depositeDomainVault } from '../../api'
import { toast } from '../../utils'
import accountStore from '../../stores/account'
import vaultModalStore from '../../stores/vaultModal'
// import TokenLogo from '../../components/tokenLogo'

const Components = ({ nameHash, children, cb, isOpen, onClose, vaultBalances }) => {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const tokenConfigs = getSupportTokenConfig()
  const { vaultModalConf = {} } = vaultModalStore.useState('vaultModalConf')
  const { type, token: defaultToken } = vaultModalConf
  const isDeposite = type == 'deposit'
  const { tokenBals } = accountStore.useState('tokenBals')
  if (!defaultToken) {
    return <></>
  }
  const domainVaultBal = vaultBalances[tokenConfigs[defaultToken].type] || 0

  const validationSchema = Yup.object({
    token: Yup.string().required(t('required')),
    amount: Yup.number()
      .min(0)
      .required(t('required'))
      .test('validateBal', t('bal.not.enough'), (value, context) => {
        const { token } = context.parent
        const balance = isDeposite ? tokenBals[token] : domainVaultBal
        const bal = Number(balance)
        return bal >= value
      }),
  })

  const onSubmit = async (values) => {
    const { token, amount } = values

    ReactGA.event({
      category: 'domainVaultChange',
      action: `${type} ${defaultToken} submit`,
    })
    setLoading(true)
    try {
      let req = null
      switch (type) {
        case 'deposit':
          req = depositeDomainVault(nameHash, token, Number(amount))
          break
        case 'withdraw':
          req = widhdrawDomainVault(nameHash, token, Number(amount))
          break
      }
      const res = await req

      const { status = 0 } = res
      if (status === 4) {
        ReactGA.event({
          category: 'domainVaultChange',
          action: `${type} ${defaultToken} success`,
          value: Number(amount),
        })
        toast({
          title: t(`${type}.success`, { token: defaultToken }),
          status: 'success',
        })
        if (cb) {
          cb()
        } else {
          Router.reload()
        }
        onClose()
      }
    } catch (error) {
      ReactGA.event({
        category: 'domainVaultChange',
        action: `${type} ${defaultToken} failed`,
        value: Number(amount),
      })
      toast({
        title: t(`${type}.error`, { token: defaultToken }),
        status: 'error',
      })
      setLoading(false)
    }
    setLoading(false)
    onclose()
  }

  const initialValues = {
    token: defaultToken,
  }

  // 2. Create the form
  const renderForm = () => {
    return (
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
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
              <SelectControl
                mb={4}
                label={t('token')}
                name='token'
                selectProps={{
                  placeholder: t('select.token'),
                  variant: 'flushed',
                  disabled: true,
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
              {type == 'deposit' && (
                <Flex mb={2} justifyContent='space-between' fontSize='10px' opacity={0.7}>
                  <Text>{t('balance')}</Text>
                  <Text>{tokenBals[values.token]}</Text>
                </Flex>
              )}
              {type == 'withdraw' && (
                <Flex mb={2} justifyContent='space-between' fontSize='10px' opacity={0.7}>
                  <Text>{t('balance')}</Text>
                  <Text
                    fontStyle='italic'
                    textDecor='underline'
                    cursor='pointer'
                    onClick={() => {
                      setFieldValue('amount', domainVaultBal, true)
                    }}
                  >
                    {domainVaultBal}
                  </Text>
                </Flex>
              )}
              <InputControl
                mb={4}
                name='amount'
                label={t('amount')}
                inputProps={{
                  variant: 'flushed',
                }}
              />
            </Box>
            <ButtonGroup w='100%'>
              <SubmitButton
                variant='ghost'
                border='1px'
                borderStyle='dashed'
                isLoading={loading}
                disabled={Object.keys(errors).length}
                w='50%'
                borderColor='primary'
                textColor='primary'
                spinner={<Spinner type='dots' />}
              >
                {t(type)}
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
      <Popover
        // initialFocusRef={firstFieldRef}
        isOpen={isOpen}
        onClose={onClose}
        placement='left'
        closeOnBlur={false}
      >
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent p={4} opacity={1} textTransform='none'>
          <PopoverHeader pt={0} fontWeight='bold' border='0' fontSize='15px'>
            {t(`vault.${type}`, { token: defaultToken })}
          </PopoverHeader>
          {/* <PopoverArrow /> */}
          <PopoverCloseButton m={4} />
          <PopoverBody>{renderForm()}</PopoverBody>
          {/* <PopoverFooter
            border='0'
            d='flex'
            alignItems='center'
            justifyContent='space-between'
            pb={4}
          >
            <></>
          </PopoverFooter> */}
        </PopoverContent>
      </Popover>
    </>
  )
}
export default Components
