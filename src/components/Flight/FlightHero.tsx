import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const HERO_LIGHT = "https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_4.svg";
const HERO_DARK = "https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg";

const FlightHero: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        minHeight: { xs: 180, md: 220 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
        mb: { xs: 2, md: 4 },
        overflow: "hidden",
      }}
    >
      <img
        src={isDark ? HERO_DARK : HERO_LIGHT}
        alt="Flights Hero"
        style={{
          width: "100%",
          maxWidth: 2048,
          minHeight: 180,
          objectFit: "cover",
          objectPosition: "center top",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
      <Typography
        variant="h2"
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 32,
          textAlign: "center",
          fontWeight: 500,
          fontSize: { xs: "2rem", md: "3rem" },
          color: "text.primary",
          zIndex: 2,
        }}
      >
        Flights
      </Typography>
    </Box>
  );
};

export default FlightHero;
