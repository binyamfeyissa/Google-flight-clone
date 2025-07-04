"use client"

import type React from "react"
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  useTheme,
  useMediaQuery,
  Fab,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Flight as FlightIcon,
  Hotel as HotelIcon,
  DirectionsCar as CarIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "@/store"
import { setActiveTab, toggleSidebar } from "@/store/slices/uiSlice"

interface MobileAppLayoutProps {
  children: React.ReactNode
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const dispatch = useAppDispatch()
  const { activeTab, sidebarOpen } = useAppSelector((state) => state.ui)

  const navigationItems = [
    { id: "flights", label: "Flights", icon: <FlightIcon /> },
    { id: "hotels", label: "Hotels", icon: <HotelIcon /> },
    { id: "cars", label: "Cars", icon: <CarIcon /> },
  ]

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    dispatch(setActiveTab(newValue as "flights" | "hotels" | "cars"))
  }

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
        Google Flights Clone
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Find your perfect trip
        </Typography>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.id}
            onClick={() => {
              dispatch(setActiveTab(item.id as "flights" | "hotels" | "cars"))
              dispatch(toggleSidebar())
            }}
            sx={{
              mx: 2,
              borderRadius: 2,
              cursor: "pointer",
              backgroundColor: activeTab === item.id ? "primary.main" : "transparent",
              color: activeTab === item.id ? "primary.contrastText" : "text.primary",
              "&:hover": {
                backgroundColor: activeTab === item.id ? "primary.dark" : "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  if (!isMobile) {
    return null // Use regular AppLayout for desktop
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Mobile App Bar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "background.paper",
          color: "text.primary",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => dispatch(toggleSidebar())}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Google Flights Clone
          </Typography>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => dispatch(toggleSidebar())}
        onOpen={() => dispatch(toggleSidebar())}
        disableSwipeToOpen={false}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </SwipeableDrawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          pb: 8, // Space for bottom navigation
          px: 1,
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        {navigationItems.map((item) => (
          <BottomNavigationAction
            key={item.id}
            label={item.label}
            value={item.id}
            icon={item.icon}
            sx={{
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        ))}
      </BottomNavigation>

      {/* Floating Action Button for Quick Search */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 80,
          right: 16,
        }}
      >
        <SearchIcon />
      </Fab>
    </Box>
  )
}

export default MobileAppLayout
