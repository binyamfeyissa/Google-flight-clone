"use client"

import type React from "react"
import { useState, useCallback } from "react"
import {
  Box,
  Button,
  Autocomplete,
  TextField,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material"
import {
  Search as SearchIcon,
  SwapHoriz as SwapIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { useAppDispatch, useAppSelector } from "@/store"
import { setSearchParams, searchFlightsAsync, searchAirportsAsync } from "@/store/slices/flightSlice"
import type { Airport } from "@/types"
import { debounce } from "@/utils/debounce"
import { saveRecentSearch } from "@/utils/localStorage"

// --- Styles ---
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    height: 56,
    fontSize: 16,
    bgcolor: "white",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
    },
    "&.Mui-focused": {
      bgcolor: "white",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "grey.300" },
}

// --- Reusable Components ---
const AirportAutocomplete = ({
  placeholder,
  value,
  inputValue,
  onInputChange,
  onChange,
  options,
  loading,
}: {
  placeholder: string
  value: Airport | null
  inputValue: string
  onInputChange: (value: string) => void
  onChange: (value: Airport | null) => void
  options: Airport[]
  loading: boolean
}) => (
  <Autocomplete
    options={options}
    getOptionLabel={(option) => option.presentation.suggestionTitle}
    inputValue={inputValue}
    value={value}
    onInputChange={(_, v) => onInputChange(v)}
    onChange={(_, v) => onChange(v)}
    loading={loading}
    isOptionEqualToValue={(option, value) => option.skyId === value.skyId}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder={placeholder}
        variant="outlined"
        fullWidth
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <LocationIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={inputSx}
      />
    )}
  />
)

const DateInput = ({
  value,
  onChange,
  minDate,
  placeholder,
}: {
  value: dayjs.Dayjs | null
  onChange: (date: dayjs.Dayjs | null) => void
  minDate: dayjs.Dayjs
  placeholder: string
}) => (
  <DatePicker
    value={value}
    onChange={onChange}
    minDate={minDate}
    slotProps={{
      textField: {
        placeholder,
        variant: "outlined",
        fullWidth: true,
        InputProps: {
          startAdornment: (
            <InputAdornment position="start">
              <CalendarIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            </InputAdornment>
          ),
        },
        sx: inputSx,
      },
    }}
  />
)

