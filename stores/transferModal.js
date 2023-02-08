import Rekv from 'rekv'

const store = new Rekv({
  transferModalConf: {
    type: '',
    token: '',
    isOpen: false,
  },
})

export const setTransferModalConf = (conf) => {
  store.setState({ transferModalConf: conf })
}

export default store
