import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"
import flightSlice from "./slices/flightSlice"
import hotelSlice from "./slices/hotelSlice"
import carSlice from "./slices/carSlice"
import uiSlice from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    flights: flightSlice,
    hotels: hotelSlice,
    cars: carSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
