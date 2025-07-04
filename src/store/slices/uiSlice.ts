import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UIPreferences } from "@/types"
import { loadUserPreferences, saveUserPreferences } from "@/utils/localStorage"

interface UIState extends UIPreferences {
  activeTab: "flights" | "hotels" | "cars"
  sidebarOpen: boolean
  searchFormExpanded: boolean
}

// Load initial preferences from localStorage
const savedPreferences = loadUserPreferences()

const initialState: UIState = {
  theme: savedPreferences.theme || "light",
  currency: savedPreferences.currency || "USD",
  language: "en",
  visibleColumns: savedPreferences.visibleColumns || ["airline", "departure", "arrival", "duration", "stops", "price"],
  pageSize: savedPreferences.pageSize || 25,
  sortModel: [],
  filterModel: { items: [] },
  activeTab: "flights",
  sidebarOpen: false,
  searchFormExpanded: true,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload
      saveUserPreferences({ theme: action.payload })
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload
      saveUserPreferences({ currency: action.payload })
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload
      saveUserPreferences({ visibleColumns: action.payload })
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      saveUserPreferences({ pageSize: action.payload })
    },
    setSortModel: (state, action: PayloadAction<UIState["sortModel"]>) => {
      state.sortModel = action.payload
    },
    setFilterModel: (state, action: PayloadAction<UIState["filterModel"]>) => {
      state.filterModel = action.payload
    },
    setActiveTab: (state, action: PayloadAction<"flights" | "hotels" | "cars">) => {
      state.activeTab = action.payload
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setSearchFormExpanded: (state, action: PayloadAction<boolean>) => {
      state.searchFormExpanded = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    toggleSearchForm: (state) => {
      state.searchFormExpanded = !state.searchFormExpanded
    },
  },
})

export const {
  setTheme,
  setCurrency,
  setLanguage,
  setVisibleColumns,
  setPageSize,
  setSortModel,
  setFilterModel,
  setActiveTab,
  setSidebarOpen,
  setSearchFormExpanded,
  toggleSidebar,
  toggleSearchForm,
} = uiSlice.actions

export default uiSlice.reducer
