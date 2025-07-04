import type { Airport, FlightItinerary, Hotel, CarRental } from "@/types"

// Mock Airports Data
export const mockAirports: Airport[] = [
  {
    skyId: "NYCA",
    entityId: "27537542",
    presentation: {
      title: "New York",
      suggestionTitle: "New York (Any)",
      subtitle: "United States",
    },
    navigation: {
      entityId: "27537542",
      entityType: "CITY",
      localizedName: "New York",
      relevantFlightParams: {
        skyId: "NYCA",
        entityId: "27537542",
        flightPlaceType: "CITY",
        localizedName: "New York",
      },
    },
  },
  {
    skyId: "JFK",
    entityId: "95565058",
    presentation: {
      title: "New York John F. Kennedy",
      suggestionTitle: "New York John F. Kennedy (JFK)",
      subtitle: "United States",
    },
    navigation: {
      entityId: "95565058",
      entityType: "AIRPORT",
      localizedName: "New York John F. Kennedy",
      relevantFlightParams: {
        skyId: "JFK",
        entityId: "95565058",
        flightPlaceType: "AIRPORT",
        localizedName: "New York John F. Kennedy",
      },
    },
  },
  {
    skyId: "LAX",
    entityId: "95565054",
    presentation: {
      title: "Los Angeles International",
      suggestionTitle: "Los Angeles International (LAX)",
      subtitle: "United States",
    },
    navigation: {
      entityId: "95565054",
      entityType: "AIRPORT",
      localizedName: "Los Angeles International",
      relevantFlightParams: {
        skyId: "LAX",
        entityId: "95565054",
        flightPlaceType: "AIRPORT",
        localizedName: "Los Angeles International",
      },
    },
  },
  {
    skyId: "LHR",
    entityId: "95565050",
    presentation: {
      title: "London Heathrow",
      suggestionTitle: "London Heathrow (LHR)",
      subtitle: "United Kingdom",
    },
    navigation: {
      entityId: "95565050",
      entityType: "AIRPORT",
      localizedName: "London Heathrow",
      relevantFlightParams: {
        skyId: "LHR",
        entityId: "95565050",
        flightPlaceType: "AIRPORT",
        localizedName: "London Heathrow",
      },
    },
  },
  {
    skyId: "CDG",
    entityId: "95565045",
    presentation: {
      title: "Paris Charles de Gaulle",
      suggestionTitle: "Paris Charles de Gaulle (CDG)",
      subtitle: "France",
    },
    navigation: {
      entityId: "95565045",
      entityType: "AIRPORT",
      localizedName: "Paris Charles de Gaulle",
      relevantFlightParams: {
        skyId: "CDG",
        entityId: "95565045",
        flightPlaceType: "AIRPORT",
        localizedName: "Paris Charles de Gaulle",
      },
    },
  },
]

// Mock Flight Data
export const mockFlights: FlightItinerary[] = [
  {
    id: "flight-1",
    price: {
      raw: 299,
      formatted: "$299",
    },
    legs: [
      {
        id: "leg-1",
        origin: {
          skyId: "JFK",
          name: "New York John F. Kennedy",
          displayCode: "JFK",
        },
        destination: {
          skyId: "LAX",
          name: "Los Angeles International",
          displayCode: "LAX",
        },
        durationInMinutes: 360,
        stopCount: 0,
        departure: "2024-01-15T08:00:00",
        arrival: "2024-01-15T11:00:00",
        segments: [
          {
            id: "segment-1",
            origin: {
              skyId: "JFK",
              name: "New York John F. Kennedy",
              displayCode: "JFK",
            },
            destination: {
              skyId: "LAX",
              name: "Los Angeles International",
              displayCode: "LAX",
            },
            departure: "2024-01-15T08:00:00",
            arrival: "2024-01-15T11:00:00",
            durationInMinutes: 360,
            flightNumber: "AA123",
            marketingCarrier: {
              id: "AA",
              name: "American Airlines",
              alternateId: "AA",
              allianceId: "oneworld",
            },
          },
        ],
      },
    ],
    isSelfTransfer: false,
    isProtectedSelfTransfer: false,
    farePolicy: {
      isChangeAllowed: true,
      isPartiallyChangeable: false,
      isCancellationAllowed: true,
      isPartiallyRefundable: false,
    },
    tags: ["shortest"],
    isMashUp: false,
    hasFlexibleOptions: true,
    score: 0.95,
  },
  {
    id: "flight-2",
    price: {
      raw: 249,
      formatted: "$249",
    },
    legs: [
      {
        id: "leg-2",
        origin: {
          skyId: "JFK",
          name: "New York John F. Kennedy",
          displayCode: "JFK",
        },
        destination: {
          skyId: "LAX",
          name: "Los Angeles International",
          displayCode: "LAX",
        },
        durationInMinutes: 420,
        stopCount: 1,
        departure: "2024-01-15T06:30:00",
        arrival: "2024-01-15T13:30:00",
        segments: [
          {
            id: "segment-2a",
            origin: {
              skyId: "JFK",
              name: "New York John F. Kennedy",
              displayCode: "JFK",
            },
            destination: {
              skyId: "ORD",
              name: "Chicago O'Hare",
              displayCode: "ORD",
            },
            departure: "2024-01-15T06:30:00",
            arrival: "2024-01-15T08:00:00",
            durationInMinutes: 150,
            flightNumber: "UA456",
            marketingCarrier: {
              id: "UA",
              name: "United Airlines",
              alternateId: "UA",
              allianceId: "star_alliance",
            },
          },
          {
            id: "segment-2b",
            origin: {
              skyId: "ORD",
              name: "Chicago O'Hare",
              displayCode: "ORD",
            },
            destination: {
              skyId: "LAX",
              name: "Los Angeles International",
              displayCode: "LAX",
            },
            departure: "2024-01-15T10:00:00",
            arrival: "2024-01-15T13:30:00",
            durationInMinutes: 270,
            flightNumber: "UA789",
            marketingCarrier: {
              id: "UA",
              name: "United Airlines",
              alternateId: "UA",
              allianceId: "star_alliance",
            },
          },
        ],
      },
    ],
    isSelfTransfer: false,
    isProtectedSelfTransfer: false,
    farePolicy: {
      isChangeAllowed: true,
      isPartiallyChangeable: true,
      isCancellationAllowed: false,
      isPartiallyRefundable: true,
    },
    tags: ["cheapest"],
    isMashUp: false,
    hasFlexibleOptions: false,
    score: 0.87,
  },
]

