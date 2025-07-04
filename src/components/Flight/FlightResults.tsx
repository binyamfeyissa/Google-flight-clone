"use client"

import type React from "react"
import { useMemo } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material"
import { DataGrid, type GridColDef, type GridSortModel, type GridFilterModel } from "@mui/x-data-grid"
import {
  Flight as FlightIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Info as InfoIcon,
} from "@mui/icons-material"
import { useAppSelector, useAppDispatch } from "@/store"
import { setSelectedFlight, setSortBy } from "@/store/slices/flightSlice"
import { setSortModel, setFilterModel } from "@/store/slices/uiSlice"
import type { FlightItinerary } from "@/types"
import { formatDuration, formatTime } from "@/utils/formatters"
import ColumnCustomization from "./ColumnCustomization"

const FlightResults: React.FC = () => {
  const dispatch = useAppDispatch()
  const { flights, isSearchingFlights, flightError, selectedFlight } = useAppSelector((state) => state.flights)
  const { sortModel, filterModel, pageSize } = useAppSelector((state) => state.ui)

  // Transform flights data for DataGrid
  const rows = useMemo(() => {
    return flights.map((flight) => {
      const leg = flight.legs[0]
      return {
        id: flight.id,
        airline: leg.segments[0]?.marketingCarrier.name || "Unknown",
        flightNumber: leg.segments.map((s) => s.flightNumber).join(", "),
        departure: leg.departure,
        arrival: leg.arrival,
        duration: leg.durationInMinutes,
        stops: leg.stopCount,
        price: flight.price.raw,
        priceFormatted: flight.price.formatted,
        origin: leg.origin.displayCode,
        destination: leg.destination.displayCode,
        tags: flight.tags,
        score: flight.score,
        hasFlexibleOptions: flight.hasFlexibleOptions,
        ...flight,
      }
    })
  }, [flights])

  const columns: GridColDef[] = [
    {
      field: "airline",
      headerName: "Airline",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FlightIcon color="primary" fontSize="small" />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.flightNumber}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "departure",
      headerName: "Departure",
      width: 140,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {formatTime(params.value)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.origin}
          </Typography>
        </Box>
      ),
    },
    {
      field: "arrival",
      headerName: "Arrival",
      width: 140,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {formatTime(params.value)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.destination}
          </Typography>
        </Box>
      ),
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ScheduleIcon fontSize="small" color="action" />
          <Typography variant="body2">{formatDuration(params.value)}</Typography>
        </Box>
      ),
    },
    {
      field: "stops",
      headerName: "Stops",
      width: 100,
      type: "singleSelect",
      valueOptions: ["Nonstop", "1 Stop", "2+ Stops"],
      renderCell: (params) => {
        const stopsText = params.value === 0 ? "Nonstop" : params.value === 1 ? "1 Stop" : `${params.value} Stops`
        const color = params.value === 0 ? "success" : params.value === 1 ? "warning" : "error"
        return <Chip label={stopsText} size="small" color={color} variant="outlined" />
      },
      valueGetter: (params) => {
        return params === 0 ? "Nonstop" : params === 1 ? "1 Stop" : "2+ Stops"
      },
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      type: "number",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MoneyIcon fontSize="small" color="success" />
          <Typography variant="body2" fontWeight={700} color="success.main">
            {params.row.priceFormatted}
          </Typography>
        </Box>
      ),
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {params.value?.slice(0, 2).map((tag: string) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            variant="contained"
            onClick={() => dispatch(setSelectedFlight(params.row as FlightItinerary))}
            sx={{ minWidth: 80 }}
          >
            Select
          </Button>
        </Box>
      ),
    },
  ]

  const handleSortModelChange = (model: GridSortModel) => {
    dispatch(setSortModel(model))
    if (model.length > 0) {
      dispatch(setSortBy(model[0].field))
    }
  }

  const handleFilterModelChange = (model: GridFilterModel) => {
    dispatch(setFilterModel(model))
  }

  if (flightError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6">Error loading flights</Typography>
        <Typography>{flightError}</Typography>
      </Alert>
    )
  }

  if (isSearchingFlights) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <FlightIcon color="primary" />
            <Typography variant="h6">Searching for flights...</Typography>
          </Box>
          <Grid container spacing={2}>
            {[...Array(5)].map((_, index) => (
              <Grid item xs={12} key={index}>
                <Skeleton variant="rectangular" height={80} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    )
  }

  if (flights.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          <FlightIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No flights found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or dates
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        {/* Results Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FlightIcon color="primary" />
            <Typography variant="h6">
              {flights.length} flight{flights.length !== 1 ? "s" : ""} found
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ColumnCustomization />
            <Tooltip title="Results are sorted by best value by default">
              <IconButton size="small">
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Results Table */}
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 25, 50]}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "action.hover",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default FlightResults
