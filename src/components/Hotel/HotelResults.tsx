"use client"

import type React from "react"
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Rating,
  Skeleton,
  Alert,
} from "@mui/material"
import {
  LocationOn as LocationIcon,
  Star as StarIcon,
  Wifi as WifiIcon,
  Pool as PoolIcon,
  FitnessCenter as GymIcon,
} from "@mui/icons-material"
import { useAppSelector, useAppDispatch } from "@/store"
import { setSelectedHotel } from "@/store/slices/hotelSlice"

const HotelResults: React.FC = () => {
  const dispatch = useAppDispatch()
  const { hotels, isSearching, error } = useAppSelector((state) => state.hotels)

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <WifiIcon fontSize="small" />
      case "pool":
        return <PoolIcon fontSize="small" />
      case "gym":
        return <GymIcon fontSize="small" />
      default:
        return <StarIcon fontSize="small" />
    }
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6">Error loading hotels</Typography>
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
              <Skeleton variant="rectangular" height={200} />
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

  if (hotels.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hotels found
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
        {hotels.length} hotel{hotels.length !== 1 ? "s" : ""} found
      </Typography>

      <Grid container spacing={3}>
        {hotels.map((hotel) => (
          <Grid item xs={12} md={6} lg={4} key={hotel.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia component="img" height="200" image={hotel.images[0]} alt={hotel.name} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Typography variant="h6" component="h3" fontWeight={600}>
                    {hotel.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {[...Array(hotel.stars)].map((_, i) => (
                      <StarIcon key={i} sx={{ fontSize: 16, color: "gold" }} />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {hotel.location.name}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Rating value={hotel.rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {hotel.rating} ({hotel.reviewCount} reviews)
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                  {hotel.amenities.slice(0, 3).map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      size="small"
                      variant="outlined"
                      icon={getAmenityIcon(amenity)}
                    />
                  ))}
                  {hotel.amenities.length > 3 && (
                    <Chip label={`+${hotel.amenities.length - 3} more`} size="small" variant="outlined" />
                  )}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                  <Typography variant="h6" color="primary" fontWeight={700}>
                    {hotel.price.formatted}
                  </Typography>
                  <Button variant="contained" size="small" onClick={() => dispatch(setSelectedHotel(hotel))}>
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

export default HotelResults
