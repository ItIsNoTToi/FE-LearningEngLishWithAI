import { configureStore } from '@reduxjs/toolkit'
import LessionReducer from '../features/lession/lession.store';

export const store =  configureStore({
  reducer: {
    lession: LessionReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store