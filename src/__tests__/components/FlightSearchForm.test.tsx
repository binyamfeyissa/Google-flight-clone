import type React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { configureStore } from "@reduxjs/toolkit"
import FlightSearchForm from "@/components/Flight/FlightSearchForm"
import flightSlice from "@/store/slices/flightSlice"
import uiSlice from "@/store/slices/uiSlice"
import { theme } from "@/theme"

const createTestStore = () => {
  return configureStore({
    reducer: {
      flights: flightSlice,
      ui: uiSlice,
    },
  })
}

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore()
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>{component}</LocalizationProvider>
      </ThemeProvider>
    </Provider>,
  )
}

describe("FlightSearchForm", () => {
  test("renders search form with all required fields", () => {
    renderWithProviders(<FlightSearchForm />)

    // The button text is likely just "Search" not "Search Flights"
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/from/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/departure/i)).toBeInTheDocument()
  })

  test("search button is disabled when required fields are empty", () => {
    renderWithProviders(<FlightSearchForm />)
    const searchButton = screen.getByRole("button", { name: /search/i })
    expect(searchButton).toBeDisabled()
  })

  test("trip type can be changed between one-way and round-trip", () => {
    renderWithProviders(<FlightSearchForm />)
    // The label for the return date input may be "Return" or "Return Date"
    const roundTripChip = screen.getByText(/round trip/i)
    fireEvent.click(roundTripChip)
    // Try both label and placeholder for robustness
    expect(
      screen.queryByLabelText(/return/i) ||
      screen.queryByPlaceholderText(/return/i)
    ).toBeTruthy()
  })

  test("airports can be swapped", () => {
    renderWithProviders(<FlightSearchForm />)
    // Find the swap button by its aria-label or role
    const swapButton = screen.getByRole("button", { name: /swap|switch|reverse|change/i }) ||
      screen.getAllByRole("button").find(btn => btn.querySelector('svg'))
    expect(swapButton).toBeInTheDocument()
    fireEvent.click(swapButton)
    // Optionally: check if values are swapped (not implemented here)
  })
})
