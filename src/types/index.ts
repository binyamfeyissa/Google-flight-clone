// Airport Types
export interface Airport {
  skyId: string
  entityId: string
  presentation: {
    title: string
    suggestionTitle: string
    subtitle: string
  }
  navigation: {
    entityId: string
    entityType: string
    localizedName: string
    relevantFlightParams: {
      skyId: string
      entityId: string
      flightPlaceType: string
      localizedName: string
    }
  }
}

// Flight Types
export interface FlightSegment {
  id: string
  origin: {
    skyId: string
    name: string
    displayCode: string
  }
  destination: {
    skyId: string
    name: string
    displayCode: string
  }
  departure: string
  arrival: string
  durationInMinutes: number
  flightNumber: string
  marketingCarrier: {
    id: string
    name: string
    alternateId: string
    allianceId: string
  }
}

export interface FlightItinerary {
  id: string
  price: {
    raw: number
    formatted: string
  }
  legs: Array<{
    id: string
    origin: {
      skyId: string
      name: string
      displayCode: string
    }
    destination: {
      skyId: string
      name: string
      displayCode: string
    }
    durationInMinutes: number
    stopCount: number
    departure: string
    arrival: string
    segments: FlightSegment[]
  }>
  isSelfTransfer: boolean
  isProtectedSelfTransfer: boolean
  farePolicy: {
    isChangeAllowed: boolean
    isPartiallyChangeable: boolean
    isCancellationAllowed: boolean
    isPartiallyRefundable: boolean
  }
  tags: string[]
  isMashUp: boolean
  hasFlexibleOptions: boolean
  score: number
}

// Search Types
export interface FlightSearchParams {
  originSkyId: string
  destinationSkyId: string
  originEntityId: string
  destinationEntityId: string
  date: string
  returnDate?: string
  adults?: number
  children?: number
  infants?: number
  cabinClass?: "economy" | "premium_economy" | "business" | "first"
  currency?: string
  market?: string
  countryCode?: string
  sortBy?: "best" | "price_high" | "price_low" | "duration" | "outbound_take_off_time" | "outbound_landing_time"
}

// Hotel Types
export interface Hotel {
  id: string
  name: string
  stars: number
  rating: number
  reviewCount: number
  price: {
    amount: number
    currency: string
    formatted: string
  }
  location: {
    name: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  images: string[]
  amenities: string[]
}

// Car Rental Types
export interface CarRental {
  id: string
  supplier: string
  carType: string
  carClass: string
  doors: number
  seats: number
  bags: number
  transmission: "manual" | "automatic"
  airConditioning: boolean
  price: {
    total: number
    currency: string
    formatted: string
  }
  pickupLocation: string
  dropoffLocation: string
  image: string
}

// UI State Types
export interface UIPreferences {
  theme: "light" | "dark"
  currency: string
  language: string
  visibleColumns: string[]
  pageSize: number
  sortModel: Array<{
    field: string
    sort: "asc" | "desc"
  }>
  filterModel: {
    items: Array<{
      field: string
      operator: string
      value: any
    }>
  }
}
