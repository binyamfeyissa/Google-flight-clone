// User Preferences Persistence
export interface UserPreferences {
  visibleColumns: string[]
  pageSize: number
  currency: string
  theme: "light" | "dark"
  recentSearches: RecentSearch[]
  filterPreferences: {
    maxPrice: number
    preferredAirlines: string[]
    preferredStops: string[]
  }
}

export interface RecentSearch {
  id: string
  origin: string
  destination: string
  originSkyId: string
  destinationSkyId: string
  originEntityId: string
  destinationEntityId: string
  date: string
  returnDate?: string
  tripType: "one-way" | "round-trip"
  timestamp: number
}

const STORAGE_KEYS = {
  USER_PREFERENCES: "travelSearch_userPreferences",
  RECENT_SEARCHES: "travelSearch_recentSearches",
} as const

export const loadUserPreferences = (): Partial<UserPreferences> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.warn("Failed to load user preferences:", error)
    return {}
  }
}

export const saveUserPreferences = (preferences: Partial<UserPreferences>): void => {
  try {
    const existing = loadUserPreferences()
    const updated = { ...existing, ...preferences }
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated))
  } catch (error) {
    console.warn("Failed to save user preferences:", error)
  }
}

export const loadRecentSearches = (): RecentSearch[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES)
    const searches = stored ? JSON.parse(stored) : []
    // Return only last 10 searches, sorted by most recent
    return searches.sort((a: RecentSearch, b: RecentSearch) => b.timestamp - a.timestamp).slice(0, 10)
  } catch (error) {
    console.warn("Failed to load recent searches:", error)
    return []
  }
}

export const saveRecentSearch = (search: Omit<RecentSearch, "id" | "timestamp">): void => {
  try {
    const existing = loadRecentSearches()
    const newSearch: RecentSearch = {
      ...search,
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }

    // Remove duplicates (same origin/destination/date)
    const filtered = existing.filter(
      (s) => !(s.origin === search.origin && s.destination === search.destination && s.date === search.date),
    )

    const updated = [newSearch, ...filtered].slice(0, 10)
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated))
  } catch (error) {
    console.warn("Failed to save recent search:", error)
  }
}

export const clearRecentSearches = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES)
  } catch (error) {
    console.warn("Failed to clear recent searches:", error)
  }
}