// Mock Hotels Data
export const mockHotels: Hotel[] = [
  {
    id: "hotel-1",
    name: "Grand Plaza Hotel",
    stars: 5,
    rating: 4.5,
    reviewCount: 1250,
    price: {
      amount: 299,
      currency: "USD",
      formatted: "$299/night",
    },
    location: {
      name: "Downtown Manhattan",
      coordinates: {
        lat: 40.7589,
        lng: -73.9851,
      },
    },
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
    ],
    amenities: ["WiFi", "Pool", "Gym", "Spa", "Restaurant"],
  },
  {
    id: "hotel-2",
    name: "Boutique Inn",
    stars: 4,
    rating: 4.2,
    reviewCount: 890,
    price: {
      amount: 189,
      currency: "USD",
      formatted: "$189/night",
    },
    location: {
      name: "SoHo",
      coordinates: {
        lat: 40.723,
        lng: -74.003,
      },
    },
    images: [
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
    ],
    amenities: ["WiFi", "Restaurant", "Bar"],
  },
  {
    id: "hotel-3",
    name: "Seaside Resort",
    stars: 5,
    rating: 4.8,
    reviewCount: 2100,
    price: {
      amount: 399,
      currency: "USD",
      formatted: "$399/night",
    },
    location: {
      name: "Santa Monica Beach",
      coordinates: {
        lat: 34.0195,
        lng: -118.4912,
      },
    },
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80"
    ],
    amenities: ["WiFi", "Pool", "Beach Access", "Spa", "Restaurant"],
  },
  {
    id: "hotel-4",
    name: "London Royal Suites",
    stars: 5,
    rating: 4.7,
    reviewCount: 1750,
    price: {
      amount: 350,
      currency: "USD",
      formatted: "$350/night",
    },
    location: {
      name: "Central London",
      coordinates: {
        lat: 51.5074,
        lng: -0.1278,
      },
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
    ],
    amenities: ["WiFi", "Gym", "Bar", "Restaurant"],
  },
]

// Mock Car Rentals Data
export const mockCarRentals: CarRental[] = [
  {
    id: "car-1",
    supplier: "Enterprise",
    carType: "Economy",
    carClass: "Compact",
    doors: 4,
    seats: 5,
    bags: 2,
    transmission: "automatic",
    airConditioning: true,
    price: {
      total: 45,
      currency: "USD",
      formatted: "$45/day",
    },
    pickupLocation: "JFK Airport",
    dropoffLocation: "JFK Airport",
    image: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "car-2",
    supplier: "Hertz",
    carType: "SUV",
    carClass: "Full Size",
    doors: 4,
    seats: 7,
    bags: 4,
    transmission: "automatic",
    airConditioning: true,
    price: {
      total: 89,
      currency: "USD",
      formatted: "$89/day",
    },
    pickupLocation: "LAX Airport",
    dropoffLocation: "LAX Airport",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "car-3",
    supplier: "Avis",
    carType: "Luxury",
    carClass: "Sedan",
    doors: 4,
    seats: 5,
    bags: 3,
    transmission: "automatic",
    airConditioning: true,
    price: {
      total: 120,
      currency: "USD",
      formatted: "$120/day",
    },
    pickupLocation: "London Heathrow",
    dropoffLocation: "London Heathrow",
    image: "https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "car-4",
    supplier: "Sixt",
    carType: "Convertible",
    carClass: "Sports",
    doors: 2,
    seats: 2,
    bags: 1,
    transmission: "automatic",
    airConditioning: true,
    price: {
      total: 150,
      currency: "USD",
      formatted: "$150/day",
    },
    pickupLocation: "Paris Charles de Gaulle",
    dropoffLocation: "Paris Charles de Gaulle",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
]
