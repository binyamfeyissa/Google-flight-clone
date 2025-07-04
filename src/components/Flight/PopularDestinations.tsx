"use client"

import React from "react"
import { Typography, Box, Container, IconButton } from "@mui/material"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"

interface PopularDestination {
  code: string
  city: string
  country: string
  price: number
  image: string
  trend: "up" | "down" | "stable"
  discount?: number
}

const popularDestinations: PopularDestination[] = [
  {
    code: "PAR",
    city: "Paris",
    country: "France",
    price: 549,
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&w=400&q=80",
    trend: "stable",
  },
  {
    code: "MIL",
    city: "Milan",
    country: "Italy",
    price: 579,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=400&q=80",
    trend: "up",
  },
  {
    code: "SIN",
    city: "Singapore",
    country: "Singapore",
    price: 699,
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=80",
    trend: "up",
  },
  {
    code: "BKK",
    city: "Bangkok",
    country: "Thailand",
    price: 499,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
    trend: "down",
  },
  {
    code: "NYC",
    city: "New York",
    country: "USA",
    price: 799,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80",
    trend: "up",
  },
  {
    code: "ICN",
    city: "Seoul",
    country: "South Korea",
    price: 599,
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=400&q=80",
    trend: "up",
  },
  {
    code: "SHA",
    city: "Shanghai",
    country: "China",
    price: 649,
    image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=400&q=80",
    trend: "stable",
  },
  {
    code: "LON",
    city: "London",
    country: "UK",
    price: 599,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80",
    trend: "up",
  },
  {
    code: "DXB",
    city: "Dubai",
    country: "UAE",
    price: 699,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80",
    trend: "up",
  },
]

interface PopularDestinationsProps {
  onDestinationSelect: (destination: PopularDestination) => void
}

const PopularDestinations: React.FC<PopularDestinationsProps> = ({ onDestinationSelect }) => {
  const [scrollPosition, setScrollPosition] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 280 // Width of one card plus gap
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : Math.min(containerRef.current.scrollWidth - containerRef.current.clientWidth, scrollPosition + scrollAmount)

      containerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
      setScrollPosition(newPosition)
    }
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ width: "100%", mb: 6, mt: 6 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 400,
          fontSize: { xs: 20, sm: 24 },
          color: "text.primary",
          px: { xs: 2, sm: 3 },
        }}
      >
        Popular destinations
      </Typography>

      <Box sx={{ position: "relative", px: { xs: 2, sm: 3 } }}>
        {/* Left Arrow */}
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: { xs: -8, sm: 8 },
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "white",
            boxShadow: 2,
            width: 40,
            height: 40,
            "&:hover": {
              bgcolor: "grey.50",
            },
            display: scrollPosition > 0 ? "flex" : "none",
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Right Arrow */}
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: { xs: -8, sm: 8 },
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "white",
            boxShadow: 2,
            width: 40,
            height: 40,
            "&:hover": {
              bgcolor: "grey.50",
            },
          }}
        >
          <ChevronRight />
        </IconButton>

        {/* Scrollable Container */}
        <Box
          ref={containerRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            scrollBehavior: "smooth",
            pb: 1,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
          onScroll={(e) => {
            setScrollPosition((e.target as HTMLDivElement).scrollLeft)
          }}
        >
          {popularDestinations.map((destination) => (
            <Box
              key={destination.code}
              onClick={() => onDestinationSelect(destination)}
              sx={{
                minWidth: 260,
                height: 140,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                flexShrink: 0,
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              {/* Background Image */}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${destination.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                {/* Gradient Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "50%",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                  }}
                />

                {/* City Name */}
                <Typography
                  variant="h6"
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    color: "white",
                    fontWeight: 500,
                    fontSize: 18,
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    zIndex: 1,
                  }}
                >
                  {destination.city}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  )
}

export default PopularDestinations
