import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import kesme from "./reducers/kesme";


const store = configureStore({
  reducer: {
    user,
    [kesme.reducerPath]: kesme.reducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(kesme.middleware)
      
  // devTools: import.meta.env.DEV,
});

export default store;
