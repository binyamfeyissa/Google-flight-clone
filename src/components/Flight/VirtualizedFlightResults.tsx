"use client";

import React from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Box, Paper, Avatar, useTheme, useMediaQuery, Typography, Chip } from "@mui/material";
import { Flight as FlightIcon, FlightTakeoff as TakeoffIcon, FlightLand as LandIcon } from "@mui/icons-material";
import type { FlightItinerary } from "../../types";
import { formatDuration, formatTime } from "../../utils/formatters";

interface FlightRowProps {
  index: number
  style: React.CSSProperties
  data: FlightItinerary[];
}

const FlightRow: React.FC<FlightRowProps> = ({ index, style, data }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const flight = data[index];
  const leg = flight.legs[0];

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
                variant="outlined"
              />
            </Box>
          </Box>
        ) : (
          // Desktop Layout
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
              <FlightIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ minWidth: 150 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {leg.segments[0]?.marketingCarrier.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {leg.segments.map((s) => s.flightNumber).join(", ")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TakeoffIcon color="action" />
                <Box>
                  <Typography variant="body2" fontWeight={500}>{formatTime(leg.departure)}</Typography>
                  <Typography variant="caption">{leg.origin.displayCode}</Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatDuration(leg.durationInMinutes)}
                </Typography>
                <Box sx={{ height: 2, bgcolor: "divider", borderRadius: 1, mx: 1 }} />
                <Chip
                  label={leg.stopCount === 0 ? "Nonstop" : `${leg.stopCount} Stop${leg.stopCount > 1 ? "s" : ""}`}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LandIcon color="action" />
                <Box>
                  <Typography variant="body2" fontWeight={500}>{formatTime(leg.arrival)}</Typography>
                  <Typography variant="caption">{leg.destination.displayCode}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ ml: 2, textAlign: "right" }}>
              <Typography variant="h6" color="primary" fontWeight={700}>
                {flight.price.formatted}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </div>
  );
};

interface VirtualizedFlightResultsProps {
  itineraries: FlightItinerary[];
}

const VirtualizedFlightResults: React.FC<VirtualizedFlightResultsProps> = ({ itineraries }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={itineraries.length}
            itemSize={isMobile ? 220 : 120} // Adjust item size for mobile/desktop
            width={width}
            itemData={itineraries}
            overscanCount={5}
          >
            {FlightRow}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
};

export default VirtualizedFlightResults;
