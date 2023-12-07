import { useSelector } from 'react-redux'

export const useUser = () => useSelector((state) => state.user)
export const userTokens = () => useSelector((state) => state.tokens)

