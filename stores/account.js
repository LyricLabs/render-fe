import Rekv from 'rekv'

const store = new Rekv({
  user: {},
  isLogin: false,
  domainIds: [],
  domains: [],
  flowBalance: 0.0,
  tokenBals: {},
})

export const ifOwner = (address = '') => {
  if (address.length == 0 || !store._state.user?.addr) {
    return false
  }
  return address == store._state.user.addr
}

export default store
