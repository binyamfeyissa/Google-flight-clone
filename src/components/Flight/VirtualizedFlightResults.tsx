"use client"

import type React from "react"
import { useCallback } from "react"
import { FixedSizeList as List } from "react-window"
import { Box, Card, CardContent, Typography, Chip, Button, Paper, Avatar, useTheme, useMediaQuery } from "@mui/material"
import { Flight as FlightIcon, FlightTakeoff as TakeoffIcon, FlightLand as LandIcon } from "@mui/icons-material"
import { useAppSelector, useAppDispatch } from "@/store"
import { setSelectedFlight } from "@/store/slices/flightSlice"
import type { FlightItinerary } from "@/types"
import { formatDuration, formatTime } from "@/utils/formatters"

interface FlightRowProps {
  index: number
  style: React.CSSProperties
  data: FlightItinerary[]
}

const FlightRow: React.FC<FlightRowProps> = ({ index, style, data }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const flight = data[index]
  const leg = flight.legs[0]

  const handleSelect = useCallback(() => {
    dispatch(setSelectedFlight(flight))
  }, [dispatch, flight])

  return (
    <div style={style}>
      <Paper
        sx={{
          m: 1,
          p: 2,
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            boxShadow: 4,
            transform: "translateY(-1px)",
          },
        }}
      >
        {isMobile ? (
          // Mobile Layout
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                  <FlightIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {leg.segments[0]?.marketingCarrier.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {leg.segments.map((s) => s.flightNumber).join(", ")}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" color="primary" fontWeight={700}>
                {flight.price.formatted}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight={600}>
                  {formatTime(leg.departure)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {leg.origin.displayCode}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, mx: 2, textAlign: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 0.5 }}>
                  <TakeoffIcon fontSize="small" color="action" />
                  <Box sx={{ flex: 1, height: 2, bgcolor: "divider", borderRadius: 1 }} />
                  <LandIcon fontSize="small" color="action" />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {formatDuration(leg.durationInMinutes)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight={600}>
                  {formatTime(leg.arrival)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {leg.destination.displayCode}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Chip
                label={leg.stopCount === 0 ? "Nonstop" : `${leg.stopCount} Stop${leg.stopCount > 1 ? "s" : ""}`}
                size="small"
                color={leg.stopCount === 0 ? "success" : leg.stopCount === 1 ? "warning" : "error"}
                variant="outlined"
              />
              <Button variant="contained" size="small" onClick={handleSelect}>
                Select
              </Button>
            </Box>
          </Box>
        ) : (
          // Desktop Layout
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 200 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <FlightIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {leg.segments[0]?.marketingCarrier.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {leg.segments.map((s) => s.flightNumber).join(", ")}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight={600}>
                  {formatTime(leg.departure)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {leg.origin.displayCode}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                  <TakeoffIcon fontSize="small" color="action" />
                  <Box sx={{ flex: 1, height: 2, bgcolor: "divider", borderRadius: 1 }} />
                  <LandIcon fontSize="small" color="action" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatDuration(leg.durationInMinutes)}
                </Typography>
                <Chip
                  label={leg.stopCount === 0 ? "Nonstop" : `${leg.stopCount} Stop${leg.stopCount > 1 ? "s" : ""}`}
                  size="small"
                  color={leg.stopCount === 0 ? "success" : leg.stopCount === 1 ? "warning" : "error"}
                  variant="outlined"
                />
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight={600}>
                  {formatTime(leg.arrival)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {leg.destination.displayCode}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 150 }}>
              <Box sx={{ textAlign: "right", flex: 1 }}>
                <Typography variant="h6" color="primary" fontWeight={700}>
                  {flight.price.formatted}
                </Typography>
                {flight.tags.length > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    {flight.tags[0]}
                  </Typography>
                )}
              </Box>
              <Button variant="contained" onClick={handleSelect}>
                Select
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </div>
  )
}

const VirtualizedFlightResults: React.FC = () => {
  const { flights } = useAppSelector((state) => state.flights)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const itemHeight = isMobile ? 160 : 120
  const containerHeight = Math.min(600, flights.length * itemHeight)

  if (flights.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {flights.length} flights found (Virtualized)
        </Typography>
        <Box sx={{ height: containerHeight, width: "100%" }}>
          <List height={containerHeight} itemCount={flights.length} itemSize={itemHeight} itemData={flights}>
            {FlightRow}
          </List>
        </Box>
      </CardContent>
    </Card>
  )
}

export default VirtualizedFlightResults
