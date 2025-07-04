import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { CarRental } from "@/types"
import { searchCars } from "@/services/api"

interface CarState {
  cars: CarRental[]
  isSearching: boolean
  error: string | null
  searchParams: {
    location: string
    pickupDate: string
    dropoffDate: string
    pickupTime: string
    dropoffTime: string
  }
  selectedCar: CarRental | null
  filters: {
    maxPrice: number
    carTypes: string[]
    suppliers: string[]
    transmission: string[]
  }
}

const initialState: CarState = {
  cars: [],
  isSearching: false,
  error: null,
  searchParams: {
    location: "",
    pickupDate: "",
    dropoffDate: "",
    pickupTime: "10:00",
    dropoffTime: "10:00",
  },
  selectedCar: null,
  filters: {
    maxPrice: 500,
    carTypes: [],
    suppliers: [],
    transmission: [],
  },
}

export const searchCarsAsync = createAsyncThunk(
  "cars/searchCars",
  async (params: { location: string; pickupDate: string; dropoffDate: string }) => {
    const response = await searchCars(params.location, params.pickupDate, params.dropoffDate)
    return response
  },
)

const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<Partial<CarState["searchParams"]>>) => {
      state.searchParams = { ...state.searchParams, ...action.payload }
    },
    setSelectedCar: (state, action: PayloadAction<CarRental | null>) => {
      state.selectedCar = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<CarState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearCars: (state) => {
      state.cars = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCarsAsync.pending, (state) => {
        state.isSearching = true
        state.error = null
      })
      .addCase(searchCarsAsync.fulfilled, (state, action) => {
        state.isSearching = false
        state.cars = action.payload
      })
      .addCase(searchCarsAsync.rejected, (state, action) => {
        state.isSearching = false
        state.error = action.error.message || "Failed to search cars"
      })
  },
})

export const { setSearchParams, setSelectedCar, setFilters, clearCars } = carSlice.actions

export default carSlice.reducer
