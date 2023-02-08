import Rekv from 'rekv'

const store = new Rekv({
  vaultModalConf: {
    isOpen: false,
    type: 'deposit',
    token: '',
  },
})

export const setVaultModal = (conf) => {
  store.setState({ vaultModalConf: conf })
}

export default store