// --- Main Component ---
const FlightSearchForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const { searchParams, airports, isSearchingAirports, isSearchingFlights } = useAppSelector((state) => state.flights)

  // --- State ---
  const [originInput, setOriginInput] = useState("")
  const [destinationInput, setDestinationInput] = useState("")
  const [selectedOrigin, setSelectedOrigin] = useState<Airport | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<Airport | null>(null)
  const [departureDate, setDepartureDate] = useState<dayjs.Dayjs | null>(dayjs().add(1, "day"))
  const [returnDate, setReturnDate] = useState<dayjs.Dayjs | null>(null)
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("round-trip")

  // --- Handlers ---
  const debouncedSearchAirports = useCallback(
    debounce((query: string) => {
      if (query.length >= 2) dispatch(searchAirportsAsync(query))
    }, 1500),
    [dispatch],
  )

  const handleOriginInputChange = (value: string) => {
    setOriginInput(value)
    debouncedSearchAirports(value)
  }
  const handleDestinationInputChange = (value: string) => {
    setDestinationInput(value)
    debouncedSearchAirports(value)
  }
  const handleSwapAirports = () => {
    setSelectedOrigin(selectedDestination)
    setOriginInput(destinationInput)
    setSelectedDestination(selectedOrigin)
    setDestinationInput(originInput)
  }
  const handleSearch = () => {
    if (!selectedOrigin || !selectedDestination || !departureDate) return
    const params = {
      originSkyId: selectedOrigin.skyId,
      destinationSkyId: selectedDestination.skyId,
      originEntityId: selectedOrigin.entityId,
      destinationEntityId: selectedDestination.entityId,
      date: departureDate.format("YYYY-MM-DD"),
      ...(returnDate && tripType === "round-trip" && { returnDate: returnDate.format("YYYY-MM-DD") }),
      adults: searchParams.adults,
      children: searchParams.children,
      infants: searchParams.infants,
      cabinClass: searchParams.cabinClass,
      currency: searchParams.currency,
      market: searchParams.market,
      countryCode: searchParams.countryCode,
      sortBy: searchParams.sortBy,
    }
    dispatch(setSearchParams(params))
    dispatch(searchFlightsAsync(params))
    saveRecentSearch({
      origin: selectedOrigin.presentation.suggestionTitle,
      destination: selectedDestination.presentation.suggestionTitle,
      originSkyId: selectedOrigin.skyId,
      destinationSkyId: selectedDestination.skyId,
      originEntityId: selectedOrigin.entityId,
      destinationEntityId: selectedDestination.entityId,
      date: departureDate.format("YYYY-MM-DD"),
      ...(returnDate && tripType === "round-trip" ? { returnDate: returnDate.format("YYYY-MM-DD") } : {}),
      tripType,
    })
  }
  const isSearchDisabled = !selectedOrigin || !selectedDestination || !departureDate || isSearchingFlights

  // --- Render ---
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={2} sx={{ maxWidth: 1200, mx: "auto", my: 4, borderRadius: 4, overflow: "hidden", bgcolor: "background.paper" }}>
        {/* Demo Data Example */}
        <Box sx={{ px: 3, pt: 2, pb: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Example:</strong> From <b>JFK</b> to <b>LHR</b>, Departure: <b>{dayjs().add(1, "day").format("YYYY-MM-DD")}</b>
          </Typography>
        </Box>
        {/* Top Controls Row */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" }, gap: { xs: 1, sm: 2 }, p: 3, pb: 2 }}>
          {/* Trip Type */}
          <FormControl sx={{ minWidth: { xs: "100%", sm: 140 } }}>
            <Select
              value={tripType}
              onChange={(e) => setTripType(e.target.value as any)}
              variant="outlined"
              size="small"
              startAdornment={<SwapIcon sx={{ mr: 1, color: "text.secondary" }} />}
              sx={{ borderRadius: 3, border: "none", bgcolor: "background.paper", color: "text.primary", fontWeight: 500, '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
            >
              <MenuItem value="round-trip">Round trip</MenuItem>
              <MenuItem value="one-way">One way</MenuItem>
            </Select>
          </FormControl>
          {/* Passengers */}
          <FormControl sx={{ minWidth: { xs: "100%", sm: 80 } }}>
            <Select
              value={searchParams.adults}
              onChange={(e) => dispatch(setSearchParams({ adults: Number(e.target.value) }))}
              variant="outlined"
              size="small"
              startAdornment={<PersonIcon sx={{ mr: 1, color: "text.secondary" }} />}
              sx={{ borderRadius: 3, border: "none", bgcolor: "background.paper", color: "text.primary", fontWeight: 500, '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
            >
              {[...Array(9)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Cabin Class */}
          <FormControl sx={{ minWidth: { xs: "100%", sm: 120 } }}>
            <Select
              value={searchParams.cabinClass}
              onChange={(e) => dispatch(setSearchParams({ cabinClass: e.target.value as any }))}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 3, border: "none", bgcolor: "background.paper", color: "text.primary", fontWeight: 500, '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
            >
              <MenuItem value="economy">Economy</MenuItem>
              <MenuItem value="premium_economy">Premium economy</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="first">First</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Main Search Row */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" }, px: 3, pb: 3, gap: 2 }}>
          {/* Origin & Destination */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 2, flex: { md: 2 } }}>
            {/* Origin */}
            <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
              <AirportAutocomplete
                placeholder="From?"
                value={selectedOrigin}
                inputValue={originInput}
                onInputChange={handleOriginInputChange}
                onChange={setSelectedOrigin}
                options={airports}
                loading={isSearchingAirports}
              />
            </Box>
            {/* Swap Button */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", order: { xs: 3, sm: 2 } }}>
              <IconButton
                onClick={handleSwapAirports}
                size="small"
                sx={{ bgcolor: "white", border: "1px solid", borderColor: "grey.300", boxShadow: 1, "&:hover": { bgcolor: "grey.50", borderColor: "primary.main" } }}
              >
                <SwapIcon fontSize="small" />
              </IconButton>
            </Box>
            {/* Destination */}
            <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" }, order: { xs: 2, sm: 3 } }}>
              <AirportAutocomplete
                placeholder="Where to?"
                value={selectedDestination}
                inputValue={destinationInput}
                onInputChange={handleDestinationInputChange}
                onChange={setSelectedDestination}
                options={airports}
                loading={isSearchingAirports}
              />
            </Box>
          </Box>
          {/* Dates */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, flex: { md: 1 } }}>
            {/* Departure Date */}
            <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
              <DateInput
                value={departureDate}
                onChange={setDepartureDate}
                minDate={dayjs()}
                placeholder="Departure"
              />
            </Box>
            {/* Return Date */}
            {tripType === "round-trip" && (
              <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
                <DateInput
                  value={returnDate}
                  onChange={setReturnDate}
                  minDate={departureDate || dayjs()}
                  placeholder="Return"
                />
              </Box>
            )}
          </Box>
        </Box>
        {/* Search Button */}
        <Box sx={{ display: "flex", justifyContent: "center", px: 3, pb: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={isSearchDisabled}
            color="primary"
            sx={{ borderRadius: "24px", px: 4, py: 1.5, fontSize: 16, fontWeight: 500, textTransform: "none", minWidth: { xs: "100%", sm: "auto" }, maxWidth: { xs: "none", sm: 200 }, bgcolor: "primary.main", color: "primary.contrastText", '&:hover': { bgcolor: "primary.dark" }, '&:disabled': { bgcolor: "grey.800", color: "grey.400" } }}
          >
            Explore
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  )
}

export default FlightSearchForm
