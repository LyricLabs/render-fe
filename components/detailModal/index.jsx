import { memo } from 'react'
import {
  Box,
  Modal,
  Center,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react'
import detailStore, { setDetailModal } from '../../stores/detailModal'
import { isBrowser } from '../../config/constants'
import dynamic from 'next/dynamic'

import Spinner from 'react-cli-spinners'

const BrowserReactJsonView = dynamic(() => import('react-json-view'), {
  ssr: false,
})
/* eslint-disable react/display-name */
const detailModal = memo(() => {
  const [isPC = true] = useMediaQuery('(min-width: 48em)')
  const { colorMode } = useColorMode()
  const isDark = colorMode == 'dark'
  const {
    detailModalConf,
    validationMessage,
    isDisabled = false,
  } = detailStore.useState('detailModalConf', 'validationMessage', 'isDisabled')
  const { title, value, isOpen, onChange, label } = detailModalConf
  const onClose = () => {
    setDetailModal({ isOpen: false })
  }
  const isJosn =
    value && value.indexOf('{') == 0 && value[value.length - 1] == '}'
  return (
    <Modal onClose={onClose} isOpen={isOpen} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader py={4}>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody px={8} pb={8} mt={-4} opacity="0.8">
          <Box w="100%" isDisabled={isDisabled}>
            <Center h="25px" mb={4}>
              {isDisabled && <Spinner type="dots3" />}
            </Center>
            {isJosn && isBrowser ? (
              <BrowserReactJsonView
                indentWidth={2}
                collapseStringsAfterLength={isPC ? 40 : 35}
                theme={isDark ? 'google' : 'rjv-default'}
                src={JSON.parse(value)}
                name={null}
                displayDataTypes={false}
                style={{
                  'background-color': 'transparent',
                  width: isPC ? '450px' : '347px',
                  overflow: 'scroll',
                }}
                onDelete={(edit) => {
                  if (!isDisabled) {
                    return onChange('del', edit)
                  } else {
                    console.log('disabled')
                    return false
                  }
                }}
                onAdd={(edit) => {
                  if (!isDisabled) {
                    return onChange('add', edit)
                  } else {
                    console.log('disabled')
                    return false
                  }
                }}
                onEdit={(edit) => {
                  if (!isDisabled) {
                    return onChange('edit', edit)
                  } else {
                    console.log('disabled')
                    return false
                  }
                }}
                validationMessage={validationMessage}
              />
            ) : (
              value
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
})

export default detailModal
