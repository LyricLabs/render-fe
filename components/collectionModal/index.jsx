import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'
import modalStore from '../../stores/modal'

const Components = ({ isOpen, onClose, type, symbol }) => {

  // const { vaultModalConf } = modalStore.useState('vaultModalConf')
  // const [loading, setLoading] = useState(false)

  // const handleClose = async () => {
  //   onClose()
  // }

  // const onSubmit = async (values) => {
  //   // const { type, key, value } = values
  //   setLoading(true)
  //   try {
  //     let req = null

  //     switch (type) {
  //       case 'deposit':
  //         req = setDomainAddress(nameHash, Number(key), value)
  //         break
  //       case 'withdraw':
  //         let obj = { ...profile }
  //         obj[key] = value
  //         req = setDomainText(nameHash, 'profile', obj)
  //         break
    
  //     }
  //     const res = await req

  //     const { status = 0 } = res
  //     if (status === 4) {
  //       toast({
  //         title: t('set.success', { type: t(type) }),
  //         status: 'success',
  //       })
  //       if (cb) {
  //         cb()
  //       } else {
  //         Router.reload()
  //       }
  //       handleClose()
  //     }
  //   } catch (error) {
  //     toast({
  //       title: t('set.error', { type: t(type) }),
  //       status: 'error',
  //     })
  //     setLoading(false)
  //   }
  //   setLoading(false)
  //   // handleClose()
  // }
  // return (
  //   <>
  //     <Modal onClose={handleClose} size={size} isOpen={showInfoSetModal}>
  //       <ModalOverlay />
  //       <ModalContent bgColor={bgColor}>
  //         <ModalHeader py={4}>{t('set.records')}</ModalHeader>
  //         <ModalCloseButton />
  //         <ModalBody opacity={0.8} py={0} mt={0}>
  //           <Formik
  //             initialValues={initialValues}
  //             onSubmit={onSubmit}
  //             validationSchema={validationSchema}
  //           >
  //             {({ handleSubmit, values, errors }) => (
  //               <Box
  //                 border='1px dashed rgba(0, 224, 117, 0.5)'
  //                 rounded='md'
  //                 minH='400px'
  //                 p={6}
  //                 mb={6}
  //                 as='form'
  //                 onSubmit={handleSubmit}
  //               >
  //                 <Box h='350px'>
  //                   <SelectControl
  //                     mb={4}
  //                     label={t('record.type')}
  //                     name='type'
  //                     selectProps={{ placeholder: t('select.record.type'), variant: 'flushed' }}
  //                   >
  //                     {Object.keys(recordsType).map((type, idx) => {
  //                       return (
  //                         <option key={idx} value={type}>
  //                           {t(type)}
  //                         </option>
  //                       )
  //                     })}
  //                   </SelectControl>

  //                   {values.type && values.type != 'custom' && (
  //                     <SelectControl
  //                       mb={4}
  //                       label={t('key')}
  //                       name='key'
  //                       selectProps={{ placeholder: t('select.record.key'), variant: 'flushed' }}
  //                     >
  //                       {Object.keys(recordsType[values.type]).map((type, idx) => {
  //                         return (
  //                           <option key={idx} value={recordsType[values.type][type]}>
  //                             {firstUpperCase(type)}
  //                           </option>
  //                         )
  //                       })}
  //                     </SelectControl>
  //                   )}

  //                   {values.type && values.type === 'custom' && (
  //                     <InputControl
  //                       mb={4}
  //                       name='key'
  //                       label={t('key')}
  //                       inputProps={{
  //                         variant: 'flushed',
  //                       }}
  //                     />
  //                   )}

  //                   {values.type && (
  //                     <InputControl
  //                       mb={4}
  //                       name='value'
  //                       label={t('value')}
  //                       inputProps={{
  //                         variant: 'flushed',
  //                       }}
  //                     />
  //                   )}
  //                 </Box>
  //                 <ButtonGroup w='100%'>
  //                   <SubmitButton
  //                     variant='ghost'
  //                     border='1px'
  //                     borderStyle='dashed'
  //                     isLoading={loading}
  //                     disabled={Object.keys(errors).length}
  //                     w='50%'
  //                     borderColor={primary}
  //                     textColor={primary}
  //                     spinner={<Spinner type='dots' />}
  //                   >
  //                     {t('submit')}
  //                   </SubmitButton>
  //                   <ResetButton
  //                     w='50%'
  //                     color='secondary'
  //                     variant='ghost'
  //                     border='1px'
  //                     disabled={loading}
  //                     borderStyle='dashed'
  //                   >
  //                     {t('reset')}
  //                   </ResetButton>
  //                 </ButtonGroup>

  //                 {/* <Box as='pre' marginY={10}>
  //                   {JSON.stringify(values, null, 2)}
  //                   <br />
  //                   {JSON.stringify(errors, null, 2)}
  //                 </Box> */}
  //               </Box>
  //             )}
  //           </Formik>
  //         </ModalBody>
  //         {/* <ModalFooter>
  //           <Button onClick={handleClose}>Close</Button>
  //         </ModalFooter> */}
  //       </ModalContent>
  //     </Modal>
  //   </>
  // )
}
export default Components
