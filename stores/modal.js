import Rekv from 'rekv'

const store = new Rekv({
  showInfoSetModal: false,
  setModalType: '',
  key: '',
  // renew and register modal
  domainRenewerShow: false,
})

export const setInfoModalStatus = (flag) => {
  store.setState({ showInfoSetModal: flag })
}

export const setInfoModalType = (type) => {
  store.setState({ setModalType: type })
}

export const openModalWithField = (type, key) => {
  store.setState({ showInfoSetModal: true, setModalType: type, key })
}

export const setRenewerPanelStatus = (flag) => {
  store.setState({ domainRenewerShow: flag })
}

export const setTransferModal = (conf) => {
  store.setState({ transferModalConfig: conf })
}

export default store
