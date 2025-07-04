import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { FlightItinerary, FlightSearchParams, Airport } from "@/types"
import { searchFlights, searchAirports } from "@/services/api"

interface FlightState {
  // Search parameters
  searchParams: FlightSearchParams

  // Results
  flights: FlightItinerary[]
  airports: Airport[]

  // Loading states
  isSearchingFlights: boolean
  isSearchingAirports: boolean

  // Error states
  flightError: string | null
  airportError: string | null

  // UI state
  selectedFlight: FlightItinerary | null
  sortBy: string
  filters: {
    maxPrice: number
    stops: string[]
    airlines: string[]
    departureTime: string[]
    bags: string;
    price: string;
    times: string;
    emissions: string;
    connectingAirports: string;
    duration: string;
  }
}

const initialState: FlightState = {
  searchParams: {
    originSkyId: "",
    destinationSkyId: "",
    originEntityId: "",
    destinationEntityId: "",
    date: "",
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: "economy",
    currency: "USD",
    market: "US",
    countryCode: "US",
    sortBy: "best",
  },
  flights: [],
  airports: [],
  isSearchingFlights: false,
  isSearchingAirports: false,
  flightError: null,
  airportError: null,
  selectedFlight: null,
  sortBy: "best",
  filters: {
    maxPrice: 2000,
    stops: [],
    airlines: [],
    departureTime: [],
    bags: 'Any',
    price: 'Any',
    times: 'Any',
    emissions: 'Any',
    connectingAirports: 'Any',
    duration: 'Any',
  },
}

// Async thunks
export const searchFlightsAsync = createAsyncThunk("flights/searchFlights", async (params: FlightSearchParams) => {
  const response = await searchFlights(params)
  return response
})

export const searchAirportsAsync = createAsyncThunk("flights/searchAirports", async (query: string) => {
  const response = await searchAirports(query)
  return response
})

const flightSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<Partial<FlightSearchParams>>) => {
      state.searchParams = { ...state.searchParams, ...action.payload }
    },
    setSelectedFlight: (state, action: PayloadAction<FlightItinerary | null>) => {
      state.selectedFlight = action.payload
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<FlightState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFlights: (state) => {
      state.flights = []
      state.flightError = null
    },
    clearAirports: (state) => {
      state.airports = []
      state.airportError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Search flights
      .addCase(searchFlightsAsync.pending, (state) => {
        state.isSearchingFlights = true
        state.flightError = null
      })
      .addCase(searchFlightsAsync.fulfilled, (state, action) => {
        state.isSearchingFlights = false
        state.flights = action.payload
      })
      .addCase(searchFlightsAsync.rejected, (state, action) => {
        state.isSearchingFlights = false
        state.flightError = action.error.message || "Failed to search flights"
      })
      // Search airports
      .addCase(searchAirportsAsync.pending, (state) => {
        state.isSearchingAirports = true
        state.airportError = null
      })
      .addCase(searchAirportsAsync.fulfilled, (state, action) => {
        state.isSearchingAirports = false
        state.airports = action.payload
      })
      .addCase(searchAirportsAsync.rejected, (state, action) => {
        state.isSearchingAirports = false
        state.airportError = action.error.message || "Failed to search airports"
      })
  },
})

export const { setSearchParams, setSelectedFlight, setSortBy, setFilters, clearFlights, clearAirports } =
  flightSlice.actions

export default flightSlice.reducer
