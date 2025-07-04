"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputAdornment,
  Paper,
} from "@mui/material"
import { Search as SearchIcon, DirectionsCar as CarIcon, CalendarToday as CalendarIcon, LocationOn as LocationIcon, AccessTime as TimeIcon } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import * as dayjs from "dayjs"
export type { Dayjs } from "dayjs"
import { useAppDispatch, useAppSelector } from "@/store"
import { setSearchParams, searchCarsAsync } from "@/store/slices/carSlice"

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

const CarSearchForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const { searchParams, isSearching } = useAppSelector((state) => state.cars)

  const [location, setLocation] = useState("")
  const [pickupDate, setPickupDate] = useState<dayjs.Dayjs | null>(dayjs().add(1, "day"))
  const [dropoffDate, setDropoffDate] = useState<dayjs.Dayjs | null>(dayjs().add(3, "day"))
  const [pickupTime, setPickupTime] = useState<dayjs.Dayjs | null>(dayjs().hour(10).minute(0))
  const [dropoffTime, setDropoffTime] = useState<dayjs.Dayjs | null>(dayjs().hour(10).minute(0))

  const handleSearch = () => {
    if (!location || !pickupDate || !dropoffDate) return
    const params = {
      location,
      pickupDate: pickupDate.format("YYYY-MM-DD"),
      dropoffDate: dropoffDate.format("YYYY-MM-DD"),
      pickupTime: pickupTime?.format("HH:mm") || "10:00",
      dropoffTime: dropoffTime?.format("HH:mm") || "10:00",
    }
    dispatch(setSearchParams(params))
    dispatch(
      searchCarsAsync({
        location,
        pickupDate: pickupDate.format("YYYY-MM-DD"),
        dropoffDate: dropoffDate.format("YYYY-MM-DD"),
      }),
    )
  }

  const isSearchDisabled = !location || !pickupDate || !dropoffDate || isSearching

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={2} sx={{ maxWidth: 1200, mx: "auto", my: 4, borderRadius: 4, overflow: "hidden", bgcolor: "background.paper" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" }, gap: { xs: 1, sm: 2 }, p: 3, pb: 2 }}>
          <CarIcon sx={{ color: "primary.main", fontSize: 32, mr: 1, display: { xs: "none", sm: "block" } }} />
          <FormControl sx={{ minWidth: { xs: "100%", sm: 220 } }}>
            <TextField
              placeholder="Pickup Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
              value={pickupDate}
              onChange={setPickupDate}
              minDate={dayjs()}
              slotProps={{
                textField: {
                  placeholder: "Pickup Date",
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
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 120 } }}>
            <TimePicker
              value={pickupTime}
              onChange={setPickupTime}
              slotProps={{
                textField: {
                  placeholder: "Pickup Time",
                  variant: "outlined",
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <TimeIcon sx={{ color: "text.secondary", fontSize: 20 }} />
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
              value={dropoffDate}
              onChange={setDropoffDate}
              minDate={pickupDate || dayjs()}
              slotProps={{
                textField: {
                  placeholder: "Dropoff Date",
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
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 120 } }}>
            <TimePicker
              value={dropoffTime}
              onChange={setDropoffTime}
              slotProps={{
                textField: {
                  placeholder: "Dropoff Time",
                  variant: "outlined",
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <TimeIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                  sx: inputSx,
                },
              }}
            />
          </Box>
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

export default CarSearchForm
