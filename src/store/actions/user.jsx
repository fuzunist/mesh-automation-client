import store from '@/store'
import { _setTokens, _setUser, _logOut } from '../reducers/user'

export const setUser = (data) => store.dispatch(_setUser(data))
export const setLogOut = () => store.dispatch(_logOut())
export const setTokens = (tokens) => store.dispatch(_setTokens(tokens))

