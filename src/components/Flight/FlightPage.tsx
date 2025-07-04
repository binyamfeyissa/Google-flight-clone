"use client"

import type React from "react"
import { Box, Grid, useTheme, useMediaQuery, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Link, Divider } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import FlightSearchForm from "./FlightSearchForm"
import FlightResults from "./FlightResults"
import VirtualizedFlightResults from "./VirtualizedFlightResults"
import PriceCalendar from "./PriceCalendar"
import FlightFilters from "./FlightFilters"
import RecentSearches from "./RecentSearches"
import { useAppSelector, useAppDispatch } from "@/store"
import { setSearchParams, searchFlightsAsync } from "@/store/slices/flightSlice"
import { saveRecentSearch, type RecentSearch } from "@/utils/localStorage"
import * as dayjs from "dayjs"
import FlightHero from "./FlightHero";
import LanguageIcon from '@mui/icons-material/Language';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const FlightPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useAppDispatch();
  const { flights, filters } = useAppSelector((state) => state.flights);
  const hasResults = flights.length > 0;

  const handleRecentSearchSelect = (search: RecentSearch) => {
    const params = {
      originSkyId: search.originSkyId,
      destinationSkyId: search.destinationSkyId,
      originEntityId: search.originEntityId,
      destinationEntityId: search.destinationEntityId,
      date: search.date,
      ...(search.returnDate && { returnDate: search.returnDate }),
      tripType: search.tripType,
    }

    dispatch(setSearchParams(params))
    dispatch(searchFlightsAsync(params))
  }

  // Handlers for filter changes
  const handleStopsFilterChange = (value: string) => {
    dispatch({ type: 'flights/setFilters', payload: { stops: value === 'Any number of stops' ? [] : [value] } });
  };
  const handleAirlinesFilterChange = (value: string[]) => {
    dispatch({ type: 'flights/setFilters', payload: { airlines: value } });
  };
  const handleBagsFilterChange = (value: string) => {
    dispatch({ type: 'flights/setFilters', payload: { bags: value } });
  };
  const handlePriceFilterChange = (value: string) => {
    dispatch({ type: 'flights/setFilters', payload: { price: value } });
  };
  const handleTimesFilterChange = (value: string) => {
    dispatch({ type: 'flights/setFilters', payload: { times: value } });
  };
  const handleEmissionsFilterChange = (value: string) => {
    dispatch({ type: 'flights/setFilters', payload: { emissions: value } });
  };
  const handleConnectingAirportsFilterChange = (value: string) => {
    dispatch({ type: 'flights/setFilters', payload: { connectingAirports: value } });
  };
  const handleDurationFilterChange = (value: string) => {
    dispatch({ type: 'flights/setFilters', payload: { duration: value } });
  };

  // Filtering logic using Redux filters
  const filteredFlights = flights.filter(flight => {
    // Stops filter
    if (filters.stops.length > 0) {
      const stopCount = flight.legs[0]?.stopCount ?? 0;
      const stopsFilter = filters.stops[0];
      if (stopsFilter === "Nonstop only" && stopCount !== 0) return false;
      if (stopsFilter === "1 stop or fewer" && stopCount > 1) return false;
      if (stopsFilter === "2 stops or fewer" && stopCount > 2) return false;
    }
    // Airlines filter
    if (filters.airlines.length > 0) {
      const airline = flight.legs[0]?.segments[0]?.marketingCarrier?.allianceId || "";
      if (!filters.airlines.includes(airline)) return false;
    }
    // Bags filter
    if (filters.bags && filters.bags !== 'Any') {
      // Example: filter by number of bags (not implemented in mock data)
      // Add your logic here
    }
    // Price filter
    if (filters.price && filters.price !== 'Any') {
      const price = flight.price.raw;
      if (filters.price === '$0-$200' && !(price >= 0 && price <= 200)) return false;
      if (filters.price === '$200-$500' && !(price > 200 && price <= 500)) return false;
      if (filters.price === '$500+' && !(price > 500)) return false;
    }
    // Times filter
    if (filters.times && filters.times !== 'Any') {
      // Example: filter by departure time (not implemented in mock data)
      // Add your logic here
    }
    // Emissions filter
    if (filters.emissions && filters.emissions !== 'Any') {
      // Example: filter by emissions (not implemented in mock data)
      // Add your logic here
    }
    // Connecting airports filter
    if (filters.connectingAirports && filters.connectingAirports !== 'Any') {
      // Example: filter by connecting airports (not implemented in mock data)
      // Add your logic here
    }
    // Duration filter
    if (filters.duration && filters.duration !== 'Any') {
      const duration = flight.legs[0]?.durationInMinutes || 0;
      if (filters.duration === '< 4h' && duration >= 240) return false;
      if (filters.duration === '4-8h' && (duration < 240 || duration > 480)) return false;
      if (filters.duration === '> 8h' && duration <= 480) return false;
    }
    return true;
  });

  // Use virtualized results for large datasets
  const useVirtualization = flights.length > 50

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1, width: '100%' }}>
      {/* Project Overview Section for Recruiters */}
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 4, p: 3, borderRadius: 3, bgcolor: '#f5f7fa', boxShadow: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>
          About This App
        </Typography>
        <Typography sx={{ fontSize: 17, mb: 2, color: '#333' }}>
          <b>Google Flights Clone</b> – A modern, full-featured flight search web application built with React, TypeScript, and Material-UI. This project demonstrates advanced frontend engineering, performance optimization, and robust state management.
        </Typography>
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Tech Stack:</Typography>
        <ul style={{ marginTop: 0, marginBottom: 12, color: '#444', fontSize: 16 }}>
          <li>React, TypeScript, Material-UI (MUI)</li>
          <li>Redux Toolkit for state management</li>
          <li>Jest & React Testing Library for testing</li>
          <li>Vite for fast builds and hot reloads</li>
          <li>Service Worker for PWA/offline support</li>
          <li>Local Storage, Day.js, Virtualized Lists</li>
        </ul>
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Key Features:</Typography>
        <ul style={{ marginTop: 0, color: '#444', fontSize: 16 }}>
          <li>Flight search with flexible dates and trip types</li>
          <li>Advanced pagination, filtering, and virtualized results for performance</li>
          <li>Autocomplete for city/airport fields</li>
          <li>Popular routes & destinations, price calendar, and FAQ</li>
          <li>Recent searches saved in local storage</li>
          <li>Comprehensive unit/integration tests with Jest</li>
          <li>Responsive, modern UI with Material-UI</li>
        </ul>
        <Typography sx={{ color: '#888', fontSize: 15, mt: 2 }}>
          Explore the app to see all features in action! https://github.com/binyamfeyissa/Google-flight-clone
        </Typography>
      </Box>
      
      <FlightHero />
      <FlightSearchForm />
      {/* Place filters above the table, full width, when not mobile */}
      

      {!hasResults && (
        <>
          <RecentSearches onSearchSelect={handleRecentSearchSelect} />
        </>
      )}

      {hasResults && (
        <>
          <PriceCalendar priceData={flights.map(f => ({ date: f.legs[0].departure, price: f.price.raw }))} />
        </>
      )}
      {hasResults && !isMobile && (
        <Box sx={{ mb: 2 }}>
          <FlightFilters
            stopsFilter={filters.stops[0] || "Any number of stops"}
            setStopsFilter={handleStopsFilterChange}
            airlinesFilter={filters.airlines}
            setAirlinesFilter={handleAirlinesFilterChange}
            bagsFilter={filters.bags}
            setBagsFilter={handleBagsFilterChange}
            priceFilter={filters.price}
            setPriceFilter={handlePriceFilterChange}
            timesFilter={filters.times}
            setTimesFilter={handleTimesFilterChange}
            emissionsFilter={filters.emissions}
            setEmissionsFilter={handleEmissionsFilterChange}
            connectingAirportsFilter={filters.connectingAirports}
            setConnectingAirportsFilter={handleConnectingAirportsFilterChange}
            durationFilter={filters.duration}
            setDurationFilter={handleDurationFilterChange}
          />
        </Box>
      )}
      <Grid container spacing={isMobile ? 1 : 3}>
        <Grid item xs={12}>
          {useVirtualization
            ? <VirtualizedFlightResults itineraries={filteredFlights} />
            : <FlightResults flights={filteredFlights} />}
        </Grid>
      </Grid>

      
      {/* FAQ and Popular Routes Section */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Box component="section" mb={4}>
            <Typography variant="h5" sx={{ fontWeight: 600, fontSize: 28, mb: 2 }}>
              Frequently asked questions
            </Typography>
            <Box>
              {[
                {
                  q: 'How can I find last-minute flight deals?',
                  a: 'Use our flexible search and filter options to find the best last-minute deals from your city.'
                },
                {
                  q: 'How can I find cheap flights for a weekend getaway?',
                  a: 'Try searching for flights departing on Fridays and returning on Sundays, and compare prices across airlines.'
                },
                {
                  q: 'How can I find flight deals if my travel plans are flexible?',
                  a: 'Use the flexible dates feature to see the cheapest days to fly within your preferred timeframe.'
                },
                {
                  q: 'How can I find cheap flights to anywhere?',
                  a: 'Select “Anywhere” as your destination to discover the cheapest places you can fly to from your city.'
                },
                {
                  q: 'How can I get flight alerts for my trip?',
                  a: 'Sign up for price alerts to get notified when fares drop for your selected route.'
                }
              ].map((item) => (
                <Accordion key={item.q} sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontSize: 18, fontWeight: 500 }}>{item.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: '#555' }}>{item.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
          <Box component="section">
            <h2 style={{ fontWeight: 600, fontSize: 24, marginBottom: 16 }}>Find cheap flights on popular routes</h2>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from New York to London</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from New York to Rome</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from Toronto to London</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from London to Tokyo</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from New York to Los Angeles</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from London to Istanbul</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from London to Berlin</a></li>
                </ul>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from New York to Paris</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from Montreal to Paris</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from New York to Milan</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from Madrid to Rome</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from Paris to Marrakech</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from Paris to Bangkok</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from Chicago to Paris</a></li>
                </ul>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from London to Paris</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from London to Milan</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from London to Dubai</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from London to Delhi</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from Sao Paulo to London</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from New York to Orlando</a></li>
                  <li><a href="#" style={{ color: '#1976d2' }}>Flights from Melbourne to London</a></li>
                </ul>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <Box component="footer" sx={{ mt: 8, pb: 4, pt: 6, borderTop: '1px solid #e0e0e0', background: 'transparent' }}>
  <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2, mb: 2, alignItems: 'center' }}>
      <Button
        variant="outlined"
        startIcon={<LanguageIcon />}
        sx={{ borderRadius: 8, textTransform: 'none', px: 2, fontWeight: 500, fontSize: 16, width: { xs: '100%', sm: 'auto' } }}
      >
        Language · English (United States)
      </Button>
      <Button
        variant="outlined"
        startIcon={<RoomOutlinedIcon />}
        sx={{ borderRadius: 8, textTransform: 'none', px: 2, fontWeight: 500, fontSize: 16, width: { xs: '100%', sm: 'auto' } }}
      >
        Location · Ethiopia
      </Button>
      <Button
        variant="outlined"
        startIcon={<AttachMoneyOutlinedIcon />}
        sx={{ borderRadius: 8, textTransform: 'none', px: 2, fontWeight: 500, fontSize: 16, width: { xs: '100%', sm: 'auto' } }}
      >
        Currency · ETB
      </Button>
    </Box>
    <Typography sx={{ color: '#555', fontSize: 16, mb: 0.5 }}>
      Current language and currency options applied: English (United States) - Ethiopia - ETB
    </Typography>
    <Typography sx={{ color: '#888', fontSize: 15, mb: 2 }}>
      Displayed currencies may differ from the currencies used to purchase flights.{' '}
      <Link href="#" underline="hover" sx={{ color: '#1976d2', fontWeight: 500 }}>Learn more</Link>
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 3, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
      <Link href="#" underline="hover" sx={{ color: '#1976d2', fontWeight: 500, width: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}>About</Link>
      <Link href="#" underline="hover" sx={{ color: '#1976d2', fontWeight: 500, width: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}>Privacy</Link>
      <Link href="#" underline="hover" sx={{ color: '#1976d2', fontWeight: 500, width: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}>Terms</Link>
      <Link href="#" underline="hover" sx={{ color: '#1976d2', fontWeight: 500, width: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}>Join user studies</Link>
      <Link href="#" underline="hover" sx={{ color: '#1976d2', fontWeight: 500, width: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}>Feedback</Link>
      <Link href="#" underline="hover" sx={{ color: '#1976d2', fontWeight: 500, width: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}>Help Center</Link>
    </Box>
    <Divider sx={{ my: 3, maxWidth: 900, mx: 'auto' }} />
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2, mt: 2, alignItems: 'center' }}>
      <Button
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ color: '#1976d2', fontWeight: 600, fontSize: 17, textTransform: 'none', background: 'none', boxShadow: 'none', minWidth: 0, width: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}
      >
        International sites
      </Button>
      <Button
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ color: '#1976d2', fontWeight: 600, fontSize: 17, textTransform: 'none', background: 'none', boxShadow: 'none', minWidth: 0, width: { xs: '100%', sm: 'auto' } }}
      >
        Explore flights
      </Button>
    </Box>
  </Box>
</Box>
    </Box>
  )
}

export default FlightPage
