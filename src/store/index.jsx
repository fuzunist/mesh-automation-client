import { configureStore } from '@reduxjs/toolkit'
import user from './reducers/user'


const store = configureStore({
    reducer: {
        user,
    },
    devTools: import.meta.env.DEV
})

export default store
