"use client"

import type React from "react"
import { Grid, Card, CardContent, CardMedia, Typography, Box, Button, Chip, Skeleton, Alert } from "@mui/material"
import {
  Person as PersonIcon,
  Luggage as LuggageIcon,
  AcUnit as AcIcon,
  Settings as TransmissionIcon,
} from "@mui/icons-material"
import { useAppSelector, useAppDispatch } from "@/store"
import { setSelectedCar } from "@/store/slices/carSlice"

const CarResults: React.FC = () => {
  const dispatch = useAppDispatch()
  const { cars, isSearching, error } = useAppSelector((state) => state.cars)

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6">Error loading cars</Typography>
        <Typography>{error}</Typography>
      </Alert>
    )
  }

  if (isSearching) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card>
              <Skeleton variant="rectangular" height={150} />
              <CardContent>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" height={24} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  if (cars.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No cars found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {cars.length} car{cars.length !== 1 ? "s" : ""} available
      </Typography>

      <Grid container spacing={3}>
        {cars.map((car) => (
          <Grid item xs={12} md={6} lg={4} key={car.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia component="img" height="150" image={car.image} alt={`${car.carType} ${car.carClass}`} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                  {car.carType} - {car.carClass}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {car.supplier}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip icon={<PersonIcon />} label={`${car.seats} seats`} size="small" variant="outlined" />
                  <Chip icon={<LuggageIcon />} label={`${car.bags} bags`} size="small" variant="outlined" />
                  <Chip icon={<TransmissionIcon />} label={car.transmission} size="small" variant="outlined" />
                  {car.airConditioning && <Chip icon={<AcIcon />} label="A/C" size="small" variant="outlined" />}
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Pickup: {car.pickupLocation}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                  <Typography variant="h6" color="primary" fontWeight={700}>
                    {car.price.formatted}
                  </Typography>
                  <Button variant="contained" size="small" onClick={() => dispatch(setSelectedCar(car))}>
                    Select
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default CarResults
