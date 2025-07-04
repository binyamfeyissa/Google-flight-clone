import type { Airport, FlightItinerary, FlightSearchParams, Hotel, CarRental } from "@/types"
import { mockAirports, mockFlights, mockHotels, mockCarRentals } from "@/data/mockData"

// -----------------------------------------------------------------------------
// Environment helpers – safely read `import.meta.env` (Vite) or fallback.
// -----------------------------------------------------------------------------
const getEnvVar = (key: string): string | undefined => {
  // For Jest/Node and most environments, use process.env
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] as string | undefined
  }
  // For Vite/browser, use import.meta.env (should only be used in browser code, not shared with Node)
  // Uncomment the following if you need Vite envs in browser-only code:
  // return typeof import.meta !== "undefined" ? (import.meta as any).env[key] : undefined
  return undefined
}

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------
const USE_DEMO_DATA = true // flip to false when ready for live API

const RAPIDAPI_KEY = getEnvVar("VITE_RAPIDAPI_KEY") || "demo-key" // <- safe fallback; replace when you add a real key
const RAPIDAPI_HOST = getEnvVar("VITE_RAPIDAPI_HOST") || "sky-scrapper.p.rapidapi.com"

const API_BASE_URL = `https://${RAPIDAPI_HOST}/api/v1`

const API_HEADERS: Record<string, string> = {
  "X-RapidAPI-Key": RAPIDAPI_KEY,
  "X-RapidAPI-Host": RAPIDAPI_HOST,
  "Content-Type": "application/json",
}

// Utility function to simulate API delay
const simulateDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

// Airport Services
export const searchAirports = async (query: string): Promise<Airport[]> => {
  if (USE_DEMO_DATA) {
    await simulateDelay(500)
    return mockAirports.filter(
      (airport) =>
        airport.presentation.title.toLowerCase().includes(query.toLowerCase()) ||
        airport.presentation.suggestionTitle.toLowerCase().includes(query.toLowerCase()),
    )
  }

  try {
    const response = await fetch(`${API_BASE_URL}/flights/searchAirport?query=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: API_HEADERS,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error searching airports:", error)
    // Fallback to demo data on error
    return mockAirports.filter((airport) => airport.presentation.title.toLowerCase().includes(query.toLowerCase()))
  }
}

// Flight Services
export const searchFlights = async (params: FlightSearchParams): Promise<FlightItinerary[]> => {
  if (USE_DEMO_DATA) {
    await simulateDelay(2000)
    // Filter mock flights based on search params
    return mockFlights.filter((flight) => {
      const leg = flight.legs[0]
      return leg.origin.skyId === params.originSkyId && leg.destination.skyId === params.destinationSkyId
    })
  }

  try {
    const queryParams = new URLSearchParams({
      originSkyId: params.originSkyId,
      destinationSkyId: params.destinationSkyId,
      originEntityId: params.originEntityId,
      destinationEntityId: params.destinationEntityId,
      date: params.date,
      ...(params.returnDate && { returnDate: params.returnDate }),
      ...(params.adults && { adults: params.adults.toString() }),
      ...(params.children && { childrens: params.children.toString() }),
      ...(params.infants && { infants: params.infants.toString() }),
      ...(params.cabinClass && { cabinClass: params.cabinClass }),
      ...(params.currency && { currency: params.currency }),
      ...(params.market && { market: params.market }),
      ...(params.countryCode && { countryCode: params.countryCode }),
      ...(params.sortBy && { sortBy: params.sortBy }),
    })

    const url = `${API_BASE_URL}/flights/searchFlights?${queryParams}`
    console.log("[Flight API] GET", url)
    const response = await fetch(url, {
      method: "GET",
      headers: API_HEADERS,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[Flight API] Response", data)
    return data.data?.itineraries || []
  } catch (error) {
    console.error("Error searching flights:", error)
    // Fallback to demo data on error
    return mockFlights
  }
}

// Hotel Services
export const searchHotels = async (destination: string, checkIn: string, checkOut: string): Promise<Hotel[]> => {
  if (USE_DEMO_DATA) {
    await simulateDelay(1500)
    return mockHotels
  }

  try {
    const queryParams = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
    })

    const response = await fetch(`${API_BASE_URL}/hotels/searchHotels?${queryParams}`, {
      method: "GET",
      headers: API_HEADERS,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error searching hotels:", error)
    return mockHotels
  }
}

// Car Rental Services
export const searchCars = async (location: string, pickupDate: string, dropoffDate: string): Promise<CarRental[]> => {
  if (USE_DEMO_DATA) {
    await simulateDelay(1200)
    return mockCarRentals
  }

  try {
    const queryParams = new URLSearchParams({
      location,
      pickupDate,
      dropoffDate,
    })

    const response = await fetch(`${API_BASE_URL}/cars/searchCars?${queryParams}`, {
      method: "GET",
      headers: API_HEADERS,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error searching cars:", error)
    return mockCarRentals
  }
}

// Utility function to switch between demo and real API
export const toggleDemoMode = (useDemoData: boolean) => {
  // This would be used to switch modes - you can call this function
  // when you're ready to use the real API
  console.log(`Switching to ${useDemoData ? "demo" : "real"} API mode`)
  // In a real implementation, you might want to store this in localStorage
  // or environment variables
}
