import Rekv from 'rekv'

const store = new Rekv({
  detailModalConf: {
    title: '',
    value: '',
    isOpen: false,
    onChange: () => false,
  },
  validationMessage: 'Can not change props',
  isDisabled: false,
})

export const setDetailModal = (conf) => {
  store.setState({ detailModalConf: conf })
}

export const setValidateText = (text) => {
  store.setState({ validationMessage: text })
}

export const setDisable = (flag) => {
  store.setState({ isDisabled: flag })
}

export const updateDetailValue = (value) => {
  const config = store._state.detailModalConf
  config.value = JSON.stringify(value)
  store.setState({ detailModalConf: config })
}

export default store
