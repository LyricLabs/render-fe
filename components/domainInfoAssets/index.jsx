import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Box,
  Text,
  Tooltip,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  useDisclosure,
} from '@chakra-ui/react'
import { getSupportTokenConfig } from '../../config/constants'
import { useDomainInfo } from '../../api/query'
import ReactGA from 'react-ga'

// import { timeformater, ellipseAddress } from '../../utils'
import { BsArrowDownLeft, BsArrowUpRight, BsQuestionCircle } from 'react-icons/bs'
import TokenLogo from '../tokenLogo'
import VaultPopover from '../vaultPopover'
import vaultModalStore, { setVaultModal } from '../../stores/vaultModal'

export default function Comp(props) {
  const { t } = useTranslation()

  const { domain, styles = null, isOwner = false } = props

  // const { isOpen, onOpen, onClose } = useDisclosure()
  const { vaultModalConf } = vaultModalStore.useState('vaultModalConf')
  const { isOpen } = vaultModalConf
  const { vaultBalances = {}, collections = {}, nameHash, name } = domain
  const { refetch } = useDomainInfo(name)

  const popoverProps = { nameHash, cb: refetch }
  const tokenConfigs = getSupportTokenConfig()

  const keys = Object.keys(tokenConfigs)

  const onClose = () => {
    setVaultModal({ isOpen: false })
  }

  return (
    <Box w='100%' {...styles}>
      <Table size='xs' variant='unstyle' opacity='0.8'>
        <Thead fontSize='12px'>
          <Tr>
            <Th px={4}>{t('token')}</Th>
            <Th px={4} textAlign='right'>
              {t('balance')}
            </Th>
            <Th>
              <VaultPopover
                isOpen={isOpen}
                onClose={onClose}
                closeOnEsc={true}
                hasArrow={false}
                vaultBalances={vaultBalances}
                {...popoverProps}
              >
                <></>
              </VaultPopover>
              <Tooltip hasArrow label={t('domain.asset.tip')}>
                <IconButton
                  opacity='1'
                  size='xs'
                  variant='ghost'
                  textColor='secondary'
                  icon={<BsQuestionCircle />}
                />
              </Tooltip>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {keys.map((label, idx) => {
            const value = vaultBalances[tokenConfigs[label].type]

            return (
              <Tr key={idx} px={2} fontSize={10}>
                <Td isNumeric textAlign='left' px={4}>
                  <TokenLogo symbol={label} size={4} />
                </Td>
                <Td isNumeric textAlign='right' px={4}>
                  {value || '0.0'}
                </Td>
                <Td>
                  <Tooltip hasArrow label={t('vault.deposit', { token: label })}>
                    <IconButton
                      opacity='1'
                      size='xs'
                      variant='ghost'
                      textColor='primary'
                      icon={<BsArrowDownLeft />}
                      onClick={() => {
                        setVaultModal({ isOpen: true, type: 'deposit', token: label })
                        ReactGA.modalview(`/domainAsset/${domain.name}/deposit`)
                      }}
                    />
                  </Tooltip>
                  {isOwner && value > 0 && (
                    <Tooltip hasArrow label={t('vault.withdraw', { token: label })}>
                      <IconButton
                        opacity='1'
                        size='xs'
                        variant='ghost'
                        textColor='secondary'
                        icon={<BsArrowUpRight />}
                        onClick={() => {
                          setVaultModal({ isOpen: true, type: 'withdraw', token: label })
                          ReactGA.modalview(`/domainAsset/${domain.name}/withdraw`)
                        }}
                      />
                    </Tooltip>
                  )}
                </Td>
              </Tr>
            )
          })}
          {/* <Divider></Divider> */}
        </Tbody>
      </Table>
    </Box>
  )
}
