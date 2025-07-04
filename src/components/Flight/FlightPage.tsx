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
import PopularDestinations from "./PopularDestinations"
import { useAppSelector, useAppDispatch } from "@/store"
import { setSearchParams, searchFlightsAsync } from "@/store/slices/flightSlice"
import { saveRecentSearch, type RecentSearch } from "@/utils/localStorage"
import * as dayjs from "dayjs"
import FlightHero from "./FlightHero"
import LanguageIcon from '@mui/icons-material/Language';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const FlightPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const dispatch = useAppDispatch()
  const { flights, searchParams } = useAppSelector((state) => state.flights)
  const hasResults = flights.length > 0

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

  const handlePopularDestinationSelect = (destination: any) => {
    const params = {
      originSkyId: "JFK", // Default origin
      destinationSkyId: destination.code,
      originEntityId: "mock-entity-id",
      destinationEntityId: "mock-entity-id",
      date: dayjs().add(7, "day").format("YYYY-MM-DD"),
    }

    dispatch(setSearchParams(params))
    dispatch(searchFlightsAsync(params))

    // Save to recent searches
    saveRecentSearch({
      origin: "JFK New York",
      destination: `${destination.code} ${destination.city}`,
      date: params.date,
      tripType: "one-way",
    })
  }

  // Use virtualized results for large datasets
  const useVirtualization = flights.length > 50

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1, width: '100%' }}>
      <Box sx={{ mt: 6, mb: 4 }}>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          
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
      <FlightHero />
      <FlightSearchForm />
      {/* Place filters above the table, full width, when not mobile */}
      

      {!hasResults && (
        <>
          <RecentSearches onSearchSelect={handleRecentSearchSelect} />
          <PopularDestinations onDestinationSelect={handlePopularDestinationSelect} />
        </>
      )}

      {hasResults && (
        <>
          <PriceCalendar />
        </>
      )}
{hasResults && !isMobile && (
        <Box sx={{ mb: 2 }}>
          <FlightFilters />
        </Box>
      )}
      <Grid container spacing={isMobile ? 1 : 3}>
        <Grid item xs={12}>
          {useVirtualization ? <VirtualizedFlightResults /> : <FlightResults />}
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
              ].map((item, i) => (
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
