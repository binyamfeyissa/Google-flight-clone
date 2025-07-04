"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
} from "@mui/material"
import { Search as SearchIcon, Hotel as HotelIcon, CalendarToday as CalendarIcon, LocationOn as LocationIcon } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import * as dayjs from "dayjs"
export type { Dayjs } from "dayjs"
import { useAppDispatch, useAppSelector } from "@/store"
import { setSearchParams, searchHotelsAsync } from "@/store/slices/hotelSlice"

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

const HotelSearchForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const { searchParams, isSearching } = useAppSelector((state) => state.hotels)

  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState<dayjs.Dayjs | null>(dayjs().add(1, "day"))
  const [checkOut, setCheckOut] = useState<dayjs.Dayjs | null>(dayjs().add(2, "day"))

  const handleSearch = () => {
    if (!destination || !checkIn || !checkOut) return
    const params = {
      destination,
      checkIn: checkIn.format("YYYY-MM-DD"),
      checkOut: checkOut.format("YYYY-MM-DD"),
      guests: searchParams.guests,
      rooms: searchParams.rooms,
    }
    dispatch(setSearchParams(params))
    dispatch(
      searchHotelsAsync({
        destination,
        checkIn: checkIn.format("YYYY-MM-DD"),
        checkOut: checkOut.format("YYYY-MM-DD"),
      }),
    )
  }

  const isSearchDisabled = !destination || !checkIn || !checkOut || isSearching

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={2} sx={{ maxWidth: 1200, mx: "auto", my: 4, borderRadius: 4, overflow: "hidden", bgcolor: "background.paper" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" }, gap: { xs: 1, sm: 2 }, p: 3, pb: 2 }}>
          <HotelIcon sx={{ color: "primary.main", fontSize: 32, mr: 1, display: { xs: "none", sm: "block" } }} />
          <FormControl sx={{ minWidth: { xs: "100%", sm: 220 } }}>
            <TextField
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          </FormControl>
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 160 } }}>
            <DatePicker
              value={checkIn}
              onChange={setCheckIn}
              minDate={dayjs()}
              slotProps={{
                textField: {
                  placeholder: "Check-in",
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
          </Box>
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 160 } }}>
            <DatePicker
              value={checkOut}
              onChange={setCheckOut}
              minDate={checkIn || dayjs()}
              slotProps={{
                textField: {
                  placeholder: "Check-out",
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
          </Box>
          <FormControl sx={{ minWidth: { xs: "100%", sm: 120 } }}>
            <InputLabel>Guests</InputLabel>
            <Select
              value={searchParams.guests}
              label="Guests"
              onChange={(e) => dispatch(setSearchParams({ guests: Number(e.target.value) }))}
              variant="outlined"
              sx={{ borderRadius: 3, bgcolor: "background.paper", fontWeight: 500 }}
            >
              {[...Array(8)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: { xs: "100%", sm: 120 } }}>
            <InputLabel>Rooms</InputLabel>
            <Select
              value={searchParams.rooms}
              label="Rooms"
              onChange={(e) => dispatch(setSearchParams({ rooms: Number(e.target.value) }))}
              variant="outlined"
              sx={{ borderRadius: 3, bgcolor: "background.paper", fontWeight: 500 }}
            >
              {[...Array(5)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
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
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  )
}

export default HotelSearchForm
