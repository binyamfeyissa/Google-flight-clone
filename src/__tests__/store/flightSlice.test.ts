import flightSlice, { setSearchParams, setFilters } from "@/store/slices/flightSlice"

describe("flightSlice", () => {
  const initialState = {
    searchParams: {
      originSkyId: "",
      destinationSkyId: "",
      originEntityId: "",
      destinationEntityId: "",
      date: "",
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: "economy" as const,
      currency: "USD",
      market: "US",
      countryCode: "US",
      sortBy: "best" as const,
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

  test("should handle setSearchParams", () => {
    const newParams = {
      originSkyId: "JFK",
      destinationSkyId: "LAX",
      date: "2024-01-15",
    }

    const action = setSearchParams(newParams)
    const state = flightSlice(initialState, action)

    expect(state.searchParams.originSkyId).toBe("JFK")
    expect(state.searchParams.destinationSkyId).toBe("LAX")
    expect(state.searchParams.date).toBe("2024-01-15")
    expect(state.searchParams.adults).toBe(1) // Should preserve existing values
  })

  test("should handle setFilters", () => {
    const newFilters = {
      maxPrice: 500,
      stops: ["Nonstop"],
    }

    const action = setFilters(newFilters)
    const state = flightSlice(initialState, action)

    expect(state.filters.maxPrice).toBe(500)
    expect(state.filters.stops).toEqual(["Nonstop"])
    expect(state.filters.airlines).toEqual([]) // Should preserve existing values
  })
})
