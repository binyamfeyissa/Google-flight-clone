import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Hotel } from "@/types"
import { searchHotels } from "@/services/api"

interface HotelState {
  hotels: Hotel[]
  isSearching: boolean
  error: string | null
  searchParams: {
    destination: string
    checkIn: string
    checkOut: string
    guests: number
    rooms: number
  }
  selectedHotel: Hotel | null
  filters: {
    maxPrice: number
    minRating: number
    stars: number[]
    amenities: string[]
  }
}

const initialState: HotelState = {
  hotels: [],
  isSearching: false,
  error: null,
  searchParams: {
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    rooms: 1,
  },
  selectedHotel: null,
  filters: {
    maxPrice: 1000,
    minRating: 0,
    stars: [],
    amenities: [],
  },
}

export const searchHotelsAsync = createAsyncThunk(
  "hotels/searchHotels",
  async (params: { destination: string; checkIn: string; checkOut: string }) => {
    const response = await searchHotels(params.destination, params.checkIn, params.checkOut)
    return response
  },
)

const hotelSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<Partial<HotelState["searchParams"]>>) => {
      state.searchParams = { ...state.searchParams, ...action.payload }
    },
    setSelectedHotel: (state, action: PayloadAction<Hotel | null>) => {
      state.selectedHotel = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<HotelState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearHotels: (state) => {
      state.hotels = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchHotelsAsync.pending, (state) => {
        state.isSearching = true
        state.error = null
      })
      .addCase(searchHotelsAsync.fulfilled, (state, action) => {
        state.isSearching = false
        state.hotels = action.payload
      })
      .addCase(searchHotelsAsync.rejected, (state, action) => {
        state.isSearching = false
        state.error = action.error.message || "Failed to search hotels"
      })
  },
})

export const { setSearchParams, setSelectedHotel, setFilters, clearHotels } = hotelSlice.actions

export default hotelSlice.reducer
