import type React from "react"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"
import { configureStore } from "@reduxjs/toolkit"
import FlightResults from "@/components/Flight/FlightResults"
import flightSlice from "@/store/slices/flightSlice"
import uiSlice from "@/store/slices/uiSlice"
import { theme } from "@/theme"
import { mockFlights } from "@/data/mockData"

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      flights: flightSlice,
      ui: uiSlice,
    },
    preloadedState: initialState,
  })
}

const renderWithProviders = (component: React.ReactElement, initialState = {}) => {
  const store = createTestStore(initialState)
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </Provider>,
  )
}

describe("FlightResults", () => {
  test("shows no flights message when no results", () => {
    renderWithProviders(<FlightResults />)

    expect(screen.getByText("No flights found")).toBeInTheDocument()
    expect(screen.getByText("Try adjusting your search criteria or dates")).toBeInTheDocument()
  })

  test("displays loading state when searching", () => {
    const initialState = {
      flights: {
        flights: [],
        isSearchingFlights: true,
        flightError: null,
        searchParams: {},
        airports: [],
        isSearchingAirports: false,
        airportError: null,
        selectedFlight: null,
        sortBy: "best",
        filters: {
          maxPrice: 2000,
          stops: [],
          airlines: [],
          departureTime: [],
        },
      },
      ui: {
        sortModel: [],
        filterModel: { items: [] },
        pageSize: 25,
        visibleColumns: ["airline", "departure", "arrival", "duration", "stops", "price"],
        theme: "light",
        currency: "USD",
        language: "en",
        activeTab: "flights",
        sidebarOpen: false,
        searchFormExpanded: true,
      },
    }

    renderWithProviders(<FlightResults />, initialState)

    expect(screen.getByText("Searching for flights...")).toBeInTheDocument()
  })

  test("displays flight results when available", () => {
    const initialState = {
      flights: {
        flights: mockFlights,
        isSearchingFlights: false,
        flightError: null,
        searchParams: {},
        airports: [],
        isSearchingAirports: false,
        airportError: null,
        selectedFlight: null,
        sortBy: "best",
        filters: {
          maxPrice: 2000,
          stops: [],
          airlines: [],
          departureTime: [],
        },
      },
      ui: {
        sortModel: [],
        filterModel: { items: [] },
        pageSize: 25,
        visibleColumns: ["airline", "departure", "arrival", "duration", "stops", "price"],
        theme: "light",
        currency: "USD",
        language: "en",
        activeTab: "flights",
        sidebarOpen: false,
        searchFormExpanded: true,
      },
    }

    renderWithProviders(<FlightResults />, initialState)

    expect(screen.getByText(`${mockFlights.length} flights found`)).toBeInTheDocument()
    expect(screen.getByText("American Airlines")).toBeInTheDocument()
    expect(screen.getByText("$299")).toBeInTheDocument()
  })
})
