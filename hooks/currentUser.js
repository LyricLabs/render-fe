import { useEffect, useState } from 'react'
import * as fcl from '@onflow/fcl'
// import { fclinit } from '../utils'
import accountStore from '../stores/account'

export const setUserStroe = (user) => {
  accountStore.setState({ user: user })
}

export const getUser = () => {
  const user = accountStore.useState('user')
  return user
}

export const ifOwner = (address = '') => {
  if (address.length == 0 || !store.user?.address) {
    return false
  }
  const user = getUser()
  return address == user.addr
}

export default function useCurrentUser() {
  const [user, setUser] = useState()
  const tools = {
    logIn: fcl.authenticate,
    logOut: () => {
      accountStore.setState({
        user: {},
        isLogin: false,
        domainIds: [],
        domains: [],
        flowBalance: 0.0,
        tokenBals: {},
      })
      localStorage.setItem('flowns_default_name', '')
      fcl.unauthenticate()
    },
  }

  useEffect(() => {
    let cancel = false
    if (!cancel) {
      fcl.currentUser().subscribe((user) => {
        setUser(user)
        setUserStroe(user)
      })
    }
    return () => {
      cancel = true
    }
  }, [])

  return [user, user?.addr != null, tools]
}
